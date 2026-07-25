const CATEGORIES = [
  "Food",
  "Subscriptions & services",
  "Luxury purchases",
  "Debt & repayments",
  "Devices & installments",
  "Transport & Travel",
  "Alcohol & nightlife",
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
    tapToEdit: "Tap the amount to edit",
    savingsRequirement: "SAVINGS REQUIREMENT",
    protectedSpending: "Protected from spending",
    spentThisMonth: "SPENT THIS SALARY CYCLE",
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
    tapToEdit: "Нажмите на сумму, чтобы изменить",
    savingsRequirement: "ЦЕЛЬ НАКОПЛЕНИЙ",
    protectedSpending: "Защищено от расходов",
    spentThisMonth: "ПОТРАЧЕНО В ЭТОМ ЦИКЛЕ",
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
let salarySchedule = { dayOfMonth: 12, weekendRule: "previousFriday" };
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

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
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

function legacyStorageKey(month) {
  return `euroscope:${month.month}:${month.updatedAt}:r${month.revision}`;
}

function loadMonth(month) {
  selectedMonth = month;
  try {
    const saved =
      localStorage.getItem(storageKey(month)) ??
      localStorage.getItem(legacyStorageKey(month));
    data = JSON.parse(saved) || structuredClone(month);
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
    item.innerHTML = `
      <span class="expense-monogram" aria-hidden="true">${code}</span>
      <span class="expense-info">
        <strong></strong>
        <small>${categoryLabel(expense.category)} · ${expense.recurring ? `${t("monthly")} · ` : ""}${sourceLabel(expense.source)} · ${date}</small>
      </span>
      <strong class="expense-amount">−${formatEuro(safeNumber(expense.amount))}</strong>
    `;
    item.querySelector(".expense-info strong").textContent = expenseNoteLabel(expense);
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
    const recurring = document.createElement("section");
    recurring.className = "recurring-expenses";
    recurring.setAttribute("aria-labelledby", "expected-monthly-title");
    recurring.innerHTML = `
      <div class="expense-group-heading">
        <div>
          <p class="eyebrow">${t("expectedEyebrow")}</p>
          <h2 id="expected-monthly-title">${t("expectedMonthly")}</h2>
        </div>
        <span>${recurringExpenses.length} ${t("items")}</span>
      </div>
    `;
    recurring.append(createExpenseList(recurringExpenses));

    const footer = document.createElement("footer");
    footer.className = "recurring-total";
    const recurringTotal = recurringExpenses.reduce(
      (sum, expense) => sum + safeNumber(expense.amount),
      0,
    );
    footer.innerHTML = `
      <span>${t("expectedMonthlyTotal")}</span>
      <strong>${formatEuro(recurringTotal)}</strong>
    `;
    recurring.append(footer);
    container.append(recurring);
  }

  const oneTime = document.createElement("section");
  oneTime.className = "activity-panel one-time-expenses-table";
  oneTime.setAttribute("aria-labelledby", "one-time-title");
  oneTime.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">${t("ledger")}</p>
        <h2 id="one-time-title">${t("oneTimeExpenses")}</h2>
      </div>
      <span>${oneTimeExpenses.length} ${t("items")}</span>
    </div>
  `;

  if (oneTimeExpenses.length) {
    oneTime.append(createExpenseList(oneTimeExpenses));
  } else {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <span aria-hidden="true">○</span>
      <h3>${t("nothingSpent")}</h3>
      <p>${t("monthEmpty", { month: formatMonth(selectedMonth.month) })}</p>
    `;
    oneTime.append(empty);
  }

  container.append(oneTime);
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
  element("salary").value = salary;
  element("savings").value = savings;
  element("spent-total").textContent = formatEuro(spent);
  element("expense-count").textContent =
    t("recordedExpenses", {
      count: data.expenses.length,
      plural: data.expenses.length === 1 ? "" : "s",
    });
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
  renderSpendingAlert();
  renderHistory();
  renderCategories();
  renderBreakdown();
  renderLedger();
}

function bindControls() {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      language = button.dataset.language;
      localStorage.setItem("kinance:language", language);
      applyTranslations();
      if (data) render();
    });
  });
  element("salary").addEventListener("change", (event) => {
    data.salary = safeNumber(event.target.value);
    save();
    render();
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
    const noteInput = element("note");
    data.expenses.unshift({
      id: crypto.randomUUID(),
      amount: Math.round(amount * 100) / 100,
      note: noteInput.value.trim() || category,
      date: selectedMonth.updatedAt,
      category,
      source: "site",
    });
    amountInput.value = "";
    noteInput.value = "";
    save();
    render();
  });
}

async function start() {
  try {
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
