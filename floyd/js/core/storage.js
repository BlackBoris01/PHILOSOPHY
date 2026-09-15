(function () {
  window.App = window.App || {};
  window.App.storage = {
    loadJSON: function (key, fallback) {
      try {
        const s = localStorage.getItem(key);
        if (!s) return fallback;
        return JSON.parse(s);
      } catch (e) {
        return fallback;
      }
    },
    saveJSON: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        if (window.App && window.App.sync && window.App.sync.handleStorageWrite) {
          window.App.sync.handleStorageWrite(key);
        }
      } catch (e) {
        alert("Не удалось сохранить в браузер (возможно, память переполнена).");
      }
    },
    newId: function () {
      if (crypto.randomUUID) return crypto.randomUUID();
      return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    },
  };
})();
