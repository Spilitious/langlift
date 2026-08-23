
export type EquipmentSlot =
  | "helm"
  | "armor"
  | "sword"
  | "shield"
  | "boots";

export type EquipmentLocation =
  | "inventory"
  | "equipped"
  | "belt";

export type Equipment = {
  id: number;
  name: string;
  type: TypeEquipment;
  image: number;

  width: number;
  height: number;

  location: EquipmentLocation;

  x: number | null;
  y: number | null;

  slot?: EquipmentSlot;
  beltSlot?: number;
};

export type TypeEquipment = "sword" | "helm" | "armor" | "shield" | "potion"


type Inventory = number[][];

const inventory: Inventory = [
  [1, 1, 0, 0, 2, 2, 0, 0, 0, 0],
  [1, 1, 0, 4, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
