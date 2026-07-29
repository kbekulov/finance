"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import financeHistoryJson from "@/data/finance-history.json";
import strengthHistoryJson from "@/data/strength-history.json";

type Category =
  | "Food"
  | "Subscriptions & services"
  | "Luxury purchases"
  | "Debt & repayments"
  | "Devices & installments"
  | "Transport & Travel"
  | "Alcohol & nightlife";
type Language = "en" | "ru";

const STRENGTH_REFERENCE_BODY_MASS_KG = 75;
const STRENGTH_ALLOMETRIC_EXPONENT = 1 / 3;
const STRENGTH_PULL_UP_TARGET_REPS = 20;
const STRENGTH_PUSH_UP_TARGET_REPS = 50;
const STRENGTH_RANK_OPTICAL_X_PX = 5;
const STRENGTH_RANKS = [
  { threshold: 1, abbreviation: "Pvt.", en: "Private", ru: "Рядовой" },
  { threshold: 1.5, abbreviation: "Sr. Pvt.", en: "Senior Private", ru: "Старший рядовой" },
  { threshold: 2, abbreviation: "Cpl.", en: "Corporal", ru: "Капрал" },
  { threshold: 2.5, abbreviation: "Sgt.", en: "Sergeant", ru: "Сержант" },
  { threshold: 3, abbreviation: "Sgt. Spec.", en: "Sergeant Specialist", ru: "Сержант-специалист" },
  { threshold: 3.5, abbreviation: "SSgt.", en: "Staff Sergeant", ru: "Штаб-сержант" },
  { threshold: 4, abbreviation: "Sgt. Maj.", en: "Sergeant Major", ru: "Сержант-майор" },
  { threshold: 4.5, abbreviation: "MSgt.", en: "Master Sergeant", ru: "Мастер-сержант" },
  { threshold: 5, abbreviation: "CSM", en: "Command Sergeant Major", ru: "Главный сержант-майор" },
  { threshold: 5.5, abbreviation: "Off. Asp.", en: "Officer Aspirant", ru: "Кандидат в офицеры" },
  { threshold: 6, abbreviation: "Jr. Lt.", en: "Junior Lieutenant", ru: "Младший лейтенант" },
  { threshold: 6.5, abbreviation: "Lt.", en: "Lieutenant", ru: "Лейтенант" },
  { threshold: 7, abbreviation: "Cpt.", en: "Captain", ru: "Капитан" },
  { threshold: 7.5, abbreviation: "Maj.", en: "Major", ru: "Майор" },
  { threshold: 8, abbreviation: "Lt. Col.", en: "Lieutenant Colonel", ru: "Подполковник" },
  { threshold: 8.5, abbreviation: "Col.", en: "Colonel", ru: "Полковник" },
  { threshold: 9, abbreviation: "Brig. Gen.", en: "Brigadier General", ru: "Бригадный генерал" },
  { threshold: 9.5, abbreviation: "Maj. Gen.", en: "Major General", ru: "Генерал-майор" },
  { threshold: 9.8, abbreviation: "Lt. Gen.", en: "Lieutenant General", ru: "Генерал-лейтенант" },
  { threshold: 10, abbreviation: "Gen.", en: "General", ru: "Генерал" },
] as const;

const RANK_INSIGNIA_SETS = [
  { id: "imperial-blend", file: "rank-insignia-atlas.png", en: "Imperial blend", ru: "Имперский стиль" },
  { id: "modern-russia", file: "rank-insignia-modern-russia.png", en: "Modern Russia", ru: "Современная Россия" },
  { id: "france", file: "rank-insignia-france.png", en: "France", ru: "Франция" },
  { id: "britain", file: "rank-insignia-britain.png", en: "Britain", ru: "Британия" },
  { id: "china", file: "rank-insignia-china.png", en: "China", ru: "Китай" },
  { id: "japan", file: "rank-insignia-japan.png", en: "Japan", ru: "Япония" },
  { id: "germany", file: "rank-insignia-germany.png", en: "Germany", ru: "Германия" },
  { id: "italy", file: "rank-insignia-italy.png", en: "Italy", ru: "Италия" },
  { id: "poland", file: "rank-insignia-poland.png", en: "Poland", ru: "Польша" },
  { id: "south-korea", file: "rank-insignia-south-korea.png", en: "South Korea", ru: "Южная Корея" },
] as const;
type RankInsigniaSetId = (typeof RANK_INSIGNIA_SETS)[number]["id"];

const THEMES = [
  { id: "kinance", label: "Kinance", banners: ["/theme-banners/kinance.png?v=12", "/theme-banners/kinance-frame-2.png?v=12"] },
  { id: "kinance-moon", label: "Kinance Moon", banners: ["/theme-banners/kinance.png?v=12", "/theme-banners/kinance-frame-2.png?v=12"] },
  { id: "nier-automata", label: "NieR:Automata", banners: ["/theme-banners/nier-automata.png?v=2"] },
  { id: "tohsaka-rin", label: "Tohsaka Rin", banners: ["/theme-banners/tohsaka-rin.png?v=2"] },
] as const;
type ThemeId = (typeof THEMES)[number]["id"];

const PREFERENCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const THEME_COOKIE = "kinance_theme";
const LANGUAGE_COOKIE = "kinance_language";
const RANK_INSIGNIA_COOKIE = "kinance_rank_insignia_set";

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

