// La navegación solo controla qué secciones están visibles.
const groups = {
  inicio: ["hero", "quienes-somos", "portal-tiles"],
  herramientas: ["catalog"],
  centro: ["centro-laboral"],
  calculadoras: ["convenio-oficial"],
  nomina: ["auditoria-nomina-cgt"],
  tablas: ["datos2028"],
  derechos: ["derechos-guia"],
  dudas: ["dudas-cgt"],
  enlaces: ["enlaces-staff-cgt"],
  fuentes: ["portal-fuentes", "roadmap"],
};
const routes = {
  catalog: "herramientas",
  permisos2028: "tablas",
  datos2028: "tablas",
  "convenio-oficial": "calculadoras",
  "dudas-cgt": "dudas",
  "enlaces-staff-cgt": "enlaces",
  "auditoria-nomina-cgt": "nomina",
  "derechos-guia": "derechos",
  "centro-laboral": "centro",
  "faq-renuncia-complementarias": "dudas",
  hero: "inicio",
  "portal-fuentes": "fuentes",
};
let renderTool;

export function navigate(view) {
  const menu = document.getElementById("portal-menu");
  if (view === "menu") {
    menu.classList.add("open");
    return;
  }
  menu.classList.remove("open");
  if (view === "close") return;
  const visible = groups[view] || groups.inicio;
  const sections = new Set([
    ...Object.values(groups).flat(),
    "workspace",
    "about",
  ]);
  for (const id of sections) {
    const element =
      document.getElementById(id) || document.querySelector("." + id);
    if (!element) continue;
    element.classList.add("portal-page");
    element.classList.toggle("portal-visible", visible.includes(id));
  }
  document.querySelectorAll("[data-portal]").forEach((button) => {
    button.classList.toggle("active", button.dataset.portal === view);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function home() {
  document.getElementById("workspace").classList.remove("visible");
  document.getElementById("catalog").classList.remove("hidden");
  navigate("herramientas");
}

export function showApp(id) {
  navigate("herramientas");
  renderTool(id);
  document.getElementById("workspace").classList.add("portal-visible");
  document.getElementById("catalog").classList.remove("portal-visible");
}

export function goHome() {
  navigate("inicio");
}

export function jumpTo(id) {
  navigate(routes[id] || "herramientas");
  const target = document.getElementById(id);
  if (target?.tagName === "DETAILS") target.open = true;
  setTimeout(
    () =>
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    70,
  );
}

export function goQuestion() {
  navigate("dudas");
  const question = document.getElementById("quick-question").value.trim();
  const input = document.getElementById("pregunta-staff");
  if (!question) {
    input.focus();
    return;
  }
  input.value = question;
  document.getElementById("form-dudas").dispatchEvent(
    new Event("submit", {
      bubbles: true,
      cancelable: true,
    }),
  );
}

export function initNavigation(openTool) {
  renderTool = openTool;
  const sourceSection = [...document.querySelectorAll("section")].find(
    (element) =>
      element.textContent.includes("Fuentes y alcance") && !element.id,
  );
  if (sourceSection) sourceSection.id = "portal-fuentes";
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-portal]");
    if (button) navigate(button.dataset.portal);
    else if (event.target.id === "portal-menu") navigate("close");
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute("href").slice(1);
    if (!id || !document.getElementById(id)) return;
    event.preventDefault();
    jumpTo(id);
  });
  document
    .getElementById("quick-question")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        goQuestion();
      }
    });
  navigate("inicio");
}
