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
  assert.match(html, /<title>Kinance<\/title>/i);
  assert.doesNotMatch(html, /—|&mdash;|&#8212;|&#x2014;/i);
  assert.match(html, /kinance-favicon\.jpg/i);
  assert.match(html, />kinance<\/span>/i);
  assert.doesNotMatch(html, />euroscope<\/span>/i);
  assert.match(html, /class="spending-alert"/);
  assert.match(html, /Spending alert/);
  assert.match(html, /Debt &amp; repayments is your largest cost at €555\.00/);
  assert.match(html, /Apple Devices/);
  assert.match(html, /Updated 25 July 2026/);
  assert.match(html, /Today<!-- --> · <!-- -->25 Jul/);
  assert.match(html, /10 Jul/i);
  assert.match(html, /11 Aug/i);
  assert.match(html, /YOUR SALARY CYCLE AT A GLANCE/);
  assert.match(html, /left until next salary/);
  assert.match(html, /Buses/);
  assert.match(html, /Transport &amp; Travel/);
  assert.match(html, /iCloud\+/);
  assert.match(html, /Mercury Weather/);
  assert.match(html, /Microsoft 365/);
  assert.match(html, /Gaming laptop/);
  assert.match(html, /Keturi vėjai 0\.4 l/);
  assert.match(html, /Shelton&#x27;s pear cider/);
  assert.match(html, /Alcohol &amp; nightlife/);
  assert.match(html, /€808\.95/);
  assert.match(html, /€1,141\.05/);
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
  assert.equal(database.version, 4);
  assert.deepEqual(database.salarySchedule, {
    dayOfMonth: 12,
    weekendRule: "previousFriday",
  });
  assert.ok(database.months.length <= database.maxMonths);
  assert.equal(database.currency, "EUR");
  assert.equal(database.timezone, "Europe/Vilnius");
  assert.equal(current.updatedAt, "2026-07-25");
  assert.equal(current.revision, 12);
  assert.equal(current.savingsGoal, 200);
  assert.deepEqual(current.period, {
    start: "2026-07-10",
    end: "2026-08-11",
  });
  const effectiveSalaryDate = (year, monthIndex) => {
    const date = new Date(year, monthIndex, database.salarySchedule.dayOfMonth, 12);
    if (date.getDay() === 6) date.setDate(date.getDate() - 1);
    if (date.getDay() === 0) date.setDate(date.getDate() - 2);
    return date;
  };
  const [periodYear, periodMonth] = current.month.split("-").map(Number);
  const expectedStart = effectiveSalaryDate(periodYear, periodMonth - 1);
  const expectedNextStart = effectiveSalaryDate(periodYear, periodMonth);
  const expectedEnd = new Date(expectedNextStart);
  expectedEnd.setDate(expectedEnd.getDate() - 1);
  const isoDate = (date) => date.toISOString().slice(0, 10);
  assert.equal(isoDate(expectedStart), current.period.start);
  assert.equal(isoDate(expectedEnd), current.period.end);
  assert.equal(expectedStart.getDay(), 5);
  assert.equal(isoDate(expectedStart), "2026-07-10");
  assert.equal(isoDate(expectedNextStart), "2026-08-12");
  for (const expense of current.expenses) {
    assert.ok(expense.date >= current.period.start);
    assert.ok(expense.date <= current.period.end);
  }
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
    current.expenses.find(
      (expense) => expense.id === "2026-07-university-debt",
    )?.amount,
    189,
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
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-istorijos-001"),
    {
      id: "2026-07-istorijos-001",
      amount: 6,
      note: "Keturi vėjai 0.4 l",
      noteTranslations: {
        en: "Keturi vėjai 0.4 l",
        ru: "Keturi vėjai, 0,4 л",
      },
      date: "2026-07-25",
      category: "Food",
      source: "receipt",
      merchant: "Istorijos",
      legalEntity: "MB Skania",
      merchantAddress: "M. K. Čiurlionio g. 100, Vilnius",
      description: "Keturi vėjai 0.4 l",
      originalCurrency: "EUR",
      originalAmount: 6,
      receiptReference: "6774",
      orderNumber: "4648",
      paymentMethod: "Credit card",
      transactionTime: "11:52:56",
      vatRate: 21,
      vatAmount: 1.04,
    },
  );
  assert.deepEqual(
    current.expenses.find(
      (expense) => expense.id === "2026-07-maxima-cider-001",
    ),
    {
      id: "2026-07-maxima-cider-001",
      amount: 1.99,
      note: "Shelton's pear cider",
      noteTranslations: {
        en: "Shelton's pear cider",
        ru: "Грушевый сидр Shelton's",
      },
      date: "2026-07-25",
      category: "Alcohol & nightlife",
      source: "receipt",
      merchant: "Maxima",
      legalEntity: "MAXIMA LT, UAB",
      merchantAddress: "Medeinos g. 39, Vilnius",
      description: "Shelton's pear cider with refundable can deposit",
      originalCurrency: "EUR",
      originalAmount: 1.99,
      receiptReference: "00320265",
      paymentMethod: "Contactless debit Mastercard",
      transactionTime: "19:32:26",
      vatRate: 21,
      vatAmount: 0.33,
      containerDeposit: 0.1,
      lineItems: [
        {
          description: "Shelton's pear cider",
          amount: 1.89,
        },
        {
          description: "Refundable can deposit",
          amount: 0.1,
        },
      ],
    },
  );
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
    assert.match(source, /Alcohol & nightlife/);
    assert.match(source, /Алкоголь и ночная жизнь/);
    assert.match(source, /effectiveSalaryDate/);
    assert.match(source, /previousFriday/);
    assert.match(source, /SALARY CYCLE|Salary cycle/);
  }
});
