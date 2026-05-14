(function () {
  var sc = document.currentScript;
  var STATS_URL =
    sc && sc.src
      ? new URL("../api/site-stats.php", sc.src).href
      : "api/site-stats.php";
  var SESSION_KEY = "site-stats-session-v1";
  var started = false;
  var heartbeatTimer = null;

  function getSessionId() {
    try {
      var s = sessionStorage.getItem(SESSION_KEY);
      if (!s) {
        s =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : "site-" + Date.now() + "-" + Math.random().toString(16).slice(2);
        sessionStorage.setItem(SESSION_KEY, s);
      }
      return s;
    } catch (e) {
      return "site-anon-" + Date.now();
    }
  }

  function clientMeta() {
    try {
      return {
        ua: typeof navigator !== "undefined" ? String(navigator.userAgent || "").slice(0, 512) : "",
        lang: typeof navigator !== "undefined" ? String(navigator.language || "").slice(0, 32) : "",
      };
    } catch (e) {
      return { ua: "", lang: "" };
    }
  }

  function post(action) {
    var meta = clientMeta();
    return fetch(STATS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: action,
        session: getSessionId(),
        ua: meta.ua,
        lang: meta.lang,
      }),
      credentials: "same-origin",
    }).then(function (r) {
      return r.json().catch(function () {
        return { ok: false };
      });
    });
  }

  function start() {
    if (started) return;
    started = true;

    post("visit").catch(function () {
      /* тихо */
    });

    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(function () {
      post("heartbeat").catch(function () {
        /* тихо */
      });
    }, 50000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
