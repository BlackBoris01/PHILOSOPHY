(function () {
const STORAGE_CODE = window.App.constants.STORAGE_CODE;
const loadJSON = window.App.storage.loadJSON;
const saveJSON = window.App.storage.saveJSON;
const MS_DAY = window.App.date.MS_DAY;
const toLocalISO = window.App.date.toLocalISO;
const fromLocalISO = window.App.date.fromLocalISO;
const monthMeta = window.App.date.monthMeta;
const mondayOfWeek = window.App.date.mondayOfWeek;
const monthLabel = window.App.date.monthLabel;
const daysWord = window.App.date.daysWord;

function normalizeCodeDays(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).forEach(function (k) {
    const v = raw[k];
    if (v === true || v === "code") out[k] = "code";
    else if (v === "weekend") out[k] = "weekend";
  });
  return out;
}

function initTracker(today) {
  const todayISO = toLocalISO(today);
  const yesterdayISO = toLocalISO(new Date(today.getTime() - MS_DAY));

  let codeDays = normalizeCodeDays(loadJSON(STORAGE_CODE, {}));
  let codeCalYear = today.getFullYear();
  let codeCalMonth = today.getMonth();

  function saveCodeDays() {
    saveJSON(STORAGE_CODE, codeDays);
  }

  function getCodeState(iso) {
    const v = codeDays[iso];
    if (v === "weekend") return "weekend";
    if (v === true || v === "code") return "code";
    return "empty";
  }

  function countWeekendsInSameWeek(iso) {
    const mon = mondayOfWeek(fromLocalISO(iso));
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const x = toLocalISO(new Date(mon.getTime() + i * MS_DAY));
      if (getCodeState(x) === "weekend") n++;
    }
    return n;
  }

  function codeMonthCells(year, month) {
    const meta = monthMeta(year, month);
    const cells = [];
    for (let i = 0; i < meta.startCol; i++) {
      cells.push(new Date(year, month, 1 - (meta.startCol - i)));
    }
    for (let day = 1; day <= meta.lastDay; day++) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1];
      cells.push(new Date(last.getTime() + MS_DAY));
    }
    return cells;
  }

  function setCodeMsg(text) {
    document.getElementById("code-msg").textContent = text || "";
  }

  function updateStreak() {
    let n = 0;
    let d = new Date(today);
    while (getCodeState(toLocalISO(d)) === "code") {
      n++;
      d = new Date(d.getTime() - MS_DAY);
    }
    document.getElementById("code-streak").textContent =
      "Серия: " + n + " " + daysWord(n);
  }

  function onCodeCellClick(iso) {
    setCodeMsg("");
    if (iso !== todayISO && iso !== yesterdayISO) return;

    const cur = getCodeState(iso);
    let next = "empty";

    if (cur === "empty") {
      next = "code";
    } else if (cur === "code") {
      if (countWeekendsInSameWeek(iso) >= 2) {
        setCodeMsg(
          "В этой неделе уже 2 выходных — сначала сбрось один (3-й клик по синей)."
        );
        return;
      }
      next = "weekend";
    } else {
      next = "empty";
    }

    if (next === "empty") delete codeDays[iso];
    else codeDays[iso] = next;

    saveCodeDays();
    renderCodeMonth();
    updateStreak();
  }

  function renderCodeMonth() {
    const host = document.getElementById("code-grid");
    host.innerHTML = "";
    document.getElementById("code-cal-label").textContent = monthLabel(
      codeCalYear,
      codeCalMonth
    );

    const days = codeMonthCells(codeCalYear, codeCalMonth);

    for (let i = 0; i < days.length; i += 7) {
      const row = document.createElement("div");
      row.className = "code-week-row";

      for (let j = 0; j < 7; j++) {
        const d = days[i + j];
        if (!d) break;
        const iso = toLocalISO(d);
        const inMonth =
          d.getMonth() === codeCalMonth && d.getFullYear() === codeCalYear;
        const isFuture = d.getTime() > today.getTime();
        const state = getCodeState(iso);

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "code-cell";
        if (!inMonth) cell.classList.add("is-out-month");
        if (isFuture) cell.classList.add("is-future");
        if (iso === todayISO) cell.classList.add("is-today");
        if (state === "code") cell.classList.add("state-code");
        else if (state === "weekend") cell.classList.add("state-weekend");

        const canEdit = !isFuture && (iso === todayISO || iso === yesterdayISO);
        if (canEdit) {
          cell.classList.add("is-editable");
          cell.addEventListener("click", function () {
            onCodeCellClick(iso);
          });
        }

        cell.title = iso;
        const num = document.createElement("span");
        num.className = "code-cell-day";
        num.textContent = String(d.getDate());
        cell.appendChild(num);
        row.appendChild(cell);
      }

      host.appendChild(row);
    }

    updateStreak();
  }

  document.getElementById("code-cal-prev").addEventListener("click", function () {
    codeCalMonth--;
    if (codeCalMonth < 0) {
      codeCalMonth = 11;
      codeCalYear--;
    }
    setCodeMsg("");
    renderCodeMonth();
  });

  document.getElementById("code-cal-next").addEventListener("click", function () {
    codeCalMonth++;
    if (codeCalMonth > 11) {
      codeCalMonth = 0;
      codeCalYear++;
    }
    setCodeMsg("");
    renderCodeMonth();
  });

  renderCodeMonth();
}

window.App.features = window.App.features || {};
window.App.features.initTracker = initTracker;
})();
