import type { CSSProperties } from "react";
import { Trees, Sun, Waves, Mountain, type LucideIcon } from "lucide-react";

// Named accents used across PixelPanel / PixelButton / PixelModal.
// If your tailwind.config already defines these as color tokens
// (parchment/leaf/sky/gold/ember/bark), feel free to swap the inline
// hex usage in these components for the matching Tailwind classes —
// this map is kept in JS so it also works as a fallback with zero
// config changes.
export const ACCENT_HEX: Record<string, string> = {
  leaf: "#6fcf67",
  sky: "#4cc9e8",
  gold: "#f2c14e",
  ember: "#e35b3f",
  bark: "#4a3222",
  grape: "#a06cd5",
  bubblegum: "#ff7fb0",
};

export function accentHex(accent?: string): string {
  if (!accent) return ACCENT_HEX.bark;
  return ACCENT_HEX[accent] ?? accent; // allow a raw hex to pass through too
}

/** The signature stepped/notched pixel-art corner clip-path. */
export function notch(size: number): CSSProperties {
  const s = `${size}px`;
  return {
    clipPath: `polygon(
      0 ${s}, ${s} ${s}, ${s} 0,
      calc(100% - ${s}) 0, calc(100% - ${s}) ${s}, 100% ${s},
      100% calc(100% - ${s}), calc(100% - ${s}) calc(100% - ${s}), calc(100% - ${s}) 100%,
      ${s} 100%, ${s} calc(100% - ${s}), 0 calc(100% - ${s})
    )`,
  };
}

interface HabitatMeta {
  hex: string;
  icon: LucideIcon;
}

// habitat is a free-text field on Class in the schema, not an enum,
// so this matches by keyword with a safe fallback rather than a
// switch on exact strings.
const HABITAT_RULES: { test: RegExp; hex: string; icon: LucideIcon }[] = [
  { test: /rainforest|jungle|canopy/i, hex: ACCENT_HEX.leaf, icon: Trees },
  { test: /savanna|plains|desert/i, hex: ACCENT_HEX.gold, icon: Sun },
  { test: /reef|ocean|coral|sea/i, hex: ACCENT_HEX.sky, icon: Waves },
  { test: /mountain|peak|cliff/i, hex: ACCENT_HEX.grape, icon: Mountain },
];

export function getHabitatMeta(habitat: string): HabitatMeta {
  const match = HABITAT_RULES.find((r) => r.test.test(habitat));
  return match ? { hex: match.hex, icon: match.icon } : { hex: "#8fae8f", icon: Trees };
}