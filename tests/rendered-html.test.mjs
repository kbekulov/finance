import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the current finance tracker", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Euroscope — Your monthly money, clearly<\/title>/i);
  assert.match(html, /class="spending-alert"/);
  assert.match(html, /Spending alert/);
  assert.match(html, /Debt &amp; repayments is your largest cost at €566\.00/);
  assert.match(html, /Apple Devices/);
  assert.match(html, /Updated 25 July 2026/);
  assert.match(html, /Today<!-- --> · <!-- -->25/);
  assert.match(html, /€785\.00/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps database history and translations aligned", async () => {
  const [databaseText, page, script] = await Promise.all([
    readFile(new URL("../data/finance-history.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../script.js", import.meta.url), "utf8"),
  ]);
  const database = JSON.parse(databaseText);
  const current = database.months.at(-1);

  assert.equal(database.maxMonths, 12);
  assert.ok(database.months.length <= database.maxMonths);
  assert.equal(database.currency, "EUR");
  assert.equal(database.timezone, "Europe/Vilnius");
  assert.equal(current.updatedAt, "2026-07-25");
  assert.equal(current.revision, 4);
  assert.deepEqual(current.period, {
    start: "2026-07-01",
    end: "2026-07-31",
  });
  assert.equal(
    current.expenses.find((expense) => expense.id === "2026-07-apple-devices")
      ?.note,
    "Apple Devices",
  );

  for (const source of [page, script]) {
    assert.match(source, /Apple Devices/);
    assert.match(source, /Устройства Apple/);
    assert.match(source, /Spending alert/);
    assert.match(source, /Контроль расходов/);
  }
});
