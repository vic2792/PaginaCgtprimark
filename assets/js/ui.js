const $ = (id) => document.getElementById(id);
const money = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    n || 0,
  );
const num = (id) => Number($(id)?.value) || 0;
const val = (id) => $(id)?.value || "";
const f = (id, label, type = "number", value = "", extra = "") =>
  `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${value}" ${extra}></div>`;
const sel = (id, label, opts) =>
  `<div class="field"><label for="${id}">${label}</label><select id="${id}">${opts.map((o) => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>`;
const note = (t) => `<div class="note">${t}</div>`;
const result = (html) => `<div class="result" id="result">${html}</div>`;
const button = (action, label = "Calcular", app = "") =>
  `<button class="btn" data-action="${action}"${app ? ` data-app="${app}"` : ""}>${label}</button>`;
function toast(t) {
  $("toast").textContent = t;
  $("toast").classList.add("is-visible");
  setTimeout(() => $("toast").classList.remove("is-visible"), 2800);
}

function out(h) {
  $("result").innerHTML = h;
}

function validNumbers(ids) {
  return ids.every((id) => {
    const e = $(id);
    return (
      e &&
      e.value.trim() !== "" &&
      Number.isFinite(Number(e.value)) &&
      Number(e.value) >= 0 &&
      e.checkValidity()
    );
  });
}

function clean(t) {
  return String(t || "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

function copyText(t) {
  navigator.clipboard
    ?.writeText(t)
    .then(() => toast("Texto copiado"))
    .catch(() => toast("Selecciona y copia el texto manualmente"));
}
export {
  $,
  money,
  num,
  val,
  f,
  sel,
  note,
  result,
  button,
  toast,
  out,
  validNumbers,
  clean,
  copyText,
};
