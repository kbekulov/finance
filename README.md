# Operating Manual for AI Maintainers

This repository is a personal monthly finance tracker maintained through chat. This file is for an LLM/AI taking over maintenance. Do not replace it with a conventional project README, marketing copy, screenshots, or end-user setup instructions.

## Non-negotiable behavior

Treat each user message as a possible finance or product update. When it changes code or source finance data, complete the entire workflow in the same task:

1. inspect the current `dev` branch and remote state;
2. update the canonical JSON and both website implementations;
3. set the current month’s visible update date to the actual current date;
4. increment the current month’s `revision` for every canonical finance-data change;
5. check English/Russian parity for every visible or accessible string;
6. validate JSON, static JavaScript, calculations, responsive behavior, and the production build;
7. commit intentionally and push `dev`;
8. publish the exact pushed commit to the connected Site when Sites tools are available;
9. verify the worktree is clean and local `HEAD` equals `origin/dev`.

Never leave a completed code/data change uncommitted or unpushed. Do not force-push, discard unrelated work, or overwrite a newer remote commit. Fetch and integrate concurrent remote changes safely.

The active Git branch is `dev`. Do not recreate or use `main` unless the user explicitly requests it.

## Two website implementations must stay equivalent

The repository contains two presentation surfaces backed by the same data:

- GitHub Pages/static: `index.html`, `styles.css`, `script.js`
- Connected Site/Vinext: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`

Every feature, data interpretation, calculation, warning, translation, and important accessibility label must behave equivalently in both. Do not update only one implementation.

The complete tracker must be served directly. Never add a redirect to an unrelated host. Preserve `CNAME` when the custom GitHub Pages domain is intended to remain active.

## Canonical database

`data/finance-history.json` is the only canonical finance database. UI edits saved in browser storage are device-local conveniences and must never be treated as canonical history.

Root fields:

- `version`: database structure version; increment when the JSON structure changes
- `maxMonths`: must remain `12`
- `currency`: `EUR`
- `timezone`: `Europe/Vilnius`
- `months`: chronological array, oldest first, newest last, containing no more than 12 records

Every month record must contain:

- `month`: unique `YYYY-MM` key
- `label`: human-readable English label
- `period.start` and `period.end`: exact inclusive calendar boundaries
- `currency`: `EUR`
- `timezone`: `Europe/Vilnius`
- `updatedAt`: actual date of the latest committed code/data update affecting that month, `YYYY-MM-DD`
- `revision`: positive integer incremented whenever canonical values for that month change
- `salary`: non-negative numeric base monthly income
- `savingsGoal`: non-negative numeric amount protected from spending
- `expenses`: ordered array of expense records

Every expense record must preserve all known details:

- `id`: stable, unique, month-prefixed identifier such as `2026-07-grocery-001`
- `amount`: positive numeric final euro amount, never a formatted string
- `note`: concise canonical English name
- `noteTranslations.en` and `noteTranslations.ru`: required display names for every canonical expense, even when a brand name is identical in both languages
- `date`: actual expense date in `YYYY-MM-DD`
- `category`: one supported stable English category value
- `source`: `chat`, `site`, or `receipt`
- `recurring`: boolean when known
- `frequency`: `monthly` for monthly recurring expenses

When more information is actually available, preserve it with clearly named optional fields rather than discarding it, for example `merchant`, `description`, `originalCurrency`, `originalAmount`, `receiptReference`, or `paymentMethod`. Use `null` only when the distinction between “known empty” and “not supplied” matters. Never invent missing receipt, merchant, time, or payment details.

Do not store derived totals in JSON. Total spent, remaining balance, category totals, percentages, daily pace, and warning guidance must be recalculated from canonical salary, savings, expenses, and calendar dates so they cannot drift.

## Exact interpretation of chat updates

### Plain number

A message whose financial intent is simply a number means: add that amount in euros as a new expense for the current calendar month.

- Use a new stable ID.
- Add both English and Russian `noteTranslations`; never leave a canonical expense name untranslated.
- Use today’s date unless the user specifies another date.
- Choose the most reasonable supported category from context.
- Use `source: "chat"`.
- Do not mark it recurring unless the user says it repeats.
- If the purpose is genuinely unknown, use a neutral note such as `Unspecified expense`; do not fabricate a merchant.

### Receipt image

Read the final amount actually paid, not subtotal, tax, savings, balance due before payment, or a single line item.

- Use `source: "receipt"`.
- Record merchant and receipt-specific details when visible.
- Preserve the receipt currency and convert only when the user requests conversion or a reliable conversion value is available.
- If the final total is ambiguous, do not guess; explain what is ambiguous and ask the user.

### Salary

When the user states a monthly salary, replace the current month’s `salary`. Salary is the base from which savings and expenses are deducted. Current canonical salary is €2,150 until changed.

### Savings requirement

When the user changes the monthly savings requirement, replace the current month’s `savingsGoal`. Current canonical savings requirement is at least €200 per month until changed.

### Rename or correct an expense

Edit the existing record instead of adding a duplicate. Preserve its amount, date, recurrence, source, and category unless the user changes them. Update both database-level `noteTranslations` values with every rename.

### Recurring expenses

Store each recurring charge as a normal expense with `recurring: true` and `frequency: "monthly"`. When opening a new month, carry recurring records forward with new month-specific IDs and dates, then apply any user-requested cancellations or amount changes.

## Supported categories

Internal values must remain exactly:

- `Food`
- `Subscriptions & services`
- `Luxury purchases`
- `Debt & repayments`
- `Devices & installments`
- `Transport & Travel`

Translate only the displayed labels. If a genuinely necessary new category is added, update:

- the JSON record;
- `CATEGORIES` and category labeling/classification in both JavaScript and React;
- the form options;
- English and Russian labels;
- colored category strip, breakdown bar, legend, and accessibility text;
- this manual.

## Rolling 12-month history

At the first update in a new calendar month:

1. create the new month record using exact month boundaries;
2. set `updatedAt` to the current date and `revision` to `1`;
3. carry forward salary, savings requirement, and active recurring expenses;
4. assign new month-specific expense IDs and dates;
5. do not copy one-time expenses;
6. keep records ordered oldest to newest;
7. if the array exceeds 12 records, remove only the oldest record;
8. verify navigation, totals, timeline, and warnings for both current and historical months.

Never silently rewrite a historical month when the user is clearly talking about the current month.

## Spending warning strip

The warning strip at the very top is dynamic and must never contain stale hard-coded euro amounts.

- Recalculate it from the selected month’s category totals on every render.
- Identify the largest current category and show its amount and share of total spending.
- Recommend a flexible cut from `Food`, `Subscriptions & services`, `Luxury purchases`, `Devices & installments`, or `Transport & Travel`, preferring the largest flexible category other than the dominant category.
- If only one category has spending, advise pausing new spending in that category.
- If no expenses exist, show a neutral guidance state rather than a false warning.
- Use localized category names, euro formatting, English/Russian copy, and live-region semantics.
- Preserve the dark Apple-style translucent amber treatment and mobile readability.

The warning is guidance derived from current data, not financial or legal advice.

## Timeline and date rules

- The current month shows the actual current day and positions the marker using that month’s true number of days.
- Historical months show month end.
- `updatedAt`, the visible updated label, and current timeline must be aligned whenever code or canonical data changes.
- The connected React implementation currently uses a deterministic `TODAY` date for consistent builds; update it to the actual current date whenever the site changes.
- Month names and short dates must follow the active locale.

## English/Russian parity

The EN/RU switch must always expose identical information and functionality.

For every change, inspect:

- headings, warnings, labels, buttons, form help, placeholders, empty/error states;
- category names and known expense-name mappings;
- month/timeline text, recurrence labels, sources, totals, and generated guidance;
- `aria-label`, `title`, status/live-region text, and other accessibility copy.

Canonical `note` and category keys remain English, while every canonical expense also stores `noteTranslations.en` and `noteTranslations.ru`. Render expense names from those database fields. Persist the selected language locally. Never ship a new visible English string without its Russian equivalent.

## Calculation invariants

After each finance-data update, verify:

- `spent = sum(expense.amount)`
- `spendable = max(salary - savingsGoal, 0)`
- `remaining = salary - savingsGoal - spent`
- used percentage is based on `spent / spendable` and visually capped at 100%
- category totals sum exactly to `spent`
- breakdown segment widths are proportional to category totals
- daily pace uses non-negative remaining money divided by remaining calendar days
- expense count equals the current month’s array length
- warning amount/share match the same category totals

Do not change monetary totals when only renaming an expense.

## Design and accessibility

Preserve the dark iOS-inspired system:

- black canvas and layered graphite cards;
- Apple system font stack;
- translucent blur, subtle hairlines, soft shadows, and restrained system colors;
- large rounded touch targets and readable mobile layouts;
- SSD-style proportional colored spending bar with text legend;
- visible keyboard focus, semantic structure, sufficient contrast, and reduced-motion support.

Do not introduce heavy libraries for behavior that plain TypeScript/JavaScript/CSS already handles.

## Required validation

At minimum:

```bash
node --check script.js
node -e "JSON.parse(require('fs').readFileSync('data/finance-history.json','utf8'))"
npm run build
```

If `npm` is unavailable, use the bundled Node runtime with `pnpm run build` or the existing Vinext build command. Do not treat obsolete starter-template tests as product validation; update tests so they assert the current product.

Also inspect the produced HTML or bundle for:

- the current revision and date;
- the newest expense values and translated note mappings;
- both warning-strip translations;
- no unexpected redirect;
- no `NaN`, missing category label, or untranslated visible key.

Before finishing:

- review `git diff --check`;
- ensure only intended files are staged;
- commit with a concise description of the user-visible/data change;
- push `dev` and verify remote `dev` equals local `HEAD`;
- package and deploy the exact pushed commit to the connected Site;
- report the resulting live URL and any external GitHub Pages limitation honestly.
