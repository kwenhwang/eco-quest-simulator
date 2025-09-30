import palette from "@/public/assets/palettes/eco-quest.json";

type PaletteSwatches = Record<string, readonly string[]>;

type EcoQuestPalette = {
  meta: {
    name: string;
    description: string;
    createdAt: string;
    notes?: string;
  };
  swatches: PaletteSwatches;
};

const ecoPalette = palette as EcoQuestPalette;

const PALETTE_ENTRIES = Object.entries(ecoPalette.swatches).flatMap(
  ([group, colors]) =>
    colors.map((value, index) => [
      `--palette-${group}-${index + 1}`,
      value,
    ] as const),
);

type PaletteVariable = (typeof PALETTE_ENTRIES)[number][0];

type PaletteMap = Record<PaletteVariable, string>;

export const ecoPaletteMap: PaletteMap = Object.fromEntries(
  PALETTE_ENTRIES,
) as PaletteMap;

export const ecoPaletteCss = `:root {\n${PALETTE_ENTRIES.map(
  ([prop, value]) => `  ${prop}: ${value};`,
).join("\n")}\n}`;

export function getPaletteValue(token: PaletteVariable) {
  return ecoPaletteMap[token];
}

export function listPaletteTokens() {
  return PALETTE_ENTRIES.map(([prop]) => prop);
}

export { ecoPalette };
