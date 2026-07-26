const CATEGORIES = [
  "Food",
  "Subscriptions & services",
  "Luxury purchases",
  "Debt & repayments",
  "Devices & installments",
  "Transport & Travel",
  "Alcohol & nightlife",
];

const KINANCE_CATEGORY_ICONS = {
  Food: "/public/category-icons/food-item.png?v=1",
  "Subscriptions & services": "/public/category-icons/subscriptions-item.png?v=2",
  "Luxury purchases": "/public/category-icons/luxury-item.png?v=2",
  "Debt & repayments": "/public/category-icons/debt-item.png?v=2",
  "Devices & installments": "/public/category-icons/devices-item.png?v=2",
  "Transport & Travel": "/public/category-icons/transport-item.png?v=2",
  "Alcohol & nightlife": "/public/category-icons/alcohol-item.png?v=2",
};

const CHARACTER_CATEGORY_ICON_POOLS = {
  Food: [
    "/public/category-icons/food.png?v=5",
    "/public/category-icons/food-kohaku.png?v=1",
    "/public/category-icons/food-soujuurou.png?v=1",
  ],
  "Subscriptions & services": [
    "/public/category-icons/subscriptions-services.png?v=5",
    "/public/category-icons/subscriptions-bb.png?v=1",
    "/public/category-icons/subscriptions-sion.png?v=1",
  ],
  "Luxury purchases": [
    "/public/category-icons/luxury-purchases.png?v=5",
    "/public/category-icons/luxury-nero.png?v=1",
    "/public/category-icons/luxury-alice.png?v=1",
  ],
  "Debt & repayments": [
    "/public/category-icons/debt-repayments.png?v=5",
    "/public/category-icons/debt-mash.png?v=1",
    "/public/category-icons/debt-shiki-ryougi.png?v=1",
  ],
  "Devices & installments": [
    "/public/category-icons/devices-installments.png?v=5",
    "/public/category-icons/devices-ciel.png?v=1",
    "/public/category-icons/devices-touko.png?v=1",
  ],
  "Transport & Travel": [
    "/public/category-icons/transport-travel.png?v=5",
    "/public/category-icons/transport-arcueid.png?v=1",
    "/public/category-icons/transport-shiki-tohno.png?v=1",
  ],
  "Alcohol & nightlife": [
    "/public/category-icons/alcohol-nightlife.png?v=5",
    "/public/category-icons/alcohol-shuten.png?v=1",
    "/public/category-icons/alcohol-aoko.png?v=1",
  ],
};

