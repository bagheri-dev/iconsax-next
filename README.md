<div align="center">
  <h1>iconsax-next</h1>
  <p>
    A modern, zero-dependency, tree-shakeable collection of <strong>1,050+ Iconsax icons</strong> built for <strong>React 18/19</strong> and <strong>Next.js (App Router & Server Components)</strong>.
  </p>

  <p>
    <a href="https://www.npmjs.com/package/iconsax-next">
      <img src="https://img.shields.io/npm/v/iconsax-next.svg?style=flat-square&color=0ea5e9" alt="npm version" />
    </a>
    <a href="https://bundlephobia.com/package/iconsax-next">
      <img src="https://img.shields.io/bundlephobia/minzip/iconsax-next?style=flat-square&color=10b981" alt="bundle size" />
    </a>
    <a href="https://github.com/bagheri-dev/iconsax-next">
      <img src="https://img.shields.io/badge/GitHub-bagheri--dev-181717?style=flat-square&logo=github" alt="GitHub" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/npm/l/iconsax-next.svg?style=flat-square" alt="license" />
    </a>
  </p>
</div>

---

Unlike legacy `iconsax-react` packages that bundle all icons together or rely on heavy runtime wrappers, `iconsax-next` compiles every icon into an isolated, lightweight SVG component with full TypeScript support and **6 built-in visual variants**.

## ✨ Features

- **1,050+ Icons × 6 Variants:** Switch seamlessly between `Linear`, `Bold`, `Bulk`, `Broken`, `Outline`, and `TwoTone` via a single `variant` prop.
- **True Tree-Shaking (`sideEffects: false`):** Only the icons you import end up in your production bundle (~0.6 KB gzipped per icon).
- **React Server Components (RSC) Ready:** Pure stateless components with zero client-side hooks—works out of the box in Next.js App Router, Remix, and Vite.
- **First-Class TypeScript Support:** Strict autocomplete for icon names, `IconVariant`, and standard `SVGProps<SVGSVGElement>`.
- **Tailwind CSS Friendly:** Inherits `currentColor` by default and accepts `className`, `size`, `color`, and any standard SVG attribute.

---

## 📦 Installation

```bash
# pnpm
pnpm add iconsax-next

# npm
npm install iconsax-next

# yarn
yarn add iconsax-next

# bun
bun add iconsax-next

```

---

## 🚀 Quick Start

Import any icon in `PascalCase` and pass your desired `variant`, `size`, or `className`:

```tsx
import { Home2, FolderCloud, Ticket2, Wallet3 } from "iconsax-next";

export default function DashboardNav() {
  return (
    <nav className="flex items-center gap-4">
      {/* Default variant is "Linear" and default size is 24 */}
      <Home2/>

      {/* Custom size and variant */}
      <FolderCloud size={28} variant="Bulk"/>

      {/* Styled with Tailwind CSS */}
      <Ticket2 className="text-indigo-600 transition-colors hover:text-indigo-500" size={24} variant="Bold"/>

      {/* Custom hex color */}
      <Wallet3 color="#10B981" size={32} variant="TwoTone"/>
    </nav>
  );
}

```

---

## 🎨 Available Variants

Every icon component accepts a `variant` prop with the following options:

| Variant | Description | Best Used For |
| --- | --- | --- |
| `"Linear"` *(default)* | Clean, uniform `1.5px` stroke icons | General UI, toolbars, minimal interfaces |
| `"Outline"` | Outlined path shapes | Crisp geometric layouts |
| `"Bold"` | Solid filled icons | Active navigation states, primary actions |
| `"Bulk"` | Duotone solid fills with layered opacity | Feature cards, dashboards, onboarding |
| `"TwoTone"` | Dual-opacity stroke icons | Subtle depth without heavy visual weight |
| `"Broken"` | Stylized strokes with intentional gaps | Modern, expressive brand interfaces |

---

## ⚙️ Props API

All icon components extend standard React `SVGProps<SVGSVGElement>`:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number \| string` | `24` | Sets both `width` and `height` of the SVG |
| `variant` | `IconVariant` | `"Linear"` | One of `"Linear"`, `"Bold"`, `"Bulk"`, `"Broken"`, `"Outline"`, `"TwoTone"` |
| `color` | `string` | `"currentColor"` | Stroke and fill color of the icon |
| `className` | `string` | `undefined` | Custom CSS or Tailwind utility classes |
| `...props` | `SVGProps<SVGSVGElement>` | — | Any valid SVG attribute (`onClick`, `style`, `aria-label`, etc.) |
---

## 🔷 TypeScript Usage

Import `IconProps` and `IconVariant` directly when building reusable UI components or navigation configs:

```tsx
import type { ComponentType } from "react";
import { Home2, Setting2, type IconProps, type IconVariant } from "iconsax-next";

interface NavItem {
  label: string;
  icon: ComponentType<IconProps>;
  variant?: IconVariant;
}

const navItems: NavItem[] = [
  { label: "Overview", icon: Home2, variant: "Bulk" },
  { label: "Settings", icon: Setting2, variant: "Linear" },
];

```

---

## 🏷️ Icon Naming Convention

* All icon filenames are converted to **PascalCase** (e.g., `arrow-right-2.svg` → `ArrowRight2`, `home-2.svg` → `Home2`).
* Icons starting with a digit are prefixed with `Icon` (e.g., `24-support.svg` → `Icon24Support`, `3d-rotate.svg` → `Icon3dRotate`).

---

## 📄 Author & Credits

* **Package Author:** [bagheri-dev](https://github.com/bagheri-dev)
* **Icon Design:** [Iconsax (Vuesax)](https://iconsax.io/)
* **License:** [MIT](./LICENSE)