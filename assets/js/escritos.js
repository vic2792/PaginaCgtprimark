import { $, val, out, copyText, clean } from "./ui.js";
let lastText = "";
function showText(t) {
  lastText = t;
  out(
    `<pre id="copyarea"></pre><button class="btn" data-action="copyLastText">Copiar texto</button>`,
  );
  $("copyarea").textContent = t;
}

function makeLetter() {
  let types = {
    contrato: "SOLICITUD DE COPIA DE CONTRATO",
    permiso: "SOLICITUD DE PERMISO RETRIBUIDO",
    jornada: "SOLICITUD DE ACLARACIÓN DE JORNADA",
    nomina: "SOLICITUD DE REVISIÓN DE NÓMINA",
    vacaciones: "SOLICITUD SOBRE VACACIONES",
    otro: "SOLICITUD GENERAL",
  };
  showText(
    `${types[val("etype")]}\n\nA la atención de Recursos Humanos de Primark Gran Vía\n\nFecha: ${val("edate") || "[fecha]"}\nNombre: ${val("ename") || "[nombre y apellidos]"}\nCentro / departamento: ${val("eemail") || "[centro]"}\n\nPor medio del presente escrito, solicito lo siguiente:\n\n${val("edetail") || "[Describir la solicitud y las fechas correspondientes]"}\n\nRuego confirmación por escrito y respuesta a esta solicitud.\n\nAtentamente,\n${val("ename") || "[firma]"}`,
  );
}

