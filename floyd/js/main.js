(function () {
  function initSyncUi() {
    var inp = document.getElementById("sync-token-input");
    var save = document.getElementById("sync-token-save");
    var pushBtn = document.getElementById("sync-push-now");
    var status = document.getElementById("sync-status");
    if (!inp || !save) return;

    window.addEventListener("floyd-sync-status", function (e) {
      if (!status) return;
      var d = e.detail || {};
      status.textContent = d.message || "";
      status.className = "sync-status is-" + (d.level || "ok");
    });

    save.addEventListener("click", function () {
      var v = inp.value.trim();
      if (v) {
        window.App.sync.setToken(v);
        inp.value = "";
        if (status) {
          status.textContent = "Токен сохранён. Перезагрузка…";
          status.className = "sync-status is-ok";
        }
        window.location.reload();
        return;
      }
      window.App.sync.setToken("");
      if (status) {
        status.textContent = "Токен удалён из браузера.";
        status.className = "sync-status is-ok";
      }
    });

    if (pushBtn) {
      pushBtn.addEventListener("click", function () {
        if (!window.App.sync.getToken()) {
          if (status) {
            status.textContent = "Сначала сохраните токен.";
            status.className = "sync-status is-error";
          }
          return;
        }
        window.App.sync.pushNow();
      });
    }
  }

  function startApp() {
    var today = window.App.date.startOfDay(new Date());
    var todayISO = window.App.date.toLocalISO(today);

    window.App.features.initTracker(today);
    window.App.features.initNotes(todayISO);
    window.App.features.initTasks(today);
    initSyncUi();
  }

  if (window.App.sync && window.App.sync.pullThen) {
    window.App.sync.pullThen(function () {
      startApp();
    });
  } else {
    startApp();
  }
})();
