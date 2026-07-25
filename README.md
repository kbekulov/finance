# Operating Manual for AI Maintainers

This repository is a personal salary-cycle finance tracker maintained through chat. This file is for an LLM/AI taking over maintenance. Do not replace it with a conventional project README, marketing copy, screenshots, or end-user setup instructions.

## Non-negotiable behavior

Treat each user message as a possible finance or product update. When it changes code or source finance data, complete the entire workflow in the same task:

1. inspect the current `dev` branch and remote state;
2. update the canonical JSON and both website implementations;
3. set the current salary cycle’s visible update date to the actual current date;
4. increment the current salary cycle’s `revision` for every canonical finance-data change;
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
- `salarySchedule.dayOfMonth`: nominal monthly salary day, currently `12`
- `salarySchedule.weekendRule`: `previousFriday`; when the nominal salary day is Saturday or Sunday, use the Friday immediately before that weekend
- `months`: chronological array, oldest first, newest last, containing no more than 12 records

Every month record must contain:

- `month`: unique `YYYY-MM` key for the nominal salary month
- `label`: human-readable English label
- `period.start` and `period.end`: exact inclusive salary-cycle boundaries
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

A message whose financial intent is simply a number means: add that amount in euros as a new expense for the current salary cycle.

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
- Classify the purchase using an existing supported category when one accurately fits. If the receipt reveals a meaningful, reusable type of spending that none of the existing categories represents, create a new stable category without waiting for separate approval.
- Keep receipt-discovered categories broad enough to reuse across merchants and future expenses. Never create a merchant-specific, product-specific, or one-off category merely to avoid making a reasonable classification.
- If the final total is ambiguous, do not guess; explain what is ambiguous and ask the user.

### Salary

When the user states a monthly salary, replace the current salary cycle’s `salary`. Salary is the base from which savings and expenses are deducted. Current canonical salary is €2,150 until changed.

Salary is nominally paid on the 12th of every month. If the 12th is Saturday or Sunday, the effective salary and reset date is the Friday immediately before that weekend. A cycle starts on that effective salary date and ends one calendar day before the next effective salary date. Use `Europe/Vilnius` dates and calculate this rule for each month; never hard-code a permanent day-of-week assumption.

### Savings requirement

When the user changes the monthly savings requirement, replace the current salary cycle’s `savingsGoal`. Current canonical savings requirement is at least €200 per cycle until changed.

### Rename or correct an expense

Edit the existing record instead of adding a duplicate. Preserve its amount, date, recurrence, source, and category unless the user changes them. Update both database-level `noteTranslations` values with every rename.

### Recurring expenses

Store each recurring charge as a normal expense with `recurring: true` and `frequency: "monthly"`. When opening a new month, carry recurring records forward with new month-specific IDs and dates, then apply any user-requested cancellations or amount changes.

Render every expense marked `recurring: true` inside a standalone expected-monthly-expenses table. Render one-time expenses in a separate sibling table. Never nest either table inside the other or inside a shared ledger card. Both tables must be independently collapsible, open by default, keyboard accessible, and show the localized table name on the left and that table’s calculated total on the right while collapsed. The recurring table footer must always calculate and display the sum of the recurring records in the selected salary cycle.

On desktop, the ledger grid must size both tables to their content instead of stretching them to the adjacent expense form. A collapsed table must remain only as tall as its summary row at every responsive breakpoint.

## Supported categories

Internal values must remain exactly:

- `Food`
- `Subscriptions & services`
- `Luxury purchases`
- `Debt & repayments`
- `Devices & installments`
- `Transport & Travel`
- `Alcohol & nightlife`

Receipt evaluation may introduce a genuinely necessary new category. Treat that as a complete database and product feature, never as a JSON-only value. Translate only the displayed labels. In the same committed update, change:

- the JSON record;
- `CATEGORIES` and category labeling/classification in both JavaScript and React;
- the form options;
- English and Russian labels;
- colored category strip, breakdown bar, legend, and accessibility text;
- warning guidance and flexible-category behavior when applicable;
- tests for canonical data, calculations, rendering, and translation parity;
- this manual.

