const CATEGORIES = [
  "Food",
  "Subscriptions & services",
  "Luxury purchases",
  "Debt & repayments",
  "Devices & installments",
];
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

let history = [];
let selectedMonth = null;
let data = null;

function element(id) {
  return document.getElementById(id);
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
}

function categoryCode(category) {
  if (category === "Food") return ["F", "food"];
  if (category === "Subscriptions & services") return ["S", "services"];
  if (category === "Luxury purchases") return ["L", "luxury"];
  if (category === "Debt & repayments") return ["D", "debt"];
  return ["I", "devices"];
}

function storageKey(month) {
  return `euroscope:${month.month}:${month.updatedAt}:r${month.revision}`;
}

function loadMonth(month) {
  selectedMonth = month;
  try {
    data = JSON.parse(localStorage.getItem(storageKey(month))) || structuredClone(month);
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
    button.textContent = month.label;
    button.className = month.month === selectedMonth.month ? "active" : "";
    if (button.className) button.setAttribute("aria-current", "date");
    button.addEventListener("click", () => loadMonth(month));
    nav.append(button);
  });
  const count = document.createElement("span");
  count.className = "history-count";
  count.textContent = `${history.length} / 12 months saved`;
  nav.append(count);
}

function renderTimeline() {
  const [year, month] = selectedMonth.month.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const updated = new Date(`${selectedMonth.updatedAt}T12:00:00`);
  const isCurrentMonth =
    updated.getFullYear() === year && updated.getMonth() + 1 === month;
  const day = isCurrentMonth ? Math.min(updated.getDate(), daysInMonth) : daysInMonth;
  const shortMonth = selectedMonth.label.slice(0, 3);
  const position = `${(day / daysInMonth) * 100}%`;

  element("timeline-start").textContent = `01 ${shortMonth.toUpperCase()}`;
  element("timeline-current").textContent = `${isCurrentMonth ? "Today" : "Month end"} · ${day} ${shortMonth}`;
  element("timeline-end").textContent = `${daysInMonth} ${shortMonth.toUpperCase()}`;
  element("timeline-progress").style.width = position;
  element("timeline-marker").style.left = position;
  return { daysInMonth, day };
}

function renderCategories() {
  const container = element("category-strip");
  container.replaceChildren();
  CATEGORIES.forEach((category) => {
    const total = data.expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + safeNumber(expense.amount), 0);
    const [code, className] = categoryCode(category);
    const article = document.createElement("article");
    article.innerHTML = `
      <span class="category-symbol ${className}" aria-hidden="true">${code}</span>
      <span><small>${category}</small><strong>${euro.format(total)}</strong></span>
    `;
    container.append(article);
  });
}

function renderLedger() {
  const container = element("ledger");
  container.replaceChildren();
  element("ledger-count").textContent = `${data.expenses.length} ITEMS`;

  if (!data.expenses.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span aria-hidden="true">○</span>
        <h3>Nothing spent yet</h3>
        <p>Your ${selectedMonth.label} expenses will appear here as you add them.</p>
      </div>
    `;
    return;
  }

  const list = document.createElement("ul");
  list.className = "expense-list";
  data.expenses.forEach((expense) => {
    const [code] = categoryCode(expense.category);
    const date = new Date(`${expense.date}T12:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="expense-monogram" aria-hidden="true">${code}</span>
      <span class="expense-info">
        <strong></strong>
        <small>${expense.category} · ${expense.recurring ? "Monthly · " : ""}${date}</small>
      </span>
      <strong class="expense-amount">−${euro.format(safeNumber(expense.amount))}</strong>
    `;
    item.querySelector(".expense-info strong").textContent = expense.note || expense.category;
    list.append(item);
  });
  container.append(list);
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
  const daysLeft = Math.max(timeline.daysInMonth - timeline.day, 1);

  element("month-label").textContent = selectedMonth.label;
  element("updated-label").textContent = `Updated ${new Date(
    `${selectedMonth.updatedAt}T12:00:00`,
  ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
  element("salary").value = salary;
  element("savings").value = savings;
  element("spent-total").textContent = euro.format(spent);
  element("expense-count").textContent =
    `${data.expenses.length} recorded expense${data.expenses.length === 1 ? "" : "s"}`;
  element("remaining").textContent = euro.format(remaining);
  element("spent-percent").textContent = `${Math.round(percent)}% SPENT`;
  element("ring-percent").textContent = `${Math.round(percent)}%`;
  element("progress-ring").style.setProperty("--progress", `${percent * 3.6}deg`);
  element("daily-pace").textContent = `${compactEuro.format(Math.max(remaining, 0) / daysLeft)} / day`;

  renderHistory();
  renderCategories();
  renderLedger();
}

function bindControls() {
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
    const response = await fetch("/data/finance-history.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`History request failed: ${response.status}`);
    const financeHistory = await response.json();
    history = financeHistory.months.slice(-12);
    if (!history.length) throw new Error("Finance history is empty.");
    bindControls();
    loadMonth(history.at(-1));
  } catch (error) {
    element("ledger").innerHTML = `
      <div class="empty-state">
        <h3>History unavailable</h3>
        <p>Please refresh the page in a moment.</p>
      </div>
    `;
    console.error(error);
  }
}

start();
