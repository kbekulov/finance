"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import financeHistoryJson from "@/data/finance-history.json";

type Category =
  | "Food"
  | "Subscriptions & services"
  | "Luxury purchases"
  | "Debt & repayments"
  | "Devices & installments"
  | "Transport & Travel"
  | "Alcohol & nightlife";
type Language = "en" | "ru";

type Expense = {
  id: string;
  amount: number;
  note: string;
  noteTranslations?: Record<Language, string>;
  date: string;
  category: Category;
  source: "chat" | "site" | "receipt";
  recurring?: boolean;
  frequency?: "monthly";
};

type FinanceData = {
  salary: number;
  savingsGoal: number;
  expenses: Expense[];
};

type MonthRecord = FinanceData & {
  month: string;
  label: string;
  period: {
    start: string;
    end: string;
  };
  currency: "EUR";
  timezone: "Europe/Vilnius";
  updatedAt: string;
  revision: number;
};

const CATEGORIES: Category[] = [
  "Food",
  "Subscriptions & services",
  "Luxury purchases",
  "Debt & repayments",
  "Devices & installments",
  "Transport & Travel",
  "Alcohol & nightlife",
];

const COPY = {
  en: {
    monthGlance: "YOUR SALARY CYCLE AT A GLANCE",
    headlineLead: "Every euro has",
    headlineEnd: "a place.",
    intro: "A calm, honest view of what came in, what went out, and what you’re keeping for yourself.",
    available: "AVAILABLE AFTER PLAN",
    spent: "SPENT",
    left: "left until next salary",
    pace: "Comfortable daily pace",
    day: "/ day",
    salary: "MONTHLY SALARY",
    edit: "Tap the amount to edit",
    savings: "SAVINGS REQUIREMENT",
    protected: "Protected from spending",
    spentMonth: "SPENT THIS SALARY CYCLE",
    recorded: "recorded expenses",
    mix: "SPENDING MIX",
    where: "Where your money goes",
    total: "total",
    ledger: "THE LEDGER",
    recent: "Recent expenses",
    items: "ITEMS",
    empty: "Nothing spent yet",
    emptyText: "expenses will appear here as you add them.",
    monthly: "Monthly",
    receipt: "Receipt",
    chat: "Added in chat",
    here: "Added here",
    quick: "QUICK ENTRY",
    add: "Add an expense",
    formIntro: "Log something now, or simply send the amount in our chat.",
    amount: "Amount",
    category: "Category",
    what: "What was it for?",
    placeholder: "Coffee, Netflix, new shoes…",
    hint: "In chat, send a number or a receipt photo and it will be added and categorised here.",
    footer: "Private by design. Clear by default.",
    today: "Today",
    monthEnd: "Cycle end",
    updated: "Updated",
    monthsSaved: "cycles saved",
    spendingAlert: "Spending alert",
    spendingClear: "No spending pressure yet. Keep logging expenses to receive current guidance.",
    spendingLargest: "{category} is your largest cost at {amount} ({percent}% of spending).",
    spendingCut: "For flexible cuts, focus on {category} next ({amount}).",
    spendingSame: "Pause new spending in this category until the balance improves.",
    kinanceHome: "Kinance home",
    languageLabel: "Language",
    financeHistoryLabel: "Salary cycle history",
    monthlyPlanLabel: "Salary cycle plan balance",
    monthlyTotalsLabel: "Salary cycle totals",
    expenseCategoriesLabel: "Expense categories",
    budgetUsed: "{percent}% of spending budget used",
    salaryEuroLabel: "Monthly salary in euros",
    savingsEuroLabel: "Monthly savings requirement in euros",
  },
  ru: {
    monthGlance: "ВАШ ЦИКЛ ЗАРПЛАТЫ В ЦИФРАХ",
    headlineLead: "У каждого евро",
    headlineEnd: "своё место.",
    intro: "Спокойный и честный взгляд на доходы, расходы и деньги, которые вы сохраняете для себя.",
    available: "ДОСТУПНО ПОСЛЕ ПЛАНА",
    spent: "ПОТРАЧЕНО",
    left: "до следующей зарплаты",
    pace: "Комфортный дневной лимит",
    day: "/ день",
    salary: "МЕСЯЧНЫЙ ДОХОД",
    edit: "Нажмите на сумму, чтобы изменить",
    savings: "ЦЕЛЬ НАКОПЛЕНИЙ",
    protected: "Защищено от расходов",
    spentMonth: "ПОТРАЧЕНО В ЭТОМ ЦИКЛЕ",
    recorded: "расходов записано",
    mix: "СТРУКТУРА РАСХОДОВ",
    where: "Куда уходят деньги",
    total: "всего",
    ledger: "ЖУРНАЛ",
    recent: "Последние расходы",
    items: "ЗАПИСЕЙ",
    empty: "Расходов пока нет",
    emptyText: "расходы появятся здесь после добавления.",
    monthly: "Ежемесячно",
    receipt: "Чек",
    chat: "Добавлено в чате",
    here: "Добавлено здесь",
    quick: "БЫСТРОЕ ДОБАВЛЕНИЕ",
    add: "Добавить расход",
    formIntro: "Добавьте расход здесь или просто отправьте сумму в чате.",
    amount: "Сумма",
    category: "Категория",
    what: "На что потрачено?",
    placeholder: "Кофе, Netflix, новая обувь…",
    hint: "Отправьте в чат сумму или фото чека: расход будет добавлен и распределён по категории.",
    footer: "Приватность по замыслу. Ясность по умолчанию.",
    today: "Сегодня",
    monthEnd: "Конец цикла",
    updated: "Обновлено",
    monthsSaved: "циклов сохранено",
    spendingAlert: "Контроль расходов",
    spendingClear: "Пока нет признаков перерасхода. Продолжайте добавлять расходы для актуальных рекомендаций.",
    spendingLargest: "Самая крупная статья: {category}, {amount} ({percent}% всех расходов).",
    spendingCut: "Для гибкого сокращения расходов обратите внимание на {category} ({amount}).",
    spendingSame: "Не добавляйте новые траты в этой категории, пока баланс не улучшится.",
    kinanceHome: "Главная Kinance",
    languageLabel: "Язык",
    financeHistoryLabel: "История циклов зарплаты",
    monthlyPlanLabel: "Баланс цикла зарплаты",
    monthlyTotalsLabel: "Итоги цикла зарплаты",
    expenseCategoriesLabel: "Категории расходов",
    budgetUsed: "Использовано {percent}% бюджета на расходы",
    salaryEuroLabel: "Месячный доход в евро",
    savingsEuroLabel: "Цель ежемесячных накоплений в евро",
  },
};

