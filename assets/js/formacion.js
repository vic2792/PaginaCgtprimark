import { $, val, out } from "./ui.js";
let permits, questions;
export function initFormacion(datos) {
  permits = datos.permisos;
  questions = datos.cuestionario;
}
function permitInfo() {
  const [t, d] = permits[val("ptype")];
  $("permitout").innerHTML =
    `<div class="result"><h3>${t}</h3><p>${d}</p><p class="info">Referencia: <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430" target="_blank" rel="noopener">Estatuto de los Trabajadores (BOE)</a></p></div>`;
}

function renderQuiz() {
  const q = $("quiz");
  if (!q) return;
  q.innerHTML = questions
    .map(
      (x, i) =>
        `<fieldset class="faq space-bottom-12"><legend><b>${i + 1}. ${x[0]}</b></legend>${x[1].map((opt, j) => `<label class="quiz-option"><input type="radio" name="q${i}" value="${j}"> ${opt}</label>`).join("")}</fieldset>`,
    )
    .join("");
}

function gradeQuiz() {
  let correct = 0;
  let details = [];
  questions.forEach((q, i) => {
    const picked = document.querySelector(`input[name="q${i}"]:checked`);
    if (picked && Number(picked.value) === q[2]) correct++;
    details.push(
      `${i + 1}. ${picked && Number(picked.value) === q[2] ? "Correcto" : "Revisar"}: ${q[3]}`,
    );
  });
  out(
    `<strong class="big">${correct}/${questions.length}</strong>${details.join("<br>")}`,
  );
}
export { permitInfo, renderQuiz, gradeQuiz };
