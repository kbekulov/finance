"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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

const THEMES = [
  { id: "kinance", label: "Kinance", banner: "/theme-banners/kinance.png?v=2" },
  { id: "nier-automata", label: "NieR:Automata", banner: "/theme-banners/nier-automata.png" },
  { id: "tohsaka-rin", label: "Tohsaka Rin", banner: "/theme-banners/tohsaka-rin.png" },
] as const;
type ThemeId = (typeof THEMES)[number]["id"];

type Expense = {
  id: string;
  amount: number;
  note: string;
  noteTranslations?: Record<Language, string>;
  date: string;
  category: Category;
  source: "chat" | "site" | "receipt";
  paymentMethod: "debit" | "credit";
  creditStatus?: "outstanding" | "repaid";
  repaidAt?: string;
  recurring?: boolean;
  frequency?: "monthly";
};

type FinanceData = {
  salary: number;
  savingsGoal: number;
  expenses: Expense[];
};

type SavedFinanceData = Pick<FinanceData, "savingsGoal" | "expenses">;

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

const CATEGORY_ICONS: Record<Category, string> = {
  Food: "/category-icons/food.png?v=2",
  "Subscriptions & services": "/category-icons/subscriptions-services.png?v=3",
  "Luxury purchases": "/category-icons/luxury-purchases.png?v=2",
  "Debt & repayments": "/category-icons/debt-repayments.png?v=2",
  "Devices & installments": "/category-icons/devices-installments.png?v=2",
  "Transport & Travel": "/category-icons/transport-travel.png?v=2",
  "Alcohol & nightlife": "/category-icons/alcohol-nightlife.png?v=2",
};

