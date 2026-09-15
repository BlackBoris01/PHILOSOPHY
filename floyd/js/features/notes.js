(function () {
const STORAGE_NOTES = window.App.constants.STORAGE_NOTES;
const STORAGE_NOTES_SORT = window.App.constants.STORAGE_NOTES_SORT;
const NOTE_COLORS = window.App.constants.NOTE_COLORS;
const NOTE_COLOR_LABELS = window.App.constants.NOTE_COLOR_LABELS;
const loadJSON = window.App.storage.loadJSON;
const saveJSON = window.App.storage.saveJSON;
const newId = window.App.storage.newId;

function normalizeNoteColorKey(c) {
  if (c === "blue" || c === "green" || c === "red") return c;
  if (c === "emerald") return "green";
  if (c === "rose") return "red";
  return "blue";
}

function initNotes(todayISO) {
  let notes = loadJSON(STORAGE_NOTES, []).map(function (raw) {
    return {
      id: raw.id || null,
      dateISO: raw.dateISO || todayISO,
      text: raw.text || "",
      createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
      color: normalizeNoteColorKey(raw.color),
      pinned: !!raw.pinned,
    };
  });

  (function ensureNoteIds() {
    var changed = false;
    notes.forEach(function (n) {
      if (!n.id) {
        n.id = newId();
        changed = true;
      }
    });
    if (changed) saveJSON(STORAGE_NOTES, notes);
  })();

  (function persistNoteColorMigration() {
    var raw = loadJSON(STORAGE_NOTES, []);
    var need = raw.some(function (r) {
      return normalizeNoteColorKey(r.color) !== (r.color || "");
    });
    if (need) saveJSON(STORAGE_NOTES, notes);
  })();

  function saveNotes() {
    saveJSON(STORAGE_NOTES, notes);
  }

  var selectedNewNoteColor = "blue";
  document.querySelectorAll(".notes-form .color-swatch").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".notes-form .color-swatch").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      selectedNewNoteColor = btn.getAttribute("data-note-color") || "blue";
    });
  });

  var notesSortEl = document.getElementById("notes-sort");
  notesSortEl.value = loadJSON(STORAGE_NOTES_SORT, "created-desc") || "created-desc";
  notesSortEl.addEventListener("change", function () {
    saveJSON(STORAGE_NOTES_SORT, notesSortEl.value);
    renderNotes();
  });

  document.getElementById("notes-search").addEventListener("input", function () {
    renderNotes();
  });

  function renderNotes() {
    var board = document.getElementById("notes-list");
    board.innerHTML = "";
    var q = (document.getElementById("notes-search").value || "")
      .trim()
      .toLowerCase();
    var list = notes.filter(function (n) {
      if (!q) return true;
      return (
        (n.text || "").toLowerCase().indexOf(q) >= 0 ||
        (n.dateISO || "").indexOf(q) >= 0
      );
    });

    var mode = notesSortEl.value;
    list.sort(function (a, b) {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      switch (mode) {
        case "created-desc":
          return (b.createdAt || 0) - (a.createdAt || 0);
        case "created-asc":
          return (a.createdAt || 0) - (b.createdAt || 0);
        case "dated-desc":
          return (b.dateISO || "").localeCompare(a.dateISO || "");
        case "dated-asc":
          return (a.dateISO || "").localeCompare(b.dateISO || "");
        case "text-az":
          return (a.text || "").localeCompare(b.text || "", "ru");
        default:
          return 0;
      }
    });

    if (list.length === 0) {
      var empty = document.createElement("div");
      empty.className = "notes-empty";
      empty.textContent = notes.length === 0 ? "Пока пусто" : "Ничего не найдено";
      board.appendChild(empty);
      return;
    }

    list.forEach(function (n) {
      var card = document.createElement("article");
      card.className = "note-card" + (n.pinned ? " is-pinned" : "");
      card.setAttribute("data-color", n.color);

      var hd = document.createElement("header");
      var timeEl = document.createElement("time");
      timeEl.dateTime = n.dateISO;
      timeEl.textContent = n.dateISO;

      var actions = document.createElement("div");
      actions.className = "note-card-actions";

      var pinBtn = document.createElement("button");
      pinBtn.type = "button";
      pinBtn.setAttribute("aria-label", n.pinned ? "Снять с верха" : "Закрепить сверху");
      pinBtn.setAttribute("aria-pressed", n.pinned ? "true" : "false");
      pinBtn.title = n.pinned ? "Снять закреп" : "Закрепить";
      pinBtn.textContent = n.pinned ? "★" : "☆";
      if (n.pinned) pinBtn.classList.add("is-on");
      pinBtn.addEventListener("click", function () {
        n.pinned = !n.pinned;
        saveNotes();
        renderNotes();
      });

      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.setAttribute("aria-label", "Удалить");
      delBtn.title = "Удалить";
      delBtn.textContent = "×";
      delBtn.addEventListener("click", function () {
        if (!confirm("Удалить заметку?")) return;
        notes = notes.filter(function (x) {
          return x.id !== n.id;
        });
        saveNotes();
        renderNotes();
      });

      actions.appendChild(pinBtn);
      actions.appendChild(delBtn);
      hd.appendChild(timeEl);
      hd.appendChild(actions);

      var body = document.createElement("p");
      body.className = "note-body";
      body.textContent = n.text;

      var foot = document.createElement("div");
      foot.className = "note-card-footer";
      var labl = document.createElement("label");
      var sel = document.createElement("select");
      NOTE_COLORS.forEach(function (c) {
        var opt = document.createElement("option");
        opt.value = c;
        opt.textContent = NOTE_COLOR_LABELS[c];
        if (c === n.color) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener("change", function () {
        n.color = sel.value;
        card.setAttribute("data-color", n.color);
        saveNotes();
        renderNotes();
      });
      labl.appendChild(document.createTextNode("Рамка "));
      labl.appendChild(sel);

      foot.appendChild(labl);
      card.appendChild(hd);
      card.appendChild(body);
      card.appendChild(foot);
      board.appendChild(card);
    });
  }

  document.getElementById("note-date").value = todayISO;
  document.getElementById("note-save").addEventListener("click", function () {
    var text = document.getElementById("note-text").value.trim();
    var dateISO = document.getElementById("note-date").value || todayISO;
    if (!text) return;
    notes.push({
      id: newId(),
      dateISO: dateISO,
      text: text,
      createdAt: Date.now(),
      color: normalizeNoteColorKey(selectedNewNoteColor),
      pinned: false,
    });
    document.getElementById("note-text").value = "";
    saveNotes();
    renderNotes();
  });

  renderNotes();
}

window.App.features = window.App.features || {};
window.App.features.initNotes = initNotes;
})();
