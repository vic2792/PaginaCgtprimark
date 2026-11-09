const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const prefix = "/PaginaCgtprimark/";
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

async function startServer({ baseline } = {}) {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://localhost");
    if (baseline && url.pathname === "/baseline/") {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(fs.readFileSync(baseline));
      return;
    }
    if (!url.pathname.startsWith(prefix)) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    let file;
    try {
      file = path.resolve(
        root,
        decodeURIComponent(url.pathname.slice(prefix.length)) || "index.html",
      );
    } catch {
      response.writeHead(400);
      response.end("Invalid path");
      return;
    }
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    fs.readFile(file, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.setHeader(
        "Content-Type",
        (mime[path.extname(file)] || "application/octet-stream") +
          (file.endsWith(".jpg") ? "" : "; charset=utf-8"),
      );
      response.end(content);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}${prefix}`,
    baselineUrl: `http://127.0.0.1:${server.address().port}/baseline/`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

async function launchBrowser() {
  const executablePath =
    process.env.CHROMIUM_PATH ||
    (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
  return chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox"],
  });
}

async function ready(page) {
  await page.waitForFunction(
    () => document.documentElement.dataset.appReady === "true",
  );
}

async function openTool(page, id) {
  await page
    .locator('[data-portal="herramientas"]')
    .first()
    .evaluate((element) => element.click());
  await page.locator(`#cards [data-app="${id}"]`).click();
}

module.exports = { startServer, launchBrowser, ready, openTool };
