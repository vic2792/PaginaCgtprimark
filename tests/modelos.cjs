const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { startServer, launchBrowser, ready } = require("./helpers.cjs");
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/escritos.json"), "utf8"),
);

async function ask(page, query) {
  await page
    .locator('[data-portal="dudas"]')
    .first()
    .evaluate((e) => e.click());
  await page.locator("#pregunta-staff").fill(query);
  await page
    .locator("#form-dudas")
    .evaluate((e) =>
      e.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
    );
}

(async () => {
  const server = await startServer(),
    browser = await launchBrowser();
  try {
    for (const width of [320, 390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } }),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(process.env.TEST_URL || server.url);
      await ready(page);
      assert.equal(
        await page.locator("#model-form,#model-nombre,#model-dni").count(),
        0,
      );
      await ask(page, "Cómo renunciar al pacto de horas complementarias");
      const response = page.locator("#respuesta-staff");
      const card = response.locator(
        '[data-model-id="renuncia-complementarias-breve"]',
      );
      assert.equal(await card.isVisible(), true);
      assert.match(await card.innerText(), /Qué documentación preparar/);
      assert.match(await card.innerText(), /copia con constancia de entrega/);
      const text = await card.locator(".model-text").innerText();
      assert.equal(text, data.modelos[0].texto);
      assert.match(text, /\[Nombre y apellidos\]/);
      assert.match(text, /\[fecha\]/);
      assert.equal(
        await card
          .locator('input,textarea,form,[contenteditable="true"]')
          .count(),
        0,
      );
      await page.evaluate(() =>
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async (t) => {
              window.modelClipboardTest = t;
            },
          },
        }),
      );
      await card.locator('[data-model-action="copy"]').click();
      assert.equal(await page.evaluate(() => window.modelClipboardTest), text);
      await page.evaluate(() => {
        navigator.clipboard.writeText = async () => {
          throw Error("denied");
        };
      });
      await card.locator('[data-model-action="copy"]').click();
      assert.match(
        await card.locator(".model-status").innerText(),
        /manualmente/,
      );
      assert.equal(
        await page.evaluate(() => window.getSelection().toString()),
        text,
      );
      const downloadPromise = page.waitForEvent("download");
      await card.locator('[data-model-action="download"]').click();
      const download = await downloadPromise;
      assert.equal(
        fs.readFileSync(await download.path(), "utf8").replace(/^\uFEFF/, ""),
        text,
      );
      const popupPromise = page.waitForEvent("popup");
      await card.locator('[data-model-action="print"]').click();
      const popup = await popupPromise;
      await popup.waitForLoadState("load");
      assert.equal(await popup.locator("pre").innerText(), text);
      await popup.close();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );

      // The same block and actions must work when cloned into a chat message.
      await page.locator("#cgt-chat-launch").click();
      await page
        .locator("#cgt-chat-input")
        .fill("Quiero dejar las horas complementarias");
      await page
        .locator("#cgt-chat-form")
        .evaluate((e) =>
          e.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true }),
          ),
        );
      const chatCard = page
        .locator("#cgt-chat-messages [data-model-id]")
        .last();
      assert.equal(await chatCard.locator(".model-text").innerText(), text);
      await page.evaluate(() => {
        navigator.clipboard.writeText = async (t) => {
          window.modelClipboardTest = t;
        };
      });
      await chatCard.locator('[data-model-action="copy"]').click();
      assert.equal(await page.evaluate(() => window.modelClipboardTest), text);
      await page.locator("#cgt-chat-close").click();

      // A different topic must not show the renunciation template.
      await ask(page, "Mi madre está hospitalizada");
      assert.equal(await response.locator("[data-model-id]").count(), 0);
      assert.match(await response.locator("h3").innerText(), /Hospitalización/);
      await ask(page, "Una consulta que no está cubierta");
      assert.equal(await response.locator("[data-model-id]").count(), 0);

      // Keep the library as a second entry, with no personalization form.
      await page
        .locator('[data-portal="centro"]')
        .first()
        .evaluate((e) => e.click());
      await page.locator('[data-center="modelos"]').click();
      assert.equal(
        await page.locator("#model-library-content .model-text").innerText(),
        text,
      );
      assert.equal(
        await page
          .locator(
            "#modelos-escritos input,#modelos-escritos textarea,#modelos-escritos form",
          )
          .count(),
        0,
      );
      assert.equal(
        await page.evaluate(() => localStorage.length + sessionStorage.length),
        0,
      );
      await page.reload();
      await ready(page);
      assert.equal(
        await page.locator("#model-library-content .model-text").innerText(),
        text,
      );
      assert.deepEqual(errors, []);
      await page.close();
      console.log(
        `PASS integrated models ${width}px: correct topic, documents, placeholders, copy/download/print, chat, library, no personal form`,
      );
    }

    // Fixture only: prove that a future approved text can be linked to another topic.
    const fixture = await browser.newPage();
    await fixture.route("**/data/escritos.json", (route) =>
      route.fulfill({
        json: {
          ...data,
          modelos: [
            ...data.modelos,
            {
              id: "modelo-prueba",
              titulo: "Modelo de prueba",
              texto: "Texto de prueba [Nombre]",
            },
          ],
        },
      }),
    );
    await fixture.route("**/data/preguntas.json", (route) => {
      const questions = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data/preguntas.json"), "utf8"),
      );
      questions.temas[0].modelos = ["modelo-prueba"];
      questions.temas[0].documentacion = ["Documento de prueba"];
      return route.fulfill({ json: questions });
    });
    await fixture.goto(server.url);
    await ready(fixture);
    await ask(fixture, "Hospitalización familiar");
    assert.match(
      await fixture.locator("#respuesta-staff").innerText(),
      /Documento de prueba/,
    );
    assert.equal(
      await fixture.locator("#respuesta-staff .model-text").innerText(),
      "Texto de prueba [Nombre]",
    );
    await fixture.close();
    console.log("PASS future topic/model association using test-only fixtures");
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
