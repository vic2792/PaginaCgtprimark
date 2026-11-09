const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const {
  startServer,
  launchBrowser,
  ready,
  openTool,
} = require("./helpers.cjs");

(async () => {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  assert.doesNotMatch(html, /<style\b|\sstyle=|\son(?:click|input|change)=/i);
  assert.match(html, /<script\s+type="module"\s+src="assets\/js\/main.js"/);
  const server = await startServer(),
    browser = await launchBrowser();
  try {
    const page = await browser.newPage({
        viewport: { width: 390, height: 844 },
      }),
      errors = [],
      failed = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) failed.push(response.url());
    });
    page.on("requestfailed", (request) => failed.push(request.url()));
    await page.goto(server.url);
    await ready(page);
    assert.deepEqual(
      failed,
      [],
      "all assets and JSON must load beneath the GitHub Pages path",
    );
    assert.equal(
      await page
        .locator(".official-logo")
        .evaluate((image) => image.complete && image.naturalWidth > 0),
      true,
    );
    await openTool(page, "permisos");
    await page.locator("#ptype").selectOption("mudanza");
    assert.match(await page.locator("#permitout").innerText(), /Traslado/);
    await page.locator('#workContent [data-app="escritos"]').click();
    assert.match(await page.locator("#workTitle").innerText(), /Generador/);

    // Recover a corrupt calendar and preserve a new event through reload.
    await page.evaluate(() => localStorage.setItem("cgt_events", "{"));
    await openTool(page, "calendario");
    await page.locator("#cdate").fill("2026-12-01");
    await page.locator("#ctitle").fill("Revisar nómina");
    await page.locator('[data-action="saveEvent"]').click();
    await page.reload();
    await ready(page);
    await openTool(page, "calendario");
    assert.match(await page.locator("#events").innerText(), /Revisar nómina/);
    await page.locator('[data-action="clearEvents"]').click();
    assert.match(await page.locator("#events").innerText(), /Todavía no hay/);

    // The separate print stylesheet must load before printing, with escaped text.
    await page
      .locator('[data-portal="centro"]')
      .first()
      .evaluate((e) => e.click());
    await page.locator("#cgt-letter-name").fill("Prueba <texto>");
    await page.locator("#cgt-letter-make").click();
    const expected = await page.locator("#cgt-letter-output").inputValue();
    const popupPromise = page.waitForEvent("popup");
    await page.locator("#cgt-letter-print").click();
    const popup = await popupPromise;
    await popup.waitForLoadState("load");
    assert.equal(await popup.locator("pre").innerText(), expected);
    assert.equal(
      await popup
        .locator("pre")
        .evaluate((e) => getComputedStyle(e).whiteSpace),
      "pre-wrap",
    );
    assert.equal(
      await popup
        .locator("body")
        .evaluate((e) => getComputedStyle(e).paddingTop),
      "35px",
    );
    await popup.pdf({
      path: path.join(os.tmpdir(), "cgt-escrito-refactor.pdf"),
      format: "A4",
    });
    await popup.close();
    assert.deepEqual(errors, []);
    await page.close();

    // A data-loading failure must show a useful message, rather than an empty tool.
    const broken = await browser.newPage();
    await broken.route("**/data/preguntas.json", (route) =>
      route.fulfill({ status: 503, body: "Unavailable" }),
    );
    await broken.goto(server.url);
    await broken.waitForFunction(
      () => document.documentElement.dataset.appReady === "error",
    );
    assert.match(
      await broken.locator("#app-status").innerText(),
      /Recarga la página/,
    );
    assert.equal(
      await broken.locator("#app-status").getAttribute("role"),
      "alert",
    );
    await broken.close();
    console.log(
      "PASS structure: external assets, nested paths, actions, persistence, print/PDF and loading failure",
    );
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
