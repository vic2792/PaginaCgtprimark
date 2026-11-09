export function initCentroLaboral() {
  const root = document.getElementById("centro-laboral");
  if (!root) return;
  const q = (s) => root.querySelector(s),
    qa = (s) => Array.from(root.querySelectorAll(s));
  const escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  qa("[data-center]").forEach((b) =>
    b.addEventListener("click", () => {
      qa("[data-center]").forEach((x) => x.classList.toggle("active", x === b));
      qa("[data-pane]").forEach((x) =>
        x.classList.toggle("active", x.dataset.pane === b.dataset.center),
      );
    }),
  );

  q("#cgt-week-calc").addEventListener("click", () => {
    const vals = qa(".cgt-day").map((x) => Number(x.value));
    const contract = Number(q("#cgt-week-contract").value);
    if (
      !Number.isFinite(contract) ||
      contract <= 0 ||
      vals.some((x) => !Number.isFinite(x) || x < 0 || x > 24)
    )
      return (q("#cgt-week-result").textContent =
        "Comprueba las horas introducidas.");
    const total = vals.reduce((a, b) => a + b, 0),
      dif = total - contract;
    q("#cgt-week-result").textContent =
      "Horas planificadas: " +
      total.toLocaleString("es-ES") +
      " h. Jornada semanal de referencia: " +
      contract.toLocaleString("es-ES") +
      " h. Diferencia: " +
      (dif > 0 ? "+" : "") +
      dif.toLocaleString("es-ES") +
      " h. Comprueba el cómputo anual, la distribución irregular y los descansos antes de sacar conclusiones.";
  });
  const tips = {
    horario:
      "Conserva el horario original y el modificado, y comprueba preavisos y distribución de jornada.",
    descanso:
      "Anota horas de entrada, salida y descansos; contrasta con convenio y Estatuto.",
    festivo:
      "Compara las horas de la semana y el cómputo anual; un festivo con menos horas no demuestra por sí solo una infracción.",
    nomina:
      "Reúne nómina, contrato, tablas salariales y registro horario; utiliza el revisor de nóminas.",
    sancion:
      "Conserva la comunicación y consulta inmediatamente con asesoría sindical o jurídica: la impugnación tiene plazos breves.",
  };
  q("#cgt-review").addEventListener("click", () => {
    const keys = qa(".cgt-check input[type=checkbox]:checked").map(
      (x) => x.value,
    );
    q("#cgt-review-result").innerHTML = keys.length
      ? "<strong>Orientación inicial, no diagnóstico jurídico:</strong><ul>" +
        keys.map((k) => "<li>" + escapeHtml(tips[k]) + "</li>").join("") +
        "</ul>"
      : "Selecciona al menos una situación.";
  });
  const store = "cgt-recordatorios-v1";
  let tasks = [];
  try {
    tasks = JSON.parse(localStorage.getItem(store) || "[]");
    if (!Array.isArray(tasks)) tasks = [];
  } catch (e) {}
  const persist = () => {
    try {
      localStorage.setItem(store, JSON.stringify(tasks));
    } catch (e) {
      alert("Este navegador no permite guardar los recordatorios.");
    }
  };
  const render = () => {
    q("#cgt-task-list").innerHTML = tasks.length
      ? tasks
          .map(
            (t, i) =>
              '<div class="cgt-task-row"><span>' +
              escapeHtml(t.name) +
              (t.date ? " · " + escapeHtml(t.date) : "") +
              '</span><button type="button" data-remove="' +
              i +
              '" aria-label="Eliminar recordatorio">Eliminar</button></div>',
          )
          .join("")
      : "<p>No tienes recordatorios guardados.</p>";
  };
  q("#cgt-task-add").addEventListener("click", () => {
    const name = q("#cgt-task-name").value.trim(),
      date = q("#cgt-task-date").value;
    if (!name) return;
    tasks.push({ name, date });
    persist();
    render();
    q("#cgt-task-name").value = "";
  });
  q("#cgt-task-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-remove]");
    if (!b) return;
    tasks.splice(Number(b.dataset.remove), 1);
    persist();
    render();
  });
  q("#cgt-task-clear").addEventListener("click", () => {
    if (
      confirm("¿Borrar todos los recordatorios guardados en este navegador?")
    ) {
      tasks = [];
      persist();
      render();
    }
  });
  render();
  q("#cgt-quiz-check").addEventListener("click", () => {
    const v = q("input[name=cgt-quiz]:checked");
    q("#cgt-quiz-result").textContent = !v
      ? "Selecciona una respuesta."
      : v.value === "si"
        ? "Correcto. Las sanciones pueden impugnarse en un plazo breve (con carácter general, 20 días hábiles). Consulta de inmediato los detalles de tu caso."
        : "No es correcto. Las sanciones tienen plazos de impugnación; conviene consultar cuanto antes con representación sindical o asesoría jurídica.";
  });
}