type AdditionalIncome = {
  id: string;
  amount: number;
  note: string;
  noteTranslations: Record<Language, string>;
  date: string;
  source: "chat" | "site";
};

type FinanceData = {
  salary: number;
  additionalIncome: AdditionalIncome[];
  savingsGoal: number;
  expenses: Expense[];
};

type StrengthEntry = {
  id: string;
  date: string;
  weightKg: number;
  maxPullUpsSingleSet: number;
  maxPushUpsSingleSet: number;
  source: "chat";
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

const KINANCE_CATEGORY_ICONS: Record<Category, string> = {
  Food: "/category-icons/food-rpg.png?v=1",
  "Subscriptions & services": "/category-icons/services-rpg.png?v=1",
  "Luxury purchases": "/category-icons/luxury-rpg.png?v=1",
  "Debt & repayments": "/category-icons/debt-rpg.png?v=1",
  "Devices & installments": "/category-icons/devices-rpg.png?v=1",
  "Transport & Travel": "/category-icons/transport-rpg.png?v=1",
  "Alcohol & nightlife": "/category-icons/alcohol-rpg.png?v=1",
};

const CHARACTER_CATEGORY_ICON_POOLS: Record<Category, readonly string[]> = {
  Food: [
    "/category-icons/food.png?v=5",
    "/category-icons/food-kohaku.png?v=1",
    "/category-icons/food-soujuurou.png?v=1",
  ],
  "Subscriptions & services": [
    "/category-icons/subscriptions-services.png?v=5",
    "/category-icons/subscriptions-bb.png?v=1",
    "/category-icons/subscriptions-sion.png?v=1",
  ],
  "Luxury purchases": [
    "/category-icons/luxury-purchases.png?v=5",
    "/category-icons/luxury-nero.png?v=1",
    "/category-icons/luxury-alice.png?v=1",
  ],
  "Debt & repayments": [
    "/category-icons/debt-repayments.png?v=5",
    "/category-icons/debt-mash.png?v=1",
    "/category-icons/debt-shiki-ryougi.png?v=1",
  ],
  "Devices & installments": [
    "/category-icons/devices-installments.png?v=5",
    "/category-icons/devices-ciel.png?v=1",
    "/category-icons/devices-touko.png?v=1",
  ],
  "Transport & Travel": [
    "/category-icons/transport-travel.png?v=5",
    "/category-icons/transport-arcueid.png?v=1",
    "/category-icons/transport-shiki-tohno.png?v=1",
  ],
  "Alcohol & nightlife": [
    "/category-icons/alcohol-nightlife.png?v=5",
    "/category-icons/alcohol-shuten.png?v=1",
    "/category-icons/alcohol-aoko.png?v=1",
  ],
};

function categoryIconFor(expense: Expense, selectedTheme: ThemeId) {
  if (selectedTheme === "kinance") {
    return KINANCE_CATEGORY_ICONS[expense.category];
  }

  const pool = CHARACTER_CATEGORY_ICON_POOLS[expense.category];
  let hash = 2166136261;
  for (const character of expense.id) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b);
  hash ^= hash >>> 16;
  return pool[(hash >>> 0) % pool.length];
}

