import type { SVGProps } from "react";

export type IconVariant = "Bold" | "Broken" | "Bulk" | "Linear" | "Outline" | "TwoTone";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: IconVariant;
}