const CATEGORY_LABELS: Record<Language, Record<Category, string>> = {
  en: {
    Food: "Food",
    "Subscriptions & services": "Subscriptions & services",
    "Luxury purchases": "Luxury purchases",
    "Debt & repayments": "Debt & repayments",
    "Devices & installments": "Devices & installments",
    "Transport & Travel": "Transport & Travel",
    "Alcohol & nightlife": "Alcohol & nightlife",
  },
  ru: {
    Food: "Еда",
    "Subscriptions & services": "Подписки и сервисы",
    "Luxury purchases": "Покупки для удовольствия",
    "Debt & repayments": "Долги и выплаты",
    "Devices & installments": "Устройства и рассрочки",
    "Transport & Travel": "Транспорт и путешествия",
    "Alcohol & nightlife": "Алкоголь и ночная жизнь",
  },
};

// The JSON file is the source of truth. Only the most recent 12 records are shown.
const HISTORY = (financeHistoryJson.months as unknown as MonthRecord[]).slice(-12);
const INITIAL_MONTH = HISTORY[HISTORY.length - 1];
const TODAY = new Date("2026-07-25T12:00:00");
const SALARY_SCHEDULE = financeHistoryJson.salarySchedule;
const DAY_MS = 24 * 60 * 60 * 1000;

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const compactEuro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function sourceLabel(source: Expense["source"], language: Language) {
  if (source === "receipt") return COPY[language].receipt;
  if (source === "chat") return COPY[language].chat;
  return COPY[language].here;
}

