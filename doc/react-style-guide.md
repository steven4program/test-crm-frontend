# React/JSX Style Guide

## 1  Component & File Basics

| ✔ Do                                                                                           | ✘ Avoid                                                                       |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **One component per file** (additional tiny stateless “helpers” are OK).                       | Packing multiple big components into one file.               |
| Prefer **function components** whenever you don’t need state or refs.                          | Using `class` when a function works, or `React.createClass`. |
| Keep all files that export a component in **PascalCase** & end with `.jsx` (or `.tsx` for TS). | snake\_case / kebab-case or mismatched names.                |

---

## 2  Naming Conventions

* **File / Component**: `ReservationCard.jsx` → `ReservationCard`
* **Instances**: camelCase → `<ReservationCard />` stored as `reservationCard`
* **HOC displayName**: `withFoo(Bar)`
* **Props**: camelCase (`userName`)
* **Hooks you author**: `useAwesomeThing()` (lint via `airbnb/hooks`)
* Never re-use DOM prop names (`style`, `className`) for custom semantics. ([airbnb.io][2], [airbnb.io][2])

---

## 3  JSX Formatting

* **Quotes**: double quotes for JSX, single quotes elsewhere.
* **Self-closing**: `<Foo />` (space before `/>`).
* **Multiline props**: open tag on its own line; align each prop 2 spaces in; close bracket on a new line.
* **No space inside curly braces**: `<Foo bar={baz} />`.
* **Wrap JSX that spans >1 line in parentheses**. ([airbnb.io][2], [airbnb.io][2])

```jsx
// ✅ good
<Foo
  superLong="bar"
  another="baz"
>
  <Child />
</Foo>
```

---

## 4  Props & Accessibility

* **Boolean props**: omit the value (`<Button disabled />`).
* **Images**: always give `alt`; if decorative, use `alt=""` or `role="presentation"`.
* **ARIA**: only real, non-abstract roles (`role="button"` yes, `role="datepicker"` no).
* **Keys**: never use array index — prefer a stable id.
* **defaultProps** for every non-required prop to document intent.
* **Spread props sparingly** (HOCs or testing helpers).

---

## 5  Refs, Events & Methods

* Use **callback refs** (`ref={el => { this.el = el; }}`) — no string refs.
* **Bind** class methods once (constructor or class fields), not inline in render.
* Don’t prefix private-ish methods with `_`; everything in JS is public anyway.

---

## 6  Class Component Ordering

1. `static` methods
2. `constructor`
3. Lifecycle: `componentDidMount`, …
4. Event handlers (`onClickSave`)
5. Render helpers (`renderSidebar`)
6. `render()` itself

(React.createClass has its own list; prefer ES6 classes in new code.)

---

## 7  Pro-tips & Anti-patterns

* **Mixins** and `isMounted()` are banned — use composition/HOCs/hooks instead.
* If a component renders no children, **self-close** it.
* Group related props before spreading the rest to avoid leaking unwanted attributes.
* Let ESLint + Prettier auto-fix as much as possible; commit lint-staged pre-commit hooks so these rules never hit PR review.

### 9 TypeScript supplements ­— Google Style Guide

#### 9.1 Imports & Exports

* **Prefer *named* exports** for every symbol; avoid `default export`. 
* Keep import paths **relative inside a package** (`./foo`) and minimise `../../..`. 
* Use **named imports** for frequently-used symbols, **namespace imports** (`* as foo`) only when dealing with broad APIs. 
* Resolve name clashes by aliasing (`import {Foo as FooModel}`) rather than re-exporting duplicates. 

#### 9.2 Naming rules

* No Hungarian prefixes or trailing/leading underscores (even for privates). 
* **Identifier casing**

  * `UpperCamelCase`: classes, interfaces, types, enums, decorators, type parameters
  * `lowerCamelCase`: variables, parameters, functions, properties
  * `CONSTANT_CASE`: module-level immutable constants & enum members 

#### 9.3 Type system etiquette

* **Lean on inference** for trivially obvious literals; annotate only where it clarifies intent or fixes generic inference. 
* Prefer **interfaces for structural contracts**; annotate the value at declaration time so errors surface early. 
* Use **optional fields/parameters (`foo?:`)** instead of explicit `| undefined`. 
* Avoid `any`; instead

  * use a more precise type,
  * fall back to `unknown`, or
  * explicitly suppress with a justification comment for rare cases (e.g. tests). 
* **`const enum` is banned** — stick to plain `enum`. 
* Favour simple types over heavy **mapped / conditional types**; use advanced operators only when they substantially reduce complexity. 
* Skip wrapper object types `String`, `Number`, `Boolean`; always use the primitive forms (`string`, `number`, `boolean`). 

#### 9.4 Language & runtime bans

* Never use `with`, `eval`, or dynamic `Function(...)` in production code. 
* Do **not modify built-in prototypes** or sprinkle globals. 

#### 9.5 House-keeping

* **Debugger statements** must be removed before commit. 
* Compile with **strict type-checking** and ensure the codebase stays free of `any` creep and unused `@ts-expect-error` comments.
