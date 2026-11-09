# Auditoría inicial y plan técnico — 9 de noviembre de 2026

Base: main, commit 9717d28505890e79093a3896babb87800a2d140c. No se ha modificado index.html ni publicado cambios.

## Inventario comprobado

El repositorio versiona únicamente index.html (419.759 bytes), con 10 bloques de JavaScript y 14 de estilos. El logotipo está incrustado como imagen en el HTML: conservar el original. No hay pruebas, documentación previa, dependencias ni recursos gráficos separados.

El catálogo contiene 16 herramientas aunque anuncia 15: huelga, nómina aritmética, horas anuales, vacaciones, permisos, revisión de descansos, domingos/festivos, escritos, incidencias, biblioteca de derechos, calendario, antigüedad, comparación de contratos, test, finiquito y novedades.

Fuera del catálogo existen tablas 2025–2028, calculadora salarial por grupos, revisión de nómina, enlaces sindicales, guía de derechos, consultas por temas y chat que reutiliza esas consultas. El Centro laboral tiene siete pestañas: escritos, sanciones, jornada semanal, revisión de situaciones, seguimiento local, cuestionario y actualidad.

Los dos generadores de escritos tienen opciones distintas. Incidencias genera texto; no es un registro compartido. Calendario y recordatorios guardan datos en localStorage. La actualidad ofrece enlaces, no un sistema de publicación de noticias. La revisión de nómina utiliza importes introducidos manualmente; no lee documentos. No hay backend, autenticación, subida de archivos ni envío de consultas.

## Hallazgos priorizados

### P0 — Orientación equivocada por coincidencias de texto

Reproducido: «Me han despedido y tengo un hijo» devuelve «Urgencia familiar o hijo enfermo». El buscador selecciona el primer tema que contiene una palabra coincidente. No distingue intención ni ambigüedad. Las cuatro formulaciones facilitadas para renunciar al pacto de horas complementarias devuelven ausencia de respuesta. Hay siete temas preparados, no una base documentada de 79 fichas verificadas.

Corrección propuesta: consultas sensibles identificadas explícitamente, resultados candidatos y petición de concreción cuando haya ambigüedad, sin afirmar una conclusión automática. Publicar únicamente respuestas revisadas; conservar la salida de consulta no cubierta.

### P1 — Navegación incoherente

Reproducido a 390 × 844: abrir una herramienta y pulsar volver mantiene visible workspace. La clase portal-visible fuerza display:block aunque la navegación antigua quite visible.

Reproducido: el acceso «Permisos» de portada navega al grupo derechos pero intenta desplazar a permisos2028, dentro de datos2028, que permanece oculto.

Inspección: conviven navegación antigua, pestañas superiores, barra inferior, menú y enlaces por ancla. home() lleva a herramientas, aunque varios controles se presentan como inicio. Los enlaces por ancla no activan automáticamente secciones ocultas. Revisar también enlaces internos de respuestas y chat.

### P1 — Formularios y cálculos

Ocho controles de la calculadora salarial carecen de etiqueta asociada mediante for/id o aria-label. Algunas calculadoras invocan funciones desde botones sin validar el formulario; min/max por sí solos no impiden ejecutar cálculos. calcHoras y calcContracts dividen por valores de entrada sin comprobar denominador positivo. La lectura de calendario mediante JSON.parse carece de recuperación ante contenido corrupto; los recordatorios tienen tratamiento parcial de errores.

El generador de renuncia incluye fecha del pacto pero no valida automáticamente que haya transcurrido un año. No determina ni verifica el régimen convencional. Requiere revisión jurídica del artículo 12 del convenio y 12.5.g ET antes de presentar su texto como correcto.

### P1 — Estilos y accesibilidad

Hay sucesivas capas claras y oscuras, reglas globales, estilos tardíos y numerosos !important y -webkit-text-fill-color. Las correcciones locales compiten entre sí. Se requiere medir contraste en cada vista y estado; esta revisión inicial no acredita conformidad WCAG.

