import { $, money, num, val, out, validNumbers } from "./ui.js";
function calcHuelga() {
  const amounts = ["hb", "hp", "ha", "h10", "h11"].map(num);
  if (amounts.some((x) => x < 0))
    return out("Los importes no pueden ser negativos.");
  const factor = val("hd") === "4" ? 1.75 : 1.4;
  const extra = val("he") === "prorrateadas" ? num("hp") : 0;
  const base = num("hb") + extra + num("ha") + num("h10") + num("h11");
  const estimate = (base / 30) * factor;
  out(
    `<strong class="big">${money(estimate)}</strong>Descuento bruto orientativo por una jornada completa de huelga.<p>Base mensual utilizada: ${money(base)} · Factor: ${factor.toLocaleString("es-ES")}.</p><p class="info">No incluye efectos sobre conceptos variables, cotización, descanso, pagas no prorrateadas ni regularizaciones de nómina. No equivale necesariamente al descuento real.</p>`,
  );
}

function calcNomina() {
  if (!validNumbers(["base", "extra", "anti", "plus", "ded"]))
    return out("Introduce importes válidos y no negativos.");
  const gross = num("base") + num("extra") + num("anti") + num("plus");
  out(
    `<strong class="big">${money(gross - num("ded"))}</strong>Neto aritmético estimado<br>Bruto introducido: ${money(gross)} · Descuentos introducidos: ${money(num("ded"))}`,
  );
}

function calcHoras() {
  if (!validNumbers(["ref", "full", "weekly", "done"]) || num("full") <= 0)
    return out(
      "Comprueba las horas: la jornada de referencia debe ser mayor que cero.",
    );
  const annual = (num("ref") * num("weekly")) / num("full");
  out(
    `<strong class="big">${annual.toFixed(2)} h</strong>Referencia anual proporcional<br>Pendientes según datos introducidos: <b>${(annual - num("done")).toFixed(2)} h</b>`,
  );
}

function calcVac() {
  if (!validNumbers(["vd", "vm", "vu"]))
    return out("Comprueba los días y meses introducidos.");
  const earned = (num("vd") * num("vm")) / 12;
  out(
    `<strong class="big">${(earned - num("vu")).toFixed(2)} días</strong>Devengados: ${earned.toFixed(2)} · Disfrutados: ${num("vu")}`,
  );
}

function calcShift() {
  let a = new Date(val("end")),
    b = new Date(val("start"));
  if (!val("end") || !val("start") || b <= a)
    return out("Introduce fechas válidas y consecutivas.");
  const h = (b - a) / 3600000;
  out(
    `<strong class="big">${h.toFixed(2)} horas</strong>Descanso entre turnos. ${h < 12 ? "<b>Posible incumplimiento del descanso general de 12 horas: requiere revisión.</b>" : "Cumple el mínimo general de 12 horas entre jornadas."}<br>Duración indicada de la jornada: ${num("shift")} h.`,
  );
}

function calcFest() {
  out(
    `<strong class="big">${money(num("ns") * num("ps") + num("nf") * num("pf"))}</strong>Domingos: ${money(num("ns") * num("ps"))} · Festivos: ${money(num("nf") * num("pf"))}`,
  );
}

function calcAnti() {
  if (!val("hire") || !val("until")) return out("Selecciona ambas fechas.");
  const a = new Date(val("hire") + "T12:00:00"),
    b = new Date(val("until") + "T12:00:00");
  if (b < a) return out("La fecha final debe ser posterior al inicio.");
  let y = b.getFullYear() - a.getFullYear(),
    m = b.getMonth() - a.getMonth(),
    d = b.getDate() - a.getDate();
  if (d < 0) {
    m--;
    d += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  out(
    `<strong class="big">${y} años y ${m} meses</strong>Y ${d} días adicionales (cómputo de calendario orientativo).`,
  );
}

function calcContracts() {
  if (!validNumbers(["refh", "refs", "h1", "h2"]) || num("refh") <= 0)
    return out(
      "Comprueba los datos: la jornada de referencia debe ser mayor que cero.",
    );
  const h = num("refh"),
    s = num("refs");
  out(
    `<div class="statrow"><div class="stat">Contrato A<strong>${money((s * num("h1")) / h)}</strong>${num("h1")} h/semana</div><div class="stat">Contrato B<strong>${money((s * num("h2")) / h)}</strong>${num("h2")} h/semana</div></div><p>Diferencia mensual proporcional: ${money((s * (num("h2") - num("h1"))) / h)}</p>`,
  );
}

function calcFini() {
  if (!validNumbers(["fmonthly", "fdays", "fvac", "fextra", "fother"]))
    return out("Introduce importes y días válidos y no negativos.");
  const wage = num("fmonthly") / 30,
    tot = wage * (num("fdays") + num("fvac")) + num("fextra") + num("fother");
  out(
    `<strong class="big">${money(tot)}</strong>Estimación bruta antes de deducciones<br>Salario pendiente: ${money(wage * num("fdays"))}<br>Vacaciones pendientes: ${money(wage * num("fvac"))}<br>Pagas pendientes: ${money(num("fextra"))}<br>Otros: ${money(num("fother"))}`,
  );
}
let BOEWAGES, salaryData;
export function initCalculadoras(datos) {
  BOEWAGES = datos.baseBOE;
  salaryData = datos;
  calcBoe();
}
function calcBoe() {
  const y = +document.getElementById("boeyear").value,
    g = +document.getElementById("boegroup").value,
    h = +document.getElementById("boehours").value,
    f = +document.getElementById("boefull").value,
    n = +document.getElementById("boeanti").value,
    p = +document.getElementById("boepays").value,
    sun = +document.getElementById("boesun").value,
    night = +document.getElementById("boenight").value;
  if (!(h > 0 && f > 0 && h <= f)) {
    document.getElementById("boeresult").textContent =
      "Revisa las horas introducidas.";
    return;
  }
  const frac = h / f,
    base = BOEWAGES[y][g] * frac,
    anti = salaryData.tramosAntiguedad,
    a =
      Array.from({ length: n }, (_, i) => anti[Math.min(i, 3)]).reduce(
        (x, z) => x + z,
        0,
      ) * frac,
    annual = base + a,
    month = annual / p,
    fullHours = salaryData.jornadaAnual[y],
    nightPlus = night * (BOEWAGES[y][g] / fullHours) * 0.25,
    sunday = sun * salaryData.plusDomingo[y];
  const euro = (v) =>
    v.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  document.getElementById("boeresult").innerHTML =
    "<strong>Base anual: " +
    euro(base) +
    "</strong><br>Antigüedad anual estimada: " +
    euro(a) +
    "<br>Total fijo bruto anual: " +
    euro(annual) +
    "<br>Importe por paga (" +
    p +
    " pagas): " +
    euro(month) +
    "<br>Plus domingos/festivos del periodo (si procede): " +
    euro(sunday) +
    "<br>Plus nocturno estimado del periodo: " +
    euro(nightPlus) +
    "<br><b>Total estimado de una paga con estos pluses: " +
    euro(month + sunday + nightPlus) +
    "</b>";
}
export {
  calcHuelga,
  calcNomina,
  calcHoras,
  calcVac,
  calcShift,
  calcFest,
  calcAnti,
  calcContracts,
  calcFini,
  calcBoe,
};
