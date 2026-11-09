import { $, val, toast, clean } from "./ui.js";
function readEvents() {
  try {
    const data = JSON.parse(localStorage.getItem("cgt_events") || "[]");
    return Array.isArray(data)
      ? data.filter(
          (e) => e && typeof e.date === "string" && typeof e.title === "string",
        )
      : [];
  } catch (e) {
    return [];
  }
}

function saveEvent() {
  if (!val("cdate") || !val("ctitle")) return toast("Introduce fecha y nota");
  const ev = readEvents();
  ev.push({ date: val("cdate"), title: val("ctitle") });
  try {
    localStorage.setItem("cgt_events", JSON.stringify(ev));
  } catch (e) {
    return toast("No se ha podido guardar en este navegador");
  }
  showEvents();
  toast("Guardado en este navegador");
}

function showEvents() {
  const el = $("events");
  if (!el) return;
  const ev = readEvents().sort((a, b) => a.date.localeCompare(b.date));
  el.innerHTML = `<div class="stack space-top-18">${ev.map((e, i) => `<div class="faq"><b>${clean(e.date)}</b> · ${clean(e.title)}</div>`).join("") || '<p class="muted">Todavía no hay fechas guardadas.</p>'}</div><button class="chip" data-action="clearEvents">Borrar todas las notas locales</button>`;
}
export function clearEvents() {
  localStorage.removeItem("cgt_events");
  showEvents();
}
export { saveEvent, showEvents };
