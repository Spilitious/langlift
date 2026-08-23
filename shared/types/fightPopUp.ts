export type FightPopupData = {
  text: string;
  type: "damage" | "dodge" | "block" | "heal";
};

export type FightPopup = {
  id: number;
  details: FightPopupData;
  x: number;
  y: number;
};