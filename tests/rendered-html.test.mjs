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
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /aria-label="Тема"/);
  assert.match(html, /<option value="kinance" selected="">Kinance<\/option><option value="kinance-moon">Kinance Moon<\/option>/);
  assert.match(html, /NieR:Automata/);
  assert.match(html, /Tohsaka Rin/);
  const monthPill = html.match(/<div class="month-pill"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  assert.ok(monthPill);
  assert.doesNotMatch(monthPill, /2026/);
  assert.doesNotMatch(html, /—|&mdash;|&#8212;|&#x2014;/i);
  assert.match(html, /kinance-favicon\.jpg/i);
  assert.match(html, />kinance<\/span>/i);
  assert.doesNotMatch(html, />euroscope<\/span>/i);
  assert.match(html, /class="spending-insight-trigger"/);
  assert.match(html, /id="spending-insight-tooltip"[^>]*role="tooltip"[^>]*hidden/);
  assert.doesNotMatch(html, /class="spending-alert"/);
  assert.doesNotMatch(html, /class="credit-alert"/);
  assert.match(html, /class="payment-badge debit"/);
  assert.match(html, /class="payment-badge credit-repaid"/);
  assert.doesNotMatch(html, /class="payment-badge credit-outstanding"/);
  assert.match(html, /Анализ расходов/);
  assert.match(html, /Самая крупная статья расходов: Еда, 560,64/);
  assert.match(html, /Устройства Apple/);
  assert.match(html, /iPad/);
  assert.match(html, /Обновлено 26 июля 2026 г\./);
  const vilniusDateParts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Vilnius",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .filter(({ type }) => ["year", "month", "day"].includes(type))
      .map(({ type, value }) => [type, Number(value)]),
  );
  assert.match(
    html,
    new RegExp(`Сегодня<!-- --> · <!-- -->${vilniusDateParts.day} июл`),
  );
  assert.match(html, /10 ИЮЛ/i);
  assert.match(html, /11 АВГ/i);
  assert.match(html, /<h1 id="page-title">БАЛАНС ДЕБЕТОВОЙ КАРТЫ<\/h1>/);
  assert.doesNotMatch(html, /Past 3-cycle comparison appears when history is available/);
  assert.match(html, /на карте до следующей зарплаты/);
  assert.match(html, /Проезд на автобусе/);
  assert.match(html, /Транспорт и путешествия/);
  assert.match(html, /iCloud\+/);
  assert.doesNotMatch(html, /Mercury Weather/);
  assert.match(html, /Microsoft 365/);
  assert.match(html, /Adobe/);
  assert.match(html, /G Suite/);
  assert.match(html, /class="expense-table recurring-expenses"/);
  assert.match(html, /class="ledger-stack"/);
  assert.match(html, /class="expense-table one-time-expenses-table"/);
  assert.match(html, /<details[^>]*class="expense-table recurring-expenses"/);
  assert.match(html, /<summary class="expense-table-summary"/);
  assert.match(html, /Разовые расходы/);
  assert.match(html, /1.{0,4}024,03.{0,8}€/);
  assert.match(html, /Плановые ежемесячные расходы/);
  assert.equal((html.match(/Плановые ежемесячные расходы/g) ?? []).length, 1);
  assert.doesNotMatch(html, /Expected monthly total/);
  assert.doesNotMatch(html, /class="recurring-total"/);
  assert.doesNotMatch(html, /class="category-strip"/);
  assert.doesNotMatch(html, /class="month-history"/);
  assert.match(html, /936,47.{0,8}€/);
  assert.match(html, /Разовые расходы/);
  assert.match(html, /Игровой ноутбук/);
  assert.match(html, /Ипотека/);
  assert.doesNotMatch(html, /Apartment debt/);
  assert.match(html, /Keturi vėjai, 0,4 л/);
  assert.match(html, /Грушевый сидр Shelton&#x27;s/);
  assert.match(html, /Алкоголь и ночная жизнь/);
  assert.match(html, /Alita Spritz Limon/);
  assert.match(html, /Холодный персиковый чай/);
  assert.match(html, /Bočmano Ūsai IPA, 0,4 л/);
  assert.match(html, /1.{0,4}960,50.{0,8}€/);
  assert.match(html, /199,50.{0,8}€/);
  assert.match(html, /-0,50.{0,8}€/);
  assert.match(html, /ДОПОЛНИТЕЛЬНЫЕ ДОХОДЫ/);
  assert.match(html, /\+.{0,8}10,00.{0,8}€/);
  assert.match(html, /ОБЩИЙ ДОХОД/);
  assert.match(html, /2.{0,4}160,00.{0,8}€/);
  assert.match(html, /Учтено расходов: 44/);
  assert.match(html, /91%<!-- --> <!-- -->ПОТРАЧЕНО|91% ПОТРАЧЕНО/);
  assert.match(html, /Без сохранения накоплений/);
  assert.match(html, /С сохранением накоплений/);
  assert.match(html, /class="pace-limit pace-limit-all"/);
  assert.match(html, /class="pace-limit pace-limit-safe"/);
  const todayUtc = Date.UTC(
    vilniusDateParts.year,
    vilniusDateParts.month - 1,
    vilniusDateParts.day,
  );
  const cycleEndUtc = Date.UTC(2026, 7, 11);
  const renderedRemainingDays = Math.max(
    Math.round((cycleEndUtc - todayUtc) / 86400000),
    1,
  );
  const renderedAllFundsPace = Math.round(199.5 / renderedRemainingDays);
  const renderedSavingsSafePace = 0;
  assert.match(
    html,
    new RegExp(`${renderedAllFundsPace}.{0,12}€(?:<!-- --> <!-- -->)?в день`),
  );
  assert.match(
    html,
    new RegExp(`${renderedSavingsSafePace}.{0,12}€(?:<!-- --> <!-- -->)?в день`),
  );
  assert.match(html, /Красное вино/);
  assert.match(html, /McDonald&#x27;s/);
  assert.match(html, /Пиво/);
  assert.match(html, /Мороженое/);
  assert.match(html, /class="stat-card salary salary-locked"/);
  assert.match(html, /ЗАРПЛАТА ЗА ЭТОТ ЦИКЛ/);
  assert.match(html, /Зафиксирована для этого зарплатного цикла/);
  assert.doesNotMatch(html, /Monthly salary in euros[^<]*<\/span>\s*<span[^>]*>€<\/span>\s*<input/s);
  assert.doesNotMatch(html, /class="daily-chart-panel"/);
  assert.match(html, /class="daily-expense-chart"/);
  assert.match(html, /class="expense-category-icon"/);
  assert.match(
    html,
    /category-icons\/debt-rpg\.png/,
  );
  assert.doesNotMatch(html, /class="expense-monogram"/);
  assert.match(html, /aria-label="Составные столбцы расходов по дебету и кредиту, график относительной силы и линии дневных лимитов"/);
  assert.match(html, /class="strength-panel"/);
  assert.match(html, /ОТНОСИТЕЛЬНАЯ СИЛА/);
  assert.match(html, /<strong>4,6<\/strong>/);
  assert.match(html, /aria-label="Мастер-сержант, ранг силы 8 из 20\.[^"]*Имперский стиль[^"]*"/);
  assert.match(html, /class="strength-rank-icon"[^>]*background-position:50% 33\.333333333333336%/);
  assert.match(html, /<small>MSgt\.<\/small>/);
  assert.match(html, /<strong>51<small>кг<\/small><\/strong>/);
  assert.match(html, /Подтягивания<\/span><strong>8<small class="strength-target"[^>]*>.*?23<\/small><\/strong>/);
  assert.match(html, /Отжимания<\/span><strong>25<small class="strength-target"[^>]*>.*?57<\/small><\/strong>/);
  assert.doesNotMatch(html, /Лучший подход|Best (?:pull-up|push-up) set/);
  assert.match(html, /подходы не суммируются/);
  assert.doesNotMatch(html, /<form\b/);
  assert.doesNotMatch(html, /class="add-panel"/);
  assert.doesNotMatch(html, /class="editable-value"/);
  assert.match(html, /12.{0,8}€\/день · Накопления используются/);
  assert.match(html, /0.{0,8}€\/день · Накопления сохранены/);
  assert.match(html, /allowance-guide-all" style="--guide-top:79%"/);
  assert.match(html, /allowance-guide-safe" style="--guide-top:91%"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps database history and translations aligned", async () => {
  const [databaseText, strengthText, page, script, styles, index, manual] = await Promise.all([
    readFile(new URL("../data/finance-history.json", import.meta.url), "utf8"),
    readFile(new URL("../data/strength-history.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../script.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);
  const database = JSON.parse(databaseText);
  const strengthDatabase = JSON.parse(strengthText);
  const current = database.months.at(-1);

  assert.equal(database.maxMonths, 12);
  assert.equal(database.version, 6);
  assert.deepEqual(database.salarySchedule, {
    dayOfMonth: 12,
    weekendRule: "previousFriday",
  });
  assert.ok(database.months.length <= database.maxMonths);
  assert.ok(database.months.every((month) => Number.isFinite(month.salary) && month.salary >= 0));
  assert.equal(database.currency, "EUR");
  assert.equal(database.timezone, "Europe/Vilnius");
  assert.match(manual, /use that printed date even if the user uploads the receipt days or months later/);
  assert.match(manual, /salary cycle whose inclusive `period\.start` through `period\.end` contains the chosen receipt date/);
  assert.match(manual, /use the actual current `Europe\/Vilnius` calendar day and add the expense to the current salary cycle/);
  assert.match(manual, /never misdate it into the current cycle/);
  assert.match(manual, /Synthetic expense history is exceptional/);
  assert.match(manual, /`synthetic: true` and a stable shared `backfillBatch` identifier/);
  assert.match(manual, /default `kinance` theme uses one bold, item-only RPGMaker-inspired pixel inventory icon per category/);
  assert.match(manual, /Type-Moon-style modern urban-occult story logic/);
  assert.match(manual, /Every expense-recording request that adds at least one new canonical expense/);
  assert.match(manual, /Generate one fresh two-frame banner set per request/);
  assert.match(manual, /Every new banner must meaningfully represent the topic of the expense/);
  assert.match(manual, /RPGMaker-style in-game moment/);
  assert.match(manual, /character visibly performing the activity related to the newly recorded expense/);
  assert.match(manual, /increment the shared banner query version for both `kinance` and `kinance-moon`/);
  assert.match(manual, /Finance accuracy takes priority/);
  assert.match(manual, /consecutive frames of a deliberately low-frame-rate idle animation/);
  assert.match(manual, /Alternate the frames with a hard pixel-art cut every 1000 milliseconds/);
  assert.match(manual, /Taiga Fujimura, Kohaku, and Soujuurou Shizuki for Food/);
  assert.match(manual, /Lancer Cu Chulainn, Shuten-Douji, and Aoko Aozaki for Alcohol & nightlife/);
  assert.match(manual, /stable expense-ID hash/);
  assert.match(manual, /create new concepts from a blank canvas instead of tracing an older icon/);
  assert.match(manual, /sits entirely over the lower 168 pixels of the banner artwork/);
  assert.match(manual, /red upper segment is credit/);
  assert.match(manual, /whether its `creditStatus` is `outstanding` or `repaid`/);
  assert.match(manual, /red long-dashed rule for the all-funds allowance/);
  assert.match(manual, /green short-dashed rule for the savings-safe allowance/);
  assert.match(manual, /visually `short line, text, long line`/);
  assert.match(manual, /no pill, badge, outline, or floating callout/);
  assert.match(manual, /edge-faded canvas mask/);
  assert.match(manual, /`data\/strength-history\.json`/);
  assert.match(manual, /frontend is read-only/);
  assert.match(manual, /personal bodyweight strength-endurance index/);
  assert.match(manual, /Formula version 3/);
  assert.match(manual, /Spending insight` disclosure between the Kinance brand and the theme selector/);
  assert.match(manual, /clicking anywhere outside it or pressing Escape closes it/);
  assert.match(manual, /Do not place debit, credit, or other finance-series legends inside the Relative Strength card/);
  assert.match(manual, /Keep it separate from `salary` so the fixed salary and salary history remain truthful/);
  assert.match(manual, /Russian is the default language when no preference exists/);
  assert.match(manual, /`kinance_language` cookie/);
  assert.match(manual, /`kinance_theme` cookie/);
  assert.equal(current.updatedAt, "2026-07-26");
  assert.equal(current.revision, 29);
  assert.equal(current.savingsGoal, 200);
  assert.equal(current.expenses.length, 44);
  assert.deepEqual(strengthDatabase, {
    version: 3,
    timezone: "Europe/Vilnius",
    updatedAt: "2026-07-26",
    revision: 5,
    entries: [{
      id: "2026-07-26-rs-001",
      date: "2026-07-26",
      weightKg: 51,
      maxPullUpsSingleSet: 8,
      maxPushUpsSingleSet: 25,
      source: "chat",
    }],
  });
  const supportedCategories = new Set([
    "Food",
    "Subscriptions & services",
    "Luxury purchases",
    "Debt & repayments",
    "Devices & installments",
    "Transport & Travel",
    "Alcohol & nightlife",
  ]);
  const monthKeys = new Set();
  const expenseIds = new Set();
  const incomeIds = new Set();
  for (const [monthIndex, monthRecord] of database.months.entries()) {
    assert.match(monthRecord.month, /^\d{4}-\d{2}$/);
    assert.ok(!monthKeys.has(monthRecord.month));
    monthKeys.add(monthRecord.month);
    assert.ok(monthRecord.period.start <= monthRecord.period.end);
    if (monthIndex > 0) {
      const previous = database.months[monthIndex - 1];
      const dayAfterPreviousEnd = new Date(`${previous.period.end}T12:00:00`);
      dayAfterPreviousEnd.setDate(dayAfterPreviousEnd.getDate() + 1);
      assert.equal(
        `${dayAfterPreviousEnd.getFullYear()}-${String(dayAfterPreviousEnd.getMonth() + 1).padStart(2, "0")}-${String(dayAfterPreviousEnd.getDate()).padStart(2, "0")}`,
        monthRecord.period.start,
      );
    }
    assert.ok(Array.isArray(monthRecord.additionalIncome));
    for (const income of monthRecord.additionalIncome) {
      assert.ok(!incomeIds.has(income.id));
      incomeIds.add(income.id);
      assert.ok(Number.isFinite(income.amount) && income.amount > 0);
      assert.ok(
        Math.abs(Math.round(income.amount * 100) - income.amount * 100) <
          1e-8,
      );
      assert.ok(["chat", "site"].includes(income.source));
      assert.ok(income.date >= monthRecord.period.start);
      assert.ok(income.date <= monthRecord.period.end);
      assert.equal(typeof income.noteTranslations?.en, "string");
      assert.equal(typeof income.noteTranslations?.ru, "string");
    }
    for (const expense of monthRecord.expenses) {
      assert.ok(!expenseIds.has(expense.id));
      expenseIds.add(expense.id);
      assert.ok(Number.isFinite(expense.amount) && expense.amount > 0);
      assert.ok(
        Math.abs(Math.round(expense.amount * 100) - expense.amount * 100) <
          1e-8,
      );
      assert.ok(supportedCategories.has(expense.category));
      assert.ok(["chat", "site", "receipt"].includes(expense.source));
      assert.ok(["debit", "credit"].includes(expense.paymentMethod));
      assert.ok(expense.date >= monthRecord.period.start);
      assert.ok(expense.date <= monthRecord.period.end);
      if (expense.recurring) assert.equal(expense.frequency, "monthly");
      if (expense.paymentMethod === "credit") {
        assert.ok(["outstanding", "repaid"].includes(expense.creditStatus));
        if (expense.creditStatus === "repaid") assert.match(expense.repaidAt, /^\d{4}-\d{2}-\d{2}$/);
      } else {
        assert.equal(expense.creditStatus, undefined);
        assert.equal(expense.repaidAt, undefined);
      }
    }
  }
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
    if (["2026-07-beer-credit-001", "2026-07-ice-cream-credit-001"].includes(expense.id)) {
      assert.equal(expense.paymentMethod, "credit");
      assert.equal(expense.creditStatus, "repaid");
      assert.equal(expense.repaidAt, "2026-07-25");
    } else {
      assert.equal(expense.paymentMethod, "debit");
      assert.equal(expense.creditStatus, undefined);
    }
  }
  assert.equal(
    current.expenses.find((expense) => expense.id === "2026-07-apple-devices")
      ?.note,
    "Apple Devices",
  );
  assert.equal(
    current.expenses.find((expense) => expense.id === "2026-07-apple-devices")
      ?.amount,
    97,
  );
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-ipad"),
    {
      id: "2026-07-ipad",
      amount: 59,
      note: "iPad",
      noteTranslations: {
        en: "iPad",
        ru: "iPad",
      },
      date: "2026-07-25",
      category: "Devices & installments",
      source: "chat",
      recurring: true,
      frequency: "monthly",
      paymentMethod: "debit",
    },
  );
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-buses"),
    {
      id: "2026-07-buses",
      amount: 38,
      note: "Buses",
      noteTranslations: {
        en: "Buses",
        ru: "Проезд на автобусе",
      },
      date: "2026-07-25",
      category: "Transport & Travel",
      source: "chat",
      recurring: true,
      frequency: "monthly",
      paymentMethod: "debit",
    },
  );
  assert.equal(
    current.expenses.find((expense) => expense.id === "2026-07-chatgpt")
      ?.amount,
    22.99,
  );
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-apartment-debt")
      ?.noteTranslations,
    {
      en: "Mortgage",
      ru: "Ипотека",
    },
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
      amount: 79,
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
      paymentMethod: "debit",
    },
  );
  for (const [id, amount] of [
    ["2026-07-icloud-plus", 2.99],
    ["2026-07-microsoft-365", 13],
    ["2026-07-adobe", 18.3],
    ["2026-07-g-suite", 16.2],
  ]) {
    const expense = current.expenses.find((item) => item.id === id);
    assert.equal(expense?.amount, amount);
    assert.equal(expense?.category, "Subscriptions & services");
    assert.equal(expense?.recurring, true);
    assert.equal(expense?.frequency, "monthly");
  }
  assert.equal(
    current.expenses.find((item) => item.id === "2026-07-mercury-weather"),
    undefined,
  );
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
      paymentMethod: "debit",
      transactionTime: "11:52:56",
      vatRate: 21,
      vatAmount: 1.04,
      receiptPaymentDescription: "Credit card",
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
      paymentMethod: "debit",
      transactionTime: "19:32:26",
      vatRate: 21,
      vatAmount: 0.33,
      containerDeposit: 0.1,
      receiptPaymentDescription: "Contactless debit Mastercard",
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
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-beer-credit-001"),
    {
      id: "2026-07-beer-credit-001",
      amount: 5,
      note: "Beer",
      noteTranslations: { en: "Beer", ru: "Пиво" },
      date: "2026-07-25",
      category: "Alcohol & nightlife",
      source: "chat",
      paymentMethod: "credit",
      creditStatus: "repaid",
      repaidAt: "2026-07-25",
    },
  );
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-ice-cream-credit-001"),
    {
      id: "2026-07-ice-cream-credit-001",
      amount: 2,
      note: "Ice cream",
      noteTranslations: { en: "Ice cream", ru: "Мороженое" },
      date: "2026-07-25",
      category: "Food",
      source: "chat",
      paymentMethod: "credit",
      creditStatus: "repaid",
      repaidAt: "2026-07-25",
    },
  );
  const outstandingCredit = database.months
    .flatMap((month) => month.expenses)
    .filter(
      (expense) =>
        expense.paymentMethod === "credit" && expense.creditStatus !== "repaid",
    )
    .reduce((sum, expense) => sum + expense.amount, 0);
  assert.equal(outstandingCredit, 0);
  assert.deepEqual(
    current.expenses.filter((expense) => [
      "2026-07-beer-debit-002",
      "2026-07-red-wine-001",
      "2026-07-mcdonalds-001",
    ].includes(expense.id)),
    [
      {
        id: "2026-07-beer-debit-002",
        amount: 5,
        note: "Beer",
        noteTranslations: { en: "Beer", ru: "Пиво" },
        date: "2026-07-26",
        category: "Alcohol & nightlife",
        source: "chat",
        paymentMethod: "debit",
      },
      {
        id: "2026-07-red-wine-001",
        amount: 8,
        note: "Red wine",
        noteTranslations: { en: "Red wine", ru: "Красное вино" },
        date: "2026-07-26",
        category: "Alcohol & nightlife",
        source: "chat",
        paymentMethod: "debit",
      },
      {
        id: "2026-07-mcdonalds-001",
        amount: 5.8,
        note: "McDonald's",
        noteTranslations: { en: "McDonald's", ru: "McDonald's" },
        date: "2026-07-26",
        category: "Food",
        source: "chat",
        paymentMethod: "debit",
      },
    ],
  );
  assert.deepEqual(
    current.expenses.find(
      (expense) => expense.id === "2026-07-caffeine-iced-peach-tea-001",
    ),
    {
      id: "2026-07-caffeine-iced-peach-tea-001",
      amount: 3.4,
      note: "Iced peach tea",
      noteTranslations: {
        en: "Iced peach tea",
        ru: "Холодный персиковый чай",
      },
      date: "2026-07-26",
      category: "Food",
      source: "receipt",
      merchant: "Caffeine",
      legalEntity: "UAB Retail Convenience Lithuania",
      merchantAddress: "Vinco Kudirkos g. 1, Vilnius",
      description: "Iced peach tea with packaging fee",
      originalCurrency: "EUR",
      originalAmount: 3.4,
      receiptReference: "47/567/135894",
      paymentMethod: "debit",
      transactionTime: "13:13:10",
      vatRate: 21,
      vatAmount: 0.59,
      packagingFee: 0.1,
      lineItems: [
        { description: "Iced peach tea", amount: 3.3 },
        { description: "Packaging fee", amount: 0.1 },
      ],
      receiptPaymentDescription: "Contactless debit Mastercard",
    },
  );
  assert.deepEqual(
    current.expenses.find(
      (expense) => expense.id === "2026-07-greet-bocmano-usai-ipa-001",
    ),
    {
      id: "2026-07-greet-bocmano-usai-ipa-001",
      amount: 6.12,
      note: "Bočmano Ūsai IPA 0.4 l",
      noteTranslations: {
        en: "Bočmano Ūsai IPA 0.4 l",
        ru: "Bočmano Ūsai IPA, 0,4 л",
      },
      date: "2026-07-26",
      category: "Alcohol & nightlife",
      source: "receipt",
      description: "Bočmano Ūsai IPA 0.4 l with service fee",
      originalCurrency: "EUR",
      originalAmount: 6.12,
      receiptReference: "Order #8",
      paymentMethod: "debit",
      orderingPlatform: "app.greet.menu",
      dateFallbackReason: "No transaction date visible in order confirmation screenshot",
      lineItems: [
        { description: "Bočmano Ūsai IPA 0.4 l", amount: 6 },
        { description: "Service fee", amount: 0.12 },
      ],
      receiptPaymentDescription: "Apple Pay",
    },
  );
  assert.deepEqual(
    current.expenses.find((expense) => expense.id === "2026-07-rimi-alita-spritz-001"),
    {
      id: "2026-07-rimi-alita-spritz-001",
      amount: 1.69,
      note: "Alita Spritz Limon",
      noteTranslations: {
        en: "Alita Spritz Limon",
        ru: "Alita Spritz Limon, 0,2 л",
      },
      date: "2026-07-26",
      category: "Alcohol & nightlife",
      source: "receipt",
      merchant: "Rimi",
      legalEntity: "UAB RIMI LIETUVA",
      merchantAddress: "Rygos g. 8, Vilnius",
      description: "Alita Spritz Limon 8% 0.2 l with refundable metal packaging deposit",
      originalCurrency: "EUR",
      originalAmount: 1.69,
      receiptReference: "13/854/127400",
      paymentMethod: "debit",
      transactionTime: "11:26:35",
      vatRate: 21,
      vatAmount: 0.28,
      containerDeposit: 0.1,
      lineItems: [
        { description: "Alita Spritz Limon 8% 0.2 l", amount: 1.59 },
        { description: "Refundable metal packaging deposit", amount: 0.1 },
      ],
      receiptPaymentDescription: "Contactless debit Mastercard",
    },
  );
  const sumCents = (expenses) =>
    expenses.reduce((sum, expense) => sum + Math.round(expense.amount * 100), 0);
  const spentCents = sumCents(current.expenses);
  const recurringCents = sumCents(current.expenses.filter((expense) => expense.recurring));
  const oneTimeCents = sumCents(current.expenses.filter((expense) => !expense.recurring));
  const syntheticBackfill = current.expenses.filter(
    (expense) => expense.backfillBatch === "2026-07-debit-balance-bootstrap",
  );
  assert.equal(syntheticBackfill.length, 20);
  assert.equal(sumCents(syntheticBackfill), 97903);
  assert.equal(new Set(syntheticBackfill.map((expense) => expense.date)).size, 14);
  for (const expense of syntheticBackfill) {
    assert.equal(expense.synthetic, true);
    assert.equal(expense.source, "chat");
    assert.equal(expense.paymentMethod, "debit");
    assert.equal(expense.recurring, undefined);
    assert.ok(expense.date >= "2026-07-12");
    assert.ok(expense.date <= "2026-07-25");
  }
  assert.equal(spentCents, 196050);
  assert.equal(recurringCents, 93647);
  assert.equal(oneTimeCents, 102403);
  assert.equal(recurringCents + oneTimeCents, spentCents);
  const additionalIncomeCents = sumCents(current.additionalIncome);
  const totalIncomeCents = current.salary * 100 + additionalIncomeCents;
  assert.equal(additionalIncomeCents, 1000);
  assert.equal(totalIncomeCents, 216000);
  assert.deepEqual(current.additionalIncome, [
    {
      id: "2026-07-side-income-001",
      amount: 10,
      note: "Side income",
      noteTranslations: {
        en: "Side income",
        ru: "Дополнительный доход",
      },
      date: "2026-07-26",
      source: "chat",
    },
  ]);
  const cashRemainingCents = totalIncomeCents - spentCents;
  const safeRemainingCents = cashRemainingCents - current.savingsGoal * 100;
  assert.equal(cashRemainingCents, 19950);
  assert.equal(safeRemainingCents, -50);
  const calendarDay = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    return Date.UTC(year, month - 1, day) / 86400000;
  };
  const totalCycleDays = calendarDay(current.period.end) - calendarDay(current.period.start) + 1;
  const elapsedCycleDays = calendarDay("2026-07-26") - calendarDay(current.period.start) + 1;
  const remainingDaysAfterToday = totalCycleDays - elapsedCycleDays;
  assert.equal(totalCycleDays, 33);
  assert.equal(elapsedCycleDays, 17);
  assert.equal(remainingDaysAfterToday, 16);
  assert.equal(Math.round((cashRemainingCents / 100) / remainingDaysAfterToday), 12);
  assert.equal(Math.round(Math.max(safeRemainingCents / 100, 0) / remainingDaysAfterToday), 0);
  assert.equal(Math.round((spentCents / totalIncomeCents) * 100), 91);

  const salaryHistoryScenario = [
    { salary: 2150, additionalIncome: 10, savingsGoal: 200, spent: 1960.5 },
    { salary: 2750, additionalIncome: 0, savingsGoal: 200, spent: 1960.5 },
  ].map((cycle) => ({
    cashRemaining: Math.round((cycle.salary + cycle.additionalIncome - cycle.spent) * 100) / 100,
    safeRemaining: Math.round((cycle.salary + cycle.additionalIncome - cycle.spent - cycle.savingsGoal) * 100) / 100,
    usedPercent: (cycle.spent / (cycle.salary + cycle.additionalIncome)) * 100,
  }));
  assert.deepEqual(salaryHistoryScenario.map(({ cashRemaining }) => cashRemaining), [199.5, 789.5]);
  assert.deepEqual(salaryHistoryScenario.map(({ safeRemaining }) => safeRemaining), [-0.5, 589.5]);
  assert.ok(salaryHistoryScenario[1].usedPercent < salaryHistoryScenario[0].usedPercent);
  for (const expense of current.expenses) {
    assert.equal(typeof expense.noteTranslations?.en, "string");
    assert.equal(typeof expense.noteTranslations?.ru, "string");
    assert.ok(expense.noteTranslations.en.length > 0);
    assert.ok(expense.noteTranslations.ru.length > 0);
  }

  for (const source of [page, script]) {
    assert.match(source, /noteTranslations/);
    assert.match(source, /Spending insight/);
    assert.match(source, /Анализ расходов/);
    assert.match(source, /Transport & Travel/);
    assert.match(source, /Транспорт и путешествия/);
    assert.match(source, /Alcohol & nightlife/);
    assert.match(source, /Алкоголь и ночная жизнь/);
    assert.match(source, /Expected monthly expenses/);
    assert.match(source, /Плановые ежемесячные расходы/);
    assert.match(source, /SALARY THIS CYCLE/);
    assert.match(source, /ЗАРПЛАТА ЗА ЭТОТ ЦИКЛ/);
    assert.match(source, /ДОПОЛНИТЕЛЬНЫЕ ДОХОДЫ/);
    assert.match(source, /ОБЩИЙ ДОХОД/);
    assert.doesNotMatch(source, /Expected monthly total/);
    assert.match(source, /effectiveSalaryDate/);
    assert.match(source, /previousFriday/);
    assert.match(source, /SALARY CYCLE|Salary cycle/);
    assert.doesNotMatch(source, /comparisonUnavailable/);
    assert.match(source, /savingsMore/);
    assert.match(source, /spendingLess/);
    assert.match(source, /selectedIndex - 3/);
    assert.match(source, /nier-automata/);
    assert.match(source, /tohsaka-rin/);
    assert.match(source, /kinance-moon/);
    assert.match(source, /kinance_theme/);
    assert.match(source, /kinance_language/);
    assert.match(source, /SameSite=Lax/);
    assert.match(source, /Max-Age=/);
    assert.match(source, /document\.documentElement\.lang = language/);
    assert.doesNotMatch(source, /localStorage\.(?:getItem|setItem)\("kinance:(?:theme|language)/);
    assert.match(source, /outstandingCredit/);
    assert.match(source, /paymentMethod/);
    assert.match(source, /creditStatus !== "repaid"/);
    assert.match(source, /todayInVilnius/);
    assert.match(source, /timeZone:\s*"Europe\/Vilnius"/);
    assert.match(source, /sumExpenses/);
    assert.match(source, /toCents/);
    assert.doesNotMatch(source, /parseExpenseAmount/);
    assert.match(source, /visualSpentPercent/);
    assert.match(source, /noSpendingBudget/);
    assert.match(source, /expenseDay <= elapsed/);
    assert.doesNotMatch(source, /localStorage/);
    assert.doesNotMatch(source, /const TODAY\s*=/);
  }
  assert.match(index, /id="theme-select"/);
  assert.match(index, /<html lang="ru">/);
  assert.match(index, /styles\.css\?v=47/);
  assert.match(index, /public\/vendor\/apexcharts\.min\.js\?v=21/);
  assert.match(index, /script\.js\?v=52/);
  assert.match(index, /id="strength-pull-ups-target"/);
  assert.match(index, /id="strength-push-ups-target"/);
  assert.match(index, /rank-icons\/rank-insignia-atlas\.png\?v=1/);
  assert.match(index, /class="strength-metrics-row"/);
  assert.match(index, /<button class="strength-rank" id="strength-rank" type="button">/);
  assert.match(index, /data-current-theme="kinance"/);
  assert.match(index, /id="credit-alert"[^>]*hidden/);
  assert.doesNotMatch(index, /id="payment-method"/);
  assert.doesNotMatch(index, /id="expense-form"/);
  assert.doesNotMatch(index, /id="strength-form"/);
  assert.doesNotMatch(index, /class="add-panel"/);
  assert.doesNotMatch(index, /class="editable-value"/);
  assert.match(index, /id="savings-value" class="fixed-stat-value"/);
  assert.match(index, /id="theme-banner-image"/);
  assert.doesNotMatch(index, /class="hero-copy"/);
  assert.doesNotMatch(index, /class="hero-intro"/);
  assert.match(index, /<h1 id="page-title"[^>]*data-i18n="availableAfterPlan"/);
  assert.match(index, /public\/theme-banners\/kinance\.png\?v=7/);
  assert.equal((script.match(/public\/theme-banners\/kinance\.png\?v=7/g) ?? []).length, 2);
  assert.equal((page.match(/theme-banners\/kinance\.png\?v=7/g) ?? []).length, 2);
  assert.equal((script.match(/public\/theme-banners\/kinance-frame-2\.png\?v=7/g) ?? []).length, 2);
  assert.equal((page.match(/theme-banners\/kinance-frame-2\.png\?v=7/g) ?? []).length, 2);
  assert.match(script, /id: "kinance-moon", label: "Kinance Moon"/);
  assert.match(page, /id: "kinance-moon", label: "Kinance Moon"/);
  assert.match(script, /public\/theme-banners\/nier-automata\.png\?v=2/);
  assert.match(script, /public\/theme-banners\/tohsaka-rin\.png\?v=2/);
  assert.match(script, /public\/category-icons\/food\.png/);
  assert.match(script, /public\/category-icons\/alcohol-nightlife\.png/);
  assert.match(script, /category-icons\/food\.png\?v=5/);
  assert.match(script, /category-icons\/subscriptions-services\.png\?v=5/);
  assert.match(script, /const KINANCE_CATEGORY_ICONS/);
  assert.match(script, /const CHARACTER_CATEGORY_ICON_POOLS/);
  assert.match(script, /function categoryIconFor\(expense\)/);
  assert.match(script, /Math\.imul\(hash, 16777619\)/);
  for (const source of [page]) {
    assert.match(source, /themeBannerLabel/);
    assert.match(source, /theme-banners\/kinance\.png/);
    assert.match(source, /theme-banners\/nier-automata\.png/);
    assert.match(source, /theme-banners\/tohsaka-rin\.png/);
    assert.match(source, /category-icons\/food\.png/);
    assert.match(source, /category-icons\/alcohol-nightlife\.png/);
    assert.match(source, /category-icons\/food\.png\?v=5/);
    assert.match(source, /category-icons\/subscriptions-services\.png\?v=5/);
    assert.match(source, /const KINANCE_CATEGORY_ICONS/);
    assert.match(source, /const CHARACTER_CATEGORY_ICON_POOLS/);
    assert.match(source, /function categoryIconFor\(expense: Expense, selectedTheme: ThemeId\)/);
    assert.match(source, /Math\.imul\(hash, 16777619\)/);
    assert.doesNotMatch(source, /className="hero-copy"/);
    assert.doesNotMatch(source, /className="hero-intro"/);
  }
  assert.equal((script.match(/category-icons\/[\w-]+\.png\?v=5/g) ?? []).length, 7);
  assert.equal((page.match(/category-icons\/[\w-]+\.png\?v=5/g) ?? []).length, 7);
  assert.equal((script.match(/category-icons\/[\w-]+\.png\?v=1/g) ?? []).length, 21);
  assert.equal((page.match(/category-icons\/[\w-]+\.png\?v=1/g) ?? []).length, 21);
  assert.equal((script.match(/category-icons\/[\w-]+\.png\?v=2/g) ?? []).length, 0);
  assert.equal((page.match(/category-icons\/[\w-]+\.png\?v=2/g) ?? []).length, 0);
  for (const filename of [
    "food.png",
    "subscriptions-services.png",
    "luxury-purchases.png",
    "debt-repayments.png",
    "devices-installments.png",
    "transport-travel.png",
    "alcohol-nightlife.png",
    "food-kohaku.png",
    "food-soujuurou.png",
    "subscriptions-bb.png",
    "subscriptions-sion.png",
    "luxury-nero.png",
    "luxury-alice.png",
    "debt-mash.png",
    "debt-shiki-ryougi.png",
    "devices-ciel.png",
    "devices-touko.png",
    "transport-arcueid.png",
    "transport-shiki-tohno.png",
    "alcohol-shuten.png",
    "alcohol-aoko.png",
    "food-rpg.png",
    "services-rpg.png",
    "luxury-rpg.png",
    "debt-rpg.png",
    "devices-rpg.png",
    "transport-rpg.png",
    "alcohol-rpg.png",
  ]) {
    const icon = await readFile(
      new URL(`../public/category-icons/${filename}`, import.meta.url),
    );
    assert.equal(icon.subarray(1, 4).toString("ascii"), "PNG");
  }
  for (const filename of [
    "rank-insignia-atlas.png",
    "rank-insignia-modern-russia.png",
    "rank-insignia-france.png",
    "rank-insignia-britain.png",
    "rank-insignia-china.png",
    "rank-insignia-japan.png",
    "rank-insignia-germany.png",
    "rank-insignia-italy.png",
    "rank-insignia-poland.png",
    "rank-insignia-south-korea.png",
  ]) {
    const rankAtlas = await readFile(
      new URL(`../public/rank-icons/${filename}`, import.meta.url),
    );
    assert.equal(rankAtlas.subarray(1, 4).toString("ascii"), "PNG");
  }
  assert.match(styles, /\.theme-banner\s*\{/);
  assert.match(styles, /@keyframes credit-alert-pulse/);
  assert.match(styles, /\.payment-badge\.credit-outstanding/);
  assert.match(styles, /prefers-reduced-motion[\s\S]*\.credit-alert[\s\S]*animation:\s*none/);
  assert.match(styles, /\.theme-banner img\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(styles, /\.theme-banner\s*\{[^}]*background:\s*transparent/s);
  assert.match(styles, /\.theme-banner\s*\{[^}]*left:\s*50%[^}]*width:\s*var\(--app-viewport-width\)/s);
  assert.match(styles, /\.theme-banner\s*\{[^}]*transform:\s*translateX\(-50%\)/s);
  assert.doesNotMatch(styles, /\.daily-chart-panel\s*\{/);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*left:\s*50%[^}]*width:\s*var\(--app-viewport-width\)/s);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*height:\s*168px[^}]*min-height:\s*168px/s);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*margin:\s*-168px 0 18px/s);
  assert.match(styles, /@media \(min-width:\s*0px\)[\s\S]*\.daily-expense-chart\s*\{[^}]*margin-top:\s*-168px/s);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*transform:\s*translateX\(-50%\)/s);
  assert.match(styles, /\.progress-ring\s*\{[^}]*--safe-spent-end:\s*0deg[^}]*--spent-end:\s*0deg[^}]*--savings-start:\s*360deg/s);
  assert.match(styles, /var\(--green\) 0 var\(--safe-spent-end\)/);
  assert.match(styles, /var\(--red\) var\(--safe-spent-end\) var\(--spent-end\)/);
  assert.match(styles, /rgba\(118, 118, 128, 0\.28\) var\(--spent-end\) 360deg/);
  assert.match(styles, /\.progress-threshold\s*\{[^}]*conic-gradient\([^}]*from var\(--savings-start\)/s);
  assert.match(styles, /\.progress-threshold\s*\{[^}]*mask:\s*radial-gradient/s);
  assert.match(styles, /\.balance-safe-caption b\.is-negative\s*\{[^}]*color:\s*var\(--red\)/s);
  assert.match(index, /class="progress-threshold"/);
  for (const source of [script, page]) {
    assert.match(source, /safeSpendingLimitPercent/);
    assert.match(source, /safeSpentEndDegrees/);
    assert.match(source, /savingsUsed/);
    assert.match(source, /savingsViolated|savings-violated/);
  }
  assert.match(styles, /\.pace-limit-all strong\s*\{[^}]*color:\s*var\(--red\)/s);
  assert.match(styles, /\.pace-limit-safe strong\s*\{[^}]*color:\s*var\(--green\)/s);
  assert.match(styles, /\.expense-category-icon\s*\{[^}]*width:\s*48px[^}]*height:\s*48px/s);
  assert.match(styles, /\.expense-category-icon img\s*\{[^}]*image-rendering:\s*pixelated/s);
  assert.match(styles, /\.breakdown-bar\s*\{[^}]*height:\s*16px/s);
  assert.match(styles, /\.breakdown-legend\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*wrap/s);
  assert.doesNotMatch(styles, /\.breakdown-item\s*\{[^}]*background:/s);
  assert.doesNotMatch(styles, /\.expense-monogram/);
  assert.match(styles, /--chart-accent:\s*#5ac8fa/);
  assert.match(styles, /--focus-ring:\s*#4ba3ff/);
  assert.match(styles, /--timeline-start:\s*#0a84ff/);
  assert.match(styles, /--bar-divider:\s*#111113/);
  assert.match(styles, /:root\[data-theme="kinance-moon"\]\s*\{[^}]*--focus-ring:\s*#8c9dff[^}]*--timeline-start:\s*#6f9cff/s);
  assert.match(styles, /:root\[data-theme="nier-automata"\]\s*\{[^}]*--tertiary:\s*#607178[^}]*--bar-divider:\s*#d5dfe2/s);
  assert.match(styles, /:root\[data-theme="tohsaka-rin"\]\s*\{[^}]*--timeline-start:\s*#c91d49[^}]*--bar-divider:\s*#160a1b/s);
  assert.match(styles, /\.timeline-track span\s*\{[^}]*var\(--timeline-start\)[^}]*var\(--timeline-end\)/s);
  assert.match(styles, /\.timeline-copy strong\s*\{[^}]*color:\s*var\(--timeline-label\)/s);
  assert.match(styles, /\.breakdown-bar\s*\{[^}]*border:\s*2px solid var\(--bar-divider\)/s);
  assert.match(styles, /\.expense-table-summary:focus-visible\s*\{[^}]*var\(--focus-ring\)/s);
  assert.match(styles, /data-theme="nier-automata"\]\s+\.stat-card:hover\s*\{[^}]*background-color:\s*rgba\(255, 255, 255, 0\.94\)/s);
  assert.match(styles, /data-theme="tohsaka-rin"\]\s+\.balance-card\s*\{[^}]*rgba\(229, 42, 85, 0\.2\)/s);
  assert.match(styles, /@media \(min-width:\s*0px\)[\s\S]*\.balance-main\s*\{[^}]*gap:\s*12px/s);
  assert.match(styles, /\.balance-main > div:first-child\s*\{[^}]*min-width:\s*0/s);
  assert.doesNotMatch(styles, /text-shadow:/);
  assert.doesNotMatch(styles, /var\(--accent\)/);
  assert.match(styles, /data-current-theme="kinance-moon"/);
  assert.match(styles, /:root\[data-theme="nier-automata"\][^{]*\{[^}]*--chart-accent:\s*#526f78/s);
  assert.match(styles, /:root\[data-theme="tohsaka-rin"\][^{]*\{[^}]*--chart-accent:\s*#ff5b82/s);
  assert.match(script, /height:\s*168/);
  assert.match(script, /stroke:\s*\{\s*curve:\s*\["straight",\s*"straight",\s*"smooth"\],\s*width:\s*\[0,\s*0,\s*2\.5\]/);
  assert.match(script, /allowance-guide-all-label/);
  assert.match(script, /allowance-guide-safe-label/);
  assert.match(page, /height:\s*168/);
  assert.match(page, /stroke:\s*\{\s*curve:\s*\["straight",\s*"straight",\s*"smooth"\],\s*width:\s*\[0,\s*0,\s*2\.5\]/);
  for (const source of [script, page]) {
    assert.match(source, /relativeStrengthScore/);
    assert.match(source, /relativeStrengthTargets/);
    assert.match(source, /relativeStrengthRank/);
    assert.match(source, /STRENGTH_RANKS/);
    assert.match(source, /threshold:\s*9\.8,\s*abbreviation:\s*"Lt\. Gen\."/);
    assert.match(source, /dailyStrengthPoints/);
    assert.match(source, /strength-history\.json/);
    assert.match(source, /type:\s*"column"/);
    assert.match(source, /type:\s*"line"/);
    assert.match(source, /min:\s*1,\s*max:\s*10/);
    assert.match(source, /allowanceGuide/);
    assert.match(source, /STRENGTH_ALLOMETRIC_EXPONENT = 1 \/ 3/);
    assert.match(source, /STRENGTH_PULL_UP_TARGET_REPS = 20/);
    assert.match(source, /STRENGTH_PUSH_UP_TARGET_REPS = 50/);
    assert.match(source, /Math\.ceil\(STRENGTH_PULL_UP_TARGET_REPS \/ massAdjustment/);
    assert.match(source, /Math\.ceil\(STRENGTH_PUSH_UP_TARGET_REPS \/ massAdjustment/);
    assert.match(source, /safePullUps \* massAdjustment/);
    assert.match(source, /safePushUps \* massAdjustment/);
    assert.match(source, /\(pullComponent \+ pushComponent\) \/ 2/);
    assert.doesNotMatch(source, /\* 0\.6 \+ pushComponent \* 0\.4|\*\* 0\.12/);
    assert.match(source, /savingsSafeTop - allFundsTop < 12/);
  }
  assert.match(styles, /\.allowance-guide\s*\{/);
  assert.match(styles, /\.allowance-guide i\s*\{/);
  assert.match(styles, /\.allowance-guide i:first-child\s*\{[^}]*flex:\s*0 0 24px/s);
  assert.match(styles, /\.allowance-guide span\s*\{[^}]*text-align:\s*left/s);
  assert.match(styles, /\.strength-panel\s*\{/);
  assert.match(styles, /--app-viewport-width:\s*min\(100vw, 430px\)/);
  assert.match(styles, /main\s*\{[^}]*width:\s*var\(--app-viewport-width\)[^}]*margin-inline:\s*auto/s);
  assert.match(styles, /\.strength-metrics-row\s*\{[^}]*grid-template-columns:\s*80px minmax\(0, 1fr\)/s);
  assert.match(styles, /\.strength-metrics\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(styles, /\.strength-rank\s*\{[^}]*border:\s*0[^}]*background:\s*transparent[^}]*padding:\s*0/s);
  assert.match(styles, /\.strength-rank-icon\s*\{[^}]*width:\s*76px[^}]*height:\s*76px[^}]*background-size:\s*500% 400%[^}]*image-rendering:\s*pixelated/s);
  assert.doesNotMatch(styles, /\.strength-rank::after/);
  assert.doesNotMatch(styles, /\.strength-metrics\s*>\s*\.strength-rank/);
  for (const source of [script, page]) {
    assert.match(source, /const RANK_INSIGNIA_SETS/);
    assert.match(source, /kinance_rank_insignia_set/);
    assert.match(source, /rank-insignia-south-korea\.png/);
    assert.match(source, /writePreferenceCookie\(RANK_INSIGNIA_COOKIE/);
  }
  assert.doesNotMatch(styles, /\.allowance-guide-label/);
  assert.doesNotMatch(styles, /\.apexcharts-yaxis-annotations rect\s*\{/);
  assert.match(styles, /\.salary-locked\s*\{/);
  assert.match(styles, /\.stat-card\.salary-locked\s*\{[^}]*align-self:\s*start/s);
  assert.match(styles, /\.stat-card\.salary-locked\s*\{[^}]*min-height:\s*0/s);
  assert.match(index, /id="salary-value"/);
  assert.doesNotMatch(index, /id="salary"/);
  assert.doesNotMatch(script, /element\("salary"\)\.addEventListener/);
  assert.match(script, /financeDataForMonth/);
  assert.match(script, /salary:\s*safeNumber\(month\.salary\)/);
  assert.match(page, /financeDataForMonth/);
  assert.match(page, /salary:\s*safeMoney\(month\.salary\)/);
  for (const source of [page, script]) {
    assert.doesNotMatch(source, /localStorage/);
    assert.doesNotMatch(source, /expense-form|strength-form|editable-value/);
  }
  assert.match(page, /import strengthHistoryJson from "@\/data\/strength-history\.json"/);
  assert.match(script, /fetch\("\/data\/strength-history\.json"/);
  for (const source of [page, script]) {
    assert.match(source, /dailyExpensePoints/);
    assert.match(source, /type:\s*"column"/);
    assert.match(source, /type:\s*"datetime"/);
    assert.match(source, /sparkline:\s*\{\s*enabled:\s*true/);
    assert.match(source, /tooltip:\s*\{\s*enabled:\s*false/);
    assert.match(source, /fill:\s*\{\s*opacity:\s*\[0\.68,\s*0\.84,\s*1\]/);
    assert.doesNotMatch(source, /dropShadow/);
    assert.match(source, /data\.expenses\.filter\(\(expense\) => !expense\.recurring\)/);
    assert.match(source, /paymentMethod && \(expense\.paymentMethod \?\? "debit"\) !== paymentMethod/);
    assert.match(source, /"credit"/);
    assert.match(source, /stacked:\s*true/);
    assert.match(source, /stackOnlyBar:\s*true/);
    assert.match(source, /seriesName:[\s\S]{0,120}min:\s*0,[\s\S]{0,80}max:\s*(?:drawChartMaximum|chartMaximum)/);
    assert.match(source, /creditStatus !== "repaid"/);
  }
  assert.doesNotMatch(index, /class="(?:spending|credit)-key"/);
  assert.doesNotMatch(styles, /\.(?:spending|credit)-key\s*\{/);
  for (const source of [script, page]) {
    assert.match(source, /spendingInsight/);
    assert.match(source, /pointerdown/);
    assert.match(source, /event\.key === "Escape"/);
  }
  assert.doesNotMatch(styles, /--chart-glow|drop-shadow\(0 0|text-shadow:\s*0 0/);
  assert.match(script, /window\.setInterval[\s\S]{0,180}1000/);
  assert.match(page, /window\.setInterval[\s\S]{0,180}1000/);
  assert.match(script, /prefers-reduced-motion:\s*reduce/);
  assert.match(page, /import\("apexcharts"\)/);
  assert.match(page, /new Intl\.NumberFormat\(locale/);
  assert.match(styles, /:root\[data-theme="nier-automata"\]/);
  assert.match(styles, /:root\[data-theme="tohsaka-rin"\]/);
  assert.match(
    styles,
    /:root\[data-theme="nier-automata"\]\s*\{[^}]*color-scheme:\s*light/s,
  );
  assert.match(
    styles,
    /:root\[data-theme="nier-automata"\]\s*\{[^}]*--canvas:\s*#e7eff1/s,
  );
  assert.match(styles, /\.workspace\s*\{[^}]*align-items:\s*start/s);
  assert.match(styles, /\.ledger-stack\s*\{[^}]*grid-auto-rows:\s*max-content/s);
  assert.match(styles, /\.ledger-stack\s*\{[^}]*align-content:\s*start/s);
  assert.match(styles, /\.expense-table\s*\{[^}]*align-self:\s*start/s);
  assert.doesNotMatch(styles, /\.category-strip/);
  assert.doesNotMatch(styles, /\.recurring-total/);
  assert.match(script, /nav\.hidden\s*=\s*history\.length\s*<\s*2/);
  assert.doesNotMatch(script, /expense\.recurring\s*\?/);
  assert.doesNotMatch(page, /expense\.recurring\s*\?/);
});
