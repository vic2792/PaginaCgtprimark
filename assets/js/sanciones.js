export function initSanciones() {
  const root = document.getElementById("centro-laboral");
  if (!root) return;
  const btn = root.querySelector("#cgt-sanction-check"),
    out = root.querySelector("#cgt-sanction-result");
  btn.addEventListener("click", function () {
    const date = root.querySelector("#cgt-sanction-date").value,
      kind = root.querySelector("#cgt-sanction-kind").value;
    const urgent = kind === "despido";
    out.textContent =
      (urgent
        ? "DESPIDO: solicita asesoramiento jurídico de inmediato. "
        : "") +
      (date
        ? "Comunicación recibida el " +
          date.split("-").reverse().join("/") +
          ". "
        : "Indica la fecha de recepción si la conoces. ") +
      (kind === "propuesta"
        ? "Solicita por escrito que se concreten los hechos y consulta si existe trámite de audiencia. "
        : "Conserva la comunicación íntegra y prepara las pruebas. ") +
      "El plazo exacto debe verificarse individualmente; esta herramienta no lo calcula ni presenta una impugnación.";
  });
  root
    .querySelector("#cgt-sanction-letter")
    .addEventListener("click", function () {
      root.querySelector('[data-center="escritos"]').click();
      root.querySelector("#cgt-letter-type").value = "sancion";
      root.querySelector("#cgt-letter-details").value =
        "Solicito copia de la comunicación disciplinaria y aclaración de los hechos y fechas que se me atribuyen.";
      root.querySelector("#cgt-letter-make").click();
    });
}
