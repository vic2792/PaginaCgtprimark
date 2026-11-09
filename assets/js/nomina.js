export function initNomina(datos) {
  const wage = datos.baseBOE,
    hrs = datos.jornadaAnual,
    sun = datos.plusDomingo;
  const $ = (id) => document.getElementById(id),
    fmt = (n) =>
      n.toLocaleString("es-ES", { style: "currency", currency: "EUR" }),
    n = (id) => Number($(id).value || 0),
    has = (id) => $(id).value.trim() !== "";
  $("auditCalc").addEventListener("click", () => {
    const y = n("auditYear"),
      g = n("auditGroup"),
      h = n("auditHours"),
      f = n("auditFull"),
      pct = n("auditPct"),
      sen = n("auditSen"),
      p = n("auditPays");
    const fields = [
      "auditSunHours",
      "auditNight",
      "auditCpsb",
      "auditCpp10",
      "auditCpp11",
      "auditOther",
      "auditActual",
      "auditSs",
      "auditIrpf",
      "auditDed",
    ];
    if (
      !(
        f > 0 &&
        h >= 0 &&
        h <= f &&
        sen >= 0 &&
        Number.isInteger(sen) &&
        (!has("auditPct") || (pct > 0 && pct <= 100))
      ) ||
      fields.some(
        (id) => !Number.isFinite(n(id)) || (id !== "auditOther" && n(id) < 0),
      )
    ) {
      $("auditResult").textContent =
        "Revisa los datos: horas, porcentaje, cuatrienios e importes.";
      return;
    }
    const ratio = has("auditPct") ? pct / 100 : h / f,
      base = wage[y][g] * ratio,
      senValues = datos.tramosAntiguedad;
    let senAnnual = 0;
    for (let i = 0; i < sen; i++)
      senAnnual += senValues[i] ?? datos.tramosAntiguedad.at(-1);
    senAnnual *= ratio;
    const monthlyFixed = (base + senAnnual) / p;
    const supplements =
      n("auditCpsb") + n("auditCpp10") + n("auditCpp11") + n("auditOther");
    const sunday = (n("auditSunHours") * sun[y]) / 6;
    const night = n("auditNight") * (wage[y][g] / hrs[y]) * 0.25;
    const estimated = monthlyFixed + supplements + sunday + night;
    let html =
      "<h3>Resultado orientativo</h3><p>Porcentaje aplicado: <strong>" +
      (ratio * 100).toFixed(2) +
      " %</strong><br>Salario base anual: <strong>" +
      fmt(base) +
      "</strong><br>Antigüedad anual: <strong>" +
      fmt(senAnnual) +
      "</strong><br>Media de retribución fija por paga (" +
      p +
      "): <strong>" +
      fmt(monthlyFixed) +
      "</strong><br>Complementos introducidos: " +
      fmt(supplements) +
      "<br>Domingos/festivos estimados: " +
      fmt(sunday) +
      "<br>Nocturnidad estimada: " +
      fmt(night) +
      "</p><p><strong>Total bruto orientativo del periodo: " +
      fmt(estimated) +
      "</strong></p>";
    if (has("auditActual"))
      html +=
        "<p>Bruto real introducido: " +
        fmt(n("auditActual")) +
        "<br>Diferencia (real menos estimado): <strong>" +
        fmt(n("auditActual") - estimated) +
        '</strong></p><p class="small">La diferencia no prueba por sí sola un impago: hay que revisar estructura de pagas, periodo de devengo, conceptos variables y porcentaje contractual.</p>';
    if (has("auditSs") && has("auditIrpf")) {
      const gross = has("auditActual") ? n("auditActual") : estimated;
      html +=
        "<p>Neto aritmético " +
        (has("auditActual") ? "sobre bruto real" : "estimado") +
        ": <strong>" +
        fmt(gross - n("auditSs") - n("auditIrpf") - n("auditDed")) +
        "</strong> (bruto − deducciones introducidas).</p>";
    } else
      html +=
        '<p class="small">Para calcular el neto, introduce cotizaciones e IRPF reales; no se inventan porcentajes de retención.</p>';
    $("auditResult").innerHTML = html;
  });
}