El menú necesita pruebas de foco, teclado, Escape y retorno de foco. Deben revisarse cabeceras pegajosas, elementos flotantes, ampliación al 200 %, pantallas de 320 px y teclados móviles. La portada no mostró desbordamiento horizontal a 390 px en la prueba realizada.

### P2 — Mantenimiento y contenido

Generadores, cuestionarios y contenidos de permisos se duplican. Tablas sindicales y cálculo por BOE conviven: contrastar origen, conceptos y ámbito antes de unificarlos. El título «calculadora oficial» puede confundirse con una herramienta publicada por un organismo oficial; valorar denominarla «basada en tablas del convenio».

No se localizaron las 79 preguntas literales aprobadas en un fichero independiente. El resumen contiene categorías y ejemplos, no el listado completo: no reconstruirlo inventando preguntas ni incorporar la pregunta expresamente excluida.

## Pruebas ejecutadas y límites

- Parseo de los 10 scripts: sin errores de sintaxis.
- Inspección de identificadores del HTML: sin IDs duplicados en el documento inicial.
- Chromium con Playwright, copia local servida por HTTP, viewport 390 × 844: sin errores pageerror en el recorrido probado.
- Apertura de herramienta, regreso, acceso a permisos, generación de escrito, renuncia y cinco consultas: resultados descritos arriba.
- Inventario de pestañas y asociación de etiquetas de controles estáticos.

Pendiente: auditoría visual completa y contraste calculado, escritorio y otros móviles, impresión/PDF, permisos reales del portapapeles, persistencia y recuperación, pruebas exhaustivas de calculadoras, fuentes oficiales y vigencia jurídica, comparación del despliegue público con el commit. Ausencia de errores JavaScript en un recorrido no acredita que todas las funciones funcionen.

## Plan por fases

1. **Estabilidad y regresión.** Crear pruebas reproducibles de navegación, escritos, jornada, cálculos válidos e inválidos y búsquedas sensibles. Corregir regreso y permisos, asociar etiquetas y validar entradas. Conservar cálculos y contenido salvo corrección justificada.
2. **Móvil y accesibilidad.** Unificar el controlador de navegación; probar enlaces directos, foco y teclado. Medir contraste por componente y resolver reglas contradictorias progresivamente. Probar 320/390/768/1280 px, zoom y pantallas con teclado.
3. **Separación conservadora.** Extraer scripts y estilos a assets/js y assets/css manteniendo orden de ejecución y cascada. Separar imagen original y datos sin cambiar resultados. GitHub Pages admite esta estructura con rutas relativas.
4. **Base de conocimiento.** Crear esquema de ficha: id, categoría, pregunta, variantes, resumen, detalle, condiciones, excepciones, fuentes (norma, artículo, URL, ámbito), fecha y estado de revisión, escrito asociado. Estados borrador/revisada/publicada. Solo fichas revisadas podrán dar respuestas públicas. Incorporar el listado literal de 79 preguntas cuando esté disponible; nunca completar cupos inventando contenido. Añadir pruebas de sinónimos, ambigüedad y consultas no cubiertas.
5. **Mejoras funcionales.** Formularios específicos de escritos, revisión jurídica y trazabilidad de tablas; después estudiar seguimiento de reclamaciones y observatorio colectivo. Almacenamiento compartido requerirá un diseño separado y decisiones de privacidad.
6. **Publicación controlada.** Revisar diff, ejecutar regresiones y pruebas visuales/impresión; preparar cambios pequeños revisables. Tras publicar, comprobar ejecución de Pages, rutas y mismas pruebas en la URL pública. Documentar qué se ha probado y qué permanece pendiente.

Criterio de aceptación: conservar herramientas e identidad; sin errores de ejecución en recorridos cubiertos; navegación y formularios utilizables en móvil; consultas no verificadas sin respuestas inventadas; cambios y pruebas documentados.
