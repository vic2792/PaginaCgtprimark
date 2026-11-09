import { $ } from "./ui.js";
import { content } from "./plantillas.js";
import { permitInfo, renderQuiz } from "./formacion.js";
import { showEvents } from "./calendario.js";
let apps,
  areaNames,
  category = "Todas";
export function initCatalogo(datos) {
  apps = datos.herramientas;
  areaNames = datos.areas;
  renderCards();
}
function areaOf(id) {
  return areaNames[id] || "Otras";
}
function renderCards() {
  const s = $("search").value.toLocaleLowerCase("es");
  $("areaHeading").innerHTML =
    category === "Todas"
      ? '<p class="muted">Elige una categoría o busca una herramienta por su nombre.</p>'
      : "<h3>" + category + "</h3>";
  $("filters").innerHTML = [
    "Todas",
    "Salario y cálculos",
    "Jornada y horarios",
    "Derechos y permisos",
    "Gestiones CGT",
    "Información sindical",
  ]
    .map(
      (c) =>
        `<button class="chip ${c === category ? "active" : ""}" data-action="filterCategory" data-category="${c}">${c}</button>`,
    )
    .join("");
  $("cards").innerHTML =
    apps
      .filter(
        (a) =>
          (category === "Todas" || areaOf(a[0]) === category) &&
          (a[2] + " " + a[3]).toLocaleLowerCase("es").includes(s),
      )
      .map(
        (a) =>
          `<button class="tile" data-action="showApp" data-app="${a[0]}"><span class="ico">${a[1]}</span><b>${a[2]}</b><small>${a[3]}</small><em>${areaOf(a[0])}</em></button>`,
      )
      .join("") || "<p>No hay herramientas que coincidan con tu búsqueda.</p>";
}
function renderTool(id) {
  const a = apps.find((x) => x[0] === id);
  $("workIcon").textContent = a[1];
  $("workCategory").textContent = areaOf(id);
  $("workTitle").textContent = a[2];
  $("workContent").innerHTML = content(id);
  $("workspace").classList.add("visible");
  $("catalog").classList.add("hidden");
  $("hero").classList.add("hidden");
  $("about").classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "permisos") permitInfo();
  if (id === "calendario") showEvents();
  if (id === "test") renderQuiz();
}
export function filterCategory(value) {
  category = value;
  renderCards();
}
export { renderCards, renderTool };
