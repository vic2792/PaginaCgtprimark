# Separación del archivo principal

## Qué se ha hecho

Se ha partido de `main`, commit `2b75907885e7a466ab01e4cf976ffd2388b031a4`. Se conserva la web existente: se trasladan sus estilos, funciones, imagen y datos a archivos independientes y se da formato legible al código.

`index.html` pasa de 446.557 bytes a aproximadamente 79 KB. La reducción principal procede de extraer el JPEG incrustado, los 16 bloques CSS y los 10 bloques JavaScript. El tamaño total descargado no se reduce en la misma proporción: el navegador ahora solicita y puede guardar en caché los recursos por separado.

Los estilos generales están en `base.css`; los restantes bloques se mantienen, en su orden original, dentro de `componentes.css`. Sus comentarios identifican la procedencia. No se han reordenado reglas ni eliminado los ajustes históricos de contraste. Esto conserva la cascada y permite limpiar sus duplicidades más adelante, con pruebas visuales.

El JavaScript se organiza por responsabilidades y utiliza módulos nativos, sin framework ni compilación. Se eliminan las funciones globales y los atributos `onclick`, `oninput` y `onchange`. `main.js` conecta los eventos con acciones explícitas, también en los formularios creados dinámicamente. Las utilidades visuales salen de los atributos `style`; la impresión dispone de su propia hoja CSS y espera a que cargue antes de imprimir.

## Datos y contenido

Se trasladan sin alterar valores las tablas existentes, los siete temas del buscador, los permisos, las preguntas del test y las 16 herramientas. Las dos copias idénticas de la tabla de salario base BOE se sustituyen por una sola tabla compartida. Las tablas sindicales conservan su identificación y advertencias; no se mezclan con los datos del BOE.

`preguntas.json` contiene los datos existentes, no un catálogo ficticio de 79 preguntas. La explicación extensa de la cláusula sexta permanece como contenido HTML de la página y se reutiliza en buscador y chat. No se cambia su estado de revisión documental.

El logotipo se decodifica a un JPEG con los mismos bytes de imagen que tenía el `data:` original. Los iconos sociales SVG se conservan en los enlaces y plantillas.

## Carga y publicación

La entrada es `assets/js/main.js`. Carga los archivos JSON, inicia los módulos en un orden explícito y marca la página como preparada. Si falla la carga de datos, muestra un mensaje para recargar, sin inventar resultados. Las rutas de datos y de impresión se resuelven con `import.meta.url`, compatibles con la subcarpeta de GitHub Pages.

El proyecto sigue siendo estático y no necesita pasos de compilación. `package.json` y `package-lock.json` fijan únicamente la dependencia de desarrollo necesaria para repetir las pruebas. No son dependencias que se envíen al navegador.

## Verificación

Las pruebas de regresión recorren las herramientas y las consultas en tres tamaños. La prueba de equivalencia compara con el HTML anterior: 16 herramientas, 16 casos salariales BOE, 16 casos de nómina, 40 combinaciones de tabla salarial y todos los tipos de escritos, por cada tamaño de 390 y 1280 px. Compara además la apariencia calculada de diez vistas y capturas de portada, nómina y dudas.

La suite de estructura comprueba las rutas bajo `/PaginaCgtprimark/`, la carga de recursos, botones creados dinámicamente, cambios de permisos, persistencia y recuperación del calendario, carga de la hoja de impresión, texto impreso y generación de PDF. Simula una caída de un JSON para comprobar el mensaje de error.

Estas pruebas no acreditan la corrección jurídica de todas las respuestas ni la accesibilidad completa con lectores de pantalla. Tampoco prueban impresoras físicas, Safari/iOS o el portapapeles con todos los permisos posibles.
