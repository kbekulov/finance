# Operating Manual for AI Maintainers

This repository is a personal salary-cycle finance and physical-fitness tracker maintained through chat. This file is for an LLM/AI taking over maintenance. Do not replace it with a conventional project README, marketing copy, screenshots, or end-user setup instructions.

## Non-negotiable behavior

Treat each user message as a possible finance or product update. When it changes code or source finance data, complete the entire workflow in the same task:

1. inspect the current `dev` branch and remote state;
2. update the canonical JSON and both website implementations;
3. when the request adds one or more new expenses, refresh the active Kinance banner as defined under Theme system;
4. set the current salary cycle’s visible update date to the actual current date;
5. increment the current salary cycle’s `revision` for every canonical finance-data change;
6. check English/Russian parity for every visible or accessible string;
7. validate JSON, static JavaScript, calculations, responsive behavior, and the production build;
8. commit intentionally and push `dev`;
9. publish the exact pushed commit to the connected Site when Sites tools are available;
10. verify the worktree is clean and local `HEAD` equals `origin/dev`.

Never leave a completed code/data change uncommitted or unpushed. Do not force-push, discard unrelated work, or overwrite a newer remote commit. Fetch and integrate concurrent remote changes safely.

The active Git branch is `dev`. Do not recreate or use `main` unless the user explicitly requests it.

## Two website implementations must stay equivalent

The repository contains two presentation surfaces backed by the same data:

