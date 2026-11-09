export function initTablas(salarios, preguntas) {
  const salaries = salarios.salarios,
    seniority = salarios.antiguedad,
    rates = salarios.tarifas,
    permits = preguntas.permisosCartel;

  const $ = (id) => document.getElementById(id),
    euro = (n) =>
      Number(n).toLocaleString("es-ES", { style: "currency", currency: "EUR" }),
    safe = (s) =>
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
  function salary() {
    let y = $("syear").value,
      c = $("scontract").value,
      n = salaries[c][y],
      pay = Number($("spays").value);
    $("salaryResult").innerHTML =
      `<div class="figure">${euro(n)} / año</div><strong>${euro(n / pay)} por paga</strong><p class="small">Distribución aritmética en ${pay} pagas iguales. No equivale a una nómina neta ni acredita la estructura real de pagas.</p>`;
    let keys = Object.keys(salaries);
    $("salaryTable").innerHTML =
      "<table><thead><tr><th>Jornada</th>" +
      [2025, 2026, 2027, 2028].map((x) => "<th>" + x + "</th>").join("") +
      "</tr></thead><tbody>" +
      keys
        .map(
          (k) =>
            "<tr><td>" +
            (k === "full" ? "Completa" : k + " h") +
            "</td>" +
            [2025, 2026, 2027, 2028]
              .map((y) => "<td>" + euro(salaries[k][y]) + "</td>")
              .join("") +
            "</tr>",
        )
        .join("") +
      "</tbody></table>";
  }
  function anti() {
    let y = $("ayear").value,
      c = $("acontract").value,
      i = Number($("aperiod").value) - 1,
      n = seniority[y][c][i];
    $("antiResult").innerHTML =
      `<div class="figure">${euro(n)}</div><span class="small">Cuantía publicada para ${i + 1} cuatrienio(s), ${y}. Periodicidad pendiente de verificación.</span>`;
    $("antiTable").innerHTML =
      "<table><thead><tr><th>Jornada</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead><tbody>" +
      Object.entries(seniority[y])
        .map(
          ([k, arr]) =>
            "<tr><td>" +
            (k === "full" ? "Completa" : k + " h") +
            "</td>" +
            arr.map((v) => "<td>" + euro(v) + "</td>").join("") +
            "</tr>",
        )
        .join("") +
      "</tbody></table>";
  }
  function hours() {
    let y = $("hyear").value,
      c = Math.max(0, Number($("hcomp").value) || 0),
      n = Math.max(0, Number($("hnight").value) || 0),
      [cr, nr] = rates[y];
    $("hoursResult").innerHTML =
      `<div class="figure">${euro(c * cr + n * nr)}</div><p>Complementarias: ${c} × ${euro(cr)} = ${euro(c * cr)}<br>Nocturnas: ${n} × ${euro(nr)} = ${euro(n * nr)}</p><p class="small">Suma ilustrativa de conceptos, no liquidación salarial definitiva.</p>`;
  }
  function permit() {
    let q = $("psearch").value.toLocaleLowerCase("es").trim();
    let arr = permits.filter((p) =>
      p.join(" ").toLocaleLowerCase("es").includes(q),
    );
    $("permitResults").innerHTML = arr.length
      ? arr
          .map(
            (p) =>
              `<details><summary>${safe(p[0])}</summary><p><strong>${safe(p[1])}</strong></p><p class="small">${safe(p[2])}</p></details>`,
          )
          .join("")
      : "<p>No hay coincidencias. Prueba otro término.</p>";
  }
  ["syear", "scontract", "spays"].forEach((x) =>
    $(x).addEventListener("change", salary),
  );
  ["ayear", "acontract", "aperiod"].forEach((x) =>
    $(x).addEventListener("change", anti),
  );
  ["hyear", "hcomp", "hnight"].forEach((x) =>
    $(x).addEventListener("input", hours),
  );
  $("psearch").addEventListener("input", permit);
  salary();
  anti();
  hours();
  permit();
}
