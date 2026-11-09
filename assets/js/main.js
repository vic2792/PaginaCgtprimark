// Punto de entrada: carga datos y conecta los módulos, sin variables globales.
import { loadData } from "./datos.js";
import {
  initCatalogo,
  renderCards,
  renderTool,
  filterCategory,
} from "./catalogo.js";
import * as calculators from "./calculadoras.js";
import { initTablas } from "./tablas.js";
import { initNomina } from "./nomina.js";
import { initConsultas } from "./consultas.js";
import { initChat } from "./chat.js";
import {
  initEscritos,
  makeLetter,
  makeIncident,
  copyLastText,
} from "./escritos.js";
import { initCentroLaboral } from "./centro-laboral.js";
import { initSanciones } from "./sanciones.js";
import { initFormacion, permitInfo, gradeQuiz } from "./formacion.js";
import { saveEvent, clearEvents } from "./calendario.js";
import {
  initNavigation,
  home,
  goHome,
  goQuestion,
  showApp,
  jumpTo,
} from "./navegacion.js";

const actions = {
  ...calculators,
  renderCards,
  permitInfo,
  gradeQuiz,
  makeLetter,
  makeIncident,
  copyLastText,
  saveEvent,
  clearEvents,
  home,
  goHome,
  goQuestion,
  showApp: (element) => showApp(element.dataset.app),
  jumpTo: (element) => jumpTo(element.dataset.target),
  filterCategory: (element) => filterCategory(element.dataset.category),
};

async function start() {
  const [salarios, preguntas, herramientas] = await Promise.all([
    loadData("salarios"),
    loadData("preguntas"),
    loadData("herramientas"),
  ]);
  initFormacion(preguntas);
  initCatalogo(herramientas);
  initTablas(salarios, preguntas);
  calculators.initCalculadoras(salarios);
  initNomina(salarios);
  initConsultas(preguntas);
  initChat();
  initEscritos();
  initCentroLaboral();
  initSanciones();
  initNavigation(renderTool);

  // Delegación de eventos: también funciona para botones creados después.
  for (const [eventName, attribute] of [
    ["click", "data-action"],
    ["input", "data-input-action"],
    ["change", "data-change-action"],
  ]) {
    document.addEventListener(eventName, (event) => {
      const element = event.target.closest(`[${attribute}]`);
      if (!element) return;
      actions[element.getAttribute(attribute)]?.(element);
    });
  }
  document.getElementById("app-status").hidden = true;
  document.documentElement.dataset.appReady = "true";
}

start().catch((error) => {
  console.error(error);
  const status = document.getElementById("app-status");
  status.setAttribute("role", "alert");
  status.textContent =
    "No se han podido cargar las herramientas. Recarga la página para intentarlo de nuevo.";
  document.documentElement.dataset.appReady = "error";
});
