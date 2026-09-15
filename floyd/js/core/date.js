(function () {
  const MS_DAY = 24 * 60 * 60 * 1000;
  const MONTH_GENITIVE =
    "января февраля марта апреля мая июня июля августа сентября октября ноября декабря".split(
      " "
    );

  function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function toLocalISO(d) {
    const x = startOfDay(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function fromLocalISO(iso) {
    const parts = iso.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function getTodayISO() {
    return toLocalISO(startOfDay(new Date()));
  }

  function daysWord(n) {
    const a = Math.abs(n) % 100;
    const b = Math.abs(n) % 10;
    if (a > 10 && a < 20) return "дней";
    if (b === 1) return "день";
    if (b >= 2 && b <= 4) return "дня";
    return "дней";
  }

  function monthLabel(y, m) {
    const names =
      "январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь".split(
        " "
      );
    return names[m] + " " + y;
  }

  function monthMeta(y, m) {
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    return {
      first: first,
      lastDay: last.getDate(),
      startCol: (first.getDay() + 6) % 7,
    };
  }

  function mondayOfWeek(date) {
    const d = startOfDay(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return new Date(d.getTime() + diff * MS_DAY);
  }

  window.App = window.App || {};
  window.App.date = {
    MS_DAY: MS_DAY,
    MONTH_GENITIVE: MONTH_GENITIVE,
    startOfDay: startOfDay,
    toLocalISO: toLocalISO,
    fromLocalISO: fromLocalISO,
    getTodayISO: getTodayISO,
    daysWord: daysWord,
    monthLabel: monthLabel,
    monthMeta: monthMeta,
    mondayOfWeek: mondayOfWeek,
  };
})();
