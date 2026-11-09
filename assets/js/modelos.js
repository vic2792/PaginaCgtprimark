import { printLetter } from "./escritos.js";
import { navigate } from "./navegacion.js";

let models = new Map();

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function createModelCard(model) {
  const card = element("section", "", "model-card");
  card.dataset.modelId = model.id;
  card.setAttribute("aria-label", "Modelo: " + model.titulo);
  if (model.documentacion?.length) {
    card.append(element("h4", "Qué documentación preparar"));
    const list = element("ul");
    for (const text of model.documentacion) list.append(element("li", text));
    card.append(list);
  }
  card.append(element("h4", "Modelo de escrito para copiar"));
  card.append(element("p", model.titulo, "model-title"));
  card.append(
    element(
      "p",
      "Completa los campos entre corchetes en tu documento o a mano después de imprimir. No introduzcas tus datos aquí.",
      "model-help",
    ),
  );
  const text = element("pre", model.texto, "model-text");
  text.tabIndex = 0;
  card.append(text);
  const actions = element("div", "", "model-actions");
  for (const [action, label] of [
    ["copy", "Copiar modelo"],
    ["download", "Descargar .txt"],
    ["print", "Imprimir / guardar PDF"],
  ]) {
    const button = element("button", label);
    button.type = "button";
    button.dataset.modelAction = action;
    actions.append(button);
  }
  const status = element("p", "", "model-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  card.append(actions, status, element("p", model.aviso, "model-help"));
  if (model.aclaracion)
    card.append(element("p", model.aclaracion, "model-help"));
  if (model.guia) {
    const link = element("a", model.guia.texto);
    link.href = model.guia.destino;
    card.append(link);
  }
  return card;
}

// Reutilizado por la biblioteca, las fichas, las respuestas y el chat.
export function appendModels(container, ids) {
  for (const id of ids) {
    const model = models.get(id);
    if (model) container.append(createModelCard(model));
  }
}

export function initModelos(data) {
  models = new Map(data.modelos.map((model) => [model.id, model]));
  const select = document.getElementById("model-select");
  const library = document.getElementById("model-library-content");
  function showLibraryModel() {
    library.replaceChildren();
    appendModels(library, [select.value]);
  }
  for (const model of models.values())
    select.add(new Option(model.titulo, model.id));
  select.addEventListener("change", showLibraryModel);
  showLibraryModel();
  for (const slot of document.querySelectorAll("[data-model-slot]")) {
    slot.replaceChildren();
    appendModels(slot, [slot.dataset.modelSlot]);
  }

  document.addEventListener("click", async (event) => {
    const opener = event.target.closest("[data-open-model]");
    if (opener && models.has(opener.dataset.openModel)) {
      navigate("centro");
      document.querySelector('[data-center="modelos"]').click();
      select.value = opener.dataset.openModel;
      showLibraryModel();
      library.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const button = event.target.closest("[data-model-action]");
    if (!button) return;
    const card = button.closest("[data-model-id]");
    const model = models.get(card.dataset.modelId);
    if (!model) return;
    const text = card.querySelector(".model-text");
    const status = card.querySelector(".model-status");
    switch (button.dataset.modelAction) {
      case "copy":
        try {
          await navigator.clipboard.writeText(text.textContent);
          status.textContent =
            "Modelo copiado. Completa los huecos en tu documento.";
        } catch {
          text.focus();
          const range = document.createRange();
          range.selectNodeContents(text);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          status.textContent =
            "El texto está seleccionado para copiarlo manualmente.";
        }
        break;
      case "download": {
        const url = URL.createObjectURL(
          new Blob(["\uFEFF", text.textContent], {
            type: "text/plain;charset=utf-8",
          }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = model.id + ".txt";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent =
          "Modelo descargado. Completa los huecos antes de entregarlo.";
        break;
      }
      case "print":
        printLetter(text.textContent, model.titulo);
        break;
    }
  });
}