function makeIncident() {
  showText(
    `REGISTRO PERSONAL DE INCIDENCIA\nTipo: ${val("itype")}\nFecha: ${val("idate") || "[fecha]"}\nZona: ${val("iplace") || "[zona]"}\n\nHechos:\n${val("idesc") || "[descripción]"}\n\nDocumento preparado por la persona interesada. Pendiente de revisión y envío voluntario por un canal seguro.`,
  );
}
export function copyLastText() {
  copyText(lastText);
}
export function initEscritos() {
  const root = document.getElementById("centro-laboral");
  if (!root) return;
  const q = (s) => root.querySelector(s),
    qa = (s) => Array.from(root.querySelectorAll(s));
  const renunciaOptions = q("#cgt-renuncia-options");
  q("#cgt-letter-type").addEventListener("change", () => {
    renunciaOptions.hidden =
      q("#cgt-letter-type").value !== "renuncia-complementarias";
  });
  q("#cgt-letter-make").addEventListener("click", () => {
    const type = q("#cgt-letter-type").value,
      name = q("#cgt-letter-name").value.trim() || "[Nombre y apellidos]",
      detail =
        q("#cgt-letter-details").value.trim() ||
        "[Indicar motivo, fechas y documentación]";
    if (type === "renuncia-complementarias") {
      const cause = q("#cgt-renuncia-causa").value,
        center =
          q("#cgt-renuncia-centro").value.trim() || "[Centro de trabajo]",
        pact = q("#cgt-renuncia-pacto").value;
      const causes = {
        familia:
          "Atención de responsabilidades familiares en los términos del artículo 37.6 del Estatuto de los Trabajadores.",
        formacion:
          "Necesidades formativas, con incompatibilidad horaria acreditable.",
        otrocontrato:
          "Incompatibilidad con otro contrato de trabajo a tiempo parcial.",
        otros:
          "Renuncia conforme a la previsión del convenio de Primark, previa comprobación de su aplicación a mi pacto.",
      };
      const ordinary =
        cause === "otros"
          ? "Invoco la previsión de renuncia del artículo 12.4 del convenio de Primark publicado en 2021, que recoge un año desde la celebración del pacto y un preaviso de 15 días. La aplicación de esta previsión a mi pacto y la fecha de efectos deben comprobarse antes de presentar este borrador."
          : "Esta comunicación se efectúa al amparo del artículo 12.5.e del Estatuto de los Trabajadores, con el preaviso legal de 15 días, siempre que haya transcurrido un año desde la celebración del pacto.";
      q("#cgt-letter-output").value =
        "A la atención de Recursos Humanos de " +
        center +
        "\\n\\nASUNTO: RENUNCIA AL PACTO DE HORAS COMPLEMENTARIAS\\n\\nYo, " +
        name +
        ", trabajador/a del centro, comunico mi voluntad de renunciar al pacto de horas complementarias suscrito con la empresa." +
        (pact
          ? "\\nFecha del pacto: " + pact.split("-").reverse().join("/")
          : "") +
        "\\n\\nMotivo: " +
        causes[cause] +
        "\\n\\n" +
        (detail === "[Indicar motivo, fechas y documentación]"
          ? ""
          : detail + "\\n\\n") +
        ordinary +
        "\\n\\nSolicito confirmación escrita de la recepción de esta comunicación y de la fecha efectiva de finalización del pacto, manteniéndose mi jornada ordinaria contratada.\\n\\nEn Madrid, a " +
        new Date().toLocaleDateString("es-ES") +
        "\\n\\nFirma: " +
        name +
        "\\n\\nFecha y firma/sello de recepción de la empresa: __________________";
      q("#cgt-letter-output").value = q("#cgt-letter-output").value.replace(
        /\\n/g,
        "\n",
      );
      return;
    }
    const subjects = {
      permiso: "SOLICITUD DE PERMISO RETRIBUIDO",
      adaptacion: "SOLICITUD DE ADAPTACIÓN DE JORNADA",
      nomina: "SOLICITUD DE REVISIÓN DE NÓMINA",
      horario: "SOLICITUD DE REVISIÓN DE HORARIO",
      documentacion: "SOLICITUD DE DOCUMENTACIÓN LABORAL",
      vacaciones: "SOLICITUD DE REVISIÓN DE VACACIONES",
      festivos: "SOLICITUD DE REVISIÓN DE HORAS EN FESTIVOS",
      incidencia: "COMUNICACIÓN DE INCIDENCIA LABORAL",
      sancion: "SOLICITUD DE DOCUMENTACIÓN SOBRE MEDIDA DISCIPLINARIA",
    };
    const intros = {
      permiso:
        "Solicito el permiso retribuido que legal o convencionalmente corresponda por las circunstancias que se indican, y confirmación escrita de las fechas de disfrute y reincorporación.",
      adaptacion:
        "Solicito que se valore una adaptación de mi jornada por necesidades de conciliación, conforme al artículo 34.8 del Estatuto de los Trabajadores, y que se tramite la negociación que corresponda.",
      nomina:
        "Solicito revisión y desglose de los conceptos de mi nómina y aclaración por escrito de las posibles diferencias.",
      horario:
        "Solicito revisión de mi planificación horaria y aclaración escrita de los criterios aplicados.",
      documentacion:
        "Solicito que se me facilite copia de la documentación laboral que se identifica a continuación.",
      vacaciones:
        "Solicito que se revise la asignación o comunicación de vacaciones y se me confirme por escrito la resolución.",
      festivos:
        "Solicito que se explique la distribución de horas en los días festivos indicados y su adecuación a mi jornada contratada y al calendario aplicable.",
      incidencia:
        "Comunico esta incidencia y solicito que se revise, se adopten las medidas que procedan y se me responda por escrito.",
      sancion:
        "Solicito copia íntegra de la comunicación y documentación que se me pueda facilitar sobre la medida disciplinaria, así como aclaración de los hechos imputados. Esta solicitud no implica conformidad con la sanción ni suspende los plazos legales de impugnación.",
    };
    q("#cgt-letter-output").value =
      "A la atención del Departamento de Recursos Humanos de Primark Gran Vía\n\nAsunto: " +
      subjects[type] +
      "\n\nYo, " +
      name +
      ", trabajador/a del centro, expongo:\n\n" +
      detail +
      "\n\n" +
      intros[type] +
      "\n\nSolicito respuesta por escrito y, en su caso, indicación de la documentación justificativa necesaria.\n\nEn Madrid, a " +
      new Date().toLocaleDateString("es-ES") +
      "\n\nFirma: " +
      name;
  });
  q("#cgt-letter-copy").addEventListener("click", async () => {
    const t = q("#cgt-letter-output").value;
    if (!t) return;
    try {
      await navigator.clipboard.writeText(t);
      alert("Escrito copiado.");
    } catch (e) {
      q("#cgt-letter-output").select();
      alert("Selecciona el texto para copiarlo.");
    }
  });
  q("#cgt-letter-print").addEventListener("click", () => {
    printLetter(q("#cgt-letter-output").value);
  });
}

// Compartido por el generador y la biblioteca de modelos.
export function printLetter(text, title = "Escrito laboral") {
  if (!text.trim()) return alert("Prepara primero el escrito.");
  const w = window.open("", "_blank");
  if (!w) return alert("Permite las ventanas emergentes para imprimir.");
  const stylesheet = new URL("../css/impresion.css", import.meta.url).href;
  w.addEventListener(
    "load",
    () => {
      w.focus();
      w.print();
    },
    { once: true },
  );
  w.document.write(
    '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>' +
      clean(title) +
      '</title><link rel="stylesheet" href="' +
      stylesheet +
      '"></head><body><pre>' +
      clean(text) +
      "</pre></body></html>",
  );
  w.document.close();
}
export { makeLetter, makeIncident };