function effectiveSalaryDate(year: number, monthIndex: number) {
  const date = new Date(year, monthIndex, SALARY_SCHEDULE.dayOfMonth, 12);

  if (SALARY_SCHEDULE.weekendRule === "previousFriday") {
    if (date.getDay() === 6) date.setDate(date.getDate() - 1);
    if (date.getDay() === 0) date.setDate(date.getDate() - 2);
  }

  return date;
}

function salaryCycleDates(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const start = effectiveSalaryDate(year, month - 1);
  const nextStart = effectiveSalaryDate(year, month);
  const end = new Date(nextStart);
  end.setDate(end.getDate() - 1);
  return { start, end };
}

function calendarDayNumber(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
}

function inclusiveDayCount(start: Date, end: Date) {
  return calendarDayNumber(end) - calendarDayNumber(start) + 1;
}

function categorySymbol(category: Category) {
  if (category === "Food") return "F";
  if (category === "Subscriptions & services") return "S";
  if (category === "Luxury purchases") return "L";
  if (category === "Debt & repayments") return "D";
  if (category === "Devices & installments") return "I";
  if (category === "Transport & Travel") return "T";
  return "A";
}

function categoryClass(category: Category) {
  if (category === "Food") return "food";
  if (category === "Subscriptions & services") return "services";
  if (category === "Luxury purchases") return "luxury";
  if (category === "Debt & repayments") return "debt";
  if (category === "Devices & installments") return "devices";
  if (category === "Transport & Travel") return "transport";
  return "alcohol";
}

