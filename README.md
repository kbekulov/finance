# Operating Manual for AI Maintainers

This repository is a personal salary-cycle finance and physical-fitness tracker maintained through chat. This document is the operational specification for future AI maintainers. Keep it concise, current, and action-oriented. Do not replace it with marketing copy, screenshots, or a conventional end-user README.

## 1. Golden rules

1. Work on `dev`. Do not recreate or use `main` unless the user explicitly asks.
2. Fetch before editing. Preserve unrelated work and integrate concurrent remote changes safely.
3. Treat `data/finance-history.json` as the only canonical finance database and `data/strength-history.json` as the only canonical fitness database.
4. Keep both presentation surfaces equivalent:
   - GitHub Pages/static: `index.html`, `styles.css`, `script.js`
   - Connected Site/Vinext: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`
5. The frontend is read-only for canonical finance and fitness data. Do not add inputs or browser-local persistence for salary, savings, income, expenses, credit, or Relative Strength while authenticated server persistence does not exist.
6. Use `Europe/Vilnius` for every derived "today", expense date, income date, repayment date, salary-cycle boundary, and fitness date.
7. Keep English and Russian content and accessibility labels equivalent. Russian is the default language.
8. Recalculate all derived values from canonical data. Never store display totals, percentages, balances, allowances, or warning amounts in JSON.
9. Validate every affected data path, calculation, translation, responsive layout, and production build.
10. Commit every completed code or database change and push `dev` in the same task. Never leave completed work uncommitted or unpushed.
11. Publish the exact pushed commit to the connected Site when Sites tools are available. Preserve `CNAME` and the complete tracker at the custom GitHub Pages domain.
12. Finish with a clean worktree and confirm local `HEAD` equals `origin/dev`.

Never force-push, discard unrelated changes, overwrite a newer remote commit, or redirect the tracker to an unrelated host.

## 2. Change workflow

Use this sequence for every mutation:

1. Inspect `dev`, `origin/dev`, the worktree, and the relevant canonical data.
2. Determine the affected salary cycle from its inclusive date range, not from the calendar-month name or currently selected UI cycle.
3. Make the smallest complete change:
   - finance data change: update the target cycle's `updatedAt` and increment its `revision`;
   - fitness data change: update the strength root `updatedAt` and increment its `revision`;
   - visible UI copy: update English, Russian, and accessibility text in both implementations;
   - new expense: also refresh the Kinance banner pair as specified under Themes and visual assets.
4. Keep static and React implementations behaviorally equivalent.
5. Run the validation matrix in section 13.
6. Review the diff and confirm only intended files changed.
7. Fetch again if the task was long-running, integrate any remote movement safely, then commit and push `dev`.
8. Publish when the connected Sites tools are available.
9. Verify the live result when deployment is available, the worktree is clean, and local and remote `dev` match.

Do not change a cycle's `updatedAt` or `revision` for a purely visual or documentation-only edit. Those fields describe canonical data revisions.

## 3. Canonical data model

### Finance root

`data/finance-history.json` contains:

- `version`: schema version; increment only when the structure changes
- `maxMonths`: always `12`
- `currency`: `EUR`
- `timezone`: `Europe/Vilnius`
- `salarySchedule.dayOfMonth`: nominal salary day, currently `12`
- `salarySchedule.weekendRule`: `previousFriday`
- `months`: chronological salary-cycle records, oldest first, maximum 12

Every month record contains:

- `month`: unique nominal salary-month key in `YYYY-MM`
- `label`: human-readable English label
- `period.start` and `period.end`: exact inclusive cycle boundaries
- `currency`: `EUR`
- `timezone`: `Europe/Vilnius`
- `updatedAt`: date of the latest canonical change to that cycle, `YYYY-MM-DD`
- `revision`: positive integer incremented for every canonical change to that cycle
- `salary`: non-negative salary actually assigned to that cycle
- `savingsGoal`: non-negative amount protected from spending
- `additionalIncome`: ordered non-salary income records or an empty array
- `expenses`: ordered expense records

Every additional-income record contains:

- `id`: stable, unique, month-prefixed ID such as `2026-07-side-income-001`
- `amount`: positive numeric euro amount, never formatted text
- `note`: concise canonical English name
- `noteTranslations.en` and `noteTranslations.ru`
- `date`: actual Vilnius income date in `YYYY-MM-DD`
- `source`: `chat` or `site`

Every expense record contains:

- `id`: stable, unique, month-prefixed ID such as `2026-07-grocery-001`
- `amount`: positive numeric final euro amount, never formatted text
- `note`: concise canonical English name
- `noteTranslations.en` and `noteTranslations.ru`, even when a brand name is identical
- `date`: actual expense date in `YYYY-MM-DD`
- `category`: one supported stable English category key
- `source`: `chat`, `site`, or `receipt`
- `paymentMethod`: required `debit` or `credit`; default to `debit`
- `creditStatus`: required only for credit expenses, `outstanding` or `repaid`
- `repaidAt`: repayment date in `YYYY-MM-DD`, required after repayment
- `recurring`: boolean when known
- `frequency`: `monthly` for monthly recurring expenses

Preserve known optional details with clear field names, for example `merchant`, `description`, `transactionTime`, `originalCurrency`, `originalAmount`, or `receiptReference`. Use `null` only when "known empty" must be distinguished from "not supplied". Never invent merchants, receipt details, times, payment methods, or other evidence.

### Fitness root

`data/strength-history.json` contains `version`, `timezone`, `updatedAt`, `revision`, and chronological `entries`. Each entry contains:

- stable `id`
- actual Vilnius `date`
- body weight in kilograms
- `maxPullUpsSingleSet`
- `maxPushUpsSingleSet`
- `source: "chat"`

Store raw attempts only. Do not store the derived Relative Strength score.

## 4. Salary cycles and history

Salary is nominally paid on the 12th. If the 12th is Saturday or Sunday, the effective salary and reset date is the Friday immediately before that weekend. A cycle starts on that effective date and ends one calendar day before the next effective salary date. Calculate this independently for every nominal month in `Europe/Vilnius`.

At the first canonical update on or after a new effective salary date:

1. Calculate the new cycle start and next cycle start using the salary rule.
2. Create the new record with an inclusive `period.start` and `period.end`.
3. Set `updatedAt` to the actual Vilnius date and `revision` to `1`.
4. Carry forward the preceding cycle's salary, savings goal, and active recurring expenses as the best known starting values.
5. Give carried expenses new cycle-specific IDs and appropriate dates.
6. Do not copy one-time expenses, synthetic backfill entries, or non-recurring additional income.
7. Keep cycles oldest to newest and remove only the oldest when the array exceeds 12.
8. Verify navigation, totals, timeline, chart, and insights for current and historical cycles.

Hide cycle-history navigation when only one cycle exists. Show it automatically once at least two cycles exist. Never silently rewrite a historical cycle when the user is clearly discussing the current cycle.

Salary is cycle-specific historical source data, not a global editable value:

- A salary stated for one month changes only that cycle.
- A change stated as applying "from now on" changes the current cycle and becomes the starting value for newly created future cycles.
- Existing historical salaries never change unless explicitly corrected.
- New cycles initially inherit the immediately preceding salary; replace only that cycle when the actual amount becomes known.
- Do not infer gross pay, net pay, bonuses, taxes, or payroll components the user did not state.
- Do not create fake salary transactions or a separate salary-total field.

The salary card must be visually distinctive, compact, locked, and non-editable. When additional income exists, show salary, additional income, and total income as separate values.

## 5. Interpreting user updates

### New expense

A message whose financial intent is simply an amount means to add that amount in euros as a new expense in the current salary cycle.

- Create a new stable ID.
- Use the actual Vilnius date unless the user specifies another date.
- Choose the most reasonable supported category from context.
- Use `source: "chat"`.
- Use `paymentMethod: "debit"` unless the user explicitly says credit.
- Do not mark the expense recurring unless the user says it repeats.
- Add English and Russian note translations.
- If the purpose is genuinely unknown, use a neutral name such as `Unspecified expense`; do not invent a merchant.

### Receipt image

Record the final amount actually paid, not a subtotal, tax amount, discount, outstanding balance, or individual line item.

- Use `source: "receipt"`.
- Inspect every visible date and time; use that printed date even if the user uploads the receipt days or months later.
- Do not substitute the chat date, attachment timestamp, photo metadata date, statement due date, order-creation date, copy date, or reprint date for a clear purchase date.
- When several dates appear, choose the one tied to completed payment. Preserve a clearly printed time in `transactionTime`.
- Interpret the date and time in `Europe/Vilnius` unless another timezone is explicit.
- Assign the expense to the salary cycle whose inclusive `period.start` through `period.end` contains the chosen receipt date.
- If the date is absent, unreadable, obscured, conflicting, or genuinely uncertain, use the actual current `Europe/Vilnius` calendar day and add the expense to the current salary cycle. Do not guess missing digits or pause merely to ask about an unclear date.
- If a clear old date falls outside every retained cycle, never misdate it into the current cycle. Create the correct historical cycle only when required salary-cycle data can be preserved without invention; otherwise ask for the missing historical values.
- Default to debit even when a card receipt is visible. Use credit only when the user explicitly says it was credit.
- Preserve visible merchant and receipt details.
- Preserve the receipt currency. Convert only when the user requests it or a reliable conversion value is supplied.
- Use an existing broad category when it fits. Create a new reusable category without separate approval only when no current category accurately represents the purchase.
- Never create a merchant-specific, product-specific, or one-off category to avoid reasonable classification.
- If the final total itself is ambiguous, do not guess. Explain the ambiguity and ask the user.

### Correct, rename, or remove an expense

Edit or remove the existing record instead of adding a duplicate. Preserve every field the user did not change. A rename must update both note translations. A rename-only change must not alter monetary totals.

### Synthetic balance backfill

Synthetic expense history is exceptional. Add it only when the user explicitly requests a one-time balance reconciliation or demo bootstrap. Never infer it from a stated balance during normal entry.

- Reconcile in integer cents to the exact target:
  `cashRemaining = salary + additionalIncomeTotal - spent`.
- Do not subtract `savingsGoal` before matching a real debit-card or cash balance. Savings are an allocation inside that balance unless the user says they were transferred elsewhere.
- Keep all synthetic entries within the requested cycle and date range.
- Use generic plausible names and existing broad categories. Do not invent merchants, receipts, times, or evidence.
- Apply the normal debit/credit rule and `source: "chat"`.
- Set `synthetic: true` and a stable shared `backfillBatch` identifier.
- Never carry synthetic one-time expenses into another cycle.

### Additional income

Record item-sale proceeds, hobby-service payments, gifts, refunds treated as income, or other non-salary inflows in the applicable cycle's `additionalIncome` array.

- Keep it separate from `salary` so the fixed salary and salary history remain truthful.
- Use the actual Vilnius receipt date and the cycle containing that date.
- Default to non-recurring and do not carry it forward.
- Use `Side income` when no source is given. Do not invent whether it came from a sale or service.
- Never store income as a negative expense.

### Savings goal

When the user changes a savings requirement, update the intended cycle's `savingsGoal`. Do not embed a current euro amount in this manual because canonical data may change.

### Debit, credit, and repayment

Debit is the universal default for purchases, receipts, subscriptions, debt payments, and recurring expenses. Use credit only when the user explicitly identifies it.

For a new credit expense:

- set `paymentMethod: "credit"`;
- set `creditStatus: "outstanding"`;
- preserve it as spending on its original purchase date.

When the user says all credit was repaid:

- change every outstanding credit expense to `creditStatus: "repaid"`;
- set `repaidAt` to the supplied date or today's Vilnius date;
- preserve original amount, category, purchase date, source, recurrence, and payment method;
- do not add a repayment expense or count repayment as new spending.

The outstanding-credit alert:

- is hidden when the dynamically calculated outstanding total is zero;
- appears above normal content when any outstanding credit exists;
- sums expenses across all retained cycles where `paymentMethod` is `credit` and `creditStatus` is not `repaid`;
- never uses a stored or manually maintained total;
- remains high-priority, theme-aware, mobile-safe, accessible as a live region, and respectful of reduced motion.

Every expense row displays a localized Debit, Credit, or Credit repaid badge. Repaid credit remains visible in history but does not contribute to the alert. Recurring expenses carry forward their explicitly configured payment method.

### Recurring expenses

Store a recurring charge as a normal expense with `recurring: true` and `frequency: "monthly"`. Carry active charges into a new cycle with new IDs and dates, then apply cancellations or amount corrections requested by the user.

## 6. Supported categories

Stable internal keys are:

- `Food`
- `Subscriptions & services`
- `Luxury purchases`
- `Debt & repayments`
- `Devices & installments`
- `Transport & Travel`
- `Alcohol & nightlife`

If a receipt requires a genuinely new reusable category, treat it as a complete product and data change. In the same commit update:

- the canonical JSON record;
- category constants, labels, classification, colors, and accessibility text in static and React implementations;
- English and Russian translations;
- breakdown, legend, insight guidance, and flexible-category logic where applicable;
- icon maps and theme character pools;
- tests and this manual.

Use one stable English internal key everywhere. Translate display labels only. Never ship an uncategorized fallback or untranslated visible category.

## 7. Calculation invariants

Use integer cents for all monetary aggregation. For the selected cycle:

- `spent = sum(expense.amount)`
- `additionalIncomeTotal = sum(additionalIncome.amount)`
- `totalIncome = salary + additionalIncomeTotal`
- `cashRemaining = totalIncome - spent`
- `safeRemaining = cashRemaining - savingsGoal`

Required behavior:

- Read salary from the selected cycle only. Never leak another cycle's salary.
- Keep fixed salary separate from derived `totalIncome`.
- Category totals must sum exactly to `spent`.
- Expense count must equal that cycle's expense-array length.
- The real spent percentage is `spent / totalIncome`. Display values above 100%; cap only the gauge graphic at 100%.
- When total income is zero and spending is positive, show a no-budget state rather than a false `0%`.
- All-funds daily pace is non-negative `cashRemaining` divided by the remaining salary-cycle days and is red because following it consumes protected savings.
- Savings-safe daily pace is non-negative `safeRemaining` divided by the same remaining days and is green.
- Use the days after today through `period.end`; never use calendar-month end.
- A negative `safeRemaining` is a savings breach and must display red. Zero or positive remains green.
- Insights must use the same category totals as the breakdown.
- Category-breakdown widths must be proportional to their totals.

The expenditure ring is a progress gauge, not an allocation pie:

- the untouched track is dark;
- actual spending fills clockwise in green up to the safe-spending threshold `totalIncome - savingsGoal`;
- a distinct radial marker shows that threshold;
- only actual spending beyond the threshold fills red;
- unspent track remains dark;
- never pre-fill the savings allocation red before it has been spent.

Comparisons:

- Compare against the average of up to the three cycles immediately before the selected cycle.
- Savings comparisons describe planned savings and use each prior cycle's `savingsGoal`.
- Spending comparisons compare only the same elapsed cycle day in each prior cycle.
- State how many prior cycles were available.
- Hide comparison rows when no prior cycle exists.

## 8. Timeline, summaries, and ledgers

- The current cycle timeline uses the actual Vilnius date across the inclusive `period.start` to `period.end` range.
- Historical timelines stop at their cycle end.
- Salary resets on `period.start`, including a Friday-adjusted start.
- `updatedAt` describes the latest canonical revision. It never drives the live timeline, chart cutoff, or daily pace.
- Derive live dates at render time. Do not hard-code today or plot future days as zero-spend observations.
- Month and short-date text follow the active locale.
- The compact current-cycle status control shows the localized month only, without the year.

The three summary areas must remain functional:

- salary card: locked cycle salary plus separate additional and total income when applicable;
- savings card: planned savings and comparison with prior cycles;
- spending card: cycle spending and comparison with prior cycles.

Expected and one-time expenses are separate sibling tables:

- recurring expenses appear only in the expected-monthly table;
- one-time expenses appear only in the general expenses table;
- neither table is nested inside the other or a shared ledger card;
- both are independently collapsible, open by default, keyboard accessible, and content-sized on desktop;
- the persistent collapsed summary shows the localized table name on the left and calculated total on the right;
- do not repeat the total in an expanded footer or body;
- keep the item count in expanded content;
- do not repeat `Monthly` on every recurring row;
- a collapsed table must remain only as tall as its summary row at every breakpoint.

## 9. Spending insight and activity chart

### Spending insight

Keep the `Spending insight` disclosure between the Kinance brand and the theme selector, not as a persistent page-top warning panel.

- Calculate it from the selected cycle on every render.
- Show the largest category's amount and share.
- Recommend the largest flexible category other than the dominant category from `Food`, `Subscriptions & services`, `Luxury purchases`, `Devices & installments`, `Transport & Travel`, or `Alcohol & nightlife`.
- If only one category has spending, advise pausing new spending there.
- If no expenses exist, show neutral guidance.
- Clicking opens a restrained localized tooltip; clicking anywhere outside it or pressing Escape closes it.
- Keep `aria-expanded`, `aria-controls`, tooltip semantics, keyboard focus, mobile containment, and live updates correct.
- Treat it as guidance, not financial or legal advice.

### Activity chart

Use ApexCharts identically in static and React implementations. The chart sits entirely over the lower 168 pixels of the banner artwork on desktop and mobile, edge to edge and borderless, without hiding the main scene.

Spending series:

- Aggregate non-recurring expenses by actual `date`.
- Do not plot recurring expected expenses on the date they happened to be recorded.
- Include zero-value dates from cycle start through today's Vilnius date for a current cycle, or through `period.end` for a historical cycle.
- Use a datetime x-axis internally.
- Render crisp rounded stacked columns: the theme-colored lower segment is debit and the red upper segment is credit.
- Debit plus credit equals the true daily total.
- Historical credit remains red whether its `creditStatus` is `outstanding` or `repaid`. Repayment status affects only the outstanding-credit alert.

Relative Strength series:

- Overlay the best score for each day as a smooth line.
- Use a separate hidden 1-to-10 y-axis.
- Do not place debit, credit, or other finance-series legends inside the Relative Strength card. That card identifies only its own line and methodology.

Allowance guides:

- Draw a red long-dashed rule for the all-funds allowance and a green short-dashed rule for the savings-safe allowance.
- Put the rounded euro amount first, followed by compact localized state text.
- Align both labels to the same left edge.
- Interrupt real line segments with plain colored text, visually `short line, text, long line`.
- Use no pill, badge, outline, or floating callout.
- A subtle edge-faded canvas mask may protect label legibility, but it must not look like a rectangle or glow. Do not use text shadow.
- Keep both guides within the spending y-axis range.

The visible chart has no numeric axes, grid, built-in legend, or tooltip. Recalculate it when cycle, theme, expenses, savings, remaining days, or strength history changes. Disable animation for reduced motion and retain a localized accessible label describing all series.

## 10. Language, naming, and accessibility

The EN/RU switch exposes identical information and functionality.

- Canonical `note` and category keys remain English.
- Render expense names from `noteTranslations.en` and `noteTranslations.ru`.
- Russian is the default language when no preference exists.
- Persist language in the one-year site-wide `kinance_language` cookie with `SameSite=Lax` and `Secure` on HTTPS.
- Never ship visible or accessible English text without a Russian equivalent.
- Review headings, buttons, tooltips, empty/error states, category names, expense names, dates, recurrence, payment badges, sources, totals, generated guidance, `aria-label`, `title`, status text, and live regions.
- Russian must be idiomatic native UI language. Review agreement, case government, register, terminology, and singular/few/many behavior. Prefer `зарплатный цикл` to the literal `цикл зарплаты`. Rewrite count-dependent phrases when interpolation would produce bad declension.
- Never use em dashes in visible site copy, metadata, or titles.

The product name and document, Open Graph, and X/Twitter titles are exactly `Kinance` unless the user explicitly renames the product. The page title contains no subtitle or extra phrase. Preserve the configured favicon.

Maintain semantic structure, visible theme-appropriate keyboard focus, sufficient contrast, readable touch targets, reduced-motion support, and localized accessibility names.

## 11. Themes and visual assets

### Theme behavior

Theme selection is data-driven and stored in the one-year site-wide `kinance_theme` cookie with `SameSite=Lax` and `Secure` on HTTPS. `kinance` is the default and first option. Theme IDs, labels, banner paths, CSS selectors, and accessible banner text must agree between JavaScript and React.

Built-in themes:

- `kinance`: default dark iOS-inspired theme with item-only pixel inventory icons
- `kinance-moon`: moonlit indigo variation with Type-Moon character icon pools
- `nier-automata`: frosted white and pale blue-gray, black typography, cool translucent surfaces, restrained warm accents
- `tohsaka-rin`: crimson and midnight violet with jewel accents and refined serif details

Treat every theme as one shared interface with a distinct palette, not a separate layout. A theme may change palette, typography, radii, texture, and decoration, but never content, finance logic, or canonical data.

Every theme must preserve:

- theme-aware focus, timeline, chart, divider, positive, and negative colors;
- consistent semantic green and red meanings;
- sufficient contrast for small text and controls;
- hover states that preserve surface contrast;
- no clipping at desktop and a 375-pixel mobile viewport;
- responsive layout, keyboard access, English/Russian accessibility, and reduced motion;
- no glow effects, luminous text shadows, colored outer shadows, neon halos, chart drop shadows, or glowing status dots.

Neutral directional shadows may communicate elevation. Solid outlines may communicate focus or state.

### Banners

Store banners in `public/theme-banners/`. Static paths use `/public/theme-banners/...`; React paths use `/theme-banners/...`. Banners are borderless, edge-faded page-background bands independent of the content-shell width. Use a wide composition, central crop-safe subject, responsive crop, and quiet lower region for chart legibility. Never present a banner as a rounded card or wrapper.

Every expense-recording request that adds at least one new canonical expense must also refresh the shared Kinance and Kinance Moon pair:

1. Generate one fresh two-frame banner set per request, even when the request contains several expenses.
2. Use the built-in image-generation workflow.
3. Create a substantially new 16-bit or 32-bit pixel-art scene that reads as an RPGMaker-style in-game moment.
4. Show an in-game character visibly performing the activity related to the newly recorded expense. Make the purchased item or service readable at mobile banner size through action, setting, clothing, and large props.
5. For several expenses, create one coherent scene representing their shared category or balanced main topics.
6. Include no text, logos, amounts, merchant details, receipt-derived personal data, watermarks, or recognizable copyrighted character likenesses.
7. Keep the existing dark Kinance mood, edge-to-edge environment, central crop-safe subject, and darker lower band.

Every new banner must meaningfully represent the topic of the expense. The two images are consecutive frames of a deliberately low-frame-rate idle animation:

- preserve the exact camera, composition, characters, props, and setting;
- change only one or two restrained details such as breathing, cloth, rain, steam, or lantern flame;
- never turn frame two into another shot or action;
- save as `public/theme-banners/kinance.png` and `public/theme-banners/kinance-frame-2.png`;
- inspect both and increment the shared banner query version for both `kinance` and `kinance-moon` in `index.html`, `script.js`, and `app/page.tsx`;
- preload both. Alternate the frames with a hard pixel-art cut every 1000 milliseconds;
- freeze on frame one for reduced motion.

Do not refresh the Kinance pair for corrections, deletions, credit repayments, or other updates that add no expense. The NieR and Tohsaka banners are static and are not regenerated for expenses. Finance accuracy takes priority: if image generation fails to produce a usable pair after one focused retry, record and publish the expense normally, keep the existing pair, and report the optional visual limitation.

### Category icons

Every expense row uses a decorative category-relevant transparent PNG from `public/category-icons/`, never a letter monogram.

The default `kinance` theme uses one bold, item-only RPGMaker-inspired pixel inventory icon per category. These objects must make sense within Type-Moon-style modern urban-occult story logic, but must not copy franchise symbols, named artifacts, logos, or character likenesses. Current concepts:

- Food: warded mapo tofu and tea flask
- Subscriptions & services: recurring mystic-service contract terminal
- Luxury purchases: velvet mana-gem case
- Debt & repayments: sealed association ledger and brass tokens
- Devices & installments: circuit-etched laptop and familiar-control module
- Transport & Travel: field-agent helmet, rail pass, and keys
- Alcohol & nightlife: antique nocturnal wine set

Kinance Moon, NieR, and Tohsaka use the existing three-character pools:

- Taiga Fujimura, Kohaku, and Soujuurou Shizuki for Food
- Caster Medea, BB, and Sion Eltnam Atlasia for Subscriptions & services
- Luviagelita Edelfelt, Nero Claudius, and Alice Kuonji for Luxury purchases
- Kirei Kotomine, Mash Kyrielight, and Shiki Ryougi for Debt & repayments
- Archer EMIYA, Ciel, and Touko Aozaki for Devices & installments
- Rider Medusa, Arcueid Brunestud, and Shiki Tohno for Transport & Travel
- Lancer Cu Chulainn, Shuten-Douji, and Aoko Aozaki for Alcohol & nightlife

Keep the item map and every character pool complete and identical in JavaScript and React whenever categories change. Select character variants with the shared stable expense-ID hash so they vary without flicker.

Icon requirements:

- square transparent cutout, borderless and without glow;
- CSS `image-rendering: pixelated`;
- recognizable dominant silhouette and only a few large supporting props;
- distinct primary hue per category;
- readable at the actual 48-pixel size on light and dark backgrounds;
- no tiny symbolism that only reads at full resolution;
- create new concepts from a blank canvas instead of tracing an older icon;
- treat the image as decorative because the localized category name remains visible.

## 12. Relative Strength

`maxPullUpsSingleSet` and `maxPushUpsSingleSet` mean the highest repetitions completed in one uninterrupted set on that date. Never sum sets, rounds, or an evening's total volume. If the user performs several sets, record only the best pull-up set and best push-up set; they need not come from the same round. Do not track number of sets unless the user explicitly requests a separate volume feature.

Validate:

- weight: 30 to 250 kg
- pull-ups: 0 to 200
- push-ups: 0 to 300

The frontend remains read-only. Show the latest attempt as compact metrics and the best calculated daily score on the shared chart. The score is a personal bodyweight strength-endurance index, not maximal force, a medical assessment, a population percentile, a 1RM estimate, or a scientifically standardized norm. Comparisons assume consistent strict technique, range of motion, cadence, and effort.

The card must remain compact and scannable:

- score and latest date form the first hierarchy;
- weight, pull-ups, and push-ups receive equal emphasis;
- pull-up and push-up metrics show `current / target`, where the target is the minimum whole-number repetition count required for a 10.0 score at the recorded body weight;
- long labels wrap instead of truncating;
- the Relative Strength line key and methodology remain secondary but readable;
- locale controls the decimal separator.

Formula version 3 must match in JavaScript and React:

1. `massAdjustment = (weightKg / 75) ^ (1 / 3)`
2. `adjustedPullUps = maxPullUpsSingleSet * massAdjustment`
3. `adjustedPushUps = maxPushUpsSingleSet * massAdjustment`
4. `pullComponent = clamp(adjustedPullUps / 20, 0, 1)`
5. `pushComponent = clamp(adjustedPushUps / 50, 0, 1)`
6. `average = (pullComponent + pushComponent) / 2`
7. `score = roundToOneDecimal(clamp(1 + 9 * average, 1, 10))`

Calculate the displayed 10.0 targets from the same mass adjustment: `pullUpTarget = ceil(20 / massAdjustment)` and `pushUpTarget = ceil(50 / massAdjustment)`. Derive them at render time from the latest recorded weight; never store or hard-code them.

The 20- and 50-repetition anchors calibrate this personal display and are not population norms. Recompute all historical scores from raw attempts with the current formula. If the formula changes, increment the strength schema version, document the formula version, and update regression fixtures. Version 3 introduced allometric adjustment and equal weighting; version 2 used the discontinued `0.12` clamped mass factor and 60/40 weighting.

Scientific context:

- bodyweight-supported performance research supports an approximate negative one-third body-mass scaling exponent for exercises such as chin-ups: [PubMed](https://pubmed.ncbi.nlm.nih.gov/15024662/)
- push-up biomechanics show that the upper body supports a consistent fraction of body mass: [PubMed](https://pubmed.ncbi.nlm.nih.gov/20179649/), [full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC7386139/)
- repetition capacity varies substantially at a given percentage of 1RM: [PubMed](https://pubmed.ncbi.nlm.nih.gov/37792272/)

## 13. Validation and release

Run checks proportionate to the change. A finance or product change normally requires:

```bash
node --check script.js
node -e "JSON.parse(require('fs').readFileSync('data/finance-history.json','utf8'))"
node -e "JSON.parse(require('fs').readFileSync('data/strength-history.json','utf8'))"
npm run lint
node --test tests/rendered-html.test.mjs
npm run build
```

Use the bundled runtime or established Vinext command if the default executable is unavailable. Do not rely on obsolete starter-template tests.

For canonical data changes, also inspect the rendered HTML or bundle for:

- current `revision` and `updatedAt`;
- newest values and both note translations;
- localized insight and credit-alert behavior;
- no `NaN`, missing category, untranslated key, or unexpected redirect;
- correct historical-cycle assignment and calculation invariants.

For UI changes, verify:

- static and React parity;
- desktop and 375-pixel mobile layouts;
- all built-in themes;
- English and Russian;
- keyboard operation, focus, tooltip/disclosure behavior, reduced motion, and contrast;
- no clipped important content or unintended horizontal scrolling.

Before finishing:

1. Run `git diff --check`.
2. Confirm only intended files are staged.
3. Commit with a concise description.
4. Push `dev`.
5. Verify local `HEAD` equals `origin/dev` and the worktree is clean.
6. When Sites tools are available, package and deploy that exact pushed commit and verify the resulting live URL.
