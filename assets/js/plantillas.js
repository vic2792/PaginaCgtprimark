import { f, sel, note, result, button } from "./ui.js";
function content(id) {
  switch (id) {
    case "huelga":
      return (
        note(
          "Estimación orientativa del descuento bruto de un día de huelga. El multiplicador 1,4 o 1,75 procede de la calculadora sindical previa; no es una fórmula legal universal ni una liquidación oficial. Comprueba nómina, contrato y criterio de devengo.",
        ) +
        `<div class="formgrid">${f("hb", "Salario base mensual (€)", "number", 0, 'min="0" step="0.01"')}${f("hp", "Pagas extraordinarias prorrateadas (€)", "number", 0, 'min="0" step="0.01"')}${f("ha", "Antigüedad mensual (€)", "number", 0, 'min="0" step="0.01"')}${f("h10", "CPP10 mensual (€)", "number", 0, 'min="0" step="0.01"')}${f("h11", "CPP11 mensual (€)", "number", 0, 'min="0" step="0.01"')}${sel(
          "hd",
          "Días de trabajo habituales por semana",
          [
            ["5", "5 días (factor 1,4)"],
            ["4", "4 días (factor 1,75)"],
          ],
        )}${sel("he", "Pagas extras", [
          ["prorrateadas", "Prorrateadas"],
          ["separadas", "No prorrateadas"],
        ])}</div>${button("calcHuelga")}${result("Introduce los conceptos de tu nómina. Si las pagas no están prorrateadas, la posible reducción de su devengo se analiza por separado.")}`
      );
    case "nomina":
      return (
        note(
          "Estimación aritmética: introduce importes reales de tu nómina. No calcula automáticamente tablas salariales, IRPF ni cotizaciones.",
        ) +
        `<div class="formgrid">${f("base", "Salario base mensual (€)", "number", 0, 'min="0" step="0.01"')}${f("extra", "Pagas prorrateadas (€)", "number", 0, 'min="0" step="0.01"')}${f("anti", "Antigüedad (€)", "number", 0, 'min="0" step="0.01"')}${f("plus", "Otros complementos (€)", "number", 0, 'min="0" step="0.01"')}${f("ded", "Descuentos totales (€)", "number", 0, 'min="0" step="0.01"')}</div>${button("calcNomina")}${result("Introduce los importes para obtener una estimación.")}`
      );
    case "horas":
      return (
        note(
          "La jornada anual de referencia debe verificarse con el convenio y el contrato. Introduce tu propia cifra aplicable; los resultados son una ayuda de control, no una auditoría de horarios.",
        ) +
        `<div class="formgrid">${f("ref", "Jornada anual de referencia a tiempo completo (h)", "number", 1765, 'min="0" step="0.01"')}${f("full", "Jornada semanal completa de referencia (h)", "number", 39.5, 'min="1" step="0.5"')}${f("weekly", "Horas semanales de tu contrato", "number", 25, 'min="0" step="0.5"')}${f("done", "Horas computables acumuladas", "number", 0, 'min="0" step="0.01"')}</div>${button("calcHoras")}${result("Introduce los datos para calcular tu referencia anual proporcional.")}`
      );
    case "vacaciones":
      return (
        note(
          "Estimación proporcional basada en los días anuales que introduzcas. Los días naturales o laborables, devengo, redondeos y reglas de disfrute deben confirmarse según convenio y situación contractual.",
        ) +
        `<div class="formgrid">${f("vd", "Días anuales de vacaciones aplicables", "number", 30, 'min="0"')}${f("vm", "Meses de devengo", "number", 12, 'min="0" max="12" step="0.1"')}${f("vu", "Días ya disfrutados", "number", 0, 'min="0"')}</div>${button("calcVac")}${result("Introduce los datos para estimar días pendientes.")}`
      );
    case "permisos":
      return (
        note(
          "Información general del Estatuto de los Trabajadores. La duración y el inicio concreto del permiso pueden depender del supuesto, el convenio y la interpretación jurídica vigente. Compruébalo antes de solicitarlo.",
        ) +
        `<div class="field"><label for="ptype">¿Qué ha ocurrido?</label><select id="ptype" data-change-action="permitInfo"><option value="hospital">Hospitalización, accidente o enfermedad grave de familiar o conviviente</option><option value="fallecimiento">Fallecimiento de familiar</option><option value="mudanza">Traslado del domicilio habitual</option><option value="matrimonio">Matrimonio o registro de pareja de hecho</option><option value="urgencia">Urgencia familiar por fuerza mayor</option><option value="otro">Otro permiso</option></select></div><div id="permitout"></div><div class="space-top-15">${button("showApp", "Preparar solicitud →", "escritos")}</div><script-placeholder></script-placeholder>`
      );
    case "horarios":
      return (
        note(
          "Comprobación básica del descanso diario general de 12 horas entre jornadas (art. 34.3 ET). No detecta todas las excepciones, descansos semanales ni reglas especiales. No subas aquí horarios colectivos con datos personales.",
        ) +
        `<div class="formgrid">${f("end", "Salida del turno anterior", "datetime-local")}${f("start", "Entrada del siguiente turno", "datetime-local")}${f("shift", "Horas totales de la jornada", "number", 5, 'min="0" step="0.25"')}</div>${button("calcShift")}${result("Introduce dos turnos consecutivos para revisar el descanso.")}`
      );
    case "festivos":
      return (
        note(
          "Introduce el plus por domingo o festivo que conste en la normativa o en tu nómina. No se presupone que ambos tengan el mismo importe ni que sean acumulables.",
        ) +
        `<div class="formgrid">${f("ns", "Domingos trabajados", "number", 0, 'min="0"')}${f("ps", "Plus por domingo (€)", "number", 0, 'min="0" step="0.01"')}${f("nf", "Festivos trabajados", "number", 0, 'min="0"')}${f("pf", "Plus por festivo (€)", "number", 0, 'min="0" step="0.01"')}</div>${button("calcFest")}${result("Completa los importes oficiales para obtener el total.")}`
      );
    case "escritos":
      return (
        note(
          "Modelo orientativo editable. No se envía a RR. HH. desde esta web. Revisa los hechos, fechas y fundamentos antes de presentarlo.",
        ) +
        `<div class="formgrid">${sel("etype", "Tipo de escrito", [
          ["contrato", "Solicitud de copia de contrato"],
          ["permiso", "Solicitud de permiso retribuido"],
          ["jornada", "Solicitud de aclaración de jornada"],
          ["nomina", "Solicitud de revisión de nómina"],
          ["vacaciones", "Solicitud sobre vacaciones"],
          ["otro", "Solicitud general"],
        ])}${f("ename", "Nombre y apellidos", "text")}${f("edate", "Fecha", "date")}${f("eemail", "Centro / departamento", "text", "Primark Gran Vía")}</div><div class="field"><label for="edetail">Explica brevemente la solicitud</label><textarea id="edetail" placeholder="Fechas, hechos y documentación que solicitas..."></textarea></div><div class="space-top-15">${button("makeLetter", "Generar escrito")}</div>${result("El escrito aparecerá aquí para copiarlo.")}`
      );
    case "incidencias":
      return (
        note(
          "Esta herramienta NO envía denuncias ni comunicaciones a CGT. Solo genera un resumen local que puedes copiar. Evita incluir datos sensibles de terceros o información identificativa innecesaria.",
        ) +
        `<div class="formgrid">${sel("itype", "Tipo de incidencia", [
          ["Horario", "Horario"],
          ["Temperatura", "Temperatura"],
          ["Seguridad y salud", "Seguridad y salud"],
          ["Probadores", "Probadores"],
          ["Cambio de planta", "Cambio de planta"],
          ["Otro", "Otro"],
        ])}${f("idate", "Fecha de la incidencia", "date")}${f("iplace", "Planta o zona", "text")}</div><div class="field"><label for="idesc">Descripción objetiva de los hechos</label><textarea id="idesc" placeholder="Qué ocurrió, cuándo y en qué lugar..."></textarea></div><div class="space-top-15">${button("makeIncident", "Preparar resumen")}</div>${result("El resumen aparecerá aquí. Puedes copiarlo y comunicarlo por un canal sindical seguro.")}`
      );
    case "derechos":
      return (
        note(
          "Guía general para España. Puede haber mejoras en convenio y matices jurisprudenciales; no es asesoramiento jurídico individual.",
        ) +
        `<div class="stack">${[
          [
            "¿Cuánto descanso debe haber entre jornadas?",
            "Como regla general, deben transcurrir al menos 12 horas entre el final de una jornada y el comienzo de la siguiente (art. 34.3 ET), sin perjuicio de regímenes especiales.",
          ],
          [
            "¿Puedo pedir adaptación de jornada por conciliación?",
            "El artículo 34.8 ET contempla el derecho a solicitar adaptaciones razonables y proporcionadas. La empresa debe tramitar la negociación conforme a la normativa aplicable.",
          ],
          [
            "¿Cuántos días hay por hospitalización de familiar?",
            "El artículo 37.3.b ET prevé cinco días de permiso retribuido para los supuestos y vínculos que especifica. El inicio y la documentación deben valorarse en cada caso.",
          ],
          [
            "¿Qué pasa si me cambian el horario?",
            "Debe revisarse si es una distribución ordinaria, distribución irregular, modificación sustancial o cambio sujeto a convenio/acuerdo. No todos los cambios tienen los mismos requisitos.",
          ],
          [
            "¿Puedo reclamar diferencias en mi nómina?",
            "Sí. Conviene conservar nóminas, contratos y horarios. Las reclamaciones de cantidad suelen estar sujetas al plazo de prescripción de un año (art. 59 ET), con posibles particularidades.",
          ],
          [
            "¿Puedo hacer huelga sin avisar individualmente?",
            "En una huelga legalmente convocada, con carácter general, el trabajador no tiene obligación de comunicar previamente a la empresa su adhesión individual. Hay particularidades para servicios mínimos legalmente establecidos.",
          ],
        ]
          .map(
            ([q, a]) =>
              `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`,
          )
          .join("")}</div>`
      );
    case "calendario":
      return (
        note(
          "Agenda personal guardada únicamente en este navegador. No incluye automáticamente los festivos oficiales: consúltalos en el calendario de la Comunidad de Madrid y del Ayuntamiento de Madrid.",
        ) +
        `<div class="formgrid">${f("cdate", "Fecha", "date")}${f("ctitle", "Nota o acontecimiento", "text")}</div>${button("saveEvent", "Guardar en este dispositivo")}<div id="events"></div><p class="info">Fuentes: <a href="https://www.comunidad.madrid/" target="_blank" rel="noopener">Comunidad de Madrid</a> · <a href="https://www.madrid.es/" target="_blank" rel="noopener">Ayuntamiento de Madrid</a></p>`
      );
    case "antiguedad":
      return (
        note(
          "Calcula tiempo transcurrido. El reconocimiento económico de la antigüedad depende de la normativa aplicable.",
        ) +
        `<div class="formgrid">${f("hire", "Fecha de inicio del contrato", "date")}${f("until", "Calcular hasta", "date", new Date().toISOString().slice(0, 10))}</div>${button("calcAnti")}${result("Selecciona las fechas.")}`
      );
    case "contratos":
      return (
        note(
          "Comparación puramente proporcional sobre una retribución base de referencia. No sustituye las tablas salariales y puede no reflejar complementos no proporcionales.",
        ) +
        `<div class="formgrid">${f("refh", "Jornada semanal completa (h)", "number", 39.5, 'min="1" step="0.5"')}${f("refs", "Salario bruto mensual a jornada completa (€)", "number", 0, 'min="0" step="0.01"')}${f("h1", "Contrato A (h/semana)", "number", 25, 'min="0"')}${f("h2", "Contrato B (h/semana)", "number", 30, 'min="0"')}</div>${button("calcContracts")}${result("Introduce el salario de referencia.")}`
      );
    case "test":
      return `<p>Responde a estas preguntas y comprueba tus conocimientos.</p><div id="quiz"></div>${button("gradeQuiz", "Corregir respuestas")}${result("Selecciona tus respuestas.")}`;
    case "finiquito":
      return (
        note(
          "Estimación básica de salario pendiente, vacaciones pendientes y pagas devengadas no abonadas. No incluye automáticamente indemnización, retenciones, cotizaciones ni todos los posibles conceptos.",
        ) +
        `<div class="formgrid">${f("fdays", "Días de salario pendientes", "number", 0, 'min="0"')}${f("fmonthly", "Salario mensual de referencia (€)", "number", 0, 'min="0" step="0.01"')}${f("fvac", "Días de vacaciones pendientes a abonar", "number", 0, 'min="0"')}${f("fextra", "Pagas extraordinarias devengadas pendientes (€)", "number", 0, 'min="0" step="0.01"')}${f("fother", "Otros importes pendientes (€)", "number", 0, 'step="0.01"')}</div>${button("calcFini")}${result("Introduce los conceptos para una estimación bruta.")}`
      );
    case "novedades":
      return `<div class="stack"><div class="panel"><span class="tag">SECCIÓN SINDICAL</span><h3>Un espacio para las novedades del centro</h3><p>Esta sección está preparada para publicar comunicados, acuerdos, reuniones y actuaciones de CGT una vez verificados y aprobados.</p></div><div class="panel"><h3>¿Dónde seguir las actualizaciones?</h3><p>Instagram: <a target="_blank" rel="noopener" href="https://www.instagram.com/CGTPrimarkgranvia/" class="social-link" aria-label="Instagram: @CGTPrimarkgranvia"><span class="social-icon social-icon--instagram" aria-hidden="true"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg></span><span class="social-label">@CGTPrimarkgranvia</span></a></p><p>TikTok: <a target="_blank" rel="noopener" href="https://www.tiktok.com/@CGTPrimarkgranvia386" class="social-link" aria-label="TikTok: @CGTPrimarkgranvia386"><span class="social-icon social-icon--tiktok" aria-hidden="true"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></span><span class="social-label">@CGTPrimarkgranvia386</span></a></p></div></div>`;
    default:
      return "";
  }
}
export { content };
