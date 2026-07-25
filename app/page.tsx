"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import financeHistoryJson from "@/data/finance-history.json";

type Category =
  | "Food"
  | "Subscriptions & services"
  | "Luxury purchases"
  | "Debt & repayments"
  | "Devices & installments";

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

function sourceLabel(source: Expense["source"]) {
  if (source === "receipt") return "Receipt";
  if (source === "chat") return "Added in chat";
  return "Added here";
}

function categorySymbol(category: Category) {
  if (category === "Food") return "F";
  if (category === "Subscriptions & services") return "S";
  if (category === "Luxury purchases") return "L";
  if (category === "Debt & repayments") return "D";
  return "I";
}

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState<MonthRecord>(INITIAL_MONTH);
  const [data, setData] = useState<FinanceData>(INITIAL_MONTH);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [isReady, setIsReady] = useState(false);

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
  const updatedLabel = `Updated ${new Date(
    `${selectedMonth.updatedAt}T12:00:00`,
  ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;

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
            <div className="month-pill" aria-label={`Viewing ${selectedMonth.label}`}>
              <span className="month-dot" aria-hidden="true" />
              {selectedMonth.label}
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
              {record.label}
            </button>
          ))}
          <span>{HISTORY.length} / 12 months saved</span>
        </nav>

        <section
          className="month-timeline"
          aria-label={`${selectedMonth.label} timeline, day ${dayOfMonth}`}
        >
          <div className="timeline-copy">
            <span>01 {selectedMonth.label.slice(0, 3).toUpperCase()}</span>
            <strong>
              {isCurrentMonth ? "Today" : "Month end"} · {dayOfMonth}{" "}
              {selectedMonth.label.slice(0, 3)}
            </strong>
            <span>{daysInMonth} {selectedMonth.label.slice(0, 3).toUpperCase()}</span>
          </div>
          <div className="timeline-track">
            <span style={{ width: `${(dayOfMonth / daysInMonth) * 100}%` }} />
            <i style={{ left: `${(dayOfMonth / daysInMonth) * 100}%` }} />
          </div>
        </section>

        <section className="hero" id="top" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">YOUR MONTH AT A GLANCE</p>
            <h1 id="page-title">
              Every euro has
              <br />
              <em>a place.</em>
            </h1>
            <p className="hero-intro">
              A calm, honest view of what came in, what went out, and what
              you&apos;re keeping for yourself.
            </p>
          </div>

          <div className="balance-card" aria-label="Monthly plan balance">
            <div className="balance-topline">
              <span>AVAILABLE AFTER PLAN</span>
              <span>{Math.round(usedPercent)}% SPENT</span>
            </div>
            <div className="balance-main">
              <div>
                <strong>{euro.format(remaining)}</strong>
                <span className="balance-caption">left for the month</span>
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
              <span>Comfortable daily pace</span>
              <strong>{compactEuro.format(dailyPace)} / day</strong>
            </div>
          </div>
        </section>

        <section className="stat-grid" aria-label="Monthly totals">
          <article className="stat-card salary">
            <span className="stat-icon" aria-hidden="true">↗</span>
            <p>MONTHLY SALARY</p>
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
            <small>Tap the amount to edit</small>
          </article>

          <article className="stat-card savings">
            <span className="stat-icon" aria-hidden="true">◇</span>
            <p>SAVINGS REQUIREMENT</p>
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
            <small>Protected from spending</small>
          </article>

          <article className="stat-card expenses">
            <span className="stat-icon" aria-hidden="true">↓</span>
            <p>SPENT THIS MONTH</p>
            <strong>{euro.format(spent)}</strong>
            <small>{data.expenses.length} recorded expense{data.expenses.length === 1 ? "" : "s"}</small>
          </article>
        </section>

        <section className="category-strip" aria-label="Expense categories">
          {categoryTotals.map((item) => (
            <article key={item.name}>
              <span className={`category-symbol category-${categorySymbol(item.name).toLowerCase()}`}>
                {categorySymbol(item.name)}
              </span>
              <span>
                <small>{item.name}</small>
                <strong>{euro.format(item.amount)}</strong>
              </span>
            </article>
          ))}
        </section>

        <section className="workspace">
          <div className="activity-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">THE LEDGER</p>
                <h2>Recent expenses</h2>
              </div>
              <span>{data.expenses.length} ITEMS</span>
            </div>

            {data.expenses.length === 0 ? (
              <div className="empty-state">
                <span aria-hidden="true">○</span>
                <h3>Nothing spent yet</h3>
                <p>Your {selectedMonth.label} expenses will appear here as you add them.</p>
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
                        {expense.category} · {expense.recurring ? "Monthly · " : ""}
                        {sourceLabel(expense.source)} ·{" "}
                        {new Date(`${expense.date}T12:00:00`).toLocaleDateString("en-GB", {
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
            <p className="eyebrow">QUICK ENTRY</p>
            <h2 id="add-title">Add an expense</h2>
            <p className="form-intro">Log something now, or simply send the amount in our chat.</p>
            <form onSubmit={addExpense}>
              <label htmlFor="amount">Amount</label>
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
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value as Category)}
              >
                {CATEGORIES.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <label htmlFor="note">What was it for?</label>
              <input
                id="note"
                name="note"
                placeholder="Coffee, Netflix, new shoes…"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <button type="submit">
                <span aria-hidden="true">＋</span>
                Add expense
              </button>
            </form>
            <p className="chat-hint">
              <span aria-hidden="true">✦</span>
              In chat, send a number or a receipt photo and it will be added and categorised here.
            </p>
          </aside>
        </section>

        <footer>
          <span>EUROSCOPE</span>
          <p>Private by design. Clear by default.</p>
        </footer>
      </div>
    </main>
  );
}