- GitHub Pages/static: `index.html`, `styles.css`, `script.js`
- Connected Site/Vinext: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`

Every feature, data interpretation, calculation, warning, translation, and important accessibility label must behave equivalently in both. Do not update only one implementation.

The complete tracker must be served directly. Never add a redirect to an unrelated host. Preserve `CNAME` when the custom GitHub Pages domain is intended to remain active.

## Canonical database

`data/finance-history.json` is the only canonical finance database. `data/strength-history.json` is the only canonical fitness database. The current GitHub Pages frontend is read-only for finance and fitness records: do not render expense, savings, income, or Relative Strength input controls, and do not use browser storage as a record database. Record changes through chat by updating these repository files, then commit and publish them. Browser storage and cookies may be used only for non-authoritative interface preferences such as theme and language.

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
- `salary`: non-negative numeric salary actually assigned to that specific salary cycle; this is historical source data, not a global setting
- `savingsGoal`: non-negative numeric amount protected from spending
- `additionalIncome`: ordered array of non-salary income records for that salary cycle, or an empty array when none exists
- `expenses`: ordered array of expense records

Every additional-income record must contain:

- `id`: stable, unique, month-prefixed identifier such as `2026-07-side-income-001`
- `amount`: positive numeric euro amount, never a formatted string
- `note`: concise canonical English name
- `noteTranslations.en` and `noteTranslations.ru`: required display names
- `date`: actual income date in `YYYY-MM-DD`, using `Europe/Vilnius`
- `source`: `chat` or `site`

Every expense record must preserve all known details:

- `id`: stable, unique, month-prefixed identifier such as `2026-07-grocery-001`
- `amount`: positive numeric final euro amount, never a formatted string
- `note`: concise canonical English name
- `noteTranslations.en` and `noteTranslations.ru`: required display names for every canonical expense, even when a brand name is identical in both languages
- `date`: actual expense date in `YYYY-MM-DD`
- `category`: one supported stable English category value
- `source`: `chat`, `site`, or `receipt`
- `paymentMethod`: required `debit` or `credit`; use `debit` unless the user explicitly identifies the expense as credit
- `creditStatus`: required for credit expenses, either `outstanding` or `repaid`
- `repaidAt`: repayment date in `YYYY-MM-DD`, required once a credit expense is repaid
- `recurring`: boolean when known
- `frequency`: `monthly` for monthly recurring expenses

All expense dates and repayment dates use the `Europe/Vilnius` calendar day. Derive today in that timezone for chat, recurring carry-forward, and repayment records, regardless of the maintainer, browser, server, or receipt-processing device timezone. Preserve an explicit user-supplied or clearly printed receipt date, interpreting any associated time in Vilnius unless the source explicitly identifies another timezone.

When more information is actually available, preserve it with clearly named optional fields rather than discarding it, for example `merchant`, `description`, `originalCurrency`, `originalAmount`, or `receiptReference`. Use `null` only when the distinction between “known empty” and “not supplied” matters. Never invent missing receipt, merchant, time, or payment details.

Do not store derived totals in JSON. Total income, total spent, remaining balance, category totals, percentages, daily pace, and warning guidance must be recalculated from canonical salary, additional income, savings, expenses, and calendar dates so they cannot drift.

## Exact interpretation of chat updates

### Plain number

A message whose financial intent is simply a number means: add that amount in euros as a new expense for the current salary cycle.

- Use a new stable ID.
- Add both English and Russian `noteTranslations`; never leave a canonical expense name untranslated.
- Use today’s date unless the user specifies another date.
- Choose the most reasonable supported category from context.
- Use `source: "chat"`.
- Set `paymentMethod: "debit"` unless the user explicitly says the expense was paid on credit.
- Do not mark it recurring unless the user says it repeats.
- If the purpose is genuinely unknown, use a neutral note such as `Unspecified expense`; do not fabricate a merchant.

### Synthetic balance backfill

Synthetic expense history is exceptional and may be added only when the user explicitly requests a one-time balance reconciliation or demo-data bootstrap. It must never be inferred from a stated card balance or created as part of routine expense entry.

- Reconcile in integer cents so the resulting calculated balance matches the user-supplied target exactly.
- When the user states an actual debit-card or cash balance, reconcile it to `cashRemaining = salary + additionalIncomeTotal - spent`. Never subtract `savingsGoal` before matching a real account balance. The savings requirement is an allocation inside that cash balance, not money held outside the account unless the user explicitly says it has already been transferred elsewhere.
- Keep every synthetic record inside the date range and salary cycle explicitly requested by the user, using `Europe/Vilnius` calendar dates.
- Use generic, plausible expense names and existing broad categories without inventing merchants, receipts, transaction times, or other evidence.
- Set `source: "chat"` and use the normal debit or credit rule.
- Mark every generated record with `synthetic: true` and a stable shared `backfillBatch` identifier so the entire batch remains auditable and removable.
- Do not carry synthetic one-time expenses into a future salary cycle.

### Receipt image

Read the final amount actually paid, not subtotal, tax, savings, balance due before payment, or a single line item.

- Use `source: "receipt"`.
- Inspect every visible receipt date and time before choosing the expense date. When a transaction or fiscal purchase date is clearly legible, use that printed date even if the user uploads the receipt days or months later. Never substitute the chat submission date, attachment timestamp, photo metadata date, or current day for a clearly printed transaction date.
- When a receipt shows several dates, use the date tied to the completed purchase or payment. Do not use a statement due date, order-creation date, document-copy date, or reprint date unless it is also clearly the purchase date. Preserve a clearly printed transaction time in `transactionTime` when available.
- Assign the expense to the salary cycle whose inclusive `period.start` through `period.end` contains the chosen receipt date. Salary-cycle boundaries, not the receipt's calendar-month name and not the currently selected page, determine which month record receives the expense. Update that target cycle's `updatedAt` and increment its `revision`.
- Interpret a receipt date and time in `Europe/Vilnius` unless the receipt explicitly identifies another timezone. Normalize the stored `date` to `YYYY-MM-DD`.
- If no date is visible, the date is unreadable or partially obscured, multiple dates conflict without a reliable transaction date, or the apparent date is otherwise genuinely uncertain, use the actual current `Europe/Vilnius` calendar day and add the expense to the current salary cycle. Do not invent or OCR-guess missing digits, and do not delay the entry merely to ask about an unclear date when this fallback applies.
- If a clear old receipt date falls outside every retained salary cycle, never misdate it into the current cycle. Establish the correct historical cycle only when its required salary-cycle data can be preserved without invention; otherwise explain which historical salary or cycle values are missing and ask for them before changing history.
- Set `paymentMethod: "debit"` unless the user explicitly says that purchase was paid on credit. Do not infer credit merely from a card receipt.
- Record merchant and receipt-specific details when visible.
- Preserve the receipt currency and convert only when the user requests conversion or a reliable conversion value is available.
- Classify the purchase using an existing supported category when one accurately fits. If the receipt reveals a meaningful, reusable type of spending that none of the existing categories represents, create a new stable category without waiting for separate approval.
- Keep receipt-discovered categories broad enough to reuse across merchants and future expenses. Never create a merchant-specific, product-specific, or one-off category merely to avoid making a reasonable classification.
- If the final total is ambiguous, do not guess; explain what is ambiguous and ask the user.

### Salary

Salary is cycle-specific historical source data. Every month record keeps its own `salary`, and all cash balance, savings-safe balance, spent percentage, and daily-pace calculations for a selected cycle must use that cycle’s value. The July 2026 cycle is currently €2,150; do not interpret that as a permanent global salary.

When the user states a salary for a named month or says that one specific month was higher or lower, update only that salary cycle’s `salary`, `updatedAt`, and `revision`. Never propagate a one-off salary adjustment into earlier or later cycles. When the user says the new salary applies from now on, update the current cycle and use it as the starting salary carried into newly created future cycles, while preserving all existing historical salaries. If the intended cycle is genuinely ambiguous, resolve it from the conversation and current Vilnius salary cycle before editing rather than assuming a calendar month.

When creating a new salary cycle, copy the immediately preceding cycle’s salary as the best known starting value. If the user later provides the actual salary for that cycle, replace only that cycle’s value. Do not create fake salary transactions or a separate derived salary-total field. The ordered `months[].salary` values are the salary history.

Salary is the income base from which that cycle’s savings requirement and expenses are deducted. Treat it as the usable salary amount supplied by the user; do not infer gross pay, net pay, bonuses, taxes, or other payroll components that were not stated.

Salary, savings, income, expenses, and fitness attempts are repository-owned canonical data and must never be editable from either frontend interface while the site remains a static GitHub Pages product without authenticated server persistence. Render financial plan values as clear fixed values with no input control, mutation handler, or browser-local override. Changes happen only by editing the appropriate canonical data file through the maintenance workflow.

Salary is nominally paid on the 12th of every month. If the 12th is Saturday or Sunday, the effective salary and reset date is the Friday immediately before that weekend. A cycle starts on that effective salary date and ends one calendar day before the next effective salary date. Use `Europe/Vilnius` dates and calculate this rule for each month; never hard-code a permanent day-of-week assumption.

### Additional income

Record proceeds from item sales, hobby services, gifts, refunds treated as income, or any other non-salary inflow in the selected cycle's `additionalIncome` array. Keep it separate from `salary` so the fixed salary and salary history remain truthful. Use a generic note such as `Side income` when the user supplies no more specific source, and never invent whether the money came from a sale or a service.

Additional income increases the usable budget only in the salary cycle that contains its actual Vilnius receipt date. It is non-recurring by default and must not be carried into a future cycle unless the user explicitly describes it as recurring. Update that cycle's `updatedAt` and increment its `revision`. The frontend must show base salary, additional income, and total income as distinct values whenever additional income exists. Additional income is canonical backend data and must not be merged into the locked salary amount or stored as a negative expense.

### Savings requirement

When the user changes the monthly savings requirement, replace the current salary cycle’s `savingsGoal`. Current canonical savings requirement is at least €200 per cycle until changed.

### Rename or correct an expense

Edit the existing record instead of adding a duplicate. Preserve its amount, date, recurrence, source, and category unless the user changes them. Update both database-level `noteTranslations` values with every rename.

### Debit, credit, and repayment

Debit is the universal default. Every new purchase, receipt, subscription, debt payment, or other expense must be stored with `paymentMethod: "debit"` unless the user explicitly says it was paid with a credit card or on credit. An explicitly identified credit purchase must use `paymentMethod: "credit"` and `creditStatus: "outstanding"`.

When the user says that credit has been repaid, update every currently outstanding credit expense to `creditStatus: "repaid"` and set `repaidAt` to the stated repayment date, or today when no date is supplied. Preserve the original expense amount, category, date, source, recurrence, and payment method. Credit repayment is a balance settlement, not a second purchase, so do not add another expense or count the repayment twice in spending totals.

The outstanding-credit banner must remain completely hidden when the outstanding total is zero. When any outstanding credit exists in the retained finance history, show the flashing high-priority banner above the normal spending warning and calculate its euro total dynamically from all expenses where `paymentMethod` is `credit` and `creditStatus` is not `repaid`. Never store or manually update a banner total. A maintenance pass only adds credit records or marks existing records repaid when the user says repayment occurred. Repaid credit stays visibly labeled in its expense table but never contributes to the banner total. The banner must keep its theme-specific palette, assertive live-region semantics, mobile layout, and reduced-motion fallback.

Every expense row must display a localized payment badge: Debit, Credit, or Credit repaid. The quick-entry form must default to Debit while allowing Credit to be selected explicitly. Carry an explicitly configured payment method forward with recurring expenses.

### Recurring expenses

Store each recurring charge as a normal expense with `recurring: true` and `frequency: "monthly"`. When opening a new month, carry recurring records forward with new month-specific IDs and dates, then apply any user-requested cancellations or amount changes.

Render every expense marked `recurring: true` inside a standalone expected-monthly-expenses table. Render one-time expenses in a separate sibling table. Never nest either table inside the other or inside a shared ledger card. Both tables must be independently collapsible, open by default, keyboard accessible, and show the localized table name on the left and that table’s calculated total on the right in their persistent summary row. Do not repeat a table total in its expanded body or footer. Keep the item count in the expanded body, but do not repeat `Monthly` on every recurring row because the table heading already establishes that context.

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
- colored category strip, compact proportional breakdown bar, wrapping inline legend, and accessibility text;
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
6. do not copy one-time expenses or non-recurring additional income;
7. keep records ordered oldest to newest;
8. if the array exceeds 12 records, remove only the oldest record;
9. verify navigation, totals, timeline, and warnings for both current and historical cycles.

Hide the cycle-history navigation while only one cycle exists because it merely repeats the current month already shown in the header. Render it automatically once at least two cycles are available.

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
- The all-funds daily pace divides non-negative `cashRemaining` by the days after today through `period.end`; the savings-safe pace divides non-negative `safeRemaining` by the same day count. Neither pace may use calendar-month end.
- The salary balance resets on `period.start`, including when the nominal 12th moves to the preceding Friday.
- `updatedAt` and its visible label describe the latest canonical-data revision; they must not drive the live timeline or daily pace.
- Derive the live timeline, chart cutoff, and daily pace from the actual `Europe/Vilnius` calendar day at render time. Never hard-code today or treat future cycle days as zero-spend observations.
- Month names and short dates must follow the active locale.

## English/Russian parity

The EN/RU switch must always expose identical information and functionality.

For every change, inspect:

- headings, warnings, labels, buttons, form help, placeholders, empty/error states;
- category names and known expense-name mappings;
- month/timeline text, recurrence labels, sources, totals, and generated guidance;
- `aria-label`, `title`, status/live-region text, and other accessibility copy.

Canonical `note` and category keys remain English, while every canonical expense also stores `noteTranslations.en` and `noteTranslations.ru`. Render expense names from those database fields. Russian is the default language when no preference exists. Persist language selection in the one-year, site-wide `kinance_language` cookie with `SameSite=Lax` and `Secure` on HTTPS. Never ship a new visible English string without its Russian equivalent.

Russian copy must read as idiomatic native UI language, not as a word-for-word English translation. Review agreement, government, register, terminology, and singular/few/many count behavior. Prefer `зарплатный цикл` over the literal `цикл зарплаты`, use concise accounting terms consistently, and rewrite count-dependent sentences so placeholders cannot create incorrect declensions.

Never use em dashes in user-facing site copy, metadata, or titles. The document title, Open Graph title, and X/Twitter title must be exactly `Kinance` unless the user explicitly renames the product.

## Calculation invariants

After each finance-data update, verify:

- `spent = sum(expense.amount)` using integer cents for aggregation
- every displayed cycle reads `salary` from that exact month record, allowing salaries to differ across history without cross-cycle leakage
- `additionalIncomeTotal = sum(additionalIncome.amount)` using integer cents for aggregation
- `totalIncome = salary + additionalIncomeTotal`; never overwrite the fixed salary with this derived total
- `cashRemaining = totalIncome - spent`; this is the real debit balance when canonical expenses and income have been reconciled to the user's stated account balance
- `safeRemaining = cashRemaining - savingsGoal`; this is what may still be spent without touching protected savings
- spent percentage is based on `spent / totalIncome`; show the real percentage above 100% while capping only the ring graphic at 100%
- the ring uses one total-income-wide scale: green shows spent income, red permanently marks the `savingsGoal / totalIncome` zone, and the neutral gap between them is `safeRemaining`
- when salary is zero and spending is positive, show a no-spending-budget state instead of a false `0%`
- category totals sum exactly to `spent`
- breakdown segment widths are proportional to category totals
- all-funds daily pace uses non-negative `cashRemaining` divided by remaining salary-cycle days and is styled red because following it consumes the savings reserve
- savings-safe daily pace uses non-negative `safeRemaining` divided by remaining salary-cycle days and is styled green
- expense count equals the current salary cycle’s array length
- warning amount/share match the same category totals
- savings and spending comparisons use the average of up to the three salary cycles immediately before the selected cycle
- savings comparisons are explicitly described as planned savings and use each cycle's `savingsGoal`
- spending comparisons use only expenses through the same elapsed cycle day in each prior cycle, avoiding partial-to-full-cycle comparisons
- comparisons state how many prior cycles were available; hide comparison rows entirely when no prior cycle exists instead of repeating unavailable-state copy

Do not change monetary totals when only renaming an expense.

## Design and accessibility

Preserve the dark iOS-inspired system:

- black canvas and layered graphite cards;
- Apple system font stack;
- translucent blur, subtle hairlines, soft shadows, and restrained system colors;
- large rounded touch targets and readable mobile layouts;
- one proportional colored spending bar with a text legend as the single category breakdown; do not repeat the same category amounts in a separate card strip;
- visible keyboard focus, semantic structure, sufficient contrast, and reduced-motion support.

Do not introduce heavy libraries for behavior that plain TypeScript/JavaScript/CSS already handles.

## Theme system

Theme selection is a device preference stored in the one-year, site-wide `kinance_theme` cookie with `SameSite=Lax` and `Secure` on HTTPS. `kinance` is the default when no valid cookie exists. Keep the switcher data-driven so the number of themes is not artificially limited. Every theme must have one stable ID, display label, and one or more PNG banner paths in the `THEMES` collection in both JavaScript and React, matching `data-theme` CSS selectors. Store theme banners in `public/theme-banners/`, use `/public/theme-banners/...` paths in the static site and `/theme-banners/...` paths in React, use a wide composition with the important characters inside the central crop-safe area, and provide localized accessible alt text through `themeBannerLabel`. Character artwork must span the viewport as a borderless, edge-faded page-background band independent of the content shell width, with responsive height and crop positioning that preserve the main composition. It must not read as a rounded card or standalone wrapper.

Every expense-recording request that adds at least one new canonical expense must also refresh the shared Kinance and Kinance Moon banner in the same committed update. Generate one fresh two-frame banner set per request, even when the request adds several expenses. Use the built-in image-generation workflow to create a substantially new pixel-art scene that reads as an actual RPGMaker-style in-game moment, not a painted anime illustration. Show an in-game character visibly performing the activity related to the newly recorded expense, with the purchased item or service immediately legible at mobile banner size. Every new banner must meaningfully represent the topic of the expense through the character's action, setting, clothing, and large readable props. When one request contains several new expenses, stage one coherent scene that represents their shared category or a balanced combination of the main topics. Use crisp 16-bit or 32-bit pixel clusters, an edge-to-edge environment, a central crop-safe subject, and a darker quiet lower band for chart legibility. Include no text, logos, financial figures, merchant details, receipt-derived personal information, watermarks, or recognizable copyrighted character likenesses. Preserve the existing dark Kinance mood and full-viewport treatment.

The two banner images are consecutive frames of a deliberately low-frame-rate idle animation. Frame two must preserve the exact camera, composition, characters, props, and setting from frame one, changing only one or two restrained details such as a breathing pose, cloth edge, rain cluster, steam curl, or lantern flame. Never turn the second frame into a new shot or a different action. Save the frames as `public/theme-banners/kinance.png` and `public/theme-banners/kinance-frame-2.png`, inspect both, and increment the shared banner query version for both `kinance` and `kinance-moon` in `index.html`, `script.js`, and `app/page.tsx` so browsers load them immediately. Alternate the frames with a hard pixel-art cut every 1000 milliseconds, preload both, and freeze on the first frame when the user requests reduced motion. Do not refresh the banner for corrections, deletions, or credit repayments that add no expense. Finance accuracy takes priority: if image generation is temporarily unavailable or produces no usable pair after one focused retry, record and publish the expense normally, retain the current banner pair, and report that the optional visual refresh could not be completed.

Every expense row uses a category-relevant transparent PNG from `public/category-icons/` instead of a letter monogram. The default `kinance` theme uses one bold, item-only RPGMaker-inspired pixel inventory icon per category with no people or characters. These objects must be logically usable within Type-Moon-style modern urban-occult story logic, blending a clearly recognizable everyday purchase with restrained ritual craft. Do not copy franchise symbols, named artifacts, character likenesses, or logos. `kinance-moon`, `nier-automata`, and `tohsaka-rin` use the existing Type-Moon character pools. Keep both the item map and every character pool complete and identical in JavaScript and React whenever categories change. Select character variants with the shared stable expense-ID hash so different rows gain variety without flickering or changing during rerenders.

Treat every icon as decorative because the localized category name remains visible in text. Preserve the square aspect ratio, use a borderless transparent cutout without glow, and render it with CSS `image-rendering: pixelated` so the hard pixel clusters survive at the actual 48-pixel UI size. Use a dominant, unmistakable category silhouette and a few large supporting props. Give every category its own clearly different primary hue so the set has color variety comparable to the character pools; do not let one accent color dominate the set. Judge every replacement on both light and dark backgrounds at 48 pixels. Avoid tiny symbolism that only reads at full resolution, and create new concepts from a blank canvas instead of tracing an older icon. The current Kinance set is warded mapo tofu and a tea flask for Food; a recurring mystic-service contract terminal for Subscriptions & services; a velvet mana-gem case for Luxury purchases; a sealed association ledger and brass tokens for Debt & repayments; a circuit-etched mystic-code laptop and familiar-control module for Devices & installments; a field-agent motorcycle helmet, city rail pass, and keys for Transport & Travel; and an antique nocturnal wine set for Alcohol & nightlife. The current three-character pools are Taiga Fujimura, Kohaku, and Soujuurou Shizuki for Food; Caster Medea, BB, and Sion Eltnam Atlasia for Subscriptions & services; Luviagelita Edelfelt, Nero Claudius, and Alice Kuonji for Luxury purchases; Kirei Kotomine, Mash Kyrielight, and Shiki Ryougi for Debt & repayments; Archer EMIYA, Ciel, and Touko Aozaki for Devices & installments; Rider Medusa, Arcueid Brunestud, and Shiki Tohno for Transport & Travel; and Lancer Cu Chulainn, Shuten-Douji, and Aoko Aozaki for Alcohol & nightlife.

The daily activity chart sits entirely over the lower 168 pixels of the banner artwork on desktop and mobile, without obscuring the banner's primary scene. It uses ApexCharts in both implementations. Aggregate non-recurring expenses by their actual `date`; do not plot recurring expected expenses on the day they happened to be recorded because that would falsely imply they were paid that day. Include zero-value spending points from the selected salary cycle start only through the actual Vilnius date for a current cycle, or through `period.end` for a historical cycle. Keep the x-axis as a datetime axis and recalculate on cycle, theme, expense, savings target, remaining-day, or strength-history changes. Render daily spending as crisp rounded stacked columns: the theme-colored lower segment is debit and the red upper segment is credit. The two segments must add up to the true daily total. Include every credit purchase in the historical red segment whether its `creditStatus` is `outstanding` or `repaid`; repayment status affects the outstanding-credit alert, not the original payment-method history. Overlay Relative Strength as a smooth line on its own hidden 1-to-10 y-axis, using the best score recorded for each day. Keep the 168-pixel, viewport-width chart borderless, with no visible numeric axes, grid, built-in legend, or tooltip.

Add two thin horizontal allowance guides because daily allowance is a spending-axis value: a red long-dashed rule for the all-funds allowance and a green short-dashed rule for the savings-safe allowance. Each localized label must state the rounded euro amount per day first, followed by the allowance state in compact language. Build the guide as real line segments interrupted by plain theme-colored text, visually `short line, text, long line`, with both labels aligned to the same left edge. Use no pill, badge, outline, or floating callout. A subtle edge-faded canvas mask and restrained dark text shadow may sit behind the text only so bars and artwork cannot reduce legibility; the mask must not read as a solid rectangle or glow. Scale the spending y-axis to keep both guides in range. Define theme-aware spending and strength colors through `--chart-accent` and `--strength-accent`; use each theme's existing `--red` and `--green` for the guides. Disable chart animation when reduced motion is requested, while preserving a localized accessible label for screen readers.

Avoid glow effects throughout every theme. Do not add luminous text shadows, colored outer box shadows, neon halos, chart drop shadows, or glowing status dots. Ordinary neutral directional shadows may remain where they communicate elevation, and solid outlines may remain where keyboard focus or state visibility requires them.

## Relative Strength tracking

Relative Strength entries live in `data/strength-history.json`, independently of salary cycles. The root contains `version`, `timezone`, `updatedAt`, `revision`, and chronological `entries`. Increment `revision` and set the actual Vilnius `updatedAt` whenever an entry changes. Each entry contains a stable ID, the actual Vilnius date, body weight in kilograms, `maxPullUpsSingleSet`, `maxPushUpsSingleSet`, and `source: "chat"`. These two repetition values always mean the highest number completed in one uninterrupted set on that date. Never add together separate sets, rounds, or an evening's total volume. If the user performs five sets, record only the highest pull-up set and highest push-up set; they do not have to come from the same round. Do not track the number of sets unless the user explicitly asks for a separate training-volume feature. Do not store the derived score. Validate weight from 30 to 250 kg, pull-ups from 0 to 200, and push-ups from 0 to 300.

The frontend is read-only: show the latest attempt as compact metrics and the best calculated score per day on the shared activity chart, without an input form or a misleading local save action. The score is a personal training index, not a medical assessment or population percentile. Keep the Relative Strength card compact and immediately scannable on mobile: the score and latest date form the first hierarchy, all three metric values use equal visual emphasis, long metric labels wrap instead of truncating, and the chart legend plus single-set explanation remain readable secondary information. Format the score with the selected locale's decimal separator. Calculate it identically in JavaScript and React:

1. cap pull-up progress at `maxPullUpsSingleSet / 20` and push-up progress at `maxPushUpsSingleSet / 50`;
2. weight those components 60% and 40% respectively;
3. apply the deliberately mild body-mass factor `(weightKg / 75) ^ 0.12`, clamped from `0.9` to `1.1`;
4. map the result onto 1 through 10, clamp it, and round to one decimal place.

Never diagnose health, claim that this index is scientifically standardized, or silently change the formula because that would make historical comparisons misleading. If the formula changes, increment the strength database schema version and keep historical comparisons explicit.

The built-in themes are:

- `kinance`: the default dark iOS-inspired appearance with item-only chibi expense icons
- `kinance-moon`: the same dark appearance and banner with randomized Type-Moon character expense icons
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
