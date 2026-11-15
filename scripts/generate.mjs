import { transform } from "@svgr/core";
import jsx from "@svgr/plugin-jsx";
import svgo from "@svgr/plugin-svgo";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, "..");
const rawBaseDir = path.join(rootDir, "raw-svgs");
const iconsDir = path.join(rootDir, "src", "icons");
const indexPath = path.join(rootDir, "src", "index.ts");
const typesPath = path.join(rootDir, "src", "types.ts");

const VARIANT_NAME_MAP = {
  linear: "Linear",
  bold: "Bold",
  bulk: "Bulk",
  broken: "Broken",
  outline: "Outline",
  twotone: "TwoTone",
};

function toPascalCase(str) {
  const normalized = str
    .replace(/[()&]/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();

  const pascal = normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

  return /^[0-9]/.test(pascal) ? `Icon${pascal}` : pascal;
}

const innerSvgTemplate = (variables, { tpl }) => tpl`${variables.jsx}`;

async function main() {
  await rm(iconsDir, { recursive: true, force: true });
  await mkdir(iconsDir, { recursive: true });

  const variantDirs = (await readdir(rawBaseDir, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const iconMap = new Map();
  const allVariants = new Set();

  for (const variant of variantDirs) {
    const variantName =
      VARIANT_NAME_MAP[variant.toLowerCase()] ?? toPascalCase(variant);
    allVariants.add(variantName);
    const variantPath = path.join(rawBaseDir, variant);
    const entries = await readdir(variantPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".svg")) continue;
      const baseName = toPascalCase(entry.name.replace(/\.svg$/i, ""));
      const mapKey = baseName.toLowerCase();
      if (!iconMap.has(mapKey)) {
        iconMap.set(mapKey, { componentName: baseName, variants: new Map() });
      }
      iconMap
        .get(mapKey)
        .variants.set(variantName, path.join(variantPath, entry.name));
    }
  }

  const variantsUnion = Array.from(allVariants)
    .map((v) => `"${v}"`)
    .join(" | ");

  await writeFile(
    typesPath,
    `import type { SVGProps } from "react";

export type IconVariant = ${variantsUnion};

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: IconVariant;
}
`,
    "utf8"
  );

  const exportsList = [`export type { IconProps, IconVariant } from "./types";`];

  const sortedIcons = Array.from(iconMap.values()).sort((a, b) =>
    a.componentName.localeCompare(b.componentName)
  );

  for (const { componentName, variants } of sortedIcons) {
    const cases = [];
    const availableVariants = Array.from(variants.keys());
    const defaultVariant = availableVariants.includes("Linear")
      ? "Linear"
      : availableVariants[0];

    for (const [variantName, filePath] of variants.entries()) {
      const svgCode = await readFile(filePath, "utf8");
      const jsxCode = await transform(
        svgCode,
        {
          typescript: true,
          expandProps: "end",
          jsxRuntime: "automatic",
          template: innerSvgTemplate,
          plugins: [svgo, jsx],
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: { overrides: { removeViewBox: false } },
              },
              "removeDimensions",
            ],
          },
          replaceAttrValues: {
            "#292D32": "{color}",
            "#17191C": "{color}",
            "#000000": "{color}",
            "#000": "{color}",
            white: "{color}",
            "#ffffff": "{color}",
            "#FFFFFF": "{color}",
          },
          svgProps: {
            width: "{size}",
            height: "{size}",
            "aria-hidden": "true",
          },
        },
        { componentName, filePath }
      );

      const cleanJsx = jsxCode.trim().replace(/;$/, "");
      cases.push(
        `    case "${variantName}":\n      return (\n        ${cleanJsx}\n      );`
      );
    }

    const defaultCaseSource =
      cases.find((c) => c.includes(`case "${defaultVariant}":`)) ?? cases[0];
    const fallbackCase = defaultCaseSource.replace(/case "[^"]+":/, "default:");

    const componentCode = `import type { IconProps } from "../types";

const ${componentName} = ({
  size = 24,
  color = "currentColor",
  variant = "${defaultVariant}",
  ...props
}: IconProps) => {
  switch (variant) {
${cases.join("\n")}
${fallbackCase}
  }
};

export default ${componentName};
`;

    await writeFile(
      path.join(iconsDir, `${componentName}.tsx`),
      componentCode,
      "utf8"
    );
    exportsList.push(
      `export { default as ${componentName} } from "./icons/${componentName}";`
    );
  }

  await writeFile(indexPath, `${exportsList.join("\n")}\n`, "utf8");
  console.log(`✅ Generated ${iconMap.size} multi-variant icons.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});