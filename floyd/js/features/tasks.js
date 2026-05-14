(function () {
const STORAGE_TASKS = window.App.constants.STORAGE_TASKS;
const loadJSON = window.App.storage.loadJSON;
const saveJSON = window.App.storage.saveJSON;
const newId = window.App.storage.newId;
const MS_DAY = window.App.date.MS_DAY;
const startOfDay = window.App.date.startOfDay;
const toLocalISO = window.App.date.toLocalISO;
const monthMeta = window.App.date.monthMeta;
const mondayOfWeek = window.App.date.mondayOfWeek;
const getTodayISO = window.App.date.getTodayISO;
const MONTH_GENITIVE = window.App.date.MONTH_GENITIVE;

function initTasks(today) {
  const todayISO = toLocalISO(today);
  let tasks = loadJSON(STORAGE_TASKS, []);
  (function ensureTaskIds() {
    var changed = false;
    tasks.forEach(function (t) {
      if (!t.id) {
        t.id = newId();
        changed = true;
      }
    });
    if (changed) saveJSON(STORAGE_TASKS, tasks);
  })();

  let calYear = today.getFullYear();
  let calMonth = today.getMonth();
  let calWeekMonday = mondayOfWeek(today);
  let dialogDayISO = todayISO;
  let editingTaskId = null;

  function saveTasks() {
    saveJSON(STORAGE_TASKS, tasks);
  }

  function tasksForDay(iso) {
    return tasks.filter(function (t) {
      return t.dateISO === iso;
    });
  }

  function taskPreviewWords(title) {
    var parts = String(title).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "—";
    if (parts.length <= 5) return parts.join(" ");
    return parts.slice(0, 5).join(" ") + "…";
  }

  function displayCalendarTitle(y, m) {
    var names =
      "январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь".split(
        " "
      );
    var n = names[m];
    return n.charAt(0).toUpperCase() + n.slice(1) + " " + y;
  }

  function formatWeekRangeLabel(monday) {
    var sun = new Date(monday.getTime() + 6 * MS_DAY);
    var d1 = monday.getDate();
    var d2 = sun.getDate();
    var m1 = monday.getMonth();
    var m2 = sun.getMonth();
    var y1 = monday.getFullYear();
    var y2 = sun.getFullYear();
    if (y1 === y2 && m1 === m2) {
      return d1 + "–" + d2 + " " + MONTH_GENITIVE[m1] + " " + y1;
    }
    if (y1 === y2) {
      return (
        d1 +
        " " +
        MONTH_GENITIVE[m1] +
        " — " +
        d2 +
        " " +
        MONTH_GENITIVE[m2] +
        " " +
        y1
      );
    }
    return (
      d1 +
      " " +
      MONTH_GENITIVE[m1] +
      " " +
      y1 +
      " — " +
      d2 +
      " " +
      MONTH_GENITIVE[m2] +
      " " +
      y2
    );
  }

  function calendarCellDayLabel(d, inMonth) {
    if (inMonth && d.getDate() === 1) {
      return "1 " + MONTH_GENITIVE[d.getMonth()];
    }
    return String(d.getDate());
  }

  function formatTodaySidebarDate() {
    var d = startOfDay(new Date());
    var wd =
      "воскресенье понедельник вторник среда четверг пятница суббота".split(" ");
    var iso = getTodayISO();
    var parts = iso.split("-");
    var y = parts[0];
    var mon = parseInt(parts[1], 10) - 1;
    var dayNum = parseInt(parts[2], 10);
    var name = wd[d.getDay()];
    return (
      name.charAt(0).toUpperCase() +
      name.slice(1) +
      ", " +
      dayNum +
      " " +
      MONTH_GENITIVE[mon] +
      " " +
      y
    );
  }

  function calClearDropHighlights() {
    document.querySelectorAll(".cal-day.cal-day--drop").forEach(function (el) {
      el.classList.remove("cal-day--drop");
    });
  }

  function calMoveTaskToDay(taskId, targetIso) {
    var task = tasks.find(function (x) {
      return x.id === taskId;
    });
    if (!task || task.dateISO === targetIso) return;
    task.dateISO = targetIso;
    saveTasks();
    renderCalendar();
    if (document.getElementById("day-dialog").open) {
      openDayDialog(dialogDayISO);
    }
  }

  document.addEventListener("dragend", function () {
    calClearDropHighlights();
  });

  function createCalStyleCheckbox(checked, title, onChange) {
    var label = document.createElement("label");
    label.className = "cal-task-check";
    if (title) label.title = title;
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "cal-task-check-input";
    cb.checked = !!checked;
    cb.addEventListener("change", onChange);
    var face = document.createElement("span");
    face.className = "cal-task-check-face";
    face.setAttribute("aria-hidden", "true");
    label.appendChild(cb);
    label.appendChild(face);
    return label;
  }

  function openTaskEdit(task) {
    editingTaskId = task.id;
    document.getElementById("task-edit-title").value = task.title;
    document.getElementById("task-edit-date").value = task.dateISO;
    document.getElementById("task-edit-dialog").showModal();
    document.getElementById("task-edit-title").focus();
    document.getElementById("task-edit-title").select();
  }

  function renderTodayPanel() {
    var iso = getTodayISO();
    var dateEl = document.getElementById("today-sidebar-date");
    if (dateEl) dateEl.textContent = formatTodaySidebarDate();
    var ul = document.getElementById("today-tasks-list");
    if (!ul) return;
    ul.innerHTML = "";
    var list = tasksForDay(iso).slice().sort(function (a, b) {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (a.title || "").localeCompare(b.title || "", "ru");
    });
    if (list.length === 0) {
      var emptyLi = document.createElement("li");
      emptyLi.className = "today-tasks-empty";
      emptyLi.textContent = "Нет задач на сегодня";
      ul.appendChild(emptyLi);
      return;
    }
    list.forEach(function (t) {
      var li = document.createElement("li");
      li.className = "today-task-row" + (t.done ? " is-done" : "");
      var check = createCalStyleCheckbox(
        t.done,
        t.done ? "Снять отметку" : "Отметить выполненной",
        function () {
          var input = check.querySelector(".cal-task-check-input");
          t.done = input.checked;
          saveTasks();
          renderCalendar();
          if (document.getElementById("day-dialog").open) {
            openDayDialog(dialogDayISO);
          }
        }
      );
      var sp = document.createElement("span");
      sp.className = "today-task-text";
      sp.textContent = t.title;
      sp.title = "Нажмите, чтобы изменить";
      sp.addEventListener("click", function () {
        openTaskEdit(t);
      });
      li.appendChild(check);
      li.appendChild(sp);
      ul.appendChild(li);
    });
  }

  function updateDayCountdown() {
    var el = document.getElementById("today-countdown");
    if (!el) return;
    var now = new Date();
    var end = new Date(now);
    end.setHours(24, 0, 0, 0);
    var ms = end.getTime() - now.getTime();
    if (ms <= 0) {
      el.textContent = "00:00:00";
      renderTodayPanel();
      return;
    }
    var totalSec = Math.floor(ms / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    el.textContent =
      String(h).padStart(2, "0") +
      ":" +
      String(m).padStart(2, "0") +
      ":" +
      String(s).padStart(2, "0");
  }

  function applyTaskEdit() {
    if (!editingTaskId) return;
    var task = tasks.find(function (x) {
      return x.id === editingTaskId;
    });
    if (!task) return;
    var title = document.getElementById("task-edit-title").value.trim();
    var dateISO = document.getElementById("task-edit-date").value || task.dateISO;
    if (!title) return;
    task.title = title;
    task.dateISO = dateISO;
    saveTasks();
    document.getElementById("task-edit-dialog").close();
    editingTaskId = null;
    renderCalendar();
    if (document.getElementById("day-dialog").open) {
      openDayDialog(dialogDayISO);
    }
  }

  document.getElementById("task-edit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    applyTaskEdit();
  });
  document.getElementById("task-edit-cancel").addEventListener("click", function () {
    document.getElementById("task-edit-dialog").close();
    editingTaskId = null;
  });

  function renderCalendar() {
    var mobile = window.matchMedia("(max-width: 900px)").matches;
    var shell = document.querySelector(".card-calendar .cal-shell");
    if (shell) shell.setAttribute("data-cal-view", mobile ? "week" : "month");

    if (mobile) {
      document.getElementById("cal-label").textContent = formatWeekRangeLabel(calWeekMonday);
    } else {
      document.getElementById("cal-label").textContent = displayCalendarTitle(
        calYear,
        calMonth
      );
    }

    const host = document.getElementById("cal-days");
    host.innerHTML = "";

    let cells = [];
    if (mobile) {
      for (let wi = 0; wi < 7; wi++) {
        cells.push({ d: new Date(calWeekMonday.getTime() + wi * MS_DAY) });
      }
    } else {
      const meta = monthMeta(calYear, calMonth);
      for (let i = 0; i < meta.startCol; i++) {
        cells.push({
          empty: true,
          d: new Date(calYear, calMonth, 1 - (meta.startCol - i)),
        });
      }
      for (let day = 1; day <= meta.lastDay; day++) {
        cells.push({ empty: false, d: new Date(calYear, calMonth, day) });
      }
      while (cells.length % 7 !== 0) {
        const last = cells[cells.length - 1].d;
        cells.push({ empty: true, d: new Date(last.getTime() + MS_DAY) });
      }
    }

    const todayIsoLive = getTodayISO();

    cells.forEach(function (c) {
      const iso = toLocalISO(c.d);
      const inMonth =
        !mobile && c.d.getMonth() === calMonth && c.d.getFullYear() === calYear;
      const div = document.createElement("div");
      div.className = "cal-day" + (inMonth || mobile ? "" : " outside");
      if (iso === todayIsoLive) div.classList.add("is-today");
      div.dataset.dateIso = iso;

      const head = document.createElement("div");
      head.className = "cal-day-head";
      const numWrap = document.createElement("div");
      if (mobile) {
        numWrap.className =
          "cal-day-num cal-day-num--week-icon" +
          (iso === todayIsoLive ? " cal-day-num--today" : "");
        numWrap.innerHTML =
          '<span class="cal-day-n">' +
          c.d.getDate() +
          '</span><span class="cal-day-month">' +
          MONTH_GENITIVE[c.d.getMonth()] +
          "</span>";
        head.appendChild(numWrap);
      } else {
        numWrap.className = "cal-day-num";
        if (iso === todayIsoLive) numWrap.classList.add("cal-day-num--today");
        numWrap.textContent = calendarCellDayLabel(c.d, inMonth);
        head.appendChild(numWrap);
      }
      div.appendChild(head);

      const tasksWrap = document.createElement("div");
      tasksWrap.className = "cal-day-tasks";

      const dayTasks = tasksForDay(iso).slice().sort(function (a, b) {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return (a.title || "").localeCompare(b.title || "", "ru");
      });

      dayTasks.forEach(function (t) {
        const card = document.createElement("div");
        card.className = "cal-task-card" + (t.done ? " is-done" : "");

        const top = document.createElement("div");
        top.className = "cal-task-card-top";

        const checkLabel = document.createElement("label");
        checkLabel.className = "cal-task-check";
        checkLabel.title = t.done ? "Снять отметку" : "Отметить выполненной";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "cal-task-check-input";
        cb.checked = !!t.done;
        cb.addEventListener("click", function (e) {
          e.stopPropagation();
        });
        cb.addEventListener("change", function () {
          t.done = cb.checked;
          saveTasks();
          renderCalendar();
          if (document.getElementById("day-dialog").open) {
            openDayDialog(dialogDayISO);
          }
        });
        const face = document.createElement("span");
        face.className = "cal-task-check-face";
        face.setAttribute("aria-hidden", "true");
        checkLabel.appendChild(cb);
        checkLabel.appendChild(face);
        checkLabel.addEventListener("click", function (e) {
          e.stopPropagation();
        });

        const titleEl = document.createElement("span");
        titleEl.className = "cal-task-card-title";
        var rawTitle = String(t.title || "").trim();
        titleEl.textContent = mobile ? rawTitle || "—" : taskPreviewWords(t.title);
        titleEl.title = t.title + " — нажмите, чтобы изменить";
        titleEl.addEventListener("click", function (e) {
          e.stopPropagation();
          openTaskEdit(t);
        });

        const dragHandle = document.createElement("div");
        dragHandle.className = "cal-task-drag";
        dragHandle.textContent = "⋮⋮";
        dragHandle.title = "Перенести на другой день";
        dragHandle.draggable = true;
        dragHandle.addEventListener("click", function (e) {
          e.stopPropagation();
        });
        dragHandle.addEventListener("dragstart", function (e) {
          e.stopPropagation();
          e.dataTransfer.setData("text/plain", t.id);
          e.dataTransfer.effectAllowed = "move";
        });

        top.appendChild(checkLabel);
        top.appendChild(titleEl);
        top.appendChild(dragHandle);
        card.appendChild(top);
        card.addEventListener("click", function (e) {
          e.stopPropagation();
        });

        tasksWrap.appendChild(card);
      });

      if (mobile && dayTasks.length === 0) {
        tasksWrap.classList.add("is-empty");
        const emptyDay = document.createElement("div");
        emptyDay.className = "cal-day-empty";
        emptyDay.textContent = "Нет задач";
        tasksWrap.appendChild(emptyDay);
      }

      div.appendChild(tasksWrap);

      div.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      div.addEventListener("dragenter", function (e) {
        e.preventDefault();
        div.classList.add("cal-day--drop");
      });
      div.addEventListener("dragleave", function (e) {
        if (!div.contains(e.relatedTarget)) {
          div.classList.remove("cal-day--drop");
        }
      });
      div.addEventListener("drop", function (e) {
        e.preventDefault();
        div.classList.remove("cal-day--drop");
        const id = e.dataTransfer.getData("text/plain");
        if (!id) return;
        calMoveTaskToDay(id, iso);
      });

      div.addEventListener("click", function (e) {
        if (e.target.closest(".cal-task-card")) return;
        openDayDialog(iso);
      });

      host.appendChild(div);
    });

    renderTodayPanel();
  }

  function openDayDialog(iso) {
    dialogDayISO = iso;
    const dlg = document.getElementById("day-dialog");
    document.getElementById("day-dialog-title").textContent = "Задачи на " + iso;

    const listEl = document.getElementById("day-dialog-tasks");
    listEl.innerHTML = "";
    const dayList = tasksForDay(iso);
    if (dayList.length === 0) {
      const p = document.createElement("li");
      p.className = "empty";
      p.style.border = "none";
      p.textContent = "Нет задач";
      listEl.appendChild(p);
    } else {
      dayList.forEach(function (t) {
        const li = document.createElement("li");
        li.className = t.done ? "dialog-task-row is-done" : "dialog-task-row";
        const check = createCalStyleCheckbox(
          t.done,
          t.done ? "Снять отметку" : "Отметить выполненной",
          function () {
            var input = check.querySelector(".cal-task-check-input");
            t.done = input.checked;
            saveTasks();
            renderCalendar();
            openDayDialog(iso);
          }
        );
        const sp = document.createElement("span");
        sp.className = "dialog-task-title";
        sp.textContent = t.title;
        sp.title = "Нажмите, чтобы изменить";
        sp.addEventListener("click", function (e) {
          e.stopPropagation();
          openTaskEdit(t);
        });
        li.appendChild(check);
        li.appendChild(sp);
        listEl.appendChild(li);
      });
    }

    document.getElementById("day-dialog-new").value = "";
    dlg.showModal();
  }

  document.getElementById("cal-prev").addEventListener("click", function () {
    calMonth--;
    if (calMonth < 0) {
      calMonth = 11;
      calYear--;
    }
    calWeekMonday = mondayOfWeek(new Date(calYear, calMonth, 1));
    renderCalendar();
  });

  document.getElementById("cal-next").addEventListener("click", function () {
    calMonth++;
    if (calMonth > 11) {
      calMonth = 0;
      calYear++;
    }
    calWeekMonday = mondayOfWeek(new Date(calYear, calMonth, 1));
    renderCalendar();
  });

  document.getElementById("cal-today").addEventListener("click", function () {
    var now = startOfDay(new Date());
    calYear = now.getFullYear();
    calMonth = now.getMonth();
    calWeekMonday = mondayOfWeek(now);
    renderCalendar();
  });

  document.getElementById("cal-week-prev-top").addEventListener("click", function () {
    calWeekMonday = new Date(calWeekMonday.getTime() - 7 * MS_DAY);
    calYear = calWeekMonday.getFullYear();
    calMonth = calWeekMonday.getMonth();
    renderCalendar();
  });

  document
    .getElementById("cal-week-next-bottom")
    .addEventListener("click", function () {
      calWeekMonday = new Date(calWeekMonday.getTime() + 7 * MS_DAY);
      calYear = calWeekMonday.getFullYear();
      calMonth = calWeekMonday.getMonth();
      renderCalendar();
    });

  var calResizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(calResizeTimer);
    calResizeTimer = setTimeout(function () {
      renderCalendar();
    }, 200);
  });

  document.getElementById("task-new-date").value = todayISO;
  document.getElementById("task-add").addEventListener("click", function () {
    const title = document.getElementById("task-new-title").value.trim();
    const dateISO = document.getElementById("task-new-date").value || todayISO;
    if (!title) return;
    tasks.push({
      id: newId(),
      dateISO: dateISO,
      title: title,
      done: false,
    });
    document.getElementById("task-new-title").value = "";
    saveTasks();
    renderCalendar();
  });

  document.getElementById("day-dialog-add").addEventListener("click", function () {
    const inp = document.getElementById("day-dialog-new");
    const title = inp.value.trim();
    if (!title) return;
    tasks.push({
      id: newId(),
      dateISO: dialogDayISO,
      title: title,
      done: false,
    });
    inp.value = "";
    saveTasks();
    renderCalendar();
    openDayDialog(dialogDayISO);
  });

  document.getElementById("day-dialog-close").addEventListener("click", function () {
    document.getElementById("day-dialog").close();
  });

  renderCalendar();
  updateDayCountdown();
  setInterval(updateDayCountdown, 1000);
}

window.App.features = window.App.features || {};
window.App.features.initTasks = initTasks;
})();