Keep the static and React implementations equivalent, use one stable English internal key everywhere, and do not ship an uncategorized fallback or an untranslated visible category.

## Rolling 12-cycle history

At the first update on or after a new effective salary date:

1. calculate the effective salary date for the nominal month using the 12th/previous-Friday rule;
2. create the new cycle record with `period.start` on that effective salary date and `period.end` one day before the following effective salary date;
3. set `updatedAt` to the current date and `revision` to `1`;
4. carry forward salary, savings requirement, and active recurring expenses;
5. assign new cycle-specific expense IDs and dates;
6. do not copy one-time expenses;
7. keep records ordered oldest to newest;
8. if the array exceeds 12 records, remove only the oldest record;
9. verify navigation, totals, timeline, and warnings for both current and historical cycles.

Never silently rewrite a historical cycle when the user is clearly talking about the current cycle.

## Spending warning strip

The warning strip at the very top is dynamic and must never contain stale hard-coded euro amounts.

- Recalculate it from the selected month’s category totals on every render.
- Identify the largest current category and show its amount and share of total spending.
- Recommend a flexible cut from `Food`, `Subscriptions & services`, `Luxury purchases`, `Devices & installments`, `Transport & Travel`, or `Alcohol & nightlife`, preferring the largest flexible category other than the dominant category.
- If only one category has spending, advise pausing new spending in that category.
- If no expenses exist, show a neutral guidance state rather than a false warning.
- Use localized category names, euro formatting, English/Russian copy, and live-region semantics.
- Preserve the dark Apple-style translucent amber treatment and mobile readability.

The warning is guidance derived from current data, not financial or legal advice.

## Timeline and date rules

- The current cycle shows the actual current day and positions the marker across its inclusive `period.start` to `period.end` range.
- Historical cycles show their cycle end.
- Daily pace divides non-negative remaining money by the days after today through `period.end`; it must not use calendar-month end.
- The salary balance resets on `period.start`, including when the nominal 12th moves to the preceding Friday.
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

Never use em dashes in user-facing site copy, metadata, or titles. The document title, Open Graph title, and X/Twitter title must be exactly `Kinance` unless the user explicitly renames the product.

## Calculation invariants

After each finance-data update, verify:

- `spent = sum(expense.amount)`
- `spendable = max(salary - savingsGoal, 0)`
- `remaining = salary - savingsGoal - spent`
- used percentage is based on `spent / spendable` and visually capped at 100%
- category totals sum exactly to `spent`
- breakdown segment widths are proportional to category totals
- daily pace uses non-negative remaining money divided by remaining salary-cycle days
- expense count equals the current salary cycle’s array length
- warning amount/share match the same category totals
- savings and spending comparisons use the average of up to the three salary cycles immediately before the selected cycle
- savings comparisons use each cycle's `savingsGoal`; spending comparisons use the sum of each cycle's expenses
- comparisons state how many prior cycles were available and show a neutral history-unavailable message when none exist

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

## Theme system

Theme selection is a device-local preference stored as `kinance:theme`. Keep the switcher data-driven so the number of themes is not artificially limited. Every theme must have one stable ID, display label, and PNG banner path in the `THEMES` collection in both JavaScript and React, matching `data-theme` CSS selectors. Store theme banners in `public/theme-banners/`, use a wide composition with the important characters inside the central crop-safe area, and provide localized accessible alt text through `themeBannerLabel`.

The built-in themes are:

- `kinance`: the default dark iOS-inspired appearance
- `nier-automata`: frosted white, pale blue-gray atmosphere, black typography, cool translucent surfaces, and restrained warm sparks
- `tohsaka-rin`: crimson, midnight violet, jewel highlights, and refined serif accents

New themes must preserve all content, functionality, responsive layouts, keyboard focus, contrast, reduced-motion behavior, and English/Russian accessibility labels. A theme may change palette, typography, radii, texture, and decorative treatment, but never finance calculations or canonical data.

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
