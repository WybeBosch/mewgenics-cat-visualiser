- move more logic from the svg inside chunk components
- for matched pairs, allow them to have lines to each other again.
- make the "hover over something" and it highlighting in the graph and the table work again
- implement typescript
- add linting, prettier eslint stylelint. And grab that stylelint orderewd css module.

## Lint strictness reset checklist

### Step 1 baseline snapshot (done)

- `pnpm run lint`: 0 errors, 10 warnings (ESLint), Stylelint passes, Prettier passes.
- `pnpm run lint:js`: 10 warnings.
- `pnpm run lint:styles`: passes with no output.

Current ESLint warnings by rule:

- `react-hooks/exhaustive-deps` (1)
- `no-useless-assignment` (1)
- `no-empty` (3)
- `react-hooks/static-components` (1)
- `no-unused-vars` (3)
- `react-hooks/rules-of-hooks` (1)

Next step:

- Step 2: tighten ESLint config severities while keeping `no-console` and `no-unused-vars` as warnings.
