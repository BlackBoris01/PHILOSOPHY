(function () {
  window.App = window.App || {};
  var C = window.App.constants;
  var storage = window.App.storage;

  var META_KEY = "personal-site-sync-meta-v1";
  var TOKEN_KEY = "personal-site-sync-token-v1";
  var SYNC_URL = "../api/floyd-sync.php";

  var SYNC_STORAGE_KEYS = [
    C.STORAGE_CODE,
    C.STORAGE_NOTES,
    C.STORAGE_NOTES_SORT,
    C.STORAGE_TASKS,
  ];

  var pushTimer = null;
  var applyingRemote = false;

  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setToken(value) {
    try {
      if (value) localStorage.setItem(TOKEN_KEY, value);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  function getMeta() {
    return storage.loadJSON(META_KEY, { updatedAt: 0 });
  }

  function setMetaDirect(updatedAt) {
    try {
      localStorage.setItem(META_KEY, JSON.stringify({ updatedAt: updatedAt }));
    } catch (e) {
      /* ignore */
    }
  }

  function collectPayload() {
    var p = {};
    SYNC_STORAGE_KEYS.forEach(function (key) {
      p[key] = storage.loadJSON(
        key,
        key === C.STORAGE_CODE
          ? {}
          : key === C.STORAGE_NOTES_SORT
            ? "created-desc"
            : []
      );
    });
    return p;
  }

  function applyRemotePayload(remoteUpdatedAt, payload) {
    applyingRemote = true;
    try {
      SYNC_STORAGE_KEYS.forEach(function (key) {
        if (!Object.prototype.hasOwnProperty.call(payload, key)) return;
        var v = payload[key];
        try {
          localStorage.setItem(key, JSON.stringify(v));
        } catch (e) {
          /* ignore */
        }
      });
      setMetaDirect(remoteUpdatedAt);
    } finally {
      applyingRemote = false;
    }
  }

  function localHasData() {
    var code = storage.loadJSON(C.STORAGE_CODE, {});
    var notes = storage.loadJSON(C.STORAGE_NOTES, []);
    var tasks = storage.loadJSON(C.STORAGE_TASKS, []);
    return (
      (notes && notes.length > 0) ||
      (tasks && tasks.length > 0) ||
      (code && typeof code === "object" && Object.keys(code).length > 0)
    );
  }

  function schedulePush() {
    if (!getToken()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      pushNow();
    }, 1400);
  }

  function bumpLocalUpdatedAt() {
    if (applyingRemote) return;
    var m = getMeta();
    m.updatedAt = Date.now();
    setMetaDirect(m.updatedAt);
  }

  function pushNow() {
    if (!getToken()) return;
    var token = getToken();
    var meta = getMeta();
    var body = {
      updatedAt: meta.updatedAt || 0,
      payload: collectPayload(),
    };
    fetch(SYNC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Floyd-Sync-Token": token,
      },
      body: JSON.stringify(body),
      credentials: "same-origin",
    })
      .then(function (r) {
        return r.json().then(function (j) {
          return { ok: r.ok, status: r.status, json: j };
        });
      })
      .then(function (res) {
        if (!res.ok || !res.json || !res.json.ok) {
          window.dispatchEvent(
            new CustomEvent("floyd-sync-status", {
              detail: {
                level: "error",
                message:
                  (res.json && res.json.error) ||
                  "Ошибка сохранения на сервер (" + res.status + ").",
              },
            })
          );
          return;
        }
        var serverTs = res.json.updatedAt;
        if (typeof serverTs === "number") {
          setMetaDirect(serverTs);
        }
        window.dispatchEvent(
          new CustomEvent("floyd-sync-status", {
            detail: { level: "ok", message: "Сохранено в облаке." },
          })
        );
      })
      .catch(function () {
        window.dispatchEvent(
          new CustomEvent("floyd-sync-status", {
            detail: { level: "error", message: "Сеть: не удалось отправить данные." },
          })
        );
      });
  }

  function pullThen(callback) {
    var token = getToken();
    if (!token) {
      callback(false);
      return;
    }
    fetch(SYNC_URL, {
      method: "GET",
      headers: { "X-Floyd-Sync-Token": token },
      credentials: "same-origin",
    })
      .then(function (r) {
        return r.json().then(function (j) {
          return { ok: r.ok, status: r.status, json: j };
        });
      })
      .then(function (res) {
        if (!res.ok || !res.json || !res.json.ok) {
          window.dispatchEvent(
            new CustomEvent("floyd-sync-status", {
              detail: {
                level: "error",
                message:
                  (res.json && res.json.error) ||
                  "Не удалось загрузить облако (" + res.status + ").",
              },
            })
          );
          callback(false);
          return;
        }
        var remoteTs = Number(res.json.updatedAt) || 0;
        var localTs = getMeta().updatedAt || 0;
        var payload = res.json.payload;
        var remoteEmpty =
          !payload ||
          (typeof payload === "object" &&
            SYNC_STORAGE_KEYS.every(function (k) {
              return !Object.prototype.hasOwnProperty.call(payload, k);
            }));

        if (remoteTs > localTs && payload && typeof payload === "object") {
          applyRemotePayload(remoteTs, payload);
          window.dispatchEvent(
            new CustomEvent("floyd-sync-status", {
              detail: { level: "ok", message: "Загружены данные с сервера." },
            })
          );
          callback(true);
          return;
        }

        if (localTs > remoteTs || (remoteEmpty && localHasData())) {
          schedulePush();
        }
        callback(false);
      })
      .catch(function () {
        window.dispatchEvent(
          new CustomEvent("floyd-sync-status", {
            detail: { level: "error", message: "Сеть: не удалось загрузить облако." },
          })
        );
        callback(false);
      });
  }

  function handleStorageWrite(key) {
    if (applyingRemote) return;
    if (key === META_KEY || key === TOKEN_KEY) return;
    if (SYNC_STORAGE_KEYS.indexOf(key) === -1) return;
    bumpLocalUpdatedAt();
    schedulePush();
  }

  window.App.sync = {
    getToken: getToken,
    setToken: setToken,
    pullThen: pullThen,
    schedulePush: schedulePush,
    pushNow: pushNow,
    handleStorageWrite: handleStorageWrite,
  };
})();
