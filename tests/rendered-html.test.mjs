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
  assert.match(html, /Buses/);
  assert.match(html, /Transport &amp; Travel/);
  assert.match(html, /iCloud\+/);
  assert.match(html, /Mercury Weather/);
  assert.match(html, /Microsoft 365/);
  assert.match(html, /Gaming laptop/);
  assert.match(html, /€811\.96/);
  assert.match(html, /€1,138\.04/);
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
  assert.equal(current.revision, 8);
  assert.equal(current.savingsGoal, 200);
  assert.deepEqual(current.period, {
    start: "2026-07-01",
    end: "2026-07-31",
  });
  assert.equal(
    current.expenses.find((expense) => expense.id === "2026-07-apple-devices")
      ?.note,
    "Apple Devices",
  );
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-buses"),
    {
      id: "2026-07-buses",
      amount: 40,
      note: "Buses",
      noteTranslations: {
        en: "Buses",
        ru: "Автобусы",
      },
      date: "2026-07-25",
      category: "Transport & Travel",
      source: "chat",
      recurring: true,
      frequency: "monthly",
    },
  );
  assert.equal(
    current.expenses.find((expense) => expense.id === "2026-07-chatgpt")
      ?.amount,
    22.99,
  );
  assert.equal(
    current.expenses.find((expense) => expense.id === "2026-07-youtube")
      ?.amount,
    25.99,
  );
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-laptop"),
    {
      id: "2026-07-laptop",
      amount: 49,
      note: "Gaming laptop",
      noteTranslations: {
        en: "Gaming laptop",
        ru: "Игровой ноутбук",
      },
      date: "2026-07-25",
      category: "Devices & installments",
      source: "chat",
      recurring: true,
      frequency: "monthly",
    },
  );
  for (const [id, amount] of [
    ["2026-07-icloud-plus", 2.99],
    ["2026-07-mercury-weather", 2.99],
    ["2026-07-microsoft-365", 13],
  ]) {
    const expense = current.expenses.find((item) => item.id === id);
    assert.equal(expense?.amount, amount);
    assert.equal(expense?.category, "Subscriptions & services");
    assert.equal(expense?.recurring, true);
    assert.equal(expense?.frequency, "monthly");
  }
  for (const expense of current.expenses) {
    assert.equal(typeof expense.noteTranslations?.en, "string");
    assert.equal(typeof expense.noteTranslations?.ru, "string");
    assert.ok(expense.noteTranslations.en.length > 0);
    assert.ok(expense.noteTranslations.ru.length > 0);
  }

  for (const source of [page, script]) {
    assert.match(source, /noteTranslations/);
    assert.match(source, /Spending alert/);
    assert.match(source, /Контроль расходов/);
    assert.match(source, /Transport & Travel/);
    assert.match(source, /Транспорт и путешествия/);
  }
});
