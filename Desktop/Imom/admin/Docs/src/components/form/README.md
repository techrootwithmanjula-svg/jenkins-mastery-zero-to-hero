# src/components/form/

Controlled, reusable form primitive components. All accept standard HTML input props plus optional Tailwind class overrides.

## Structure

```
form/
├── input/
│   └── InputField.tsx    ← Generic <input> wrapper
├── group-input/          ← Input with prefix/suffix slot (e.g., phone code)
├── Label.tsx             ← <label> wrapper with consistent styling
└── Switch.tsx            ← Toggle switch (checkbox under the hood)
```

## `InputField.tsx`
Thin wrapper around `<input>` that applies the project's Tailwind input classes. Passes through all standard `input` props via spread (`...rest`).

**Props:** `type`, `placeholder`, `value`, `onChange`, `disabled`, `className`, and any standard HTML input attribute.

## `Label.tsx`
Renders a `<label>` with consistent text sizing and color. Accepts `children` and an optional `htmlFor`.

## `Switch.tsx`
A styled toggle component. Renders a hidden `<input type="checkbox">` with a custom visual track and thumb. Controlled via `checked` / `onChange`.

## Conventions

- Keep all form primitives stateless (controlled components only).
- Pair `Label` `htmlFor` with `InputField` `id` for accessibility.
