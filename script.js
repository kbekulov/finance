const CATEGORIES = [
  "Food",
  "Subscriptions & services",
  "Luxury purchases",
  "Debt & repayments",
  "Devices & installments",
  "Transport & Travel",
  "Alcohol & nightlife",
];

const THEMES = [
  { id: "kinance", label: "Kinance", banner: "/public/theme-banners/kinance.png" },
  { id: "nier-automata", label: "NieR:Automata", banner: "/public/theme-banners/nier-automata.png" },
  { id: "tohsaka-rin", label: "Tohsaka Rin", banner: "/public/theme-banners/tohsaka-rin.png" },
];

const TRANSLATIONS = {
  en: {
    monthGlance: "YOUR SALARY CYCLE AT A GLANCE",
    headline: "Every euro has<br><em>a place.</em>",
    intro: "A calm, honest view of what came in, what went out, and what you’re keeping for yourself.",
    availableAfterPlan: "AVAILABLE AFTER PLAN",
    leftForMonth: "left until next salary",
    dailyPace: "Comfortable daily pace",
    monthlySalary: "MONTHLY SALARY",
    salaryLocked: "Fixed in your finance plan",
    dailySpendingEyebrow: "DAILY RHYTHM",
    dailySpending: "Daily expenses",
    dailySpendingIntro: "What left your account each day this salary cycle",
    thisCycleTotal: "This cycle",
    dailyExpenseSeries: "Daily spending",
    dailySpendingChartLabel: "Daily expenses movement",
    tapToEdit: "Tap the amount to edit",
    savingsRequirement: "SAVINGS REQUIREMENT",
    protectedSpending: "Protected from spending",
    spentThisMonth: "SPENT THIS SALARY CYCLE",
    comparisonUnavailable: "Past 3-cycle comparison appears when history is available",
    savingsMore: "{difference} more saved than the prior {count}-cycle average of {average}",
    savingsLess: "{difference} less saved than the prior {count}-cycle average of {average}",
    savingsSame: "Matches the prior {count}-cycle savings average of {average}",
    spendingMore: "{difference} more spent than the prior {count}-cycle average of {average}",
    spendingLess: "{difference} less spent than the prior {count}-cycle average of {average}",
    spendingSame: "Matches the prior {count}-cycle spending average of {average}",
    spendingMix: "SPENDING MIX",
    whereMoneyGoes: "Where your money goes",
    ledger: "THE LEDGER",
    recentExpenses: "Recent expenses",
    expectedEyebrow: "EXPECTED",
    expectedMonthly: "Expected monthly expenses",
    expectedMonthlyTotal: "Expected monthly total",
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
    monthly: "Monthly",
    receipt: "Receipt",
    chat: "Added in chat",
    here: "Added here",
    salaryEuroLabel: "Monthly salary in euros",
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
    themeBannerLabel: "{theme} character banner",
    financeHistoryLabel: "Salary cycle history",
    monthlyTimelineLabel: "Salary cycle timeline",
    monthlyPlanLabel: "Salary cycle plan balance",
    monthlyTotalsLabel: "Salary cycle totals",
    expenseCategoriesLabel: "Expense categories",
    budgetUsed: "{percent}% of spending budget used",
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
    monthGlance: "ВАШ ЦИКЛ ЗАРПЛАТЫ В ЦИФРАХ",
    headline: "У каждого евро<br><em>своё место.</em>",
    intro: "Спокойный и честный взгляд на доходы, расходы и деньги, которые вы сохраняете для себя.",
    availableAfterPlan: "ДОСТУПНО ПОСЛЕ ПЛАНА",
    leftForMonth: "до следующей зарплаты",
    dailyPace: "Комфортный дневной лимит",
    monthlySalary: "МЕСЯЧНЫЙ ДОХОД",
    salaryLocked: "Зафиксировано в финансовом плане",
    dailySpendingEyebrow: "ДНЕВНОЙ РИТМ",
    dailySpending: "Расходы по дням",
    dailySpendingIntro: "Сколько уходило со счёта каждый день этого цикла зарплаты",
    thisCycleTotal: "За цикл",
    dailyExpenseSeries: "Расходы за день",
    dailySpendingChartLabel: "Динамика расходов по дням",
    tapToEdit: "Нажмите на сумму, чтобы изменить",
    savingsRequirement: "ЦЕЛЬ НАКОПЛЕНИЙ",
    protectedSpending: "Защищено от расходов",
    spentThisMonth: "ПОТРАЧЕНО В ЭТОМ ЦИКЛЕ",
    comparisonUnavailable: "Сравнение с 3 прошлыми циклами появится, когда будет доступна история",
    savingsMore: "Накоплено на {difference} больше среднего за {count} прошлых цикла: {average}",
    savingsLess: "Накоплено на {difference} меньше среднего за {count} прошлых цикла: {average}",
    savingsSame: "На уровне среднего накопления за {count} прошлых цикла: {average}",
    spendingMore: "Потрачено на {difference} больше среднего за {count} прошлых цикла: {average}",
    spendingLess: "Потрачено на {difference} меньше среднего за {count} прошлых цикла: {average}",
    spendingSame: "На уровне средних расходов за {count} прошлых цикла: {average}",
    spendingMix: "СТРУКТУРА РАСХОДОВ",
    whereMoneyGoes: "Куда уходят деньги",
    ledger: "ЖУРНАЛ",
    recentExpenses: "Последние расходы",
    expectedEyebrow: "ОЖИДАЕТСЯ",
    expectedMonthly: "Ожидаемые ежемесячные расходы",
    expectedMonthlyTotal: "Всего ожидается в месяц",
    oneTimeExpenses: "Разовые расходы",
    quickEntry: "БЫСТРОЕ ДОБАВЛЕНИЕ",
    addExpense: "Добавить расход",
    formIntro: "Добавьте расход здесь или просто отправьте сумму в чате.",
    amount: "Сумма",
    category: "Категория",
    paymentMethod: "Способ оплаты",
    debit: "Дебетовая карта",
    credit: "Кредитная карта",
    creditRepaid: "Кредит погашен",
    outstandingCredit: "Непогашенный кредит",
    outstandingCreditDetail: "Расходы по кредитной карте ожидают погашения.",
    whatFor: "На что потрачено?",
    notePlaceholder: "Кофе, Netflix, новая обувь…",
    chatHint: "Отправьте в чат сумму или фото чека: расход будет добавлен и распределён по категории.",
    footer: "Приватность по замыслу. Ясность по умолчанию.",
    today: "Сегодня",
    monthEnd: "Конец цикла",
    updated: "Обновлено",
    spent: "ПОТРАЧЕНО",
    total: "всего",
    items: "ЗАПИСЕЙ",
    nothingSpent: "Расходов пока нет",
    monthEmpty: "Расходы за {month} появятся здесь после добавления.",
    monthly: "Ежемесячно",
    receipt: "Чек",
    chat: "Добавлено в чате",
    here: "Добавлено здесь",
    salaryEuroLabel: "Месячный доход в евро",
    savingsEuroLabel: "Цель ежемесячных накоплений в евро",
    recordedExpenses: "Записано расходов: {count}",
    perDay: "/ день",
    monthsSaved: "Сохранено циклов: {count} из 12",
    noExpenses: "Расходов нет",
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
    monthlyTimelineLabel: "Шкала цикла зарплаты",
    monthlyPlanLabel: "Баланс цикла зарплаты",
    monthlyTotalsLabel: "Итоги цикла зарплаты",
    expenseCategoriesLabel: "Категории расходов",
    budgetUsed: "Использовано {percent}% бюджета на расходы",
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
let salarySchedule = { dayOfMonth: 12, weekendRule: "previousFriday" };
let theme = THEMES.some(
  ({ id }) => id === localStorage.getItem("kinance:theme"),
)
  ? localStorage.getItem("kinance:theme")
  : "kinance";
let language =
  (localStorage.getItem("kinance:language") ??
    localStorage.getItem("euroscope:language")) === "ru"
    ? "ru"
    : "en";

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

function priorCycles() {
  const selectedIndex = history.findIndex(
    (month) => month.month === selectedMonth.month,
  );
  if (selectedIndex <= 0) return [];
  return history.slice(Math.max(0, selectedIndex - 3), selectedIndex);
}

function comparisonFor(kind, currentValue) {
  const previous = priorCycles();
  if (!previous.length) {
    return { text: t("comparisonUnavailable"), tone: "neutral" };
  }

  const values = previous.map((month) =>
    kind === "savings"
      ? safeNumber(month.savingsGoal)
      : month.expenses.reduce(
          (sum, expense) => sum + safeNumber(expense.amount),
          0,
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
    amount: data.expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + safeNumber(expense.amount), 0),
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

function storageKey(month) {
  return `kinance:${month.month}:${month.updatedAt}:r${month.revision}`;
}

function renderCreditAlert() {
  const alert = element("credit-alert");
  const outstandingTotal = history
    .flatMap((month) =>
      month.month === selectedMonth.month ? data.expenses : month.expenses,
    )
    .filter(
      (expense) =>
        expense.paymentMethod === "credit" && expense.creditStatus !== "repaid",
    )
    .reduce((sum, expense) => sum + safeNumber(expense.amount), 0);

  alert.hidden = outstandingTotal <= 0;
  if (alert.hidden) return;

  element("credit-alert-title").textContent = t("outstandingCredit");
  element("credit-alert-detail").textContent = t("outstandingCreditDetail");
  element("credit-alert-total").textContent = formatEuro(outstandingTotal);
}

function legacyStorageKey(month) {
  return `euroscope:${month.month}:${month.updatedAt}:r${month.revision}`;
}

function loadMonth(month) {
  selectedMonth = month;
  try {
    const saved =
      localStorage.getItem(storageKey(month)) ??
      localStorage.getItem(legacyStorageKey(month));
    const savedData = JSON.parse(saved);
    data = savedData
      ? { ...savedData, salary: month.salary }
      : structuredClone(month);
  } catch {
    data = structuredClone(month);
  }
  render();
}

function save() {
  localStorage.setItem(storageKey(selectedMonth), JSON.stringify(data));
}

function renderHistory() {
  const nav = element("month-history");
  nav.replaceChildren();
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
  const updated = new Date(`${selectedMonth.updatedAt}T12:00:00`);
  const isCurrentCycle = updated >= start && updated <= end;
  const markerDate = isCurrentCycle ? updated : end;
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

function renderCategories() {
  const container = element("category-strip");
  container.replaceChildren();
  categoryTotals().forEach(({ category, amount }) => {
    const [code, className] = categoryCode(category);
    const article = document.createElement("article");
    article.innerHTML = `
      <span class="category-symbol ${className}" aria-hidden="true">${code}</span>
      <span><small>${categoryLabel(category)}</small><strong>${formatEuro(amount)}</strong></span>
    `;
    container.append(article);
  });
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
    const [code] = categoryCode(expense.category);
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
      <span class="expense-monogram" aria-hidden="true">${code}</span>
      <span class="expense-info">
        <span class="expense-title-row">
          <strong></strong>
          <span class="payment-badge ${paymentClass}">${paymentLabel(expense)}</span>
        </span>
        <small>${categoryLabel(expense.category)} · ${expense.recurring ? `${t("monthly")} · ` : ""}${sourceLabel(expense.source)} · ${date}</small>
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
    const recurringTotal = recurringExpenses.reduce(
      (sum, expense) => sum + safeNumber(expense.amount),
      0,
    );
    recurring.innerHTML = `
      <summary class="expense-table-summary">
        <span>${t("expectedMonthly")}</span>
        <strong>${formatEuro(recurringTotal)}</strong>
      </summary>
      <div class="expense-table-body">
        <div class="expense-table-meta">
          <p class="eyebrow">${t("expectedEyebrow")}</p>
          <span>${recurringExpenses.length} ${t("items")}</span>
        </div>
      </div>
    `;
    const recurringBody = recurring.querySelector(".expense-table-body");
    recurringBody.append(createExpenseList(recurringExpenses));

    const footer = document.createElement("footer");
    footer.className = "recurring-total";
    footer.innerHTML = `
      <span>${t("expectedMonthlyTotal")}</span>
      <strong>${formatEuro(recurringTotal)}</strong>
    `;
    recurringBody.append(footer);
    container.append(recurring);
  }

  const oneTime = document.createElement("details");
  oneTime.className = "expense-table one-time-expenses-table";
  oneTime.open = true;
  const oneTimeTotal = oneTimeExpenses.reduce(
    (sum, expense) => sum + safeNumber(expense.amount),
    0,
  );
  oneTime.innerHTML = `
    <summary class="expense-table-summary">
      <span>${t("oneTimeExpenses")}</span>
      <strong>${formatEuro(oneTimeTotal)}</strong>
    </summary>
    <div class="expense-table-body">
      <div class="expense-table-meta">
        <p class="eyebrow">${t("ledger")}</p>
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

function dailyExpensePoints(expenses, period) {
  const totals = expenses.reduce((daily, expense) => {
    daily.set(expense.date, (daily.get(expense.date) ?? 0) + safeNumber(expense.amount));
    return daily;
  }, new Map());
  const points = [];
  const cursor = new Date(`${period.start}T12:00:00`);
  const end = new Date(`${period.end}T12:00:00`);

  while (cursor <= end) {
    const date = cursor.toISOString().slice(0, 10);
    points.push({
      x: cursor.getTime(),
      y: Math.round((totals.get(date) ?? 0) * 100) / 100,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

function renderDailyExpenseChart() {
  const container = element("daily-expense-chart");
  dailyExpenseChart?.destroy();
  dailyExpenseChart = null;

  if (!window.ApexCharts) {
    container.textContent = t("refresh");
    return;
  }

  container.textContent = "";
  const accent =
    theme === "nier-automata"
      ? "#476f7b"
      : theme === "tohsaka-rin"
        ? "#e52a55"
        : "#0a84ff";

  dailyExpenseChart = new window.ApexCharts(container, {
    chart: {
      type: "line",
      height: 170,
      background: "transparent",
      fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font-family"),
      animations: { enabled: !window.matchMedia("(prefers-reduced-motion: reduce)").matches },
      sparkline: { enabled: true },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    series: [{ name: t("dailyExpenseSeries"), data: dailyExpensePoints(data.expenses, selectedMonth.period) }],
    colors: [accent],
    stroke: { curve: "smooth", width: 4, lineCap: "round" },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 0.35, opacityFrom: 0.32, opacityTo: 0.02, stops: [0, 92, 100] },
    },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    grid: { show: false, padding: { left: 0, right: 0, top: 8, bottom: 8 } },
    xaxis: { type: "datetime" },
    yaxis: { min: 0 },
    tooltip: { enabled: false },
  });
  dailyExpenseChart.render();
}

function render() {
  const spent = data.expenses.reduce(
    (sum, expense) => sum + safeNumber(expense.amount),
    0,
  );
  const salary = safeNumber(data.salary);
  const savings = safeNumber(data.savingsGoal);
  const spendable = Math.max(salary - savings, 0);
  const remaining = salary - savings - spent;
  const percent = spendable > 0 ? Math.min((spent / spendable) * 100, 100) : 0;
  const timeline = renderTimeline();
  const daysLeft = Math.max(timeline.totalDays - timeline.elapsedDays, 1);

  element("month-label").textContent = formatMonth(selectedMonth.month);
  element("updated-label").textContent = `${t("updated")} ${new Date(
    `${selectedMonth.updatedAt}T12:00:00`,
  ).toLocaleDateString(locale(), { day: "numeric", month: "long", year: "numeric" })}`;
  element("salary-value").textContent = formatEuro(salary);
  element("savings").value = savings;
  element("spent-total").textContent = formatEuro(spent);
  element("expense-count").textContent =
    t("recordedExpenses", {
      count: data.expenses.length,
      plural: data.expenses.length === 1 ? "" : "s",
    });
  const savingsComparison = comparisonFor("savings", savings);
  const spendingComparison = comparisonFor("spending", spent);
  element("savings-comparison").textContent = savingsComparison.text;
  element("savings-comparison").className = `stat-comparison ${savingsComparison.tone}`;
  element("spending-comparison").textContent = spendingComparison.text;
  element("spending-comparison").className = `stat-comparison ${spendingComparison.tone}`;
  element("remaining").textContent = formatEuro(remaining);
  element("spent-percent").textContent = `${Math.round(percent)}% ${t("spent")}`;
  element("ring-percent").textContent = `${Math.round(percent)}%`;
  element("progress-ring").style.setProperty("--progress", `${percent * 3.6}deg`);
  element("progress-ring").setAttribute(
    "aria-label",
    t("budgetUsed", { percent: Math.round(percent) }),
  );
  element("daily-pace").textContent = `${formatEuro(Math.max(remaining, 0) / daysLeft, true)} ${t("perDay")}`;

  applyTranslations();
  renderDailyExpenseChart();
  renderCreditAlert();
  renderSpendingAlert();
  renderHistory();
  renderCategories();
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
    localStorage.setItem("kinance:theme", theme);
    applyTheme();
    if (data) renderDailyExpenseChart();
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      language = button.dataset.language;
      localStorage.setItem("kinance:language", language);
      applyTranslations();
      applyTheme();
      if (data) render();
    });
  });
  element("savings").addEventListener("change", (event) => {
    data.savingsGoal = safeNumber(event.target.value);
    save();
    render();
  });
  element("expense-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const amountInput = element("amount");
    const amount = safeNumber(amountInput.value.replace(",", "."));
    if (!amount) return;
    const category = element("category").value;
    const paymentMethod = element("payment-method").value;
    const noteInput = element("note");
    data.expenses.unshift({
      id: crypto.randomUUID(),
      amount: Math.round(amount * 100) / 100,
      note: noteInput.value.trim() || category,
      date: selectedMonth.updatedAt,
      category,
      source: "site",
      paymentMethod,
      ...(paymentMethod === "credit" ? { creditStatus: "outstanding" } : {}),
    });
    amountInput.value = "";
    noteInput.value = "";
    element("payment-method").value = "debit";
    save();
    render();
  });
}

async function start() {
  try {
    renderThemeOptions();
    applyTheme();
    applyTranslations();
    const response = await fetch("/data/finance-history.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`History request failed: ${response.status}`);
    const financeHistory = await response.json();
    salarySchedule = financeHistory.salarySchedule ?? salarySchedule;
    history = financeHistory.months.slice(-12);
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
