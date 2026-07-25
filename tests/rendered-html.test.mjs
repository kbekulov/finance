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
  assert.match(html, /Updated 25 July 2026/);
  assert.match(html, /Today<!-- --> · <!-- -->25 Jul/);
  assert.match(html, /10 Jul/i);
  assert.match(html, /11 Aug/i);
  assert.match(html, /YOUR SALARY CYCLE AT A GLANCE/);
  assert.match(html, /Past 3-cycle comparison appears when history is available/);
  assert.match(html, /id="savings-comparison"|class="stat-comparison neutral"/);
  assert.match(html, /left until next salary/);
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
  assert.match(html, /€14\.99/);
  assert.match(html, /Expected monthly expenses/);
  assert.match(html, /Expected monthly total/);
  assert.match(html, /€936\.47/);
  assert.match(html, /One-time expenses/);
  assert.match(html, /Gaming laptop/);
  assert.match(html, /Mortgage/);
  assert.doesNotMatch(html, /Apartment debt/);
  assert.match(html, /Keturi vėjai 0\.4 l/);
  assert.match(html, /Shelton&#x27;s pear cider/);
  assert.match(html, /Alcohol &amp; nightlife/);
  assert.match(html, /€951\.46/);
  assert.match(html, /€998\.54/);
  assert.match(html, /49%<!-- --> <!-- -->SPENT|49% SPENT/);
  assert.match(html, /€59<!-- --> <!-- -->\/ day|€59 \/ day/);
  assert.match(html, /Beer/);
  assert.match(html, /Ice cream/);
  assert.match(html, /class="stat-card salary salary-locked"/);
  assert.match(html, /Fixed in your finance plan/);
  assert.doesNotMatch(html, /Monthly salary in euros[^<]*<\/span>\s*<span[^>]*>€<\/span>\s*<input/s);
  assert.doesNotMatch(html, /class="daily-chart-panel"/);
  assert.match(html, /class="daily-expense-chart"/);
  assert.match(html, /aria-label="Daily non-recurring expense movement"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps database history and translations aligned", async () => {
  const [databaseText, page, script, styles, index] = await Promise.all([
    readFile(new URL("../data/finance-history.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../script.js", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
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
  assert.equal(database.currency, "EUR");
  assert.equal(database.timezone, "Europe/Vilnius");
  assert.equal(current.updatedAt, "2026-07-25");
  assert.equal(current.revision, 22);
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
      assert.equal(Math.round(expense.amount * 100), expense.amount * 100);
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
  assert.equal(spentCents, 95146);
  assert.equal(recurringCents, 93647);
  assert.equal(oneTimeCents, 1499);
  assert.equal(recurringCents + oneTimeCents, spentCents);
  assert.equal(current.salary * 100 - current.savingsGoal * 100 - spentCents, 99854);
  const calendarDay = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    return Date.UTC(year, month - 1, day) / 86400000;
  };
  const totalCycleDays = calendarDay(current.period.end) - calendarDay(current.period.start) + 1;
  const elapsedCycleDays = calendarDay("2026-07-25") - calendarDay(current.period.start) + 1;
  const remainingDaysAfterToday = totalCycleDays - elapsedCycleDays;
  assert.equal(totalCycleDays, 33);
  assert.equal(elapsedCycleDays, 16);
  assert.equal(remainingDaysAfterToday, 17);
  assert.equal(Math.round((99854 / 100) / remainingDaysAfterToday), 59);
  assert.equal(Math.round((spentCents / (current.salary * 100 - current.savingsGoal * 100)) * 100), 49);
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
    assert.match(source, /Expected monthly total/);
    assert.match(source, /Всего ожидается в месяц/);
    assert.match(source, /effectiveSalaryDate/);
    assert.match(source, /previousFriday/);
    assert.match(source, /SALARY CYCLE|Salary cycle/);
    assert.match(source, /comparisonUnavailable/);
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
    assert.match(source, /visualPercent/);
    assert.match(source, /noSpendingBudget/);
    assert.match(source, /expenseDay <= elapsed/);
    assert.match(source, /creditStatus: "outstanding"/);
    assert.doesNotMatch(source, /const TODAY\s*=/);
  }
  assert.match(index, /id="theme-select"/);
  assert.match(index, /styles\.css\?v=25/);
  assert.match(index, /public\/vendor\/apexcharts\.min\.js\?v=21/);
  assert.match(index, /script\.js\?v=25/);
  assert.match(index, /data-current-theme="kinance"/);
  assert.match(index, /id="credit-alert"[^>]*hidden/);
  assert.match(index, /id="payment-method"/);
  assert.match(index, /option value="debit"/);
  assert.match(index, /option value="credit"/);
  assert.match(index, /id="theme-banner-image"/);
  assert.match(index, /public\/theme-banners\/kinance\.png/);
  assert.match(script, /public\/theme-banners\/kinance\.png/);
  assert.match(script, /public\/theme-banners\/nier-automata\.png/);
  assert.match(script, /public\/theme-banners\/tohsaka-rin\.png/);
  for (const source of [page]) {
    assert.match(source, /themeBannerLabel/);
    assert.match(source, /theme-banners\/kinance\.png/);
    assert.match(source, /theme-banners\/nier-automata\.png/);
    assert.match(source, /theme-banners\/tohsaka-rin\.png/);
  }
  assert.match(styles, /\.theme-banner\s*\{/);
  assert.match(styles, /@keyframes credit-alert-pulse/);
  assert.match(styles, /\.payment-badge\.credit-outstanding/);
  assert.match(styles, /prefers-reduced-motion[\s\S]*\.credit-alert[\s\S]*animation:\s*none/);
  assert.match(styles, /\.theme-banner img\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(styles, /\.theme-banner\s*\{[^}]*background:\s*transparent/s);
  assert.doesNotMatch(styles, /\.daily-chart-panel\s*\{/);
  assert.match(styles, /\.daily-expense-chart\s*\{[^}]*height:\s*84px[^}]*min-height:\s*84px/s);
  assert.match(styles, /--chart-accent:\s*#5ac8fa/);
  assert.match(styles, /:root\[data-theme="nier-automata"\][^{]*\{[^}]*--chart-accent:\s*#526f78/s);
  assert.match(styles, /:root\[data-theme="tohsaka-rin"\][^{]*\{[^}]*--chart-accent:\s*#ff5b82/s);
  assert.match(script, /height:\s*84/);
  assert.match(script, /stroke:\s*\{\s*curve:\s*"smooth",\s*width:\s*2\.25/);
  assert.match(page, /height:\s*84/);
  assert.match(page, /stroke:\s*\{\s*curve:\s*"smooth",\s*width:\s*2\.25/);
  assert.match(styles, /\.salary-locked\s*\{/);
  assert.match(styles, /\.stat-card\.salary-locked\s*\{[^}]*align-self:\s*start/s);
  assert.match(styles, /\.stat-card\.salary-locked\s*\{[^}]*min-height:\s*0/s);
  assert.match(index, /id="salary-value"/);
  assert.doesNotMatch(index, /id="salary"/);
  assert.doesNotMatch(script, /element\("salary"\)\.addEventListener/);
  assert.match(script, /salary:\s*month\.salary/);
  assert.match(page, /salary:\s*selectedMonth\.salary/);
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
});
