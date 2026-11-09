# CGT Primark Gran Vía

Portal estático de la sección sindical de Primark Gran Vía, Madrid.

Web: https://vic2792.github.io/PaginaCgtprimark/

## Cómo se organiza

```text
index.html                 Estructura y contenido de las secciones
assets/
  css/
    base.css               Estilos generales heredados
    componentes.css        Paneles, formularios, navegación y ajustes visuales
    impresion.css          Aspecto del documento que abre el generador
  img/
    logo-cgt-primark.jpg    Logotipo original, sin modificar
  js/
    main.js                Arranque y conexión de los módulos
    datos.js               Carga de los archivos JSON
    navegacion.js          Menú, cambios de sección y accesos internos
    catalogo.js            Lista, búsqueda y apertura de las 16 herramientas
    plantillas.js          HTML que necesitan las herramientas al abrirse
    ui.js                  Funciones pequeñas compartidas por los formularios
    calculadoras.js        Operaciones y validación de datos numéricos
    tablas.js              Consulta de salarios, antigüedad, tarifas y permisos
    nomina.js              Comparación de la nómina con la referencia salarial
    escritos.js            Generadores de escritos, copia e impresión
    consultas.js           Búsqueda de los temas laborales y sus respuestas
    chat.js                Ventana de chat que reutiliza las mismas respuestas
    centro-laboral.js      Pestañas, jornada semanal, gestiones y cuestionario
    calendario.js          Notas del calendario guardadas en este navegador
    formacion.js           Consulta de permisos y test del catálogo
    sanciones.js           Orientación disciplinaria y acceso al escrito
 data/
    herramientas.json      Nombres, descripciones y categorías del catálogo
    preguntas.json         Temas, permisos y cuestionario que ya existían
    salarios.json          Tablas e importes que utilizan las calculadoras
 docs/                     Auditoría, cambios y explicación de la estructura
 tests/                    Pruebas que se ejecutan con Node.js y Playwright
```

HTML define los elementos, CSS su aspecto y JavaScript su comportamiento. JSON guarda datos: no ejecuta operaciones. Los módulos JavaScript usan `import` y `export` para compartir funciones, sin añadirlas a `window`. El navegador carga `main.js`, que espera los datos y prepara los demás módulos.

Los botones usan atributos como `data-action="calcHoras"`. Son nombres que JavaScript reconoce, no instrucciones ejecutables dentro del HTML. Los pequeños fragmentos de HTML de `plantillas.js` se necesitan para crear los formularios al abrir una herramienta.

## Verla en tu ordenador

Desde la carpeta del repositorio, con Python instalado:

```bash
python -m http.server 8000
```

Abrir http://localhost:8000/ en el navegador. Los módulos y JSON necesitan servirse por HTTP; no se debe abrir `index.html` con doble clic. No hace falta instalar Node.js para servir la web con Python.

GitHub Pages publica estos archivos directamente desde `main`. Las rutas son relativas y también funcionan dentro de `/PaginaCgtprimark/`. No hay compilación, backend ni dependencias de producción.

## Ejecutar las pruebas

Para desarrollar y probar con Node.js 20 o posterior:

```bash
npm ci
npx playwright install chromium
npm test
```

Si se usa un Chromium ya instalado, indicar su ruta mediante `CHROMIUM_PATH`. Las pruebas utilizan un servidor temporal bajo `/PaginaCgtprimark/`, recorren las herramientas a 320/390/1280 px y comprueban también carga de archivos, calendario, errores de datos e impresión. El PDF de comprobación se escribe en la carpeta temporal del sistema.

Para comparar con la versión anterior a la separación:

```bash
git show 2b75907885e7a466ab01e4cf976ffd2388b031a4:index.html > /tmp/cgt-before.html
BASELINE_HTML=/tmp/cgt-before.html npm run test:equivalencia
```

Esta prueba contrasta cálculos, escritos, apariencia y capturas con el archivo anterior. Tras publicar, se puede ejecutar la regresión contra la URL pública:

```bash
TEST_URL=https://vic2792.github.io/PaginaCgtprimark/ node tests/regression.cjs
```

## Dónde hacer cada cambio

- Cambiar colores, tamaños o campos: `assets/css/`.
- Cambiar una fórmula: `assets/js/calculadoras.js` o `nomina.js`, y comprobar sus resultados.
- Actualizar importes: `data/salarios.json`, conservando su fuente y periodo.
- Actualizar temas de consulta: `data/preguntas.json`. No añadir respuestas sin revisar sus fuentes.
- Cambiar el contenido extenso de una sección o de la ficha de renuncia: `index.html`.
- Cambiar un formulario que aparece al abrir una herramienta: `assets/js/plantillas.js`.
- Cambiar el texto de un escrito: `assets/js/escritos.js`.

La separación conserva los importes y contenidos anteriores; no supone una nueva revisión jurídica ni incorpora las 79 preguntas completas. Las advertencias de cada herramienta siguen vigentes. Los registros locales continúan usando las mismas claves de almacenamiento.
