# Correcciones de estabilidad — 9 de noviembre de 2026

## Cambios

- Navegación: separar catálogo de formulario, corregir regreso, abrir la sección real de permisos y activar vistas desde enlaces internos. El logotipo y el botón Inicio del encabezado abren la portada.
- Móvil: ocultar pestañas superiores redundantes en pantallas pequeñas; mantener navegación inferior y menú. Mover el pie al final de las secciones.
- Consultas: priorizar orientación disciplinaria, reconocer «despedido», evitar que «hijo» solo active urgencia familiar y pedir concreción cuando coincidan varios temas. Las cuatro variantes de renuncia abren una ficha pendiente de revisión, sin inventar respuesta jurídica.
- Formularios: asociar ocho etiquetas de la calculadora salarial y rechazar valores inválidos en nómina, horas, vacaciones, contratos y finiquito. Proteger división por cero.
- Calendario: recuperar entradas válidas ante almacenamiento corrupto y avisar si no se puede guardar.
- Contraste: títulos oscuros sobre superficies claras en salario y revisión de nómina; fondos opacos de respaldo en paneles con degradado.
- Contenido: corregir recuento de 15 a 16 herramientas y sustituir «calculadora oficial» por «según convenio».

## Comprobar manualmente

1. Abrir Herramientas, entrar en cualquiera y pulsar volver: se ve el catálogo sin el formulario anterior.
2. Desde Inicio, pulsar Permisos: se muestra el buscador de permisos de las tablas.
3. En Dudas, probar «Me han despedido y tengo un hijo»: debe aparecer orientación sobre sanciones. Las cuatro variantes de renuncia deben abrir la ficha de revisión pendiente.
4. En Centro laboral, generar un escrito y una renuncia; copiar o imprimir/guardar PDF.
5. En Horas anuales, poner jornada semanal de referencia a cero: debe pedir corregirla.

## Pruebas

`node tests/regression.cjs` requiere Playwright y Chromium. Puede indicarse la ruta con CHROMIUM_PATH. Usa un servidor temporal en localhost, no envía datos personales a servicios externos. Recorre las 16 herramientas en 320, 390 y 1280 px; comprueba regreso, permisos, cálculos válidos e inválidos, generación de escritos, jornada y consultas, y detecta errores pageerror.

También se ha abierto la ventana de impresión y comprobado el texto generado. No equivale a revisar el PDF físico ni todas las configuraciones de impresora. El portapapeles real, lectores de pantalla, contraste sobre imágenes/degradados y vigencia jurídica completa requieren comprobaciones adicionales. No se han cambiado fórmulas salariales ni creado las 79 respuestas.

## Diseño del revisor de nómina

Se agrupan los 17 controles en tres bloques con fieldset/legend, etiquetas y unidades visibles, campos amplios, tipografía numérica y foco destacado. En móvil se muestra una columna; en escritorio, dos. Se conservan IDs, valores, opciones y fórmulas. Se comparó el mismo caso (30 horas, 75 € en otros conceptos y 1.500 € de bruto real) antes y después: resultados idénticos en 320, 390 y 1280 px.

## Pregunta sobre rechazo y renuncia a horas complementarias

Añadida una pregunta desplegable y acceso rápido en Dudas. La búsqueda reconoce variantes de renuncia, rechazo y cláusula sexta; el chat reutiliza la misma respuesta. Se transcribe únicamente la cláusula sexta del anexo facilitado, sin publicar imágenes, datos individuales, cifras de horas o fechas de esa persona. La ficha diferencia renuncia, oferta voluntaria y negativa por incumplimiento; enlaza a fuentes oficiales y al generador ya preparado para renuncia. Incluye fecha de revisión documental.

Fuentes contrastadas: Estatuto consolidado, artículo 12.5.e (renuncia), f (incumplimientos) y g (oferta voluntaria); IV Convenio publicado en BOE-A-2021-14561, artículo 12.4, y modificaciones BOE-A-2023-18466 y BOE-A-2025-26529. La modificación de 2023 presenta el artículo 12 bajo el epígrafe contratos formativos: por ello la ficha identifica expresamente la publicación de 2021 al explicar la previsión convencional y no afirma que se haya resuelto su aplicación al pacto individual.

Correcciones conexas: se sustituye la referencia errónea a 12.5.g para renuncia por 12.5.e; se retira la afirmación de un preaviso convencional de un mes, no acreditada en los textos contrastados; el borrador de vía convencional exige comprobar su aplicación antes de presentarlo. No se calcula una fecha efectiva automática ni se valida el pacto individual.

Pruebas añadidas: pregunta rápida, contenido legal y fuentes en la respuesta, acceso al formulario con renuncia seleccionada, borrador legal y convencional, respuesta equivalente en chat, junto con regresión en 320/390/1280 px.

## Iconos de redes sociales

Se añaden los iconos de Instagram y TikTok a los seis enlaces existentes, incluidos pie de página, actualidad y fuentes. Se conservan las cuentas y los textos accesibles; los SVG son decorativos y no duplican la lectura del enlace. Los iconos están incrustados, por lo que no cargan recursos ni rastreadores de redes sociales. Geometrías: Simple Icons, https://github.com/simple-icons/simple-icons (CC0); los logotipos siguen sujetos a los derechos de sus marcas.

## Separación de HTML, CSS, JavaScript y datos

Se conserva la aplicación y se distribuye en `assets/css`, `assets/js`, `assets/img` y `data`. Se sustituye JavaScript incrustado por módulos nativos y acciones mediante atributos de datos, con un arranque explícito. El logotipo original deja de estar incrustado en Base64. Tablas y temas existentes se cargan desde JSON sin cambiar sus valores ni añadir respuestas jurídicas. Se documenta el proyecto en README.md y docs/ESTRUCTURA.md y se añaden pruebas de equivalencia, rutas, persistencia, impresión y errores de carga.

## Biblioteca de modelos de escritos

Se añade Centro laboral → Modelos, inicialmente con la renuncia breve al pacto de horas complementarias facilitada por el usuario. El texto conserva el destinatario People & Culture y la estructura aportada; se elimina la palabra «obligatorias» para no confundir el pacto con las ofertas voluntarias. Los modelos y campos viven en data/escritos.json y su interfaz en assets/js/modelos.js y assets/css/modelos.css.

Permite ver el modelo en blanco, rellenar una copia, editar el resultado, copiarlo, descargar .txt, imprimir/guardar PDF y limpiar los datos. El DNI es opcional y se omite de la copia si no se rellena. No se almacenan datos del formulario ni se envían a terceros. La impresión reutiliza el mismo servicio que el generador existente y escapa el texto antes de mostrarlo.

Se incorporan accesos desde el generador y desde la ficha de renuncia. Se conserva el generador detallado y se recuerda que el modelo breve exige comprobar los requisitos y el preaviso aplicables. No se han creado modelos no facilitados ni nuevas respuestas jurídicas.

Pruebas: modelo en blanco y personalizado, DNI opcional, edición, copia y alternativa cuando falla el permiso, descarga, impresión con texto escapado, limpieza y ausencia de datos personales en solicitudes y almacenamiento, a 320/390/1280 px. Regresión de las 16 herramientas y la impresión existente.
