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
