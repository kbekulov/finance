"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import financeHistoryJson from "@/data/finance-history.json";

type Category =
  | "Food"
  | "Subscriptions & services"
  | "Luxury purchases"
  | "Debt & repayments"
  | "Devices & installments";
type Language = "en" | "ru";

type Expense = {
  id: string;
  amount: number;
  note: string;
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
  updatedAt: string;
  revision: number;
};

const CATEGORIES: Category[] = [
  "Food",
  "Subscriptions & services",
  "Luxury purchases",
  "Debt & repayments",
  "Devices & installments",
];

const COPY = {
  en: {
    monthGlance: "YOUR MONTH AT A GLANCE",
    headlineLead: "Every euro has",
    headlineEnd: "a place.",
    intro: "A calm, honest view of what came in, what went out, and what you’re keeping for yourself.",
    available: "AVAILABLE AFTER PLAN",
    spent: "SPENT",
    left: "left for the month",
    pace: "Comfortable daily pace",
    day: "/ day",
    salary: "MONTHLY SALARY",
    edit: "Tap the amount to edit",
    savings: "SAVINGS REQUIREMENT",
    protected: "Protected from spending",
    spentMonth: "SPENT THIS MONTH",
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
    monthEnd: "Month end",
    updated: "Updated",
    monthsSaved: "months saved",
  },
  ru: {
    monthGlance: "ВАШ МЕСЯЦ В ЦИФРАХ",
    headlineLead: "Каждому евро —",
    headlineEnd: "своё место.",
    intro: "Спокойный и честный взгляд на доходы, расходы и деньги, которые вы сохраняете для себя.",
    available: "ДОСТУПНО ПОСЛЕ ПЛАНА",
    spent: "ПОТРАЧЕНО",
    left: "осталось на месяц",
    pace: "Комфортный дневной лимит",
    day: "/ день",
    salary: "МЕСЯЧНЫЙ ДОХОД",
    edit: "Нажмите на сумму, чтобы изменить",
    savings: "ЦЕЛЬ НАКОПЛЕНИЙ",
    protected: "Защищено от расходов",
    spentMonth: "ПОТРАЧЕНО В ЭТОМ МЕСЯЦЕ",
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
    hint: "Отправьте в чат сумму или фото чека — расход будет добавлен и распределён по категории.",
    footer: "Приватность по замыслу. Ясность по умолчанию.",
    today: "Сегодня",
    monthEnd: "Конец месяца",
    updated: "Обновлено",
    monthsSaved: "месяцев сохранено",
  },
};

const CATEGORY_LABELS: Record<Language, Record<Category, string>> = {
  en: {
    Food: "Food",
    "Subscriptions & services": "Subscriptions & services",
    "Luxury purchases": "Luxury purchases",
    "Debt & repayments": "Debt & repayments",
    "Devices & installments": "Devices & installments",
  },
  ru: {
    Food: "Еда",
    "Subscriptions & services": "Подписки и сервисы",
    "Luxury purchases": "Покупки для удовольствия",
    "Debt & repayments": "Долги и выплаты",
    "Devices & installments": "Устройства и рассрочки",
  },
};

// The JSON file is the source of truth. Only the most recent 12 records are shown.
const HISTORY = (financeHistoryJson.months as unknown as MonthRecord[]).slice(-12);
const INITIAL_MONTH = HISTORY[HISTORY.length - 1];
const TODAY = new Date("2026-07-25T12:00:00");

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

function categorySymbol(category: Category) {
  if (category === "Food") return "F";
  if (category === "Subscriptions & services") return "S";
  if (category === "Luxury purchases") return "L";
  if (category === "Debt & repayments") return "D";
  return "I";
}

function categoryClass(category: Category) {
  if (category === "Food") return "food";
  if (category === "Subscriptions & services") return "services";
  if (category === "Luxury purchases") return "luxury";
  if (category === "Debt & repayments") return "debt";
  return "devices";
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
    const savedLanguage = localStorage.getItem("euroscope:language");
    if (savedLanguage === "ru") setLanguage("ru");
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        `euroscope:${selectedMonth.month}:${selectedMonth.updatedAt}:r${selectedMonth.revision}`,
      );
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
      `euroscope:${selectedMonth.month}:${selectedMonth.updatedAt}:r${selectedMonth.revision}`,
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
  const daysInMonth = new Date(year, month, 0).getDate();
  const isCurrentMonth =
    year === TODAY.getFullYear() && month === TODAY.getMonth() + 1;
  const dayOfMonth = isCurrentMonth ? TODAY.getDate() : daysInMonth;
  const dailyPace = Math.max(remaining, 0) / Math.max(daysInMonth - dayOfMonth, 1);
  const locale = language === "ru" ? "ru-RU" : "en-GB";
  const copy = COPY[language];
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
  const shortMonth = new Intl.DateTimeFormat(locale, { month: "short" })
    .format(new Date(year, month - 1, 1))
    .replace(".", "");
  const updatedLabel = `${copy.updated} ${new Date(
    `${selectedMonth.updatedAt}T12:00:00`,
  ).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}`;
  const categoryLabel = (name: Category) => CATEGORY_LABELS[language][name];

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
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Euroscope home">
            <span className="brand-mark" aria-hidden="true">€</span>
            <span>euroscope</span>
          </a>
          <div className="header-meta">
            <span className="updated-label">{updatedLabel}</span>
            <div className="language-switch" role="group" aria-label="Language">
              {(["en", "ru"] as Language[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={language === item ? "active" : ""}
                  aria-pressed={language === item}
                  onClick={() => {
                    setLanguage(item);
                    localStorage.setItem("euroscope:language", item);
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

        <nav className="month-history" aria-label="Finance history">
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
          aria-label={`${monthLabel}, ${dayOfMonth}`}
        >
          <div className="timeline-copy">
            <span>01 {shortMonth.toUpperCase()}</span>
            <strong>
              {isCurrentMonth ? copy.today : copy.monthEnd} · {dayOfMonth} {shortMonth}
            </strong>
            <span>{daysInMonth} {shortMonth.toUpperCase()}</span>
          </div>
          <div className="timeline-track">
            <span style={{ width: `${(dayOfMonth / daysInMonth) * 100}%` }} />
            <i style={{ left: `${(dayOfMonth / daysInMonth) * 100}%` }} />
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

          <div className="balance-card" aria-label="Monthly plan balance">
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
                aria-label={`${Math.round(usedPercent)} percent of spending budget used`}
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

        <section className="stat-grid" aria-label="Monthly totals">
          <article className="stat-card salary">
            <span className="stat-icon" aria-hidden="true">↗</span>
            <p>{copy.salary}</p>
            <label className="editable-value">
              <span className="sr-only">Monthly salary in euros</span>
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
              <span className="sr-only">Monthly savings requirement in euros</span>
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

        <section className="category-strip" aria-label="Expense categories">
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
                      <strong>{expense.note}</strong>
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
          <span>EUROSCOPE</span>
          <p>{copy.footer}</p>
        </footer>
      </div>
    </main>
  );
}
