const assert = require("node:assert/strict");
const fs = require("node:fs");
const { startServer, launchBrowser, ready } = require("./helpers.cjs");

(async () => {
  const server = await startServer(),
    browser = await launchBrowser();
  try {
    for (const width of [320, 390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [],
        requests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) =>
        requests.push(request.url() + (request.postData() || "")),
      );
      await page.goto(process.env.TEST_URL || server.url);
      await ready(page);
      await page
        .locator('[data-portal="centro"]')
        .first()
        .evaluate((e) => e.click());
      await page
        .locator(
          '[data-pane="escritos"] [data-open-model="renuncia-complementarias-breve"]',
        )
        .first()
        .click();
      assert.equal(await page.locator("#modelos-escritos").isVisible(), true);
      const output = page.locator("#model-output");
      const blank = await output.inputValue();
      assert.match(blank, /A\/A: People & Culture/);
      assert.match(blank, /\[Nombre y apellidos\]/);
      assert.match(blank, /Sin otro particular/);
      assert.match(blank, /\[fecha\]/);
      await page.locator(".model-personalize summary").click();
      const name = "Prueba <texto> {{fecha}} $&";
      await page.locator("#model-nombre").fill(name);
      await page.locator("#model-centro").fill("Gran Vía");
      await page.locator("#model-fecha").fill("2026-11-09");
      await page.locator('#model-form button[type="submit"]').click();
      let text = await output.inputValue();
      assert.ok(text.includes(name));
      assert.match(text, /9 de noviembre de 2026/);
      assert.doesNotMatch(text, /DNI/);
      await page.locator("#model-dni").fill("12345678Z");
      await page.locator('#model-form button[type="submit"]').click();
      assert.match(await output.inputValue(), /con DNI 12345678Z/);
      text = (await output.inputValue()) + "\nNota añadida a mano.";
      await output.fill(text);
      await page.evaluate(() =>
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async (text) => {
              window.modelClipboardTest = text;
            },
          },
        }),
      );
      await page.locator("#model-copy").click();
      assert.equal(await page.evaluate(() => window.modelClipboardTest), text);
      await page.evaluate(() => {
        navigator.clipboard.writeText = async () => {
          throw new Error("denied");
        };
      });
      await page.locator("#model-copy").click();
      assert.match(
        await page.locator("#model-status").innerText(),
        /manualmente/,
      );
      const downloadPromise = page.waitForEvent("download");
      await page.locator("#model-download").click();
      const download = await downloadPromise;
      assert.equal(
        download.suggestedFilename(),
        "renuncia-complementarias-breve.txt",
      );
      assert.equal(
        fs.readFileSync(await download.path(), "utf8").replace(/^\uFEFF/, ""),
        text,
      );
      const popupPromise = page.waitForEvent("popup");
      await page.locator("#model-print").click();
      const popup = await popupPromise;
      await popup.waitForLoadState("load");
      assert.equal(await popup.locator("pre").innerText(), text);
      assert.equal(await popup.locator("img").count(), 0);
      await popup.close();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      assert.equal(
        await page.evaluate(() =>
          JSON.stringify([
            Object.entries(localStorage),
            Object.entries(sessionStorage),
          ]).includes("12345678Z"),
        ),
        false,
      );
      assert.ok(
        requests.every(
          (url) => !url.includes("12345678Z") && !url.includes("Prueba"),
        ),
        "personal data must not be sent",
      );
      await page.locator("#model-guide").click();
      assert.equal(
        await page
          .locator("#faq-renuncia-complementarias")
          .evaluate((e) => e.open),
        true,
      );
      await page
        .locator("#faq-renuncia-complementarias [data-open-model]")
        .click();
      assert.equal(await page.locator("#modelos-escritos").isVisible(), true);
      await page.locator("#model-clear").click();
      assert.equal(await page.locator("#model-nombre").inputValue(), "");
      assert.equal(await page.locator("#model-dni").inputValue(), "");
      assert.equal(await output.inputValue(), blank);
      await page.locator("#model-nombre").fill("Dato temporal");
      await page.reload();
      await ready(page);
      assert.equal(await page.locator("#model-nombre").inputValue(), "");
      assert.equal(await page.locator("#model-output").inputValue(), blank);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(
        `PASS models ${width}px: blank/personalized/editable, optional DNI, copy, download, print, clear and privacy`,
      );
    }
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