const COPY = {
  en: {
    monthGlance: "YOUR SALARY CYCLE AT A GLANCE",
    headlineLead: "Every euro has",
    headlineEnd: "a place.",
    intro: "A calm, honest view of what came in, what went out, and what you’re keeping for yourself.",
    available: "DEBIT BALANCE",
    spent: "SPENT",
    left: "on card until next salary",
    afterSavings: "after protecting savings",
    pace: "DAILY LIMITS",
    allFunds: "All funds",
    savingsSafe: "Savings safe",
    day: "/ day",
    salary: "SALARY THIS CYCLE",
    salaryLocked: "Locked to this salary cycle",
    dailySpendingEyebrow: "DAILY RHYTHM",
    dailySpending: "Daily expenses",
    dailySpendingIntro: "What left your account each day this salary cycle",
    thisCycleTotal: "This cycle",
    dailyExpenseSeries: "Daily spending",
    dailySpendingChartLabel: "Daily non-recurring expense movement",
    edit: "Tap the amount to edit",
    savings: "SAVINGS REQUIREMENT",
    protected: "Protected from spending",
    spentMonth: "SPENT THIS SALARY CYCLE",
    savingsMore: "Planned savings are {difference} above the prior {count}-cycle average of {average}",
    savingsLess: "Planned savings are {difference} below the prior {count}-cycle average of {average}",
    savingsSame: "Planned savings match the prior {count}-cycle average of {average}",
    spendingMore: "{difference} more spent than the prior {count}-cycle average of {average}",
    spendingLess: "{difference} less spent than the prior {count}-cycle average of {average}",
    spendingSame: "Matches the prior {count}-cycle spending average of {average}",
    recorded: "recorded expenses",
    mix: "SPENDING MIX",
    where: "Where your money goes",
    total: "total",
    recent: "Recent expenses",
    items: "ITEMS",
    expectedMonthly: "Expected monthly expenses",
    oneTimeExpenses: "One-time expenses",
    empty: "Nothing spent yet",
    emptyText: "expenses will appear here as you add them.",
    receipt: "Receipt",
    chat: "Added in chat",
    here: "Added here",
    quick: "QUICK ENTRY",
    add: "Add an expense",
    formIntro: "Log something now, or simply send the amount in our chat.",
    amount: "Amount",
    category: "Category",
    paymentMethod: "Payment method",
    debit: "Debit",
    credit: "Credit",
    creditRepaid: "Credit repaid",
    outstandingCredit: "Outstanding credit",
    outstandingCreditDetail: "Credit spending is awaiting repayment.",
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
    themeLabel: "Theme",
    themeBannerLabel: "{theme} character banner",
    financeHistoryLabel: "Salary cycle history",
    monthlyPlanLabel: "Salary cycle plan balance",
    monthlyTotalsLabel: "Salary cycle totals",
    budgetUsed: "{percent}% of spending budget used",
    salaryAllocation: "{spent}% of salary spent; {savings}% reserved for savings",
    noSpendingBudget: "NO SPENDING BUDGET",
    savingsEuroLabel: "Monthly savings requirement in euros",
  },
  ru: {
    monthGlance: "ВАШ ЦИКЛ ЗАРПЛАТЫ В ЦИФРАХ",
    headlineLead: "У каждого евро",
    headlineEnd: "своё место.",
    intro: "Спокойный и честный взгляд на доходы, расходы и деньги, которые вы сохраняете для себя.",
    available: "БАЛАНС ДЕБЕТОВОЙ КАРТЫ",
    spent: "ПОТРАЧЕНО",
    left: "на карте до следующей зарплаты",
    afterSavings: "после защиты накоплений",
    pace: "ДНЕВНЫЕ ЛИМИТЫ",
    allFunds: "Все средства",
    savingsSafe: "Сохранить накопления",
    day: "/ день",
    salary: "ДОХОД В ЭТОМ ЦИКЛЕ",
    salaryLocked: "Зафиксировано для этого цикла зарплаты",
    dailySpendingEyebrow: "ДНЕВНОЙ РИТМ",
    dailySpending: "Расходы по дням",
    dailySpendingIntro: "Сколько уходило со счёта каждый день этого цикла зарплаты",
    thisCycleTotal: "За цикл",
    dailyExpenseSeries: "Расходы за день",
    dailySpendingChartLabel: "Динамика разовых расходов по дням",
    edit: "Нажмите на сумму, чтобы изменить",
    savings: "ЦЕЛЬ НАКОПЛЕНИЙ",
    protected: "Защищено от расходов",
    spentMonth: "ПОТРАЧЕНО В ЭТОМ ЦИКЛЕ",
    savingsMore: "План накоплений на {difference} выше среднего за {count} прошлых цикла: {average}",
    savingsLess: "План накоплений на {difference} ниже среднего за {count} прошлых цикла: {average}",
    savingsSame: "План накоплений совпадает со средним за {count} прошлых цикла: {average}",
    spendingMore: "Потрачено на {difference} больше среднего за {count} прошлых цикла: {average}",
    spendingLess: "Потрачено на {difference} меньше среднего за {count} прошлых цикла: {average}",
    spendingSame: "На уровне средних расходов за {count} прошлых цикла: {average}",
    recorded: "расходов записано",
    mix: "СТРУКТУРА РАСХОДОВ",
    where: "Куда уходят деньги",
    total: "всего",
    recent: "Последние расходы",
    items: "ЗАПИСЕЙ",
    expectedMonthly: "Ожидаемые ежемесячные расходы",
    oneTimeExpenses: "Разовые расходы",
    empty: "Расходов пока нет",
    emptyText: "расходы появятся здесь после добавления.",
    receipt: "Чек",
    chat: "Добавлено в чате",
    here: "Добавлено здесь",
    quick: "БЫСТРОЕ ДОБАВЛЕНИЕ",
    add: "Добавить расход",
    formIntro: "Добавьте расход здесь или просто отправьте сумму в чате.",
    amount: "Сумма",
    category: "Категория",
    paymentMethod: "Способ оплаты",
    debit: "Дебетовая карта",
    credit: "Кредитная карта",
    creditRepaid: "Кредит погашен",
    outstandingCredit: "Непогашенный кредит",
    outstandingCreditDetail: "Расходы по кредитной карте ожидают погашения.",
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
    themeLabel: "Тема",
    themeBannerLabel: "Баннер с персонажами темы {theme}",
    financeHistoryLabel: "История циклов зарплаты",
    monthlyPlanLabel: "Баланс цикла зарплаты",
    monthlyTotalsLabel: "Итоги цикла зарплаты",
    budgetUsed: "Использовано {percent}% бюджета на расходы",
    salaryAllocation: "Потрачено {spent}% зарплаты; {savings}% отведено на накопления",
    noSpendingBudget: "НЕТ БЮДЖЕТА НА РАСХОДЫ",
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
const SALARY_SCHEDULE = financeHistoryJson.salarySchedule;
const DAY_MS = 24 * 60 * 60 * 1000;

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

function todayInVilnius() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vilnius",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${value.year}-${value.month}-${value.day}`;
}

function safeMoney(value: number) {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function financeDataForMonth(
  month: MonthRecord,
  savedData?: Partial<SavedFinanceData> | null,
): FinanceData {
  const savedSavings = Number(savedData?.savingsGoal);
  return {
    salary: safeMoney(month.salary),
    savingsGoal: Number.isFinite(savedSavings)
      ? Math.max(savedSavings, 0)
      : safeMoney(month.savingsGoal),
    expenses: Array.isArray(savedData?.expenses)
      ? savedData.expenses
      : month.expenses,
  };
}

function toCents(value: number) {
  return Math.round(safeMoney(value) * 100);
}

function sumExpenses(expenses: Expense[]) {
  return expenses.reduce((sum, expense) => sum + toCents(expense.amount), 0) / 100;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function parseExpenseAmount(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!/^(?:\d+|\d*\.\d{1,2})$/.test(normalized)) return null;
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? roundMoney(amount) : null;
}

function calendarDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`);
}

function dailyExpensePoints(
  expenses: Expense[],
  period: MonthRecord["period"],
  asOfDate: string,
) {
  const totals = expenses.reduce((daily, expense) => {
    daily.set(expense.date, (daily.get(expense.date) ?? 0) + toCents(expense.amount));
    return daily;
  }, new Map<string, number>());
  const points: Array<{ x: number; y: number }> = [];
  const effectiveEnd = asOfDate < period.start
    ? period.start
    : asOfDate > period.end
      ? period.end
      : asOfDate;
  const cursor = dateFromKey(period.start);
  const end = dateFromKey(effectiveEnd);

  while (cursor <= end) {
    const date = calendarDateKey(cursor);
    points.push({
      x: cursor.getTime(),
      y: (totals.get(date) ?? 0) / 100,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState<MonthRecord>(INITIAL_MONTH);
  const [data, setData] = useState<FinanceData>(() => financeDataForMonth(INITIAL_MONTH));
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [paymentMethod, setPaymentMethod] = useState<"debit" | "credit">("debit");
  const [hydratedStorageKey, setHydratedStorageKey] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<ThemeId>("kinance");
  const [recurringExpanded, setRecurringExpanded] = useState(true);
  const [oneTimeExpanded, setOneTimeExpanded] = useState(true);
  const dailyChartRef = useRef<HTMLDivElement>(null);
  const selectedStorageKey =
    `kinance:${selectedMonth.month}:${selectedMonth.updatedAt}:r${selectedMonth.revision}`;
  const legacySelectedStorageKey =
    `euroscope:${selectedMonth.month}:${selectedMonth.updatedAt}:r${selectedMonth.revision}`;

  /* Device-local preferences and entries hydrate only after the client mounts. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("kinance:language") ??
      localStorage.getItem("euroscope:language");
    if (savedLanguage === "ru") setLanguage("ru");
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("kinance:theme");
    const nextTheme = THEMES.some(({ id }) => id === savedTheme)
      ? (savedTheme as ThemeId)
      : "kinance";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    let savedData: Partial<SavedFinanceData> | null = null;
    try {
      const saved =
        localStorage.getItem(selectedStorageKey) ??
        localStorage.getItem(legacySelectedStorageKey);
      if (saved) savedData = JSON.parse(saved) as Partial<SavedFinanceData>;
    } catch {
      // Source data remains available if browser storage is unavailable.
    }
    setData(financeDataForMonth(selectedMonth, savedData));
    setHydratedStorageKey(selectedStorageKey);
  }, [legacySelectedStorageKey, selectedMonth, selectedStorageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (hydratedStorageKey !== selectedStorageKey) return;
    try {
      localStorage.setItem(
        selectedStorageKey,
        JSON.stringify({
          savingsGoal: data.savingsGoal,
          expenses: data.expenses,
        } satisfies SavedFinanceData),
      );
    } catch {
      // The canonical cycle remains usable when browser storage is unavailable.
    }
  }, [data.expenses, data.savingsGoal, hydratedStorageKey, selectedStorageKey]);

  const spent = useMemo(
    () => sumExpenses(data.expenses),
    [data.expenses],
  );
  const categoryTotals = useMemo(
    () =>
      CATEGORIES.map((name) => ({
        name,
        amount: sumExpenses(
          data.expenses.filter((expense) => expense.category === name),
        ),
      })),
    [data.expenses],
  );
  const recurringExpenses = data.expenses.filter((expense) => expense.recurring);
  const oneTimeExpenses = data.expenses.filter((expense) => !expense.recurring);
  const recurringTotal = sumExpenses(recurringExpenses);
  const oneTimeTotal = sumExpenses(oneTimeExpenses);
  const outstandingCreditExpenses = HISTORY
    .flatMap((record) =>
      record.month === selectedMonth.month ? data.expenses : record.expenses,
    )
    .filter(
      (expense) =>
        expense.paymentMethod === "credit" && expense.creditStatus !== "repaid",
    );
  const outstandingCreditTotal = sumExpenses(outstandingCreditExpenses);
  const salary = safeMoney(data.salary);
  const savings = safeMoney(data.savingsGoal);
  const cashRemaining = roundMoney(salary - spent);
  const safeRemaining = roundMoney(cashRemaining - savings);
  const spentPercent = salary > 0 ? (spent / salary) * 100 : spent > 0 ? null : 0;
  const visualSpentPercent = spentPercent === null ? 100 : Math.min(spentPercent, 100);
  const savingsPercent = salary > 0 ? Math.min((savings / salary) * 100, 100) : savings > 0 ? 100 : 0;
  const savingsStartDegrees = (100 - savingsPercent) * 3.6;
  const spentEndDegrees = Math.min(visualSpentPercent * 3.6, savingsStartDegrees);
  const [year, month] = selectedMonth.month.split("-").map(Number);
  const { start: cycleStart, end: cycleEnd } = salaryCycleDates(selectedMonth.month);
  const todayKey = todayInVilnius();
  const today = dateFromKey(todayKey);
  const isCurrentCycle = today >= cycleStart && today <= cycleEnd;
  const markerDate = isCurrentCycle ? today : cycleEnd;
  const totalCycleDays = inclusiveDayCount(cycleStart, cycleEnd);
  const elapsedCycleDays = Math.min(
    Math.max(inclusiveDayCount(cycleStart, markerDate), 1),
    totalCycleDays,
  );
  const daysRemaining = Math.max(totalCycleDays - elapsedCycleDays, 1);
  const allFundsDailyPace = Math.max(cashRemaining, 0) / daysRemaining;
  const savingsSafeDailyPace = Math.max(safeRemaining, 0) / daysRemaining;
  const locale = language === "ru" ? "ru-RU" : "en-GB";
  const euro = useMemo(
    () => new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }),
    [locale],
  );
  const compactEuro = useMemo(
    () => new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }),
    [locale],
  );
  const copy = COPY[language];
  const selectedTheme = THEMES.find(({ id }) => id === theme) ?? THEMES[0];
  const themeBannerLabel = fillTemplate(copy.themeBannerLabel, {
    theme: selectedTheme.label,
  });
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
  const selectedIndex = HISTORY.findIndex(
    (record) => record.month === selectedMonth.month,
  );
  const previousCycles =
    selectedIndex > 0
      ? HISTORY.slice(Math.max(0, selectedIndex - 3), selectedIndex)
      : [];
  const comparisonFor = (kind: "savings" | "spending", currentValue: number) => {
    if (!previousCycles.length) return null;

    const values = previousCycles.map((record) =>
      kind === "savings"
        ? record.savingsGoal
        : sumExpenses(
            record.expenses.filter((expense) => {
              const expenseDay = inclusiveDayCount(
                dateFromKey(record.period.start),
                dateFromKey(expense.date),
              );
              return expenseDay >= 1 && expenseDay <= elapsedCycleDays;
            }),
          ),
    );
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const difference = currentValue - average;
    const replacements = {
      difference: euro.format(Math.abs(difference)),
      average: euro.format(average),
      count: previousCycles.length,
    };

    if (Math.abs(difference) < 0.005) {
      return {
        text: fillTemplate(
          kind === "savings" ? copy.savingsSame : copy.spendingSame,
          replacements,
        ),
        tone: "neutral",
      };
    }

    const isMore = difference > 0;
    const template =
      kind === "savings"
        ? isMore
          ? copy.savingsMore
          : copy.savingsLess
        : isMore
          ? copy.spendingMore
          : copy.spendingLess;
    const favorable = kind === "savings" ? isMore : !isMore;
    return {
      text: fillTemplate(template, replacements),
      tone: favorable ? "favorable" : "unfavorable",
    };
  };
  const savingsComparison = comparisonFor("savings", savings);
  const spendingComparison = comparisonFor("spending", spent);
  const categoryLabel = (name: Category) => CATEGORY_LABELS[language][name];
  const expenseNoteLabel = (expense: Expense) =>
    expense.noteTranslations?.[language] ?? expense.note;
  const paymentLabel = (expense: Expense) => {
    if (expense.paymentMethod === "credit" && expense.creditStatus === "repaid") {
      return copy.creditRepaid;
    }
    return expense.paymentMethod === "credit" ? copy.credit : copy.debit;
  };
  const expenseList = (expenses: Expense[]) => (
    <ul className="expense-list">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <span className="expense-category-icon" aria-hidden="true">
            {/* Category art is decorative because the localized category name follows in text. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CATEGORY_ICONS[expense.category]}
              alt=""
              width={256}
              height={256}
              loading="lazy"
              decoding="async"
            />
          </span>
          <span className="expense-info">
            <span className="expense-title-row">
              <strong>{expenseNoteLabel(expense)}</strong>
              <span
                className={`payment-badge ${
                  expense.paymentMethod === "credit"
                    ? expense.creditStatus === "repaid"
                      ? "credit-repaid"
                      : "credit-outstanding"
                    : "debit"
                }`}
              >
                {paymentLabel(expense)}
              </span>
            </span>
            <small>
              {categoryLabel(expense.category)} ·{" "}
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
  );
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

  useEffect(() => {
    const container = dailyChartRef.current;
    if (!container) return;
    let active = true;
    let chart: { destroy: () => void } | null = null;

    const draw = async () => {
      const { default: ApexCharts } = await import("apexcharts");
      if (!active) return;
      const themeStyles = getComputedStyle(document.documentElement);
      const accent = themeStyles.getPropertyValue("--chart-accent").trim() || "#5ac8fa";
      const glow = themeStyles.getPropertyValue("--chart-glow").trim() || accent;

      chart = new ApexCharts(container, {
        chart: {
          type: "area",
          height: 168,
          background: "transparent",
          fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font-family"),
          animations: { enabled: !window.matchMedia("(prefers-reduced-motion: reduce)").matches },
          sparkline: { enabled: true },
          dropShadow: { enabled: true, top: 2, left: 0, blur: 5, color: glow, opacity: 0.28 },
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        series: [{
          name: copy.dailyExpenseSeries,
          data: dailyExpensePoints(
            data.expenses.filter((expense) => !expense.recurring),
            selectedMonth.period,
            todayKey,
          ),
        }],
        colors: [accent],
        stroke: { curve: "smooth", width: 2.25, lineCap: "round" },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0.12,
            opacityFrom: 0.52,
            opacityTo: 0.04,
            stops: [0, 68, 100],
          },
        },
        markers: { size: 0 },
        dataLabels: { enabled: false },
        grid: { show: false, padding: { left: 3, right: 3, top: 8, bottom: 1 } },
        xaxis: { type: "datetime" },
        yaxis: { min: 0 },
        tooltip: { enabled: false },
      });
      await (chart as { render: () => Promise<void> }).render();
    };

    void draw();
    return () => {
      active = false;
      chart?.destroy();
    };
  }, [copy.dailyExpenseSeries, data.expenses, selectedMonth.period, theme, todayKey]);

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = parseExpenseAmount(amount);
    if (value === null) return;

    setData((current) => ({
      ...current,
      expenses: [
        {
          id: crypto.randomUUID(),
          amount: value,
          note: note.trim() || category,
          date: todayInVilnius(),
          category,
          source: "site",
          paymentMethod,
          ...(paymentMethod === "credit" ? { creditStatus: "outstanding" as const } : {}),
        },
        ...current.expenses,
      ],
    }));
    setAmount("");
    setNote("");
    setPaymentMethod("debit");
  }

  return (
    <main>
      <div className="shell">
        {outstandingCreditTotal > 0 && (
          <section className="credit-alert" role="alert" aria-live="assertive">
            <span className="credit-alert-icon" aria-hidden="true">CC</span>
            <div>
              <strong>{copy.outstandingCredit}</strong>
              <p>{copy.outstandingCreditDetail}</p>
            </div>
            <strong className="credit-alert-total">
              {euro.format(outstandingCreditTotal)}
            </strong>
          </section>
        )}

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
            <label className="theme-switcher" data-current-theme={theme}>
              <span className="sr-only">{copy.themeLabel}</span>
              <select
                aria-label={copy.themeLabel}
                value={theme}
                onChange={(event) => {
                  const nextTheme = event.target.value as ThemeId;
                  setTheme(nextTheme);
                  document.documentElement.dataset.theme = nextTheme;
                  localStorage.setItem("kinance:theme", nextTheme);
                }}
              >
                {THEMES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
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

        {HISTORY.length > 1 && (
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
        )}

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

        <section className="theme-banner" aria-label={themeBannerLabel}>
          {/* Theme artwork is served as a direct PNG so data-driven theme paths stay portable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={selectedTheme.id}
            src={selectedTheme.banner}
            alt={themeBannerLabel}
            width={2048}
            height={683}
            fetchPriority="high"
            decoding="async"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        </section>

        <div
          ref={dailyChartRef}
          className="daily-expense-chart"
          role="img"
          aria-label={copy.dailySpendingChartLabel}
        />

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
              <span>
                {spentPercent === null
                  ? copy.noSpendingBudget
                  : `${Math.round(spentPercent)}% ${copy.spent}`}
              </span>
            </div>
            <div className="balance-main">
              <div>
                <strong>{euro.format(cashRemaining)}</strong>
                <span className="balance-caption">{copy.left}</span>
                <span className="balance-safe-caption">
                  <b>{euro.format(safeRemaining)}</b> {copy.afterSavings}
                </span>
              </div>
              <div
                className="progress-ring"
                style={{
                  "--spent-end": `${spentEndDegrees}deg`,
                  "--savings-start": `${savingsStartDegrees}deg`,
                } as React.CSSProperties}
                aria-label={
                  spentPercent === null
                    ? copy.noSpendingBudget
                    : fillTemplate(copy.salaryAllocation, {
                        spent: Math.round(spentPercent),
                        savings: Math.round(savingsPercent),
                      })
                }
              >
                <span>{spentPercent === null ? "!" : `${Math.round(spentPercent)}%`}</span>
              </div>
            </div>
            <div className="pace-row">
              <span className="pace-heading">{copy.pace}</span>
              <div className="pace-values">
                <span className="pace-limit pace-limit-all">
                  <small>{copy.allFunds}</small>
                  <strong>{compactEuro.format(allFundsDailyPace)} {copy.day}</strong>
                </span>
                <span className="pace-limit pace-limit-safe">
                  <small>{copy.savingsSafe}</small>
                  <strong>{compactEuro.format(savingsSafeDailyPace)} {copy.day}</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="stat-grid" aria-label={copy.monthlyTotalsLabel}>
          <article className="stat-card salary salary-locked">
            <span className="stat-icon salary-lock-icon" aria-hidden="true">FIXED</span>
            <p>{copy.salary}</p>
            <strong className="locked-salary">{euro.format(salary)}</strong>
            <small className="locked-status">
              <span aria-hidden="true">●</span>
              <span>{copy.salaryLocked}</span>
            </small>
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
            {savingsComparison && (
              <div className={`stat-comparison ${savingsComparison.tone}`}>
                {savingsComparison.text}
              </div>
            )}
          </article>

          <article className="stat-card expenses">
            <span className="stat-icon" aria-hidden="true">↓</span>
            <p>{copy.spentMonth}</p>
            <strong>{euro.format(spent)}</strong>
            <small>{data.expenses.length} {copy.recorded}</small>
            {spendingComparison && (
              <div className={`stat-comparison ${spendingComparison.tone}`}>
                {spendingComparison.text}
              </div>
            )}
          </article>
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
          <div className="ledger-stack">
            {recurringExpenses.length > 0 && (
              <details
                className="expense-table recurring-expenses"
                open={recurringExpanded}
                onToggle={(event) =>
                  setRecurringExpanded(event.currentTarget.open)
                }
              >
                <summary className="expense-table-summary">
                  <span>{copy.expectedMonthly}</span>
                  <strong>{euro.format(recurringTotal)}</strong>
                </summary>
                <div className="expense-table-body">
                  <div className="expense-table-meta">
                    <span>{recurringExpenses.length} {copy.items}</span>
                  </div>
                  {expenseList(recurringExpenses)}
                </div>
              </details>
            )}

            <details
              className="expense-table one-time-expenses-table"
              open={oneTimeExpanded}
              onToggle={(event) =>
                setOneTimeExpanded(event.currentTarget.open)
              }
            >
              <summary className="expense-table-summary">
                <span>{copy.oneTimeExpenses}</span>
                <strong>{euro.format(oneTimeTotal)}</strong>
              </summary>
              <div className="expense-table-body">
                <div className="expense-table-meta">
                  <span>{oneTimeExpenses.length} {copy.items}</span>
                </div>
                {oneTimeExpenses.length > 0 ? (
                  expenseList(oneTimeExpenses)
                ) : (
                  <div className="empty-state">
                    <span aria-hidden="true">○</span>
                    <h3>{copy.empty}</h3>
                    <p>{monthLabel}: {copy.emptyText}</p>
                  </div>
                )}
              </div>
            </details>
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
              <label htmlFor="payment-method">{copy.paymentMethod}</label>
              <select
                id="payment-method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value as "debit" | "credit")
                }
              >
                <option value="debit">{copy.debit}</option>
                <option value="credit">{copy.credit}</option>
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
