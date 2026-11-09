export function initChat() {
  const launch = document.getElementById("cgt-chat-launch"),
    panel = document.getElementById("cgt-chat-panel"),
    close = document.getElementById("cgt-chat-close"),
    log = document.getElementById("cgt-chat-messages"),
    form = document.getElementById("cgt-chat-form"),
    field = document.getElementById("cgt-chat-input");
  function toggle(open) {
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", String(open));
    if (open) field.focus();
    else launch.focus();
  }
  launch.addEventListener("click", () => toggle(panel.hidden));
  close.addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) toggle(false);
  });
  function bubble(text, user) {
    const div = document.createElement("div");
    div.className = "cgt-bubble " + (user ? "cgt-user" : "cgt-bot");
    div.textContent = text;
    log.append(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const question = field.value.trim();
    if (!question) return;
    bubble(question, true);
    field.value = "";
    const original = document.getElementById("pregunta-staff"),
      existing = document.getElementById("respuesta-staff"),
      sourceForm = document.getElementById("form-dudas");
    if (!original || !existing || !sourceForm) {
      bubble(
        "La guía no está disponible. Consulta con la sección sindical.",
        false,
      );
      return;
    }
    original.value = question;
    sourceForm.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    const msg = bubble("", false);
    msg.append(
      ...Array.from(existing.childNodes).map((node) => node.cloneNode(true)),
    );
    if (!msg.textContent.trim())
      msg.textContent =
        "No encuentro una respuesta verificada para esta consulta. Contacta con la sección sindical.";
    log.scrollTop = log.scrollHeight;
  });
}