function fillTemplate(
  template: string,
  replacements: Record<string, string | number>,
) {
  return Object.entries(replacements).reduce(
    (value, [key, replacement]) =>
      value.replace(`{${key}}`, String(replacement)),
    template,
  );
}

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState<MonthRecord>(INITIAL_MONTH);
  const [data, setData] = useState<FinanceData>(INITIAL_MONTH);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("kinance:language") ??
      localStorage.getItem("euroscope:language");
    if (savedLanguage === "ru") setLanguage("ru");
  }, []);

  useEffect(() => {
    try {
      const key =
        `${selectedMonth.month}:${selectedMonth.updatedAt}:r${selectedMonth.revision}`;
      const saved =
        localStorage.getItem(`kinance:${key}`) ??
        localStorage.getItem(`euroscope:${key}`);
      if (saved) setData(JSON.parse(saved));
      else setData(selectedMonth);
    } catch {
      // Source data remains available if browser storage is unavailable.
    }
    setIsReady(true);
  }, [selectedMonth]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(
      `kinance:${selectedMonth.month}:${selectedMonth.updatedAt}:r${selectedMonth.revision}`,
      JSON.stringify(data),
    );
  }, [data, isReady, selectedMonth]);

  const spent = useMemo(
    () => data.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [data.expenses],
  );
  const categoryTotals = useMemo(
    () =>
      CATEGORIES.map((name) => ({
        name,
        amount: data.expenses
          .filter((expense) => expense.category === name)
          .reduce((sum, expense) => sum + expense.amount, 0),
      })),
    [data.expenses],
  );
  const spendable = Math.max(data.salary - data.savingsGoal, 0);
  const remaining = data.salary - data.savingsGoal - spent;
  const usedPercent = spendable > 0 ? Math.min((spent / spendable) * 100, 100) : 0;
  const [year, month] = selectedMonth.month.split("-").map(Number);
  const { start: cycleStart, end: cycleEnd } = salaryCycleDates(selectedMonth.month);
  const isCurrentCycle = TODAY >= cycleStart && TODAY <= cycleEnd;
  const markerDate = isCurrentCycle ? TODAY : cycleEnd;
  const totalCycleDays = inclusiveDayCount(cycleStart, cycleEnd);
  const elapsedCycleDays = Math.min(
    Math.max(inclusiveDayCount(cycleStart, markerDate), 1),
    totalCycleDays,
  );
  const dailyPace =
    Math.max(remaining, 0) / Math.max(totalCycleDays - elapsedCycleDays, 1);
  const locale = language === "ru" ? "ru-RU" : "en-GB";
  const copy = COPY[language];
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
  const shortDate = (date: Date) => new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
  const timelineDayLabel = shortDate(markerDate);
  const updatedLabel = `${copy.updated} ${new Date(
    `${selectedMonth.updatedAt}T12:00:00`,
  ).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}`;
  const categoryLabel = (name: Category) => CATEGORY_LABELS[language][name];
  const expenseNoteLabel = (expense: Expense) =>
    expense.noteTranslations?.[language] ?? expense.note;
  const rankedCategories = [...categoryTotals]
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const largestCategory = rankedCategories[0];
  const flexibleCategories = new Set<Category>([
    "Food",
    "Subscriptions & services",
    "Luxury purchases",
    "Devices & installments",
    "Transport & Travel",
    "Alcohol & nightlife",
  ]);
  const cutTarget =
    rankedCategories.find(
      (item) =>
        item.name !== largestCategory?.name &&
        flexibleCategories.has(item.name),
    ) ?? largestCategory;
  const spendingAlertDetail = largestCategory
    ? `${fillTemplate(copy.spendingLargest, {
        category: categoryLabel(largestCategory.name),
        amount: euro.format(largestCategory.amount),
        percent: Math.round((largestCategory.amount / spent) * 100),
      })} ${
        cutTarget?.name === largestCategory.name
          ? copy.spendingSame
          : fillTemplate(copy.spendingCut, {
              category: categoryLabel(cutTarget.name),
              amount: euro.format(cutTarget.amount),
            })
      }`
    : copy.spendingClear;

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number.parseFloat(amount.replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) return;

    setData((current) => ({
      ...current,
      expenses: [
        {
          id: crypto.randomUUID(),
          amount: Math.round(value * 100) / 100,
          note: note.trim() || category,
          date: selectedMonth.updatedAt,
          category,
          source: "site",
        },
        ...current.expenses,
      ],
    }));
    setAmount("");
    setNote("");
  }

  return (
    <main>
      <div className="shell">
        <section className="spending-alert" role="status" aria-live="polite">
          <span className="spending-alert-icon" aria-hidden="true">!</span>
          <div>
            <strong>{copy.spendingAlert}</strong>
            <p>{spendingAlertDetail}</p>
          </div>
        </section>

        <header className="topbar">
          <a className="brand" href="#top" aria-label={copy.kinanceHome}>
            <span className="brand-mark" aria-hidden="true">€</span>
            <span>kinance</span>
          </a>
          <div className="header-meta">
            <span className="updated-label">{updatedLabel}</span>
            <div className="language-switch" role="group" aria-label={copy.languageLabel}>
              {(["en", "ru"] as Language[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={language === item ? "active" : ""}
                  aria-pressed={language === item}
                  onClick={() => {
                    setLanguage(item);
                    localStorage.setItem("kinance:language", item);
                  }}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="month-pill" aria-label={monthLabel}>
              <span className="month-dot" aria-hidden="true" />
              {monthLabel}
            </div>
          </div>
        </header>

        <nav className="month-history" aria-label={copy.financeHistoryLabel}>
          {HISTORY.map((record) => (
            <button
              type="button"
              key={record.month}
              className={record.month === selectedMonth.month ? "active" : ""}
              aria-current={record.month === selectedMonth.month ? "date" : undefined}
              onClick={() => setSelectedMonth(record)}
            >
              {new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })
                .format(new Date(`${record.month}-01T12:00:00`))}
            </button>
          ))}
          <span>{HISTORY.length} / 12 {copy.monthsSaved}</span>
        </nav>

        <section
          className="month-timeline"
          aria-label={`${shortDate(cycleStart)} – ${shortDate(cycleEnd)}`}
        >
          <div className="timeline-copy">
            <span>{shortDate(cycleStart).toUpperCase()}</span>
            <strong>
              {isCurrentCycle ? copy.today : copy.monthEnd} · {timelineDayLabel}
            </strong>
            <span>{shortDate(cycleEnd).toUpperCase()}</span>
          </div>
          <div className="timeline-track">
            <span style={{ width: `${(elapsedCycleDays / totalCycleDays) * 100}%` }} />
            <i style={{ left: `${(elapsedCycleDays / totalCycleDays) * 100}%` }} />
          </div>
        </section>

        <section className="hero" id="top" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">{copy.monthGlance}</p>
            <h1 id="page-title">
              {copy.headlineLead}
              <br />
              <em>{copy.headlineEnd}</em>
            </h1>
            <p className="hero-intro">{copy.intro}</p>
          </div>

          <div className="balance-card" aria-label={copy.monthlyPlanLabel}>
            <div className="balance-topline">
              <span>{copy.available}</span>
              <span>{Math.round(usedPercent)}% {copy.spent}</span>
            </div>
            <div className="balance-main">
              <div>
                <strong>{euro.format(remaining)}</strong>
                <span className="balance-caption">{copy.left}</span>
              </div>
              <div
                className="progress-ring"
                style={{ "--progress": `${usedPercent * 3.6}deg` } as React.CSSProperties}
                aria-label={fillTemplate(copy.budgetUsed, {
                  percent: Math.round(usedPercent),
                })}
              >
                <span>{Math.round(usedPercent)}%</span>
              </div>
            </div>
            <div className="pace-row">
              <span>{copy.pace}</span>
              <strong>{compactEuro.format(dailyPace)} {copy.day}</strong>
            </div>
          </div>
        </section>

        <section className="stat-grid" aria-label={copy.monthlyTotalsLabel}>
          <article className="stat-card salary">
            <span className="stat-icon" aria-hidden="true">↗</span>
            <p>{copy.salary}</p>
            <label className="editable-value">
              <span className="sr-only">{copy.salaryEuroLabel}</span>
              <span aria-hidden="true">€</span>
              <input
                inputMode="decimal"
                value={data.salary}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    salary: Math.max(Number(event.target.value) || 0, 0),
                  }))
                }
              />
            </label>
            <small>{copy.edit}</small>
          </article>

          <article className="stat-card savings">
            <span className="stat-icon" aria-hidden="true">◇</span>
            <p>{copy.savings}</p>
            <label className="editable-value">
              <span className="sr-only">{copy.savingsEuroLabel}</span>
              <span aria-hidden="true">€</span>
              <input
                inputMode="decimal"
                value={data.savingsGoal}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    savingsGoal: Math.max(Number(event.target.value) || 0, 0),
                  }))
                }
              />
            </label>
            <small>{copy.protected}</small>
          </article>

          <article className="stat-card expenses">
            <span className="stat-icon" aria-hidden="true">↓</span>
            <p>{copy.spentMonth}</p>
            <strong>{euro.format(spent)}</strong>
            <small>{data.expenses.length} {copy.recorded}</small>
          </article>
        </section>

        <section className="category-strip" aria-label={copy.expenseCategoriesLabel}>
          {categoryTotals.map((item) => (
            <article key={item.name}>
              <span className={`category-symbol category-${categorySymbol(item.name).toLowerCase()}`}>
                {categorySymbol(item.name)}
              </span>
              <span>
                <small>{categoryLabel(item.name)}</small>
                <strong>{euro.format(item.amount)}</strong>
              </span>
            </article>
          ))}
        </section>

        <section className="breakdown-panel" aria-labelledby="breakdown-title">
          <div className="breakdown-heading">
            <div>
              <p className="eyebrow">{copy.mix}</p>
              <h2 id="breakdown-title">{copy.where}</h2>
            </div>
            <strong>{euro.format(spent)} {copy.total}</strong>
          </div>
          <div
            className="breakdown-bar"
            role="img"
            aria-label={
              categoryTotals
                .filter((item) => item.amount > 0)
                .map((item) => `${categoryLabel(item.name)}: ${euro.format(item.amount)}`)
                .join(", ") || "No expenses recorded"
            }
          >
            {categoryTotals
              .filter((item) => item.amount > 0)
              .map((item) => (
                <span
                  key={item.name}
                  className={`breakdown-segment ${categoryClass(item.name)}`}
                  style={{ width: `${spent > 0 ? (item.amount / spent) * 100 : 0}%` }}
                  title={`${categoryLabel(item.name)}: ${euro.format(item.amount)}`}
                />
              ))}
          </div>
          <div className="breakdown-legend">
            {categoryTotals
              .filter((item) => item.amount > 0)
              .map((item) => (
                <div className="breakdown-item" key={item.name}>
                  <span
                    className={`breakdown-dot ${categoryClass(item.name)}`}
                    aria-hidden="true"
                  />
                  <span>
                    <strong>{categoryLabel(item.name)}</strong>
                    <small>
                      {euro.format(item.amount)} ·{" "}
                      {Math.round(spent > 0 ? (item.amount / spent) * 100 : 0)}%
                    </small>
                  </span>
                </div>
              ))}
          </div>
        </section>

        <section className="workspace">
          <div className="activity-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{copy.ledger}</p>
                <h2>{copy.recent}</h2>
              </div>
              <span>{data.expenses.length} {copy.items}</span>
            </div>

            {data.expenses.length === 0 ? (
              <div className="empty-state">
                <span aria-hidden="true">○</span>
                <h3>{copy.empty}</h3>
                <p>{monthLabel}: {copy.emptyText}</p>
              </div>
            ) : (
              <ul className="expense-list">
                {data.expenses.map((expense) => (
                  <li key={expense.id}>
                    <span className="expense-monogram" aria-hidden="true">
                      {categorySymbol(expense.category)}
                    </span>
                    <span className="expense-info">
                      <strong>{expenseNoteLabel(expense)}</strong>
                      <small>
                        {categoryLabel(expense.category)} · {expense.recurring ? `${copy.monthly} · ` : ""}
                        {sourceLabel(expense.source, language)} ·{" "}
                        {new Date(`${expense.date}T12:00:00`).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                        })}
                      </small>
                    </span>
                    <strong className="expense-amount">−{euro.format(expense.amount)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="add-panel" aria-labelledby="add-title">
            <p className="eyebrow">{copy.quick}</p>
            <h2 id="add-title">{copy.add}</h2>
            <p className="form-intro">{copy.formIntro}</p>
            <form onSubmit={addExpense}>
              <label htmlFor="amount">{copy.amount}</label>
              <div className="amount-field">
                <span aria-hidden="true">€</span>
                <input
                  id="amount"
                  name="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
              </div>
              <label htmlFor="category">{copy.category}</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value as Category)}
              >
                {CATEGORIES.map((name) => (
                  <option key={name} value={name}>{categoryLabel(name)}</option>
                ))}
              </select>
              <label htmlFor="note">{copy.what}</label>
              <input
                id="note"
                name="note"
                placeholder={copy.placeholder}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <button type="submit">
                <span aria-hidden="true">＋</span>
                {copy.add}
              </button>
            </form>
            <p className="chat-hint">
              <span aria-hidden="true">✦</span>
              {copy.hint}
            </p>
          </aside>
        </section>

        <footer>
          <span>KINANCE</span>
          <p>{copy.footer}</p>
        </footer>
      </div>
    </main>
  );
}