function categoryIconFor(expense) {
  if (theme === "kinance") {
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

const THEMES = [
  { id: "kinance", label: "Kinance", banner: "/public/theme-banners/kinance.png?v=6" },
  { id: "kinance-moon", label: "Kinance Moon", banner: "/public/theme-banners/kinance.png?v=6" },
  { id: "nier-automata", label: "NieR:Automata", banner: "/public/theme-banners/nier-automata.png" },
  { id: "tohsaka-rin", label: "Tohsaka Rin", banner: "/public/theme-banners/tohsaka-rin.png" },
];

const PREFERENCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const THEME_COOKIE = "kinance_theme";
const LANGUAGE_COOKIE = "kinance_language";

function readPreferenceCookie(name) {
  const prefix = `${encodeURIComponent(name)}=`;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

function writePreferenceCookie(name, value) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${PREFERENCE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

const TRANSLATIONS = {
  en: {
    availableAfterPlan: "DEBIT BALANCE",
    leftForMonth: "on card until next salary",
    afterSavings: "after protecting savings",
    dailyPace: "DAILY LIMITS",
    allFunds: "All funds",
    savingsSafe: "Savings safe",
    savingsPreserved: "Savings protected",
    savingsViolated: "Savings used",
    allowanceGuide: "Allowed {amount}/day · {label}",
    monthlySalary: "SALARY THIS CYCLE",
    salaryLocked: "Locked to this salary cycle",
    additionalIncome: "SIDE INCOME",
    totalIncome: "TOTAL INCOME",
    dailySpendingEyebrow: "DAILY RHYTHM",
    dailySpending: "Daily expenses",
    dailySpendingIntro: "What left your account each day this salary cycle",
    thisCycleTotal: "This cycle",
    dailyExpenseSeries: "Daily spending",
    relativeStrengthSeries: "Relative strength",
    dailySpendingChartLabel: "Daily spending bars with relative strength and daily allowance guides",
    strengthTitle: "RELATIVE STRENGTH",
    strengthScore: "CURRENT SCORE",
    strengthNoAttempts: "Log an attempt to establish your baseline",
    strengthLatest: "Latest attempt · {date}",
    strengthWeight: "Weight",
    strengthPullUps: "Best pull-up set",
    strengthPushUps: "Best push-up set",
    strengthSave: "Save attempt",
    strengthNote: "Best uninterrupted set per exercise · never summed across sets",
    strengthLatestMetrics: "Latest relative strength attempt metrics",
    strengthWeightUnit: "kg",
    tapToEdit: "Tap the amount to edit",
    savingsRequirement: "SAVINGS REQUIREMENT",
    protectedSpending: "Protected from spending",
    spentThisMonth: "SPENT THIS SALARY CYCLE",
    savingsMore: "Planned savings are {difference} above the prior {count}-cycle average of {average}",
    savingsLess: "Planned savings are {difference} below the prior {count}-cycle average of {average}",
    savingsSame: "Planned savings match the prior {count}-cycle average of {average}",
    spendingMore: "{difference} more spent than the prior {count}-cycle average of {average}",
    spendingLess: "{difference} less spent than the prior {count}-cycle average of {average}",
    spendingSame: "Matches the prior {count}-cycle spending average of {average}",
    spendingMix: "SPENDING MIX",
    whereMoneyGoes: "Where your money goes",
    recentExpenses: "Recent expenses",
    expectedMonthly: "Expected monthly expenses",
    oneTimeExpenses: "One-time expenses",
    quickEntry: "QUICK ENTRY",
    addExpense: "Add expense",
    formIntro: "Log something now, or simply send the amount in our chat.",
    amount: "Amount",
    category: "Category",
    paymentMethod: "Payment method",
    debit: "Debit",
    credit: "Credit",
    creditRepaid: "Credit repaid",
    outstandingCredit: "Outstanding credit",
    outstandingCreditDetail: "Credit spending is awaiting repayment.",
    whatFor: "What was it for?",
    notePlaceholder: "Coffee, Netflix, new shoes…",
    chatHint: "In chat, send a number or receipt photo and it will be added and categorised here.",
    footer: "Private by design. Clear by default.",
    today: "Today",
    monthEnd: "Cycle end",
    updated: "Updated",
    spent: "SPENT",
    total: "total",
    items: "ITEMS",
    nothingSpent: "Nothing spent yet",
    monthEmpty: "Your {month} expenses will appear here as you add them.",
    receipt: "Receipt",
    chat: "Added in chat",
    here: "Added here",
    savingsEuroLabel: "Monthly savings requirement in euros",
    recordedExpenses: "{count} recorded expense{plural}",
    perDay: "/ day",
    monthsSaved: "{count} / 12 cycles saved",
    noExpenses: "No expenses recorded",
    spendingAlert: "Spending alert",
    spendingClear: "No spending pressure yet. Keep logging expenses to receive current guidance.",
    spendingLargest: "{category} is your largest cost at {amount} ({percent}% of spending).",
    spendingCut: "For flexible cuts, focus on {category} next ({amount}).",
    spendingSame: "Pause new spending in this category until the balance improves.",
    kinanceHome: "Kinance home",
    languageLabel: "Language",
    themeLabel: "Theme",
    themeBannerLabel: "{theme} theme artwork",
    financeHistoryLabel: "Salary cycle history",
    monthlyTimelineLabel: "Salary cycle timeline",
    monthlyPlanLabel: "Salary cycle plan balance",
    monthlyTotalsLabel: "Salary cycle totals",
    budgetUsed: "{percent}% of spending budget used",
    salaryAllocation: "{spent}% of total income spent; {savings}% reserved for savings",
    noSpendingBudget: "NO SPENDING BUDGET",
    historyUnavailable: "History unavailable",
    refresh: "Please refresh the page in a moment.",
    categories: {
      Food: "Food",
      "Subscriptions & services": "Subscriptions & services",
      "Luxury purchases": "Luxury purchases",
      "Debt & repayments": "Debt & repayments",
      "Devices & installments": "Devices & installments",
      "Transport & Travel": "Transport & Travel",
      "Alcohol & nightlife": "Alcohol & nightlife",
    },
  },
  ru: {
    availableAfterPlan: "БАЛАНС ДЕБЕТОВОЙ КАРТЫ",
    leftForMonth: "на карте до следующей зарплаты",
    afterSavings: "после резерва на накопления",
    dailyPace: "ЛИМИТЫ НА ДЕНЬ",
    allFunds: "Без сохранения накоплений",
    savingsSafe: "С сохранением накоплений",
    savingsPreserved: "Накопления сохранены",
    savingsViolated: "Накопления используются",
    allowanceGuide: "Можно {amount} в день · {label}",
    monthlySalary: "ЗАРПЛАТА ЗА ЭТОТ ЦИКЛ",
    salaryLocked: "Зафиксирована для этого зарплатного цикла",
    additionalIncome: "ДОПОЛНИТЕЛЬНЫЕ ДОХОДЫ",
    totalIncome: "ОБЩИЙ ДОХОД",
    dailySpendingEyebrow: "ДНЕВНОЙ РИТМ",
    dailySpending: "Расходы по дням",
    dailySpendingIntro: "Сколько списывалось со счёта каждый день текущего зарплатного цикла",
    thisCycleTotal: "За текущий цикл",
    dailyExpenseSeries: "Расходы за день",
    relativeStrengthSeries: "Относительная сила",
    dailySpendingChartLabel: "Расходы по дням в виде столбцов, график относительной силы и линии дневных лимитов",
    strengthTitle: "ОТНОСИТЕЛЬНАЯ СИЛА",
    strengthScore: "ТЕКУЩИЙ БАЛЛ",
    strengthNoAttempts: "Добавьте попытку, чтобы определить исходный уровень",
    strengthLatest: "Последняя попытка · {date}",
    strengthWeight: "Вес",
    strengthPullUps: "Лучший подход: подтягивания",
    strengthPushUps: "Лучший подход: отжимания",
    strengthSave: "Сохранить попытку",
    strengthNote: "Лучший непрерывный подход в каждом упражнении · подходы не суммируются",
    strengthLatestMetrics: "Показатели последней попытки относительной силы",
    strengthWeightUnit: "кг",
    tapToEdit: "Нажмите на сумму, чтобы изменить её",
    savingsRequirement: "ЦЕЛЬ НАКОПЛЕНИЙ",
    protectedSpending: "Зарезервировано и не тратится",
    spentThisMonth: "ПОТРАЧЕНО ЗА ЭТОТ ЦИКЛ",
    savingsMore: "План накоплений на {difference} выше среднего по истории ({count} цикл.): {average}",
    savingsLess: "План накоплений на {difference} ниже среднего по истории ({count} цикл.): {average}",
    savingsSame: "План накоплений совпадает со средним по истории ({count} цикл.): {average}",
    spendingMore: "Потрачено на {difference} больше среднего по истории ({count} цикл.): {average}",
    spendingLess: "Потрачено на {difference} меньше среднего по истории ({count} цикл.): {average}",
    spendingSame: "Расходы совпадают со средним по истории ({count} цикл.): {average}",
    spendingMix: "СТРУКТУРА РАСХОДОВ",
    whereMoneyGoes: "Куда уходят деньги",
    recentExpenses: "Последние расходы",
    expectedMonthly: "Плановые ежемесячные расходы",
    oneTimeExpenses: "Разовые расходы",
    quickEntry: "БЫСТРОЕ ДОБАВЛЕНИЕ",
    addExpense: "Добавить расход",
    formIntro: "Добавьте расход здесь или просто отправьте сумму в чат.",
    amount: "Сумма",
    category: "Категория",
    paymentMethod: "Способ оплаты",
    debit: "Дебетовая карта",
    credit: "Кредитная карта",
    creditRepaid: "Задолженность погашена",
    outstandingCredit: "Непогашенная задолженность",
    outstandingCreditDetail: "Расходы по кредитной карте ещё не погашены.",
    whatFor: "На что потрачено?",
    notePlaceholder: "Кофе, Netflix, новая обувь…",
    chatHint: "Отправьте в чат сумму или фото чека: расход будет добавлен и распределён по категории.",
    footer: "Конфиденциальность заложена в основу. Всё понятно по умолчанию.",
    today: "Сегодня",
    monthEnd: "Конец цикла",
    updated: "Обновлено",
    spent: "ПОТРАЧЕНО",
    total: "всего",
    items: "ЗАПИСЕЙ",
    nothingSpent: "Расходов пока нет",
    monthEmpty: "Расходы за {month} появятся здесь после добавления.",
    receipt: "Чек",
    chat: "Добавлено в чате",
    here: "Добавлено здесь",
    savingsEuroLabel: "Цель ежемесячных накоплений в евро",
    recordedExpenses: "Записано расходов: {count}",
    perDay: "в день",
    monthsSaved: "Сохранено циклов: {count} из 12",
    noExpenses: "Расходов нет",
    spendingAlert: "Контроль расходов",
    spendingClear: "Пока признаков перерасхода нет. Продолжайте учитывать расходы, чтобы рекомендации оставались актуальными.",
    spendingLargest: "Самая крупная статья расходов: {category}, {amount} ({percent}% всех расходов).",
    spendingCut: "Если нужно сократить необязательные траты, начните с категории «{category}» ({amount}).",
    spendingSame: "Воздержитесь от новых трат в этой категории, пока баланс не улучшится.",
    kinanceHome: "Главная Kinance",
    languageLabel: "Язык",
    themeLabel: "Тема",
    themeBannerLabel: "Оформление темы {theme}",
    financeHistoryLabel: "История зарплатных циклов",
    monthlyTimelineLabel: "Шкала зарплатного цикла",
    monthlyPlanLabel: "Баланс зарплатного цикла",
    monthlyTotalsLabel: "Итоги зарплатного цикла",
    budgetUsed: "Использовано {percent}% доступного бюджета",
    salaryAllocation: "Потрачено {spent}% общего дохода; {savings}% отведено на накопления",
    noSpendingBudget: "НЕТ БЮДЖЕТА НА РАСХОДЫ",
    historyUnavailable: "История недоступна",
    refresh: "Обновите страницу через несколько секунд.",
    categories: {
      Food: "Еда",
      "Subscriptions & services": "Подписки и сервисы",
      "Luxury purchases": "Покупки для удовольствия",
      "Debt & repayments": "Долги и выплаты",
      "Devices & installments": "Устройства и рассрочки",
      "Transport & Travel": "Транспорт и путешествия",
      "Alcohol & nightlife": "Алкоголь и ночная жизнь",
    },
  },
};

let history = [];
let selectedMonth = null;
let data = null;
let dailyExpenseChart = null;
let strengthEntries = [];
let salarySchedule = { dayOfMonth: 12, weekendRule: "previousFriday" };
const savedThemePreference = readPreferenceCookie(THEME_COOKIE);
let theme = THEMES.some(({ id }) => id === savedThemePreference)
  ? savedThemePreference
  : "kinance";
const savedLanguagePreference = readPreferenceCookie(LANGUAGE_COOKIE);
let language = savedLanguagePreference === "en" ? "en" : "ru";
writePreferenceCookie(THEME_COOKIE, theme);
writePreferenceCookie(LANGUAGE_COOKIE, language);

function t(key, replacements = {}) {
  let value = TRANSLATIONS[language][key] ?? TRANSLATIONS.en[key] ?? key;
  Object.entries(replacements).forEach(([name, replacement]) => {
    value = value.replace(`{${name}}`, replacement);
  });
  return value;
}

function categoryLabel(category) {
  return TRANSLATIONS[language].categories[category] ?? category;
}

function expenseNoteLabel(expense) {
  return expense.noteTranslations?.[language] ?? expense.note ?? expense.category;
}

function sourceLabel(source) {
  if (source === "receipt") return t("receipt");
  if (source === "chat") return t("chat");
  return t("here");
}

function paymentLabel(expense) {
  const paymentMethod = expense.paymentMethod ?? "debit";
  if (paymentMethod === "credit" && expense.creditStatus === "repaid") {
    return t("creditRepaid");
  }
  return t(paymentMethod);
}

function locale() {
  return language === "ru" ? "ru-RU" : "en-IE";
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

function formatEuro(value, compact = false) {
  return new Intl.NumberFormat(locale(), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: compact ? 0 : 2,
  }).format(value);
}

function formatMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat(locale(), { month: "long", year: "numeric" })
    .format(new Date(year, month - 1, 1));
}

function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    node.innerHTML = t(node.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-category-option]").forEach((option) => {
    option.textContent = categoryLabel(option.dataset.categoryOption);
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("active", button.dataset.language === language);
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
}

function element(id) {
  return document.getElementById(id);
}

function renderThemeOptions() {
  const select = element("theme-select");
  select.replaceChildren(
    ...THEMES.map(({ id, label }) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = label;
      return option;
    }),
  );
}

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  element("theme-select").value = theme;
  document.querySelector(".theme-switcher").dataset.currentTheme = theme;
  const selectedTheme = THEMES.find(({ id }) => id === theme) ?? THEMES[0];
  const banner = element("theme-banner-image");
  banner.hidden = false;
  banner.src = selectedTheme.banner;
  banner.alt = t("themeBannerLabel", { theme: selectedTheme.label });
  banner.closest(".theme-banner").setAttribute("aria-label", banner.alt);
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
}

