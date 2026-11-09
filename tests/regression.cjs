// Run: node tests/regression.cjs (requires Playwright and Chromium).
const assert = require("node:assert/strict");
const {
  startServer,
  launchBrowser,
  ready,
  openTool,
} = require("./helpers.cjs");
(async () => {
  const server = await startServer();
  let browser;
  try {
    browser = await launchBrowser();
    for (const width of [320, 390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(process.env.TEST_URL || server.url);
      await ready(page);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `overflow ${width}`,
      );
      await page.evaluate(() =>
        document.querySelector('[data-portal="herramientas"]').click(),
      );
      assert.equal(await page.locator("#cards button").count(), 16);
      for (const id of [
        "huelga",
        "nomina",
        "horas",
        "vacaciones",
        "permisos",
        "horarios",
        "festivos",
        "escritos",
        "incidencias",
        "derechos",
        "calendario",
        "antiguedad",
        "contratos",
        "test",
        "finiquito",
        "novedades",
      ]) {
        await openTool(page, id);
        assert.equal(await page.locator("#workspace").isVisible(), true, id);
        await page.locator(".back").click();
        assert.equal(
          await page.locator("#workspace").isVisible(),
          false,
          "back " + id,
        );
      }
      await openTool(page, "horas");
      await page.locator("#full").fill("0");
      await page.locator("[data-action=calcHoras]").click();
      assert.match(await page.locator("#result").innerText(), /mayor que cero/);
      await page.locator("#full").fill("39.5");
      await page.locator("[data-action=calcHoras]").click();
      assert.match(await page.locator("#result").innerText(), /1117\.09/);
      await page.locator(".brand").click();
      await page.locator(".hero [data-target=permisos2028]").click();
      assert.equal(await page.locator("#permisos2028").isVisible(), true);
      await page.evaluate(() =>
        document.querySelector('[data-portal="centro"]').click(),
      );
      await page.locator("#cgt-letter-name").fill("Prueba <texto>");
      await page.locator("#cgt-letter-make").click();
      assert.match(
        await page.locator("#cgt-letter-output").inputValue(),
        /Prueba <texto>/,
      );
      await page
        .locator("#cgt-letter-type")
        .selectOption("renuncia-complementarias");
      await page.locator("#cgt-letter-make").click();
      assert.match(
        await page.locator("#cgt-letter-output").inputValue(),
        /RENUNCIA AL PACTO/,
      );
      await page.locator('[data-center="jornada"]').click();
      await page.locator("#cgt-week-calc").click();
      assert.match(
        await page.locator("#cgt-week-result").innerText(),
        /Horas planificadas/,
      );
      await page.evaluate(() =>
        document.querySelector('[data-portal="nomina"]').click(),
      );
      assert.equal(await page.locator(".payroll-group").count(), 3);
      await page.locator("#auditHours").fill("30");
      await page.locator("#auditOther").fill("75");
      await page.locator("#auditCalc").click();
      assert.match(
        await page.locator("#auditResult").innerText(),
        /Total bruto orientativo/,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "payroll overflow",
      );
      await page.evaluate(() =>
        document.querySelector('[data-portal="dudas"]').click(),
      );
      for (const [query, expected] of [
        ["Quiero dejar de hacer horas complementarias", "Renuncia"],
        ["Cómo quitar las horas complementarias", "Renuncia"],
        ["Renunciar al pacto de horas", "Renuncia"],
        ["No quiero hacer más horas complementarias", "Renuncia"],
        ["Me han despedido y tengo un hijo", "Sanciones"],
        ["salario y vacaciones", "Necesitamos concretar"],
        ["astronomía", "Necesitamos concretar"],
      ]) {
        await page.locator("#pregunta-staff").fill(query);
        await page
          .locator("#form-dudas")
          .evaluate((e) =>
            e.dispatchEvent(
              new Event("submit", { bubbles: true, cancelable: true }),
            ),
          );
        assert.match(
          await page.locator("#respuesta-staff h3").innerText(),
          new RegExp(expected),
          query,
        );
      }
      await page
        .locator(
          '[data-question="Cómo rechazar las horas complementarias y renunciar al pacto"]',
        )
        .click();
      const answer = await page.locator("#respuesta-staff").innerText();
      assert.match(answer, /12\.5\.e/);
      assert.match(answer, /15 días/);
      assert.match(answer, /cláusula sexta/);
      assert.match(answer, /aceptación voluntaria/);
      assert.doesNotMatch(answer, /pendiente de revisión del convenio/);
      assert.match(
        await page.locator("#respuesta-staff .model-text").innerText(),
        /People & Culture/,
      );
      await page
        .locator('[data-portal="centro"]')
        .first()
        .evaluate((e) => e.click());
      await page.locator('[data-center="escritos"]').click();
      await page
        .locator("#cgt-letter-type")
        .selectOption("renuncia-complementarias");
      assert.equal(
        await page.locator("#cgt-letter-type").inputValue(),
        "renuncia-complementarias",
      );
      assert.equal(
        await page.locator("#cgt-renuncia-options").isVisible(),
        true,
      );
      await page.locator("#cgt-letter-make").click();
      assert.match(
        await page.locator("#cgt-letter-output").inputValue(),
        /12\.5\.e/,
      );
      await page.locator("#cgt-renuncia-causa").selectOption("otros");
      await page.locator("#cgt-letter-make").click();
      assert.match(
        await page.locator("#cgt-letter-output").inputValue(),
        /15 días/,
      );
      await page.locator("#cgt-chat-launch").click();
      await page
        .locator("#cgt-chat-input")
        .fill("¿Puedo rechazar las horas complementarias?");
      await page
        .locator("#cgt-chat-form")
        .evaluate((e) =>
          e.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true }),
          ),
        );
      assert.match(
        await page.locator("#cgt-chat-messages").innerText(),
        /12\.5\.e/,
      );
      assert.deepEqual(errors, []);
      await page.close();
      console.log(
        `PASS ${width}px: 16 tools, navigation, calculations, letters, weekly hours, queries`,
      );
    }
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
