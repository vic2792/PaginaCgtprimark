export function initConsultas(datos) {
  const topics = datos.temas;
  const input = document.getElementById("pregunta-staff"),
    result = document.getElementById("respuesta-staff");
  const normalize = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  function respond(q) {
    const t = normalize(q);
    const matches = topics.filter((x) =>
      x.keys.some((k) => t.includes(normalize(k))),
    );
    const urgent = matches.find(
      (x) => x.title === "Sanciones y medidas disciplinarias",
    );
    const complementary =
      /(complementari|pacto.{0,30}horas|clausula sexta)/.test(t);
    let item = urgent || (matches.length === 1 ? matches[0] : null);
    if (complementary && !urgent) {
      result.hidden = false;
      const source = document.getElementById(
        "respuesta-renuncia-complementarias",
      );
      result.replaceChildren(
        ...Array.from(source.childNodes).map((node) => node.cloneNode(true)),
      );
      return;
    }
    result.hidden = false;
    if (!item) {
      result.innerHTML =
        "<h3>Necesitamos concretar tu consulta</h3><p>No tenemos una respuesta preparada para esa pregunta. Prueba con palabras como <strong>hospitalización, horario, nómina, vacaciones, sanción o permisos</strong>. Para una situación individual, contacta con la sección sindical.</p>";
      return;
    }
    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Consultar norma de referencia";
    result.replaceChildren();
    const h = document.createElement("h3");
    h.textContent = item.title;
    const p = document.createElement("p");
    p.textContent = item.body;
    const next = document.createElement("p");
    const b = document.createElement("strong");
    b.textContent = "Qué hacer: ";
    next.append(b, document.createTextNode(item.next));
    const law = document.createElement("p");
    law.className = "small";
    law.textContent = "Referencia: " + item.law + ". ";
    law.append(a);
    result.append(h, p, next, law);
    if (item.internal) {
      const link = document.createElement("a");
      link.href = item.internal;
      link.textContent = "Ir a la herramienta del portal";
      result.append(link);
    }
  }
  document.addEventListener("click", (e) => {
    const link = e.target.closest('[data-letter="renuncia-complementarias"]');
    if (!link) return;
    document.querySelector('#centro-laboral [data-center="escritos"]').click();
    const select = document.getElementById("cgt-letter-type");
    select.value = "renuncia-complementarias";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  document.getElementById("form-dudas").addEventListener("submit", (e) => {
    e.preventDefault();
    respond(input.value);
  });
  document.querySelectorAll("[data-question]").forEach((b) =>
    b.addEventListener("click", () => {
      input.value = b.dataset.question;
      respond(input.value);
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }),
  );
}