function financeDataForMonth(month) {
  return {
    salary: safeNumber(month.salary),
    additionalIncome: structuredClone(
      Array.isArray(month.additionalIncome) ? month.additionalIncome : [],
    ),
    savingsGoal: safeNumber(month.savingsGoal),
    expenses: structuredClone(month.expenses),
  };
}

function toCents(value) {
  return Math.round(safeNumber(value) * 100);
}

function sumAmounts(records) {
  return records.reduce((sum, record) => sum + toCents(record.amount), 0) / 100;
}

function sumExpenses(expenses) {
  return sumAmounts(expenses);
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function calendarDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(dateKey) {
  return new Date(`${dateKey}T12:00:00`);
}

function priorCycles() {
  const selectedIndex = history.findIndex(
    (month) => month.month === selectedMonth.month,
  );
  if (selectedIndex <= 0) return [];
  return history.slice(Math.max(0, selectedIndex - 3), selectedIndex);
}

function comparisonFor(kind, currentValue, elapsedDays) {
  const previous = priorCycles();
  if (!previous.length) return null;

  const values = previous.map((month) =>
    kind === "savings"
      ? safeNumber(month.savingsGoal)
      : sumExpenses(
          month.expenses.filter((expense) => {
            const expenseDay = inclusiveDayCount(
              dateFromKey(month.period.start),
              dateFromKey(expense.date),
            );
            return expenseDay >= 1 && expenseDay <= elapsedDays;
          }),
        ),
  );
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const difference = currentValue - average;
  const replacements = {
    difference: formatEuro(Math.abs(difference)),
    average: formatEuro(average),
    count: previous.length,
  };

  if (Math.abs(difference) < 0.005) {
    return {
      text: t(kind === "savings" ? "savingsSame" : "spendingSame", replacements),
      tone: "neutral",
    };
  }

  const isMore = difference > 0;
  const key = `${kind}${isMore ? "More" : "Less"}`;
  const favorable = kind === "savings" ? isMore : !isMore;
  return {
    text: t(key, replacements),
    tone: favorable ? "favorable" : "unfavorable",
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

function effectiveSalaryDate(year, monthIndex) {
  const date = new Date(year, monthIndex, salarySchedule.dayOfMonth, 12);

  if (salarySchedule.weekendRule === "previousFriday") {
    if (date.getDay() === 6) date.setDate(date.getDate() - 1);
    if (date.getDay() === 0) date.setDate(date.getDate() - 2);
  }

  return date;
}

function salaryCycleDates(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const start = effectiveSalaryDate(year, month - 1);
  const nextStart = effectiveSalaryDate(year, month);
  const end = new Date(nextStart);
  end.setDate(end.getDate() - 1);
  return { start, end };
}

function calendarDayNumber(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
}

function inclusiveDayCount(start, end) {
  return calendarDayNumber(end) - calendarDayNumber(start) + 1;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat(locale(), {
    day: "numeric",
    month: "short",
  }).format(date);
}

function categoryCode(category) {
  if (category === "Food") return ["F", "food"];
  if (category === "Subscriptions & services") return ["S", "services"];
  if (category === "Luxury purchases") return ["L", "luxury"];
  if (category === "Debt & repayments") return ["D", "debt"];
  if (category === "Devices & installments") return ["I", "devices"];
  if (category === "Transport & Travel") return ["T", "transport"];
  return ["A", "alcohol"];
}

function categoryTotals() {
  return CATEGORIES.map((category) => ({
    category,
    amount: sumExpenses(
      data.expenses.filter((expense) => expense.category === category),
    ),
  }));
}

function renderSpendingAlert() {
  const ranked = categoryTotals()
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const total = ranked.reduce((sum, item) => sum + item.amount, 0);
  element("spending-alert-title").textContent = t("spendingAlert");

  if (!ranked.length || total <= 0) {
    element("spending-alert-detail").textContent = t("spendingClear");
    return;
  }

  const largest = ranked[0];
  const flexibleCategories = new Set([
    "Food",
    "Subscriptions & services",
    "Luxury purchases",
    "Devices & installments",
    "Transport & Travel",
    "Alcohol & nightlife",
  ]);
  const cutTarget =
    ranked.find(
      (item) =>
        item.category !== largest.category &&
        flexibleCategories.has(item.category),
    ) ?? largest;
  const lead = t("spendingLargest", {
    category: categoryLabel(largest.category),
    amount: formatEuro(largest.amount),
    percent: Math.round((largest.amount / total) * 100),
  });
  const action =
    cutTarget.category === largest.category
      ? t("spendingSame")
      : t("spendingCut", {
          category: categoryLabel(cutTarget.category),
          amount: formatEuro(cutTarget.amount),
        });

  element("spending-alert-detail").textContent = `${lead} ${action}`;
}

function renderCreditAlert() {
  const alert = element("credit-alert");
  const outstandingExpenses = history
    .flatMap((month) =>
      month.month === selectedMonth.month ? data.expenses : month.expenses,
    )
    .filter(
      (expense) =>
        expense.paymentMethod === "credit" && expense.creditStatus !== "repaid",
    );
  const outstandingTotal = sumExpenses(outstandingExpenses);

  alert.hidden = outstandingTotal <= 0;
  if (alert.hidden) return;

  element("credit-alert-title").textContent = t("outstandingCredit");
  element("credit-alert-detail").textContent = t("outstandingCreditDetail");
  element("credit-alert-total").textContent = formatEuro(outstandingTotal);
}

function loadMonth(month) {
  selectedMonth = month;
  data = financeDataForMonth(month);
  render();
}

function renderHistory() {
  const nav = element("month-history");
  nav.replaceChildren();
  nav.hidden = history.length < 2;
  if (nav.hidden) return;
  history.forEach((month) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = formatMonth(month.month);
    button.className = month.month === selectedMonth.month ? "active" : "";
    if (button.className) button.setAttribute("aria-current", "date");
    button.addEventListener("click", () => loadMonth(month));
    nav.append(button);
  });
  const count = document.createElement("span");
  count.className = "history-count";
  count.textContent = t("monthsSaved", { count: history.length });
  nav.append(count);
}

function renderTimeline() {
  const { start, end } = salaryCycleDates(selectedMonth.month);
  const today = dateFromKey(todayInVilnius());
  const isCurrentCycle = today >= start && today <= end;
  const markerDate = isCurrentCycle ? today : end;
  const totalDays = inclusiveDayCount(start, end);
  const elapsedDays = Math.min(
    Math.max(inclusiveDayCount(start, markerDate), 1),
    totalDays,
  );
  const position = `${(elapsedDays / totalDays) * 100}%`;

  element("timeline-start").textContent = formatShortDate(start).toUpperCase();
  element("timeline-current").textContent =
    `${isCurrentCycle ? t("today") : t("monthEnd")} · ${formatShortDate(markerDate)}`;
  element("timeline-end").textContent = formatShortDate(end).toUpperCase();
  element("timeline-progress").style.width = position;
  element("timeline-marker").style.left = position;
  return { totalDays, elapsedDays };
}

function renderBreakdown() {
  const totals = categoryTotals();
  const total = totals.reduce((sum, item) => sum + item.amount, 0);
  const bar = element("breakdown-bar");
  const legend = element("breakdown-legend");
  bar.replaceChildren();
  legend.replaceChildren();
  element("breakdown-total").textContent = `${formatEuro(total)} ${t("total")}`;

  totals
    .filter((item) => item.amount > 0)
    .forEach(({ category, amount }) => {
      const [, className] = categoryCode(category);
      const percent = total > 0 ? (amount / total) * 100 : 0;
      const segment = document.createElement("span");
      segment.className = `breakdown-segment ${className}`;
      segment.style.width = `${percent}%`;
      segment.title = `${categoryLabel(category)}: ${formatEuro(amount)} (${Math.round(percent)}%)`;
      bar.append(segment);

      const item = document.createElement("div");
      item.className = "breakdown-item";
      item.innerHTML = `
        <span class="breakdown-dot ${className}" aria-hidden="true"></span>
        <span><strong>${categoryLabel(category)}</strong><small>${formatEuro(amount)} · ${Math.round(percent)}%</small></span>
      `;
      legend.append(item);
    });

  bar.setAttribute(
    "aria-label",
    totals
      .filter((item) => item.amount > 0)
      .map((item) => `${categoryLabel(item.category)}: ${formatEuro(item.amount)}`)
      .join(", ") || t("noExpenses"),
  );
}

function createExpenseList(expenses) {
  const list = document.createElement("ul");
  list.className = "expense-list";
  expenses.forEach((expense) => {
    const categoryIcon = categoryIconFor(expense);
    const date = new Date(`${expense.date}T12:00:00`).toLocaleDateString(locale(), {
      day: "numeric",
      month: "short",
    });
    const item = document.createElement("li");
    const paymentMethod = expense.paymentMethod ?? "debit";
    const paymentClass =
      paymentMethod === "credit"
        ? expense.creditStatus === "repaid"
          ? "credit-repaid"
          : "credit-outstanding"
        : "debit";
    item.innerHTML = `
      <span class="expense-category-icon" aria-hidden="true">
        <img src="${categoryIcon}" alt="" width="256" height="256" loading="lazy" decoding="async">
      </span>
      <span class="expense-info">
        <span class="expense-title-row">
          <strong></strong>
          <span class="payment-badge ${paymentClass}">${paymentLabel(expense)}</span>
        </span>
        <small>${categoryLabel(expense.category)} · ${sourceLabel(expense.source)} · ${date}</small>
      </span>
      <strong class="expense-amount">−${formatEuro(safeNumber(expense.amount))}</strong>
    `;
    item.querySelector(".expense-title-row strong").textContent = expenseNoteLabel(expense);
    list.append(item);
  });
  return list;
}

function renderLedger() {
  const container = element("ledger");
  container.replaceChildren();

  const recurringExpenses = data.expenses.filter((expense) => expense.recurring);
  const oneTimeExpenses = data.expenses.filter((expense) => !expense.recurring);

  if (recurringExpenses.length) {
    const recurring = document.createElement("details");
    recurring.className = "expense-table recurring-expenses";
    recurring.open = true;
    const recurringTotal = sumExpenses(recurringExpenses);
    recurring.innerHTML = `
      <summary class="expense-table-summary">
        <span>${t("expectedMonthly")}</span>
        <strong>${formatEuro(recurringTotal)}</strong>
      </summary>
      <div class="expense-table-body">
        <div class="expense-table-meta">
          <span>${recurringExpenses.length} ${t("items")}</span>
        </div>
      </div>
    `;
    const recurringBody = recurring.querySelector(".expense-table-body");
    recurringBody.append(createExpenseList(recurringExpenses));

    container.append(recurring);
  }

  const oneTime = document.createElement("details");
  oneTime.className = "expense-table one-time-expenses-table";
  oneTime.open = true;
  const oneTimeTotal = sumExpenses(oneTimeExpenses);
  oneTime.innerHTML = `
    <summary class="expense-table-summary">
      <span>${t("oneTimeExpenses")}</span>
      <strong>${formatEuro(oneTimeTotal)}</strong>
    </summary>
    <div class="expense-table-body">
      <div class="expense-table-meta">
        <span>${oneTimeExpenses.length} ${t("items")}</span>
      </div>
    </div>
  `;
  const oneTimeBody = oneTime.querySelector(".expense-table-body");

  if (oneTimeExpenses.length) {
    oneTimeBody.append(createExpenseList(oneTimeExpenses));
  } else {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <span aria-hidden="true">○</span>
      <h3>${t("nothingSpent")}</h3>
      <p>${t("monthEmpty", { month: formatMonth(selectedMonth.month) })}</p>
    `;
    oneTimeBody.append(empty);
  }

  container.append(oneTime);
}

function dailyExpensePoints(expenses, period, asOfDate) {
  const totals = expenses.reduce((daily, expense) => {
    daily.set(expense.date, (daily.get(expense.date) ?? 0) + toCents(expense.amount));
    return daily;
  }, new Map());
  const points = [];
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

function relativeStrengthScore(weightKg, maxPullUpsSingleSet, maxPushUpsSingleSet) {
  const pullComponent = Math.min(Math.max(maxPullUpsSingleSet, 0) / 20, 1);
  const pushComponent = Math.min(Math.max(maxPushUpsSingleSet, 0) / 50, 1);
  const massFactor = Math.min(Math.max((weightKg / 75) ** 0.12, 0.9), 1.1);
  const score = 1 + 9 * (pullComponent * 0.6 + pushComponent * 0.4) * massFactor;
  return Math.round(Math.min(Math.max(score, 1), 10) * 10) / 10;
}

function dailyStrengthPoints(entries, period, asOfDate) {
  const dailyBest = new Map();
  entries.forEach((entry) => {
    if (entry.date < period.start || entry.date > period.end || entry.date > asOfDate) return;
    const score = relativeStrengthScore(
      entry.weightKg,
      entry.maxPullUpsSingleSet,
      entry.maxPushUpsSingleSet,
    );
    dailyBest.set(entry.date, Math.max(dailyBest.get(entry.date) ?? 0, score));
  });
  return [...dailyBest.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, score]) => ({ x: dateFromKey(date).getTime(), y: score }));
}

function allowanceGuideTop(value, maximum) {
  const percentage = 100 - (value / maximum) * 100;
  return Math.min(Math.max(percentage, 8), 91);
}

function allowanceGuideTops(allFunds, savingsSafe, maximum) {
  let allFundsTop = allowanceGuideTop(allFunds, maximum);
  let savingsSafeTop = allowanceGuideTop(savingsSafe, maximum);
  if (savingsSafeTop - allFundsTop < 12) {
    allFundsTop = 79;
    savingsSafeTop = 91;
  }
  return { allFundsTop, savingsSafeTop };
}

function renderStrengthSummary() {
  const latest = [...strengthEntries].sort((left, right) =>
    right.date.localeCompare(left.date) || right.id.localeCompare(left.id),
  )[0];
  const score = latest
    ? relativeStrengthScore(latest.weightKg, latest.maxPullUpsSingleSet, latest.maxPushUpsSingleSet)
    : null;
  element("strength-score").textContent = score?.toFixed(1) ?? "N/A";
  element("strength-status").textContent = latest
    ? t("strengthLatest", { date: formatShortDate(dateFromKey(latest.date)) })
    : t("strengthNoAttempts");
  element("strength-weight-value").textContent = String(latest?.weightKg ?? 0);
  element("strength-pull-ups-value").textContent = String(latest?.maxPullUpsSingleSet ?? 0);
  element("strength-push-ups-value").textContent = String(latest?.maxPushUpsSingleSet ?? 0);
}

function renderDailyExpenseChart(allFundsDailyPace, savingsSafeDailyPace) {
  const container = element("daily-expense-chart-canvas");
  dailyExpenseChart?.destroy();
  dailyExpenseChart = null;

  if (!window.ApexCharts) {
    container.textContent = t("refresh");
    return;
  }

  const themeStyles = getComputedStyle(document.documentElement);
  const accent = themeStyles.getPropertyValue("--chart-accent").trim() || "#5ac8fa";
  const glow = themeStyles.getPropertyValue("--chart-glow").trim() || accent;
  const strengthAccent = themeStyles.getPropertyValue("--strength-accent").trim() || "#bf5af2";
  const spendingPoints = dailyExpensePoints(
    data.expenses.filter((expense) => !expense.recurring),
    selectedMonth.period,
    todayInVilnius(),
  );
  const strengthPoints = dailyStrengthPoints(
    strengthEntries,
    selectedMonth.period,
    todayInVilnius(),
  );
  const chartMaximum = Math.max(
    ...spendingPoints.map(({ y }) => y),
    allFundsDailyPace,
    savingsSafeDailyPace,
    1,
  ) * 1.08;
  const allFundsGuide = element("allowance-guide-all");
  const savingsSafeGuide = element("allowance-guide-safe");
  const guidePositions = allowanceGuideTops(allFundsDailyPace, savingsSafeDailyPace, chartMaximum);
  allFundsGuide.style.setProperty("--guide-top", `${guidePositions.allFundsTop}%`);
  savingsSafeGuide.style.setProperty("--guide-top", `${guidePositions.savingsSafeTop}%`);
  element("allowance-guide-all-label").textContent = t("allowanceGuide", {
    label: t("savingsViolated"),
    amount: formatEuro(allFundsDailyPace, true),
  });
  element("allowance-guide-safe-label").textContent = t("allowanceGuide", {
    label: t("savingsPreserved"),
    amount: formatEuro(savingsSafeDailyPace, true),
  });

  dailyExpenseChart = new window.ApexCharts(container, {
    chart: {
      type: "line",
      height: 168,
      background: "transparent",
      fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font-family"),
      animations: { enabled: !window.matchMedia("(prefers-reduced-motion: reduce)").matches },
      sparkline: { enabled: true },
      dropShadow: { enabled: true, top: 2, left: 0, blur: 4, color: glow, opacity: 0.2 },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    series: [
      { name: t("dailyExpenseSeries"), type: "column", data: spendingPoints },
      { name: t("relativeStrengthSeries"), type: "line", data: strengthPoints },
    ],
    colors: [accent, strengthAccent],
    plotOptions: {
      bar: { columnWidth: "48%", borderRadius: 4, borderRadiusApplication: "end" },
    },
    stroke: { curve: ["straight", "smooth"], width: [0, 2.5], lineCap: "round" },
    fill: { opacity: [0.68, 1] },
    markers: { size: [0, 3.5], strokeWidth: 0, hover: { sizeOffset: 2 } },
    dataLabels: { enabled: false },
    grid: { show: false, padding: { left: 3, right: 3, top: 8, bottom: 1 } },
    xaxis: { type: "datetime" },
    yaxis: [
      { seriesName: t("dailyExpenseSeries"), min: 0, max: chartMaximum, show: false },
      { seriesName: t("relativeStrengthSeries"), min: 1, max: 10, opposite: true, show: false },
    ],
    tooltip: { enabled: false },
  });
  dailyExpenseChart.render();
}

function render() {
  const spent = sumExpenses(data.expenses);
  const salary = safeNumber(data.salary);
  const additionalIncomeTotal = sumAmounts(data.additionalIncome);
  const totalIncome = roundMoney(salary + additionalIncomeTotal);
  const savings = safeNumber(data.savingsGoal);
  const cashRemaining = roundMoney(totalIncome - spent);
  const safeRemaining = roundMoney(cashRemaining - savings);
  const spentPercent = totalIncome > 0 ? (spent / totalIncome) * 100 : spent > 0 ? null : 0;
  const visualSpentPercent = spentPercent === null ? 100 : Math.min(spentPercent, 100);
  const savingsPercent = totalIncome > 0 ? Math.min((savings / totalIncome) * 100, 100) : savings > 0 ? 100 : 0;
  const savingsStartDegrees = (100 - savingsPercent) * 3.6;
  const spentEndDegrees = Math.min(visualSpentPercent * 3.6, savingsStartDegrees);
  const timeline = renderTimeline();
  const daysLeft = Math.max(timeline.totalDays - timeline.elapsedDays, 1);

  element("month-label").textContent = formatMonth(selectedMonth.month);
  element("updated-label").textContent = `${t("updated")} ${new Date(
    `${selectedMonth.updatedAt}T12:00:00`,
  ).toLocaleDateString(locale(), { day: "numeric", month: "long", year: "numeric" })}`;
  element("salary-value").textContent = formatEuro(salary);
  element("additional-income-summary").hidden = additionalIncomeTotal <= 0;
  element("additional-income-value").textContent = `+${formatEuro(additionalIncomeTotal)}`;
  element("total-income-value").textContent = formatEuro(totalIncome);
  element("savings-value").textContent = formatEuro(savings);
  element("spent-total").textContent = formatEuro(spent);
  element("expense-count").textContent =
    t("recordedExpenses", {
      count: data.expenses.length,
      plural: data.expenses.length === 1 ? "" : "s",
    });
  const savingsComparison = comparisonFor("savings", savings, timeline.elapsedDays);
  const spendingComparison = comparisonFor("spending", spent, timeline.elapsedDays);
  const savingsComparisonElement = element("savings-comparison");
  savingsComparisonElement.hidden = !savingsComparison;
  savingsComparisonElement.textContent = savingsComparison?.text ?? "";
  savingsComparisonElement.className = `stat-comparison ${savingsComparison?.tone ?? "neutral"}`;
  const spendingComparisonElement = element("spending-comparison");
  spendingComparisonElement.hidden = !spendingComparison;
  spendingComparisonElement.textContent = spendingComparison?.text ?? "";
  spendingComparisonElement.className = `stat-comparison ${spendingComparison?.tone ?? "neutral"}`;
  element("remaining").textContent = formatEuro(cashRemaining);
  element("safe-remaining").textContent = formatEuro(safeRemaining);
  const usedLabel = spentPercent === null
    ? t("noSpendingBudget")
    : `${Math.round(spentPercent)}% ${t("spent")}`;
  element("spent-percent").textContent = usedLabel;
  element("ring-percent").textContent = spentPercent === null ? "!" : `${Math.round(spentPercent)}%`;
  element("progress-ring").style.setProperty("--spent-end", `${spentEndDegrees}deg`);
  element("progress-ring").style.setProperty("--savings-start", `${savingsStartDegrees}deg`);
  element("progress-ring").setAttribute(
    "aria-label",
    spentPercent === null
      ? t("noSpendingBudget")
      : t("salaryAllocation", {
          spent: Math.round(spentPercent),
          savings: Math.round(savingsPercent),
        }),
  );
  element("daily-pace-all").textContent = `${formatEuro(Math.max(cashRemaining, 0) / daysLeft, true)} ${t("perDay")}`;
  element("daily-pace-safe").textContent = `${formatEuro(Math.max(safeRemaining, 0) / daysLeft, true)} ${t("perDay")}`;

  applyTranslations();
  renderStrengthSummary();
  renderDailyExpenseChart(
    Math.max(cashRemaining, 0) / daysLeft,
    Math.max(safeRemaining, 0) / daysLeft,
  );
  renderCreditAlert();
  renderSpendingAlert();
  renderHistory();
  renderBreakdown();
  renderLedger();
}

function bindControls() {
  element("theme-banner-image").addEventListener("error", (event) => {
    event.currentTarget.hidden = true;
  });
  element("theme-select").addEventListener("change", (event) => {
    theme = THEMES.some(({ id }) => id === event.target.value)
      ? event.target.value
      : "kinance";
    writePreferenceCookie(THEME_COOKIE, theme);
    applyTheme();
    if (data) render();
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      language = button.dataset.language;
      writePreferenceCookie(LANGUAGE_COOKIE, language);
      applyTranslations();
      applyTheme();
      if (data) render();
    });
  });
}

async function start() {
  try {
    renderThemeOptions();
    applyTheme();
    applyTranslations();
    const [financeResponse, strengthResponse] = await Promise.all([
      fetch("/data/finance-history.json", { cache: "no-store" }),
      fetch("/data/strength-history.json", { cache: "no-store" }),
    ]);
    if (!financeResponse.ok) throw new Error(`History request failed: ${financeResponse.status}`);
    if (!strengthResponse.ok) throw new Error(`Strength history request failed: ${strengthResponse.status}`);
    const [financeHistory, strengthHistory] = await Promise.all([
      financeResponse.json(),
      strengthResponse.json(),
    ]);
    salarySchedule = financeHistory.salarySchedule ?? salarySchedule;
    history = financeHistory.months.slice(-12);
    strengthEntries = Array.isArray(strengthHistory.entries)
      ? strengthHistory.entries.filter((entry) =>
          typeof entry?.id === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(entry?.date) &&
          Number.isFinite(entry?.weightKg) &&
          Number.isFinite(entry?.maxPullUpsSingleSet) &&
          Number.isFinite(entry?.maxPushUpsSingleSet),
        )
      : [];
    if (!history.length) throw new Error("Finance history is empty.");
    bindControls();
    loadMonth(history.at(-1));
  } catch (error) {
    element("ledger").innerHTML = `
      <div class="empty-state">
        <h3>${t("historyUnavailable")}</h3>
        <p>${t("refresh")}</p>
      </div>
    `;
    console.error(error);
  }
}

start();
