import { printLetter } from "./escritos.js";
import { navigate } from "./navegacion.js";

function formatDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value + "T12:00:00"));
}

function today() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function initModelos(data) {
  const select = document.getElementById("model-select");
  const form = document.getElementById("model-form");
  const fields = document.getElementById("model-fields");
  const output = document.getElementById("model-output");
  const status = document.getElementById("model-status");
  const models = data.modelos;
  let model;

  function renderText(blank) {
    const values = {};
    for (const field of model.campos) {
      const input = form.elements.namedItem(field.nombre);
      values[field.nombre] = blank ? field.marcador : input.value.trim();
      if (!blank && field.tipo === "date" && values[field.nombre]) {
        values[field.nombre] = formatDate(values[field.nombre]);
      }
    }
    values.identificacion = values.dni ? ", con DNI " + values.dni : "";
    // Una sola pasada evita reinterpretar los datos personales como plantillas.
    output.value = model.texto.replace(
      /\{\{(\w+)\}\}/g,
      (_, name) => values[name] ?? "",
    );
    status.textContent = blank
      ? "Modelo en blanco: sustituye los campos entre corchetes."
      : "Copia preparada. Puedes revisar y editar el texto antes de entregarlo.";
  }

  function resetFields() {
    for (const field of model.campos) {
      form.elements.namedItem(field.nombre).value =
        field.tipo === "date" ? today() : field.valorInicial || "";
    }
  }

  function selectModel() {
    model = models.find((item) => item.id === select.value);
    document.getElementById("model-description").textContent =
      model.descripcion;
    document.getElementById("model-notice").textContent = model.aviso;
    document.getElementById("model-clarification").textContent =
      model.aclaracion;
    const guide = document.getElementById("model-guide");
    guide.hidden = !model.guia;
    if (model.guia) {
      guide.href = model.guia.destino;
      guide.textContent = model.guia.texto;
    }
    fields.replaceChildren();
    for (const field of model.campos) {
      const wrapper = document.createElement("div");
      wrapper.className = "model-field";
      const label = document.createElement("label");
      label.htmlFor = "model-" + field.nombre;
      label.textContent = field.etiqueta;
      const input = document.createElement("input");
      input.id = label.htmlFor;
      input.name = field.nombre;
      input.type = field.tipo;
      input.required = Boolean(field.obligatorio);
      input.placeholder = field.marcador;
      input.autocomplete = "off";
      wrapper.append(label, input);
      if (field.ayuda) {
        const help = document.createElement("small");
        help.id = input.id + "-help";
        help.className = "model-help";
        help.textContent = field.ayuda;
        input.setAttribute("aria-describedby", help.id);
        wrapper.append(help);
      }
      fields.append(wrapper);
    }
    resetFields();
    renderText(true);
  }

  for (const item of models) {
    select.add(new Option(item.titulo, item.id));
  }
  select.addEventListener("change", selectModel);
  selectModel();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    for (const field of model.campos) {
      const input = form.elements.namedItem(field.nombre);
      input.value = input.value.trim();
    }
    if (form.reportValidity()) renderText(false);
  });
  document
    .getElementById("model-blank")
    .addEventListener("click", () => renderText(true));
  document.getElementById("model-clear").addEventListener("click", () => {
    resetFields();
    renderText(true);
    status.textContent =
      "Datos personales y cambios en el escrito eliminados de esta copia.";
  });
  document.getElementById("model-copy").addEventListener("click", async () => {
    if (!output.value.trim()) {
      status.textContent = "Prepara primero el escrito.";
      return;
    }
    try {
      await navigator.clipboard.writeText(output.value);
      status.textContent = "Escrito copiado.";
    } catch {
      output.focus();
      output.select();
      status.textContent =
        "No se ha podido copiar automáticamente. El texto está seleccionado para copiarlo manualmente.";
    }
  });
  document
    .getElementById("model-print")
    .addEventListener("click", () => printLetter(output.value, model.titulo));
  document.getElementById("model-download").addEventListener("click", () => {
    if (!output.value.trim()) {
      status.textContent = "Prepara primero el escrito.";
      return;
    }
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", output.value], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = model.id + ".txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "Copia descargada en tu dispositivo.";
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-open-model]");
    if (!link) return;
    const id = link.dataset.openModel;
    if (!models.some((item) => item.id === id)) return;
    navigate("centro");
    document.querySelector('[data-center="modelos"]').click();
    if (select.value !== id) {
      select.value = id;
      selectModel();
    }
    document
      .getElementById("modelos-escritos")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
