# UI Coding Standards

## Component Library

**ONLY shadcn/ui components are permitted in this project.**

- All UI elements must use [shadcn/ui](https://ui.shadcn.com/) components.
- Creating custom components is strictly prohibited. If a UI element is needed, find the appropriate shadcn/ui component.
- Do not build wrappers, variants, or abstractions on top of shadcn/ui components — use them directly as provided.
- If a required component is not yet installed, add it via the CLI:
  ```bash
  npx shadcn@latest add <component-name>
  ```

## Date Formatting

All date formatting must use [date-fns](https://date-fns.org/).

### Required Format

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use the `do MMM yyyy` format string with `date-fns/format`:

```ts
import { format } from "date-fns";

format(new Date("2025-09-01"), "do MMM yyyy"); // "1st Sep 2025"
format(new Date("2025-08-02"), "do MMM yyyy"); // "2nd Aug 2025"
format(new Date("2026-01-03"), "do MMM yyyy"); // "3rd Jan 2026"
format(new Date("2024-06-04"), "do MMM yyyy"); // "4th Jun 2024"
```

No other date formatting libraries or manual date formatting are permitted.
