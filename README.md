# Instructions for AI Maintainers

You are maintaining a personal finance website for the repository owner. Follow every rule below for every user message.

## Mandatory workflow

1. Interpret every user message as a request to update the website’s code or finance data when applicable.
2. Update both implementations:
   - GitHub Pages: `index.html`, `styles.css`, and `script.js`
   - Private Sites build: `app/page.tsx`, `app/globals.css`, and related app files
3. After every code or data modification:
   - validate the affected JavaScript/JSON;
   - run the production app build;
   - commit the complete change;
   - push `main` to `https://github.com/kbekulov/finance`;
   - allow GitHub Pages to rebuild;
   - publish the same commit to the configured private Site when Sites tools are available.
4. Never add a redirect from `finance.bekulov.com`. GitHub Pages must serve the complete tracker directly.
5. Do not leave the working tree dirty after a completed update.

## Finance data

- The source of truth is `data/finance-history.json`.
- Retain no more than the latest 12 monthly records.
- The current base monthly income is €2,150 unless the user changes it.
- Every month record must contain:
  - `month`: `YYYY-MM`
  - `label`
  - `updatedAt`: `YYYY-MM-DD`
  - `revision`: increment whenever source finance data changes so stale browser storage cannot override it
  - `salary`
  - `savingsGoal`
  - `expenses`
- Every expense must contain:
  - stable unique `id`
  - positive numeric `amount`
  - `note`
  - `date`
  - `category`
  - `source`: `chat`, `site`, or `receipt`
- Recurring expenses also contain:
  - `recurring: true`
  - `frequency: "monthly"`
- A plain number from the user means add that many euros as an expense for the current month.
- For a receipt image, identify the final paid total and add it as the expense.
- Salary and savings requirement statements replace the corresponding current-month values.
- Use sensible categories. Current supported categories are:
  - `Food`
  - `Subscriptions & services`
  - `Luxury purchases`
  - `Debt & repayments`
  - `Devices & installments`
- Recalculate and verify expense count, total spent, remaining balance, category totals, percentages, and daily pace after every finance-data change.

## Timeline and history

- Every code or data update must keep the visible update date and timeline aligned with the actual current day.
- The timeline position must be calculated from the selected month’s length.
- Historical months show month end; the current month shows today.
- Month navigation and all displayed totals must be derived from `data/finance-history.json`.

## English and Russian

- The website must always support English and Russian through the EN/RU switch.
- Every new or changed visible string requires both English and Russian translations.
- Translation parity includes:
  - headings and labels;
  - form text and placeholders;
  - categories;
  - timeline states;
  - empty/error states;
  - recurring/source labels;
  - dynamically generated totals and accessibility labels.
- Keep internal category values stable in English; translate only their displayed labels.
- Persist the user’s language choice locally.
- After every site change, explicitly check whether translation keys need to be added or updated.

## Visual design

- Preserve the dark iOS-inspired design:
  - black canvas;
  - layered graphite cards;
  - translucent blurred navigation;
  - Apple system font stack;
  - iOS system accent colors;
  - rounded, touch-friendly controls;
  - subtle hairline separators.
- Keep the responsive layout readable and operable on desktop and mobile.
- Preserve visible keyboard focus, semantic labels, sufficient contrast, and reduced-motion support.
- Keep the SSD-style colored expense breakdown bar proportional to category totals and pair it with an accessible legend.

## Validation

At minimum, run:

```bash
node --check script.js
node -e "JSON.parse(require('fs').readFileSync('data/finance-history.json','utf8'))"
npm run build
```

If the bundled environment lacks `npm`, run the existing project’s `vinext build` binary with the bundled Node runtime.

Before finishing, verify:

- GitHub `main` matches local `HEAD`;
- GitHub Pages serves `finance.bekulov.com` without redirecting;
- the live JSON revision and totals match the committed source;
- English and Russian contain the same product functionality and information.
