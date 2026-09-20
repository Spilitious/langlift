export const LEVEL_CONTENT = {
  1: "attribute",
  2: "ability",
 
  3: "ability",
  4: "attribute",
  5: "talent",
  6: "ability",
  7: "attribute",
  9: "skill",

  10: "ability",
  11: "attribute",
  12: "talent",
  13: "ability",
  14: "attribute",
  15: "skill",

  16: "ability",
  17: "attribute",
  18: "talent",
  19: "attribute",
  20: "skill",


} as const;

export type LevelContentType =
  typeof LEVEL_CONTENT[keyof typeof LEVEL_CONTENT];