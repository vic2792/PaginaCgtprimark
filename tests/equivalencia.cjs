// Compare with a saved index.html from the commit before the refactor.
// BASELINE_HTML=/tmp/cgt-before.html node tests/equivalencia.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { startServer, launchBrowser, ready } = require("./helpers.cjs");
const baseline = process.env.BASELINE_HTML;
if (!baseline || !fs.existsSync(baseline))
  throw new Error("Indica BASELINE_HTML con el index.html anterior.");
const normalize = (text) => text.replace(/\s+/g, " ").trim();
const apps = [
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
];
const samples = {
  huelga: { hb: "1450", hp: "100" },
  nomina: { base: "1400", ded: "100" },
  horas: { ref: "1765", full: "39.5", weekly: "25", done: "500" },
  vacaciones: { vd: "30", vm: "6", vu: "5" },
  horarios: { end: "2026-11-08T21:00", start: "2026-11-09T07:00", shift: "8" },
  festivos: { ns: "2", ps: "45", nf: "1", pf: "45" },
  escritos: { ename: "Prueba", edetail: "Solicitud de prueba" },
  incidencias: { idesc: "Incidencia de prueba", iplace: "Cajas" },
  antiguedad: { hire: "2020-02-29", until: "2026-11-09" },
  contratos: { refh: "39.5", refs: "1800", h1: "20", h2: "30" },
  finiquito: {
    fmonthly: "1400",
    fdays: "5",
    fvac: "3",
    fextra: "200",
    fother: "10",
  },
};
async function view(page, name) {
  await page
    .locator(`[data-portal="${name}"]`)
    .first()
    .evaluate((e) => e.click());
}
async function inspect(page) {
  return page.evaluate(() => {
    const elements = [
      ...document.querySelectorAll(
        "h1,h2,h3,p,button,input,select,textarea,label,summary,a,blockquote",
      ),
    ].filter((e) => e.checkVisibility());
    return elements.map((e) => {
      const s = getComputedStyle(e);
      return {
        tag: e.tagName,
        id: e.id,
        text: e.children.length
          ? ""
          : e.textContent.replace(/\s+/g, " ").trim(),
        color: s.color,
        fill: s.webkitTextFillColor,
        bg: s.backgroundColor,
        font: s.fontSize,
        weight: s.fontWeight,
        display: s.display,
      };
    });
  });
}
async function capture(browser, url, isNew, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await page.goto(url);
    if (isNew) await ready(page);
    // Freeze motion and caret for reproducible screenshots without altering colors/layout.
    await page.addStyleTag({
      content:
        "*,*::before,*::after{scroll-behavior:auto!important;transition:none!important;animation:none!important;caret-color:transparent!important}",
    });
    await page.evaluate(() =>
      Promise.all([...document.images].map((i) => i.decode().catch(() => {}))),
    );
    const output = {
      tools: {},
      views: {},
      boe: [],
      nomina: [],
      tables: [],
      letters: [],
    };
    for (const name of [
      "inicio",
      "herramientas",
      "centro",
      "calculadoras",
      "nomina",
      "tablas",
      "derechos",
      "dudas",
      "enlaces",
      "fuentes",
    ]) {
      await view(page, name);
      output.views[name] = await inspect(page);
      if (["inicio", "nomina", "dudas"].includes(name)) {
        await page.evaluate(() => window.scrollTo(0, 0));
        const screenshot = await page.screenshot({ animations: "disabled" });
        const filename = `/tmp/cgt-${isNew ? "after" : "before"}-${name}-${width}.png`;
        fs.writeFileSync(filename, screenshot);
      }
    }
    for (let index = 0; index < apps.length; index++) {
      const id = apps[index];
      await view(page, "herramientas");
      await page.locator("#cards button").nth(index).click();
      output.tools[id] = {
        initial: normalize(await page.locator("#workContent").innerText()),
      };
      for (const [field, value] of Object.entries(samples[id] || {}))
        await page.locator("#" + field).fill(value);
      if (samples[id] || id === "test") {
        await page.locator("#workContent .btn").first().click();
        output.tools[id].result = normalize(
          await page.locator("#result").innerText(),
        );
      }
      await page.locator(".back").click();
    }
    await view(page, "calculadoras");
    for (const year of ["2025", "2026", "2027", "2028"])
      for (const group of ["0", "1", "2", "3"]) {
        await page.locator("#boeyear").selectOption(year);
        await page.locator("#boegroup").selectOption(group);
        await page.locator("#convenio-oficial button").click();
        output.boe.push(
          normalize(await page.locator("#boeresult").innerText()),
        );
      }
    await view(page, "nomina");
    for (const [field, value] of Object.entries({
      auditHours: "30",
      auditOther: "75",
      auditActual: "1500",
      auditSs: "90",
      auditIrpf: "150",
    }))
      await page.locator("#" + field).fill(value);
    for (const year of ["2025", "2026", "2027", "2028"])
      for (const group of ["0", "1", "2", "3"]) {
        await page.locator("#auditYear").selectOption(year);
        await page.locator("#auditGroup").selectOption(group);
        await page.locator("#auditCalc").click();
        output.nomina.push(
          normalize(await page.locator("#auditResult").innerText()),
        );
      }
    await view(page, "tablas");
    for (const year of ["2025", "2026", "2027", "2028"])
      for (const contract of [
        "full",
        "35",
        "32.5",
        "30",
        "25",
        "24",
        "20",
        "18",
        "16",
        "12",
      ]) {
        await page.locator("#syear").selectOption(year);
        await page.locator("#scontract").selectOption(contract);
        output.tables.push(
          normalize(await page.locator("#salaryResult").innerText()),
        );
      }
    await view(page, "centro");
    for (const type of await page
      .locator("#cgt-letter-type option")
      .evaluateAll((es) => es.map((e) => e.value))) {
      await page.locator("#cgt-letter-type").selectOption(type);
      await page.locator("#cgt-letter-name").fill("Prueba <texto>");
      await page.locator("#cgt-letter-details").fill("Texto de prueba");
      await page.locator("#cgt-letter-make").click();
      output.letters.push(
        await page.locator("#cgt-letter-output").inputValue(),
      );
    }
    assert.deepEqual(errors, []);
    return output;
  } finally {
    await page.close();
  }
}
(async () => {
  const server = await startServer({ baseline }),
    browser = await launchBrowser();
  try {
    for (const width of [390, 1280]) {
      const before = await capture(browser, server.baselineUrl, false, width),
        after = await capture(browser, server.url, true, width);
      assert.deepEqual(after.tools, before.tools, "tools");
      assert.deepEqual(after.boe, before.boe, "BOE salary");
      assert.deepEqual(after.nomina, before.nomina, "payroll");
      assert.deepEqual(after.tables, before.tables, "salary tables");
      assert.deepEqual(after.letters, before.letters, "letters");
      // The temporary loading status does not form part of the final UI.
      assert.deepEqual(after.views, before.views, "computed appearance");
      for (const name of ["inicio", "nomina", "dudas"]) {
        const same = fs
          .readFileSync(`/tmp/cgt-before-${name}-${width}.png`)
          .equals(fs.readFileSync(`/tmp/cgt-after-${name}-${width}.png`));
        assert.equal(same, true, `visual difference ${name} ${width}px`);
      }
      console.log(
        `PASS equivalence ${width}px: 16 tools, 16 BOE cases, 16 payroll cases, 40 salary cases, all letter types, 10 views and 3 screenshots`,
      );
    }
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
