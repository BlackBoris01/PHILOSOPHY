(function () {
  var sc = document.currentScript;
  var FLOYD_STATS_URL =
    sc && sc.src ? new URL("../../api/floyd-stats.php", sc.src).href : "../api/floyd-stats.php";
  var SITE_STATS_URL =
    sc && sc.src ? new URL("../../api/site-stats.php", sc.src).href : "../api/site-stats.php";

  var SESSION_KEY = "floyd-stats-session-v1";
  var DETAIL_TOKEN_KEY = "site-stats-detail-token";
  var started = false;
  var heartbeatTimer = null;
  var mainSitePollTimer = null;
  var mainSiteDetailTimer = null;

  function getSessionId() {
    try {
      var s = sessionStorage.getItem(SESSION_KEY);
      if (!s) {
        s =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : "s-" + Date.now() + "-" + Math.random().toString(16).slice(2);
        sessionStorage.setItem(SESSION_KEY, s);
      }
      return s;
    } catch (e) {
      return "anon-" + Date.now();
    }
  }

  function updateDom(data) {
    var totalEl = document.getElementById("secret-stats-total");
    var todayEl = document.getElementById("secret-stats-today");
    var onlineEl = document.getElementById("secret-stats-online");
    var wrap = document.getElementById("secret-stats");
    if (!wrap) return;
    if (!data || !data.ok) {
      wrap.hidden = true;
      return;
    }
    if (totalEl) totalEl.textContent = String(data.totalVisits ?? "—");
    if (todayEl) todayEl.textContent = String(data.dayVisits ?? "—");
    if (onlineEl) onlineEl.textContent = String(data.online ?? "—");
    wrap.hidden = false;
  }

  function updatePublicDom(data) {
    var totalEl = document.getElementById("public-stats-total");
    var todayEl = document.getElementById("public-stats-today");
    var onlineEl = document.getElementById("public-stats-online");
    var wrap = document.getElementById("public-stats");
    var errEl = document.getElementById("public-stats-error");
    if (!wrap) return;
    if (errEl) errEl.textContent = "";
    if (!data || !data.ok) {
      if (totalEl) totalEl.textContent = "—";
      if (todayEl) todayEl.textContent = "—";
      if (onlineEl) onlineEl.textContent = "—";
      if (errEl) errEl.textContent = "Нет ответа от api/site-stats.php (проверьте путь и PHP на сервере).";
      wrap.hidden = false;
      return;
    }
    if (totalEl) totalEl.textContent = String(data.totalVisits ?? "—");
    if (todayEl) todayEl.textContent = String(data.dayVisits ?? "—");
    if (onlineEl) onlineEl.textContent = String(data.online ?? "—");
    wrap.hidden = false;
  }

  function fetchMainSiteStats() {
    return fetch(SITE_STATS_URL, { method: "GET", credentials: "same-origin" })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: false };
        });
      })
      .then(updatePublicDom)
      .catch(function () {
        updatePublicDom({ ok: false });
      });
  }

  function formatTime(ts) {
    if (!ts || typeof ts !== "number") return "—";
    try {
      return new Date(ts * 1000).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return String(ts);
    }
  }

  function renderClientsTable(clients) {
    var tbody = document.getElementById("public-stats-clients-body");
    var meta = document.getElementById("public-stats-clients-meta");
    if (!tbody) return;
    tbody.textContent = "";
    if (!Array.isArray(clients) || clients.length === 0) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.colSpan = 8;
      td.textContent = "Записей пока нет.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      if (meta) meta.textContent = "";
      return;
    }
    if (meta) meta.textContent = "Записей: " + clients.length;
    clients.forEach(function (row) {
      var tr = document.createElement("tr");
      if (row.online) tr.className = "is-online";
      [
        row.online ? "онлайн" : "нет",
        formatTime(row.lastSeen),
        formatTime(row.firstSeen),
        row.ip || "—",
        [row.city, row.country].filter(Boolean).join(", ") || "—",
        row.lang || "—",
        row.ua || "—",
        row.session || "—",
      ].forEach(function (text) {
        var td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function updateClientsDom(data) {
    var wrap = document.getElementById("public-stats-clients");
    var err = document.getElementById("public-stats-clients-error");
    if (!wrap) return;
    if (err) err.textContent = "";
    if (!data || !data.ok) {
      if (err) err.textContent = data && data.error ? String(data.error) : "Не удалось загрузить список.";
      renderClientsTable([]);
      return;
    }
    renderClientsTable(data.clients || []);
  }

  function fetchMainSiteClients() {
    var token = "";
    try {
      token = (localStorage.getItem(DETAIL_TOKEN_KEY) || "").trim();
    } catch (e) {
      token = "";
    }
    if (!token) {
      updateClientsDom({ ok: false, error: "Введите токен и нажмите «Сохранить токен»." });
      return Promise.resolve();
    }
    var url = new URL(SITE_STATS_URL);
    url.searchParams.set("details", "1");
    return fetch(url.toString(), {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Site-Stats-Token": token },
    })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: false, error: "Ответ не JSON" };
        });
      })
      .then(updateClientsDom)
      .catch(function () {
        updateClientsDom({ ok: false, error: "Сеть" });
      });
  }

  function initPublicStatsPolling() {
    fetchMainSiteStats();
    if (mainSitePollTimer) clearInterval(mainSitePollTimer);
    mainSitePollTimer = setInterval(fetchMainSiteStats, 32000);
  }

  function initClientsDetailPolling() {
    if (mainSiteDetailTimer) clearInterval(mainSiteDetailTimer);
    mainSiteDetailTimer = setInterval(function () {
      var t = "";
      try {
        t = (localStorage.getItem(DETAIL_TOKEN_KEY) || "").trim();
      } catch (e) {
        t = "";
      }
      if (t) fetchMainSiteClients();
    }, 75000);
  }

  function wireClientsPanel() {
    var inp = document.getElementById("site-stats-token-input");
    var save = document.getElementById("site-stats-token-save");
    var refresh = document.getElementById("site-stats-clients-refresh");
    if (save && inp) {
      try {
        inp.value = localStorage.getItem(DETAIL_TOKEN_KEY) || "";
      } catch (e) {
        inp.value = "";
      }
      save.addEventListener("click", function () {
        var v = (inp.value || "").trim();
        try {
          if (v) localStorage.setItem(DETAIL_TOKEN_KEY, v);
          else localStorage.removeItem(DETAIL_TOKEN_KEY);
        } catch (e) {
          /* ignore */
        }
        fetchMainSiteClients();
      });
    }
    if (refresh) {
      refresh.addEventListener("click", function () {
        fetchMainSiteClients();
      });
    }
    initClientsDetailPolling();
    try {
      if ((localStorage.getItem(DETAIL_TOKEN_KEY) || "").trim()) {
        fetchMainSiteClients();
      }
    } catch (e) {
      /* ignore */
    }
  }

  function post(action) {
    return fetch(FLOYD_STATS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: action, session: getSessionId() }),
      credentials: "same-origin",
    }).then(function (r) {
      return r.json().catch(function () {
        return { ok: false };
      });
    });
  }

  function start() {
    var app = document.getElementById("app-content");
    if (!app || app.hidden || started) return;

    started = true;

    post("visit")
      .then(updateDom)
      .catch(function () {
        updateDom({ ok: false });
      });

    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(function () {
      post("heartbeat")
        .then(updateDom)
        .catch(function () {
          /* тихо */
        });
    }, 50000);
  }

  document.addEventListener("floyd-app-visible", start);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initPublicStatsPolling();
      wireClientsPanel();
    });
  } else {
    initPublicStatsPolling();
    wireClientsPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