function readPreferenceCookie(name: string) {
  if (typeof document === "undefined") return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

function writePreferenceCookie(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${PREFERENCE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

const COPY = {
  en: {
    available: "DEBIT BALANCE",
    spent: "SPENT",
    left: "on card until next salary",
    afterSavings: "after protecting savings",
    pace: "DAILY LIMITS",
    allFunds: "All funds",
    savingsSafe: "Savings safe",
    savingsPreserved: "Savings protected",
    savingsViolated: "Savings used",
    allowanceGuide: "{amount}/day · {label}",
    day: "/ day",
    salary: "SALARY THIS CYCLE",
    salaryLocked: "Locked to this salary cycle",
    additionalIncome: "SIDE INCOME",
    totalIncome: "TOTAL INCOME",
    dailySpendingEyebrow: "DAILY RHYTHM",
    dailySpending: "Daily expenses",
    dailySpendingIntro: "What left your account each day this salary cycle",
    thisCycleTotal: "This cycle",
    dailyExpenseSeries: "Debit spending",
    creditExpenseSeries: "Credit spending",
    weightSeries: "Body weight",
    relativeStrengthSeries: "Relative strength",
    dailySpendingChartLabel: "Stacked debit and credit spending bars with body-weight and relative-strength lines, plus daily allowance guides",
    chartDaySpent: "{amount} spent on {date}",
    strengthTitle: "RELATIVE STRENGTH",
    strengthScore: "CURRENT SCORE",
    strengthNoAttempts: "Log an attempt to establish your baseline",
    strengthLatest: "Latest attempt · {date}",
    strengthWeight: "Weight",
    strengthPullUps: "Pull-ups",
    strengthPushUps: "Push-ups",
    strengthTarget: "Target for a 10.0 score: {value}",
    strengthRank: "{rank}, strength rank {level} of 20",
    strengthRankControl: "{rank}, strength rank {level} of 20. Insignia style: {set}. Tap to change.",
    strengthLatestMetrics: "Latest relative strength attempt metrics",
    strengthSave: "Save attempt",
    strengthNote: "Best single sets · never summed · body-mass adjusted personal index",
    strengthWeightUnit: "kg",
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
    recorded: "{count} recorded expense{plural}",
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
    monthsSaved: "{count} / 12 cycles saved",
    spendingInsight: "Spending insight",
    spendingClear: "No spending pressure yet. Keep logging expenses to receive current guidance.",
    spendingLargest: "{category} is your largest cost at {amount} ({percent}% of spending).",
    spendingCut: "For flexible cuts, focus on {category} next ({amount}).",
    spendingSame: "Pause new spending in this category until the balance improves.",
    kinanceHome: "Kinance home",
    languageLabel: "Language",
    themeLabel: "Theme",
    themeBannerLabel: "{theme} theme artwork",
    financeHistoryLabel: "Salary cycle history",
    monthlyPlanLabel: "Salary cycle plan balance",
    monthlyTotalsLabel: "Salary cycle totals",
    budgetUsed: "{percent}% of spending budget used",
    salaryAllocation: "{spent}% of total income spent. Savings threshold: {safeLimit}%. Amount beyond threshold: {savingsUsed}.",
    noSpendingBudget: "NO SPENDING BUDGET",
    savingsEuroLabel: "Monthly savings requirement in euros",
  },
  ru: {
    available: "БАЛАНС ДЕБЕТОВОЙ КАРТЫ",
    spent: "ПОТРАЧЕНО",
    left: "на карте до следующей зарплаты",
    afterSavings: "после резерва на накопления",
    pace: "ЛИМИТЫ НА ДЕНЬ",
    allFunds: "Без сохранения накоплений",
    savingsSafe: "С сохранением накоплений",
    savingsPreserved: "Накопления сохранены",
    savingsViolated: "Накопления используются",
    allowanceGuide: "{amount}/день · {label}",
    day: "в день",
    salary: "ЗАРПЛАТА ЗА ЭТОТ ЦИКЛ",
    salaryLocked: "Зафиксирована для этого зарплатного цикла",
    additionalIncome: "ДОПОЛНИТЕЛЬНЫЕ ДОХОДЫ",
    totalIncome: "ОБЩИЙ ДОХОД",
    dailySpendingEyebrow: "ДНЕВНОЙ РИТМ",
    dailySpending: "Расходы по дням",
    dailySpendingIntro: "Сколько списывалось со счёта каждый день текущего зарплатного цикла",
    thisCycleTotal: "За текущий цикл",
    dailyExpenseSeries: "Расходы по дебету",
    creditExpenseSeries: "Расходы по кредиту",
    weightSeries: "Вес тела",
    relativeStrengthSeries: "Относительная сила",
    dailySpendingChartLabel: "Составные столбцы расходов по дебету и кредиту, графики веса и относительной силы, а также линии дневных лимитов",
    chartDaySpent: "Расходы за {date}: {amount}",
    strengthTitle: "ОТНОСИТЕЛЬНАЯ СИЛА",
    strengthScore: "ТЕКУЩИЙ БАЛЛ",
    strengthNoAttempts: "Добавьте попытку, чтобы определить исходный уровень",
    strengthLatest: "Последняя попытка · {date}",
    strengthWeight: "Вес",
    strengthPullUps: "Подтягивания",
    strengthPushUps: "Отжимания",
    strengthTarget: "Цель для оценки 10,0: {value}",
    strengthRank: "{rank}, ранг силы {level} из 20",
    strengthRankControl: "{rank}, ранг силы {level} из 20. Стиль знаков различия: {set}. Нажмите, чтобы сменить.",
    strengthLatestMetrics: "Показатели последней попытки относительной силы",
    strengthSave: "Сохранить попытку",
    strengthNote: "Лучшие одиночные подходы · подходы не суммируются · персональный индекс с поправкой на массу тела",
    strengthWeightUnit: "кг",
    edit: "Нажмите на сумму, чтобы изменить её",
    savings: "ЦЕЛЬ НАКОПЛЕНИЙ",
    protected: "Зарезервировано и не тратится",
    spentMonth: "ПОТРАЧЕНО ЗА ЭТОТ ЦИКЛ",
    savingsMore: "План накоплений на {difference} выше среднего по истории ({count} цикл.): {average}",
    savingsLess: "План накоплений на {difference} ниже среднего по истории ({count} цикл.): {average}",
    savingsSame: "План накоплений совпадает со средним по истории ({count} цикл.): {average}",
    spendingMore: "Потрачено на {difference} больше среднего по истории ({count} цикл.): {average}",
    spendingLess: "Потрачено на {difference} меньше среднего по истории ({count} цикл.): {average}",
    spendingSame: "Расходы совпадают со средним по истории ({count} цикл.): {average}",
    recorded: "Учтено расходов: {count}",
    mix: "СТРУКТУРА РАСХОДОВ",
    where: "Куда уходят деньги",
    total: "всего",
    recent: "Последние расходы",
    items: "ЗАПИСЕЙ",
    expectedMonthly: "Плановые ежемесячные расходы",
    oneTimeExpenses: "Разовые расходы",
    empty: "Расходов пока нет",
    emptyText: "расходы появятся здесь после добавления.",
    receipt: "Чек",
    chat: "Добавлено в чате",
    here: "Добавлено здесь",
    quick: "БЫСТРОЕ ДОБАВЛЕНИЕ",
    add: "Добавить расход",
    formIntro: "Добавьте расход здесь или просто отправьте сумму в чат.",
    amount: "Сумма",
    category: "Категория",
    paymentMethod: "Способ оплаты",
    debit: "Дебетовая карта",
    credit: "Кредитная карта",
    creditRepaid: "Задолженность погашена",
    outstandingCredit: "Непогашенная задолженность",
    outstandingCreditDetail: "Расходы по кредитной карте ещё не погашены.",
    what: "На что потрачено?",
    placeholder: "Кофе, Netflix, новая обувь…",
    hint: "Отправьте в чат сумму или фото чека: расход будет добавлен и распределён по категории.",
    footer: "Конфиденциальность заложена в основу. Всё понятно по умолчанию.",
    today: "Сегодня",
    monthEnd: "Конец цикла",
    updated: "Обновлено",
    monthsSaved: "Сохранено циклов: {count} из 12",
    spendingInsight: "Анализ расходов",
    spendingClear: "Пока признаков перерасхода нет. Продолжайте учитывать расходы, чтобы рекомендации оставались актуальными.",
    spendingLargest: "Самая крупная статья расходов: {category}, {amount} ({percent}% всех расходов).",
    spendingCut: "Если нужно сократить необязательные траты, начните с категории «{category}» ({amount}).",
    spendingSame: "Воздержитесь от новых трат в этой категории, пока баланс не улучшится.",
    kinanceHome: "Главная Kinance",
    languageLabel: "Язык",
    themeLabel: "Тема",
    themeBannerLabel: "Оформление темы {theme}",
    financeHistoryLabel: "История зарплатных циклов",
    monthlyPlanLabel: "Баланс зарплатного цикла",
    monthlyTotalsLabel: "Итоги зарплатного цикла",
    budgetUsed: "Использовано {percent}% доступного бюджета",
    salaryAllocation: "Потрачено {spent}% общего дохода. Порог накоплений: {safeLimit}%. Сверх порога потрачено: {savingsUsed}.",
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
const STRENGTH_ENTRIES = strengthHistoryJson.entries as StrengthEntry[];
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

function financeDataForMonth(month: MonthRecord): FinanceData {
  return {
    salary: safeMoney(month.salary),
    additionalIncome: Array.isArray(month.additionalIncome)
      ? month.additionalIncome
      : [],
    savingsGoal: safeMoney(month.savingsGoal),
    expenses: month.expenses,
  };
}

function toCents(value: number) {
  return Math.round(safeMoney(value) * 100);
}

function sumAmounts(records: ReadonlyArray<{ amount: number }>) {
  return records.reduce((sum, record) => sum + toCents(record.amount), 0) / 100;
}

function sumExpenses(expenses: Expense[]) {
  return sumAmounts(expenses);
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
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
  paymentMethod?: Expense["paymentMethod"],
) {
  const totals = expenses.reduce((daily, expense) => {
    if (paymentMethod && (expense.paymentMethod ?? "debit") !== paymentMethod) return daily;
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

function relativeStrengthScore(
  weightKg: number,
  maxPullUpsSingleSet: number,
  maxPushUpsSingleSet: number,
) {
  const safeWeightKg = Number.isFinite(weightKg) ? Math.max(weightKg, 0) : 0;
  const safePullUps = Number.isFinite(maxPullUpsSingleSet)
    ? Math.max(maxPullUpsSingleSet, 0)
    : 0;
  const safePushUps = Number.isFinite(maxPushUpsSingleSet)
    ? Math.max(maxPushUpsSingleSet, 0)
    : 0;
  const massAdjustment =
    (safeWeightKg / STRENGTH_REFERENCE_BODY_MASS_KG) ** STRENGTH_ALLOMETRIC_EXPONENT;
  const pullComponent = Math.min(
    (safePullUps * massAdjustment) / STRENGTH_PULL_UP_TARGET_REPS,
    1,
  );
  const pushComponent = Math.min(
    (safePushUps * massAdjustment) / STRENGTH_PUSH_UP_TARGET_REPS,
    1,
  );
  const score = 1 + 9 * ((pullComponent + pushComponent) / 2);
  return Math.round(Math.min(Math.max(score, 1), 10) * 10) / 10;
}

function relativeStrengthTargets(weightKg: number) {
  const safeWeightKg = Number.isFinite(weightKg) ? Math.max(weightKg, 0) : 0;
  if (safeWeightKg === 0) return null;

  const massAdjustment =
    (safeWeightKg / STRENGTH_REFERENCE_BODY_MASS_KG) ** STRENGTH_ALLOMETRIC_EXPONENT;
  return {
    pullUps: Math.ceil(STRENGTH_PULL_UP_TARGET_REPS / massAdjustment - 1e-10),
    pushUps: Math.ceil(STRENGTH_PUSH_UP_TARGET_REPS / massAdjustment - 1e-10),
  };
}

function relativeStrengthRank(score: number | null) {
  if (score === null || !Number.isFinite(score)) return null;

  let index = 0;
  STRENGTH_RANKS.forEach((rank, rankIndex) => {
    if (score >= rank.threshold) index = rankIndex;
  });
  return {
    ...STRENGTH_RANKS[index],
    level: index + 1,
    backgroundPosition: `calc(${(index % 5) * 25}% + ${STRENGTH_RANK_OPTICAL_X_PX}px) ${(Math.floor(index / 5) * 100) / 3}%`,
  };
}

function dailyStrengthPoints(
  entries: StrengthEntry[],
  period: MonthRecord["period"],
  asOfDate: string,
) {
  const dailyBest = new Map<string, number>();
  for (const entry of entries) {
    if (entry.date < period.start || entry.date > period.end || entry.date > asOfDate) continue;
    const score = relativeStrengthScore(
      entry.weightKg,
      entry.maxPullUpsSingleSet,
      entry.maxPushUpsSingleSet,
    );
    dailyBest.set(entry.date, Math.max(dailyBest.get(entry.date) ?? 0, score));
  }
  return [...dailyBest.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, score]) => ({ x: dateFromKey(date).getTime(), y: score }));
}

function dailyWeightPoints(
  entries: StrengthEntry[],
  period: MonthRecord["period"],
  asOfDate: string,
) {
  const dailyLatest = new Map<string, number>();
  for (const entry of entries) {
    if (entry.date < period.start || entry.date > period.end || entry.date > asOfDate) continue;
    if (!Number.isFinite(entry.weightKg)) continue;
    dailyLatest.set(entry.date, entry.weightKg);
  }
  return [...dailyLatest.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, weight]) => ({ x: dateFromKey(date).getTime(), y: weight }));
}

function weightAxisBounds(points: Array<{ x: number; y: number }>) {
  if (!points.length) return { min: 0, max: 1 };
  const values = points.map(({ y }) => y);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max((maximum - minimum) * 0.2, 0.5);
  return {
    min: Math.max(Math.floor((minimum - padding) * 10) / 10, 0),
    max: Math.ceil((maximum + padding) * 10) / 10,
  };
}

const DAILY_CHART_HEIGHT = 168;
const DAILY_CHART_TOP_PADDING = 8;
const DAILY_CHART_BOTTOM_PADDING = 14;

function allowanceGuideTop(value: number, maximum: number) {
  const safeMaximum = Number.isFinite(maximum) && maximum > 0 ? maximum : 1;
  const normalizedValue = Math.min(Math.max(value / safeMaximum, 0), 1);
  const plotHeight = DAILY_CHART_HEIGHT - DAILY_CHART_TOP_PADDING - DAILY_CHART_BOTTOM_PADDING;
  const pixelTop = DAILY_CHART_TOP_PADDING + (1 - normalizedValue) * plotHeight;
  return Math.round((pixelTop / DAILY_CHART_HEIGHT) * 10000) / 100;
}

function allowanceGuideTops(allFunds: number, savingsSafe: number, maximum: number) {
  return {
    allFundsTop: allowanceGuideTop(allFunds, maximum),
    savingsSafeTop: allowanceGuideTop(savingsSafe, maximum),
  };
}

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState<MonthRecord>(INITIAL_MONTH);
  const data = financeDataForMonth(selectedMonth);
  const [language, setLanguage] = useState<Language>("ru");
  const [theme, setTheme] = useState<ThemeId>("kinance");
  const [rankInsigniaSet, setRankInsigniaSet] = useState<RankInsigniaSetId>("imperial-blend");
  const [bannerFrame, setBannerFrame] = useState(0);
  const [spendingInsightOpen, setSpendingInsightOpen] = useState(false);
  const [recurringExpanded, setRecurringExpanded] = useState(true);
  const [oneTimeExpanded, setOneTimeExpanded] = useState(true);
  const dailyChartRef = useRef<HTMLDivElement>(null);
  const dailyChartShellRef = useRef<HTMLDivElement>(null);
  const spendingInsightRef = useRef<HTMLDivElement>(null);
  const [selectedChartDay, setSelectedChartDay] = useState<{ timestamp: number; total: number } | null>(null);

  /* Cookie preferences hydrate only after the client mounts. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedLanguage = readPreferenceCookie(LANGUAGE_COOKIE);
    const nextLanguage: Language = savedLanguage === "en" ? "en" : "ru";
    setLanguage(nextLanguage);
    writePreferenceCookie(LANGUAGE_COOKIE, nextLanguage);
  }, []);

  useEffect(() => {
    const savedSet = readPreferenceCookie(RANK_INSIGNIA_COOKIE);
    const nextSet = RANK_INSIGNIA_SETS.some(({ id }) => id === savedSet)
      ? (savedSet as RankInsigniaSetId)
      : "imperial-blend";
    setRankInsigniaSet(nextSet);
    writePreferenceCookie(RANK_INSIGNIA_COOKIE, nextSet);
  }, []);

  useEffect(() => {
    const savedTheme = readPreferenceCookie(THEME_COOKIE);
    const nextTheme = THEMES.some(({ id }) => id === savedTheme)
      ? (savedTheme as ThemeId)
      : "kinance";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    writePreferenceCookie(THEME_COOKIE, nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!spendingInsightOpen) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!spendingInsightRef.current?.contains(event.target as Node)) {
        setSpendingInsightOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSpendingInsightOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [spendingInsightOpen]);

  /* eslint-enable react-hooks/set-state-in-effect */

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
  const additionalIncomeTotal = sumAmounts(data.additionalIncome);
  const totalIncome = roundMoney(salary + additionalIncomeTotal);
  const savings = safeMoney(data.savingsGoal);
  const cashRemaining = roundMoney(totalIncome - spent);
  const safeRemaining = roundMoney(cashRemaining - savings);
  const spentPercent = totalIncome > 0 ? (spent / totalIncome) * 100 : spent > 0 ? null : 0;
  const visualSpentPercent = spentPercent === null ? 100 : Math.min(spentPercent, 100);
  const safeSpendingLimitPercent = totalIncome > 0
    ? Math.min(Math.max(((totalIncome - savings) / totalIncome) * 100, 0), 100)
    : 0;
  const savingsStartDegrees = safeSpendingLimitPercent * 3.6;
  const spentEndDegrees = visualSpentPercent * 3.6;
  const safeSpentEndDegrees = Math.min(spentEndDegrees, savingsStartDegrees);
  const savingsUsed = Math.max(-safeRemaining, 0);
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
  const scoreFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [locale],
  );
  const copy = COPY[language];
  const selectedRankInsigniaSet = RANK_INSIGNIA_SETS.find(({ id }) => id === rankInsigniaSet)
    ?? RANK_INSIGNIA_SETS[0];
  const selectedTheme = THEMES.find(({ id }) => id === theme) ?? THEMES[0];
  const themeBannerSrc = selectedTheme.banners[bannerFrame % selectedTheme.banners.length];
  useEffect(() => {
    selectedTheme.banners.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
    if (
      selectedTheme.banners.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const timer = window.setInterval(
      () => setBannerFrame((frame) => (frame + 1) % selectedTheme.banners.length),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [selectedTheme]);
  const themeBannerLabel = fillTemplate(copy.themeBannerLabel, {
    theme: selectedTheme.label,
  });
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
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
              src={categoryIconFor(expense, theme)}
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
  const spendingInsightDetail = largestCategory
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
  const guideSpendingPoints = dailyExpensePoints(
    data.expenses.filter((expense) => !expense.recurring),
    selectedMonth.period,
    todayKey,
  );
  const latestStrength = [...STRENGTH_ENTRIES].sort((left, right) =>
    right.date.localeCompare(left.date) || right.id.localeCompare(left.id),
  )[0];
  const latestStrengthScore = latestStrength
    ? relativeStrengthScore(
        latestStrength.weightKg,
        latestStrength.maxPullUpsSingleSet,
        latestStrength.maxPushUpsSingleSet,
      )
    : null;
  const latestStrengthTargets = latestStrength
    ? relativeStrengthTargets(latestStrength.weightKg)
    : null;
  const latestStrengthRank = relativeStrengthRank(latestStrengthScore);
  const chartMaximum = Math.max(
    ...guideSpendingPoints.map(({ y }) => y),
    allFundsDailyPace,
    savingsSafeDailyPace,
    1,
  ) * 1.08;
  const allFundsGuideText = fillTemplate(copy.allowanceGuide, {
    label: copy.savingsViolated,
    amount: compactEuro.format(allFundsDailyPace),
  });
  const savingsSafeGuideText = fillTemplate(copy.allowanceGuide, {
    label: copy.savingsPreserved,
    amount: compactEuro.format(savingsSafeDailyPace),
  });
  const allowanceGuidePositions = allowanceGuideTops(
    allFundsDailyPace,
    savingsSafeDailyPace,
    chartMaximum,
  );

  useEffect(() => {
    const container = dailyChartRef.current;
    if (!container) return;
    setSelectedChartDay(null);
    let active = true;
    let chart: { destroy: () => void } | null = null;

    const draw = async () => {
      const { default: ApexCharts } = await import("apexcharts");
      if (!active) return;
      const themeStyles = getComputedStyle(document.documentElement);
      const accent = themeStyles.getPropertyValue("--chart-accent").trim() || "#5ac8fa";
      const creditAccent = themeStyles.getPropertyValue("--red").trim() || "#ff453a";
      const weightAccent = themeStyles.getPropertyValue("--weight-accent").trim() || "#f0a86b";
      const strengthAccent = themeStyles.getPropertyValue("--strength-accent").trim() || "#bf5af2";
      const spendingPoints = dailyExpensePoints(
        data.expenses.filter((expense) => !expense.recurring),
        selectedMonth.period,
        todayKey,
      );
      const debitPoints = dailyExpensePoints(
        data.expenses.filter((expense) => !expense.recurring),
        selectedMonth.period,
        todayKey,
        "debit",
      );
      const creditPoints = dailyExpensePoints(
        data.expenses.filter((expense) => !expense.recurring),
        selectedMonth.period,
        todayKey,
        "credit",
      );
      const strengthPoints = dailyStrengthPoints(
        STRENGTH_ENTRIES,
        selectedMonth.period,
        todayKey,
      );
      const weightPoints = dailyWeightPoints(
        STRENGTH_ENTRIES,
        selectedMonth.period,
        todayKey,
      );
      const weightBounds = weightAxisBounds(weightPoints);
      const drawChartMaximum = Math.max(
        ...spendingPoints.map(({ y }) => y),
        allFundsDailyPace,
        savingsSafeDailyPace,
        1,
      ) * 1.08;

      chart = new ApexCharts(container, {
        chart: {
          type: "line",
          height: DAILY_CHART_HEIGHT,
          stacked: true,
          stackOnlyBar: true,
          background: "transparent",
          fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font-family"),
          animations: { enabled: !window.matchMedia("(prefers-reduced-motion: reduce)").matches },
          sparkline: { enabled: true },
          toolbar: { show: false },
          zoom: { enabled: false },
          events: {
            dataPointSelection: (
              event: Event,
              _chartContext: unknown,
              config: { seriesIndex: number; dataPointIndex: number },
            ) => {
              if (config.seriesIndex > 1 || config.dataPointIndex < 0) return;
              const point = spendingPoints[config.dataPointIndex];
              if (!point) return;
              event?.stopPropagation();
              setSelectedChartDay({ timestamp: point.x, total: point.y });
            },
          },
        },
        series: [
          { name: copy.dailyExpenseSeries, type: "column", data: debitPoints },
          { name: copy.creditExpenseSeries, type: "column", data: creditPoints },
          { name: copy.weightSeries, type: "line", data: weightPoints },
          { name: copy.relativeStrengthSeries, type: "line", data: strengthPoints },
        ],
        colors: [accent, creditAccent, weightAccent, strengthAccent],
        plotOptions: {
          bar: { columnWidth: "48%", borderRadius: 4, borderRadiusApplication: "end" },
        },
        stroke: {
          curve: ["straight", "straight", "smooth", "smooth"],
          width: [0, 0, 1.5, 2.5],
          dashArray: [0, 0, 4, 0],
          lineCap: "round",
        },
        fill: { opacity: [0.68, 0.84, 0.62, 1] },
        markers: { size: [0, 0, 2.5, 3.5], strokeWidth: 0, hover: { sizeOffset: 2 } },
        dataLabels: { enabled: false },
        grid: {
          show: false,
          padding: {
            left: 3,
            right: 3,
            top: DAILY_CHART_TOP_PADDING,
            bottom: DAILY_CHART_BOTTOM_PADDING,
          },
        },
        xaxis: { type: "datetime" },
        yaxis: [
          { seriesName: [copy.dailyExpenseSeries, copy.creditExpenseSeries], min: 0, max: drawChartMaximum, show: false },
          { seriesName: copy.weightSeries, min: weightBounds.min, max: weightBounds.max, opposite: true, show: false },
          { seriesName: copy.relativeStrengthSeries, min: 1, max: 10, opposite: true, show: false },
        ],
        tooltip: { enabled: false },
      });
      await (chart as { render: () => Promise<void> }).render();
    };

    void draw();
    return () => {
      active = false;
      chart?.destroy();
    };
  }, [
    copy.dailyExpenseSeries,
    copy.creditExpenseSeries,
    copy.weightSeries,
    copy.relativeStrengthSeries,
    allFundsDailyPace,
    data.expenses,
    savingsSafeDailyPace,
    selectedMonth.period,
    theme,
    todayKey,
  ]);

  useEffect(() => {
    const closeDayDetail = (event: PointerEvent) => {
      if (event.target instanceof Node && dailyChartShellRef.current?.contains(event.target)) return;
      setSelectedChartDay(null);
    };
    document.addEventListener("pointerdown", closeDayDetail);
    return () => document.removeEventListener("pointerdown", closeDayDetail);
  }, []);

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

        <header className="topbar">
          <a className="brand" href="#top" aria-label={copy.kinanceHome}>
            <span className="brand-mark" aria-hidden="true">€</span>
            <span>kinance</span>
          </a>
          <div className="spending-insight" ref={spendingInsightRef}>
            <button
              type="button"
              className="spending-insight-trigger"
              aria-expanded={spendingInsightOpen}
              aria-controls="spending-insight-tooltip"
              onClick={() => setSpendingInsightOpen((open) => !open)}
            >
              <span className="spending-insight-icon" aria-hidden="true">i</span>
              <span>{copy.spendingInsight}</span>
            </button>
            <div
              id="spending-insight-tooltip"
              className="spending-insight-tooltip"
              role="tooltip"
              hidden={!spendingInsightOpen}
            >
              <strong>{copy.spendingInsight}</strong>
              <p>{spendingInsightDetail}</p>
            </div>
          </div>
          <div className="header-meta">
            <label className="theme-switcher" data-current-theme={theme}>
              <span className="sr-only">{copy.themeLabel}</span>
              <select
                aria-label={copy.themeLabel}
                value={theme}
                onChange={(event) => {
                  const nextTheme = event.target.value as ThemeId;
                  setTheme(nextTheme);
                  document.documentElement.dataset.theme = nextTheme;
                  writePreferenceCookie(THEME_COOKIE, nextTheme);
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
                    writePreferenceCookie(LANGUAGE_COOKIE, item);
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
            <span className="updated-label">{updatedLabel}</span>
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
            <span>{fillTemplate(copy.monthsSaved, { count: HISTORY.length })}</span>
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
            key={`${selectedTheme.id}-${themeBannerSrc}`}
            src={themeBannerSrc}
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

        <div ref={dailyChartShellRef} className="daily-expense-chart" role="group" aria-label={copy.dailySpendingChartLabel}>
          <div ref={dailyChartRef} className="daily-expense-chart-canvas" aria-hidden="true" />
          {selectedChartDay ? (
            <output
              className="chart-day-detail"
              role="status"
              aria-live="polite"
              aria-label={fillTemplate(copy.chartDaySpent, {
                date: shortDate(new Date(selectedChartDay.timestamp)),
                amount: euro.format(selectedChartDay.total),
              })}
            >
              <span>{shortDate(new Date(selectedChartDay.timestamp))}</span>
              <strong>{euro.format(selectedChartDay.total)}</strong>
            </output>
          ) : null}
          <div
            className="allowance-guide allowance-guide-all"
            style={{ "--guide-top": `${allowanceGuidePositions.allFundsTop}%` } as React.CSSProperties}
            aria-hidden="true"
          >
            <i /><span>{allFundsGuideText}</span><i />
          </div>
          <div
            className="allowance-guide allowance-guide-safe"
            style={{ "--guide-top": `${allowanceGuidePositions.savingsSafeTop}%` } as React.CSSProperties}
            aria-hidden="true"
          >
            <i /><span>{savingsSafeGuideText}</span><i />
          </div>
        </div>

        <section className="strength-panel" aria-labelledby="strength-title">
          <div className="strength-scoreboard">
            <span id="strength-title">{copy.strengthTitle}</span>
            <div className="strength-score">
              <strong>{latestStrengthScore === null ? "N/A" : scoreFormatter.format(latestStrengthScore)}</strong>
              <small>/ 10</small>
            </div>
            <p>
              {latestStrength
                ? fillTemplate(copy.strengthLatest, { date: shortDate(dateFromKey(latestStrength.date)) })
                : copy.strengthNoAttempts}
            </p>
          </div>
          <div className="strength-metrics-row">
            <button
              className="strength-rank"
              type="button"
              aria-label={latestStrengthRank
                ? fillTemplate(copy.strengthRankControl, {
                    rank: latestStrengthRank[language],
                    level: latestStrengthRank.level,
                    set: selectedRankInsigniaSet[language],
                  })
                : copy.strengthNoAttempts}
              title={selectedRankInsigniaSet[language]}
              onClick={() => {
                const currentIndex = RANK_INSIGNIA_SETS.findIndex(({ id }) => id === rankInsigniaSet);
                const nextSet = RANK_INSIGNIA_SETS[(currentIndex + 1) % RANK_INSIGNIA_SETS.length];
                setRankInsigniaSet(nextSet.id);
                writePreferenceCookie(RANK_INSIGNIA_COOKIE, nextSet.id);
              }}
            >
              <span
                className="strength-rank-icon"
                aria-hidden="true"
                hidden={!latestStrengthRank}
                style={{
                  backgroundImage: `url('/rank-icons/${selectedRankInsigniaSet.file}?v=1')`,
                  backgroundPosition: latestStrengthRank?.backgroundPosition ?? "0% 0%",
                }}
              />
              <small>{latestStrengthRank?.abbreviation ?? "—"}</small>
            </button>
            <div className="strength-metrics" aria-label={copy.strengthLatestMetrics}>
              <div className="weight-metric"><span>{copy.strengthWeight}</span><strong>{latestStrength?.weightKg ?? 0}<small>{copy.strengthWeightUnit}</small></strong></div>
              <div><span>{copy.strengthPullUps}</span><strong>{latestStrength?.maxPullUpsSingleSet ?? 0}<small className="strength-target" aria-label={fillTemplate(copy.strengthTarget, { value: latestStrengthTargets?.pullUps ?? "—" })}><span aria-hidden="true">/</span> {latestStrengthTargets?.pullUps ?? "—"}</small></strong></div>
              <div><span>{copy.strengthPushUps}</span><strong>{latestStrength?.maxPushUpsSingleSet ?? 0}<small className="strength-target" aria-label={fillTemplate(copy.strengthTarget, { value: latestStrengthTargets?.pushUps ?? "—" })}><span aria-hidden="true">/</span> {latestStrengthTargets?.pushUps ?? "—"}</small></strong></div>
            </div>
          </div>
          <div className="strength-meta">
            <span><i className="strength-key" />{copy.relativeStrengthSeries}</span>
            <small>{copy.strengthNote}</small>
          </div>
        </section>

        <section className="hero" id="top">
          <div className="balance-card" aria-labelledby="page-title">
            <div className="balance-topline">
              <h1 id="page-title">{copy.available}</h1>
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
                  <b className={safeRemaining < 0 ? "is-negative" : undefined}>
                    {euro.format(safeRemaining)}
                  </b>{" "}{copy.afterSavings}
                </span>
              </div>
              <div
                className="progress-ring"
                style={{
                  "--safe-spent-end": `${safeSpentEndDegrees}deg`,
                  "--spent-end": `${spentEndDegrees}deg`,
                  "--savings-start": `${savingsStartDegrees}deg`,
                } as React.CSSProperties}
                data-savings-violated={savingsUsed > 0 ? "true" : "false"}
                aria-label={
                  spentPercent === null
                    ? copy.noSpendingBudget
                    : fillTemplate(copy.salaryAllocation, {
                        spent: Math.round(spentPercent),
                        safeLimit: Math.round(safeSpendingLimitPercent),
                        savingsUsed: euro.format(savingsUsed),
                      })
                }
              >
                <i className="progress-threshold" aria-hidden="true" />
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
            {additionalIncomeTotal > 0 && (
              <div className="additional-income-summary">
                <div>
                  <span>{copy.additionalIncome}</span>
                  <strong>+{euro.format(additionalIncomeTotal)}</strong>
                </div>
                <div className="income-total-row">
                  <span>{copy.totalIncome}</span>
                  <strong>{euro.format(totalIncome)}</strong>
                </div>
              </div>
            )}
          </article>

          <article className="stat-card savings">
            <span className="stat-icon" aria-hidden="true">◇</span>
            <p>{copy.savings}</p>
            <strong className="fixed-stat-value">{euro.format(savings)}</strong>
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
            <small>
              {fillTemplate(copy.recorded, {
                count: data.expenses.length,
                plural: language === "en" && data.expenses.length === 1 ? "" : "s",
              })}
            </small>
            {spendingComparison && (
              <div className={`stat-comparison ${spendingComparison.tone}`}>
                {spendingComparison.text}
              </div>
            )}
          </article>
        </section>

        <section className="breakdown-panel" aria-labelledby="breakdown-title">
          <div className="breakdown-heading">
            <h2 id="breakdown-title">{copy.where}</h2>
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
        </section>

        <footer>
          <span>KINANCE</span>
          <p>{copy.footer}</p>
        </footer>
      </div>
    </main>
  );
}
