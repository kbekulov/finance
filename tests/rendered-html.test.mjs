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
  assert.match(html, /aria-label="Theme"/);
  assert.match(html, /NieR:Automata/);
  assert.match(html, /Tohsaka Rin/);
  assert.doesNotMatch(html, /—|&mdash;|&#8212;|&#x2014;/i);
  assert.match(html, /kinance-favicon\.jpg/i);
  assert.match(html, />kinance<\/span>/i);
  assert.doesNotMatch(html, />euroscope<\/span>/i);
  assert.match(html, /class="spending-alert"/);
  assert.doesNotMatch(html, /class="credit-alert"/);
  assert.match(html, /class="payment-badge debit"/);
  assert.match(html, /class="payment-badge credit-repaid"/);
  assert.doesNotMatch(html, /class="payment-badge credit-outstanding"/);
  assert.match(html, /Spending alert/);
  assert.match(html, /Debt &amp; repayments is your largest cost at €555\.00/);
  assert.match(html, /Apple Devices/);
  assert.match(html, /iPad/);
  assert.match(html, /Updated 26 July 2026/);
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
    new RegExp(`Today<!-- --> · <!-- -->${vilniusDateParts.day} Jul`),
  );
  assert.match(html, /10 Jul/i);
  assert.match(html, /11 Aug/i);
  assert.match(html, /<h1 id="page-title">DEBIT BALANCE<\/h1>/);
  assert.doesNotMatch(html, /Past 3-cycle comparison appears when history is available/);
  assert.match(html, /on card until next salary/);
  assert.match(html, /Buses/);
  assert.match(html, /Transport &amp; Travel/);
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
  assert.match(html, /One-time expenses/);
  assert.match(html, /€994\.02/);
  assert.match(html, /Expected monthly expenses/);
  assert.equal((html.match(/Expected monthly expenses/g) ?? []).length, 1);
  assert.doesNotMatch(html, /Expected monthly total/);
  assert.doesNotMatch(html, /class="recurring-total"/);
  assert.doesNotMatch(html, /class="category-strip"/);
  assert.doesNotMatch(html, /class="month-history"/);
  assert.match(html, /€936\.47/);
  assert.match(html, /One-time expenses/);
  assert.match(html, /Gaming laptop/);
  assert.match(html, /Mortgage/);
  assert.doesNotMatch(html, /Apartment debt/);
  assert.match(html, /Keturi vėjai 0\.4 l/);
  assert.match(html, /Shelton&#x27;s pear cider/);
  assert.match(html, /Alcohol &amp; nightlife/);
  assert.match(html, /€1,930\.49/);
  assert.match(html, /€219\.51/);
  assert.match(html, /€19\.51/);
  assert.match(html, /90%<!-- --> <!-- -->SPENT|90% SPENT/);
  assert.match(html, /All funds/);
  assert.match(html, /Savings safe/);
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
  const renderedAllFundsPace = Math.round(219.51 / renderedRemainingDays);
  const renderedSavingsSafePace = Math.round(19.51 / renderedRemainingDays);
  assert.match(
    html,
    new RegExp(`€${renderedAllFundsPace}(?:<!-- --> <!-- -->)?/ day`),
  );
  assert.match(
    html,
    new RegExp(`€${renderedSavingsSafePace}(?:<!-- --> <!-- -->)?/ day`),
  );
  assert.match(html, /Beer/);
  assert.match(html, /Ice cream/);
  assert.match(html, /class="stat-card salary salary-locked"/);
  assert.match(html, /SALARY THIS CYCLE/);
  assert.match(html, /Locked to this salary cycle/);
  assert.doesNotMatch(html, /Monthly salary in euros[^<]*<\/span>\s*<span[^>]*>€<\/span>\s*<input/s);
  assert.doesNotMatch(html, /class="daily-chart-panel"/);
  assert.match(html, /class="daily-expense-chart"/);
  assert.match(html, /class="expense-category-icon"/);
  assert.match(html, /category-icons\/debt-repayments\.png/);
  assert.doesNotMatch(html, /class="expense-monogram"/);
  assert.match(html, /aria-label="Daily non-recurring expense movement"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps database history and translations aligned", async () => {
  const [databaseText, page, script, styles, index, manual] = await Promise.all([
    readFile(new URL("../data/finance-history.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../script.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);
  const database = JSON.parse(databaseText);
  const current = database.months.at(-1);

  assert.equal(database.maxMonths, 12);
  assert.equal(database.version, 5);
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
  assert.match(manual, /category-specific transparent Fate\/stay night chibi PNG/);
  assert.match(manual, /Every expense-recording request that adds at least one new canonical expense/);
  assert.match(manual, /Generate one fresh banner per request/);
  assert.match(manual, /increment the Kinance banner query version in `index\.html`, `script\.js`, and `app\/page\.tsx`/);
  assert.match(manual, /Finance accuracy takes priority/);
  assert.match(manual, /Taiga Fujimura as a curry-shop cook hugging a giant curry platter for Food/);
  assert.match(manual, /Lancer Cu Chulainn as a pub tapmaster hoisting a ruby beer stein for Alcohol & nightlife/);
  assert.match(manual, /create new concepts from a blank canvas instead of tracing an older icon/);
  assert.match(manual, /sits entirely over the lower 168 pixels of the character artwork/);
  assert.equal(current.updatedAt, "2026-07-26");
  assert.equal(current.revision, 24);
  assert.equal(current.savingsGoal, 200);
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
        ru: "Автобусы",
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
  assert.equal(spentCents, 193049);
  assert.equal(recurringCents, 93647);
  assert.equal(oneTimeCents, 99402);
  assert.equal(recurringCents + oneTimeCents, spentCents);
  const cashRemainingCents = current.salary * 100 - spentCents;
  const safeRemainingCents = cashRemainingCents - current.savingsGoal * 100;
  assert.equal(cashRemainingCents, 21951);
  assert.equal(safeRemainingCents, 1951);
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
  assert.equal(Math.round((cashRemainingCents / 100) / remainingDaysAfterToday), 14);
  assert.equal(Math.round((safeRemainingCents / 100) / remainingDaysAfterToday), 1);
  assert.equal(Math.round((spentCents / (current.salary * 100)) * 100), 90);

  const salaryHistoryScenario = [
    { salary: 2150, savingsGoal: 200, spent: 1930.49 },
    { salary: 2750, savingsGoal: 200, spent: 1930.49 },
  ].map((cycle) => ({
    cashRemaining: Math.round((cycle.salary - cycle.spent) * 100) / 100,
    safeRemaining: Math.round((cycle.salary - cycle.spent - cycle.savingsGoal) * 100) / 100,
    usedPercent: (cycle.spent / cycle.salary) * 100,
  }));
  assert.deepEqual(salaryHistoryScenario.map(({ cashRemaining }) => cashRemaining), [219.51, 819.51]);
  assert.deepEqual(salaryHistoryScenario.map(({ safeRemaining }) => safeRemaining), [19.51, 619.51]);
  assert.ok(salaryHistoryScenario[1].usedPercent < salaryHistoryScenario[0].usedPercent);
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
    assert.match(source, /Expected monthly expenses/);
    assert.match(source, /Ожидаемые ежемесячные расходы/);
    assert.match(source, /SALARY THIS CYCLE/);
    assert.match(source, /ДОХОД В ЭТОМ ЦИКЛЕ/);
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
    assert.match(source, /kinance:theme/);
    assert.match(source, /outstandingCredit/);
    assert.match(source, /paymentMethod/);
    assert.match(source, /creditStatus !== "repaid"/);
    assert.match(source, /todayInVilnius/);
    assert.match(source, /timeZone:\s*"Europe\/Vilnius"/);
    assert.match(source, /sumExpenses/);
    assert.match(source, /toCents/);
    assert.match(source, /parseExpenseAmount/);
    assert.match(source, /visualSpentPercent/);
    assert.match(source, /noSpendingBudget/);
    assert.match(source, /expenseDay <= elapsed/);
    assert.match(source, /creditStatus: "outstanding"/);
    assert.doesNotMatch(source, /const TODAY\s*=/);
  }
  assert.match(index, /id="theme-select"/);
  assert.match(index, /styles\.css\?v=36/);
  assert.match(index, /public\/vendor\/apexcharts\.min\.js\?v=21/);
  assert.match(index, /script\.js\?v=36/);
  assert.match(index, /data-current-theme="kinance"/);
  assert.match(index, /id="credit-alert"[^>]*hidden/);
  assert.match(index, /id="payment-method"/);
  assert.match(index, /option value="debit"/);
  assert.match(index, /option value="credit"/);
  assert.match(index, /id="theme-banner-image"/);
  assert.doesNotMatch(index, /class="hero-copy"/);
  assert.doesNotMatch(index, /class="hero-intro"/);
  assert.match(index, /<h1 id="page-title"[^>]*data-i18n="availableAfterPlan"/);
  assert.match(index, /public\/theme-banners\/kinance\.png/);
  assert.match(script, /public\/theme-banners\/kinance\.png/);
  assert.match(script, /public\/theme-banners\/nier-automata\.png/);
  assert.match(script, /public\/theme-banners\/tohsaka-rin\.png/);
  assert.match(script, /public\/category-icons\/food\.png/);
  assert.match(script, /public\/category-icons\/alcohol-nightlife\.png/);
  assert.match(script, /category-icons\/food\.png\?v=5/);
  assert.match(script, /category-icons\/subscriptions-services\.png\?v=5/);
  for (const source of [page]) {
    assert.match(source, /themeBannerLabel/);
    assert.match(source, /theme-banners\/kinance\.png/);
    assert.match(source, /theme-banners\/nier-automata\.png/);
    assert.match(source, /theme-banners\/tohsaka-rin\.png/);
    assert.match(source, /category-icons\/food\.png/);
    assert.match(source, /category-icons\/alcohol-nightlife\.png/);
    assert.match(source, /category-icons\/food\.png\?v=5/);
    assert.match(source, /category-icons\/subscriptions-services\.png\?v=5/);
    assert.doesNotMatch(source, /className="hero-copy"/);
    assert.doesNotMatch(source, /className="hero-intro"/);
  }
  assert.equal((script.match(/category-icons\/[\w-]+\.png\?v=5/g) ?? []).length, 7);
  assert.equal((page.match(/category-icons\/[\w-]+\.png\?v=5/g) ?? []).length, 7);
  for (const filename of [
    "food.png",
    "subscriptions-services.png",
    "luxury-purchases.png",
    "debt-repayments.png",
    "devices-installments.png",
    "transport-travel.png",
    "alcohol-nightlife.png",
  ]) {
    const icon = await readFile(
      new URL(`../public/category-icons/${filename}`, import.meta.url),
    );
    assert.equal(icon.subarray(1, 4).toString("ascii"), "PNG");
  }
  assert.match(styles, /\.theme-banner\s*\{/);
  assert.match(styles, /@keyframes credit-alert-pulse/);
  assert.match(styles, /\.payment-badge\.credit-outstanding/);
  assert.match(styles, /prefers-reduced-motion[\s\S]*\.credit-alert[\s\S]*animation:\s*none/);
  assert.match(styles, /\.theme-banner img\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(styles, /\.theme-banner\s*\{[^}]*background:\s*transparent/s);
  assert.match(styles, /\.theme-banner\s*\{[^}]*left:\s*50%[^}]*width:\s*100vw/s);
  assert.match(styles, /\.theme-banner\s*\{[^}]*transform:\s*translateX\(-50%\)/s);
  assert.doesNotMatch(styles, /\.daily-chart-panel\s*\{/);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*left:\s*50%[^}]*width:\s*100vw/s);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*height:\s*168px[^}]*min-height:\s*168px/s);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*margin:\s*-168px 0 18px/s);
  assert.match(styles, /@media \(max-width:\s*640px\)[\s\S]*\.daily-expense-chart\s*\{[^}]*margin-top:\s*-168px/s);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*transform:\s*translateX\(-50%\)/s);
  assert.match(styles, /\.progress-ring\s*\{[^}]*--spent-end:\s*0deg[^}]*--savings-start:\s*360deg/s);
  assert.match(styles, /var\(--red\) var\(--savings-start\) 360deg/);
  assert.match(styles, /\.pace-limit-all strong\s*\{[^}]*color:\s*var\(--red\)/s);
  assert.match(styles, /\.pace-limit-safe strong\s*\{[^}]*color:\s*var\(--green\)/s);
  assert.match(styles, /\.expense-category-icon\s*\{[^}]*width:\s*48px[^}]*height:\s*48px/s);
  assert.match(styles, /\.breakdown-bar\s*\{[^}]*height:\s*16px/s);
  assert.match(styles, /\.breakdown-legend\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*wrap/s);
  assert.doesNotMatch(styles, /\.breakdown-item\s*\{[^}]*background:/s);
  assert.doesNotMatch(styles, /\.expense-monogram/);
  assert.match(styles, /--chart-accent:\s*#5ac8fa/);
  assert.match(styles, /:root\[data-theme="nier-automata"\][^{]*\{[^}]*--chart-accent:\s*#526f78/s);
  assert.match(styles, /:root\[data-theme="tohsaka-rin"\][^{]*\{[^}]*--chart-accent:\s*#ff5b82/s);
  assert.match(script, /height:\s*168/);
  assert.match(script, /stroke:\s*\{\s*curve:\s*"smooth",\s*width:\s*2\.25/);
  assert.match(page, /height:\s*168/);
  assert.match(page, /stroke:\s*\{\s*curve:\s*"smooth",\s*width:\s*2\.25/);
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
    assert.match(source, /JSON\.stringify\(\{[\s\S]*savingsGoal:[\s\S]*expenses:/);
    assert.doesNotMatch(source, /JSON\.stringify\(\{[\s\S]{0,240}salary:/);
    assert.doesNotMatch(source, /JSON\.stringify\(data\)/);
  }
  assert.match(page, /hydratedStorageKey !== selectedStorageKey/);
  for (const source of [page, script]) {
    assert.match(source, /dailyExpensePoints/);
    assert.match(source, /type:\s*"area"/);
    assert.match(source, /type:\s*"datetime"/);
    assert.match(source, /sparkline:\s*\{\s*enabled:\s*true/);
    assert.match(source, /tooltip:\s*\{\s*enabled:\s*false/);
    assert.match(source, /opacityFrom:\s*0\.52/);
    assert.match(source, /dropShadow:\s*\{\s*enabled:\s*true/);
    assert.match(source, /data\.expenses\.filter\(\(expense\) => !expense\.recurring\)/);
    assert.match(source, /creditStatus !== "repaid"/);
  }
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
