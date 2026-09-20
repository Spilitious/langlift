import type { StatName } from "./label";

export type EquipmentSlot =
  | "helm"
  | "armor"
  | "sword"
  | "shield"
  | "boots";

export type EquipmentLocation =
  | "inventory"
  | "equipped"
  | "belt"
  | "dragged"
  | "alchemy";

export type EquipmentView = {
  id: number;
  basicEquipmentId:number;
  name: string;
  type: EquipmentType;
  image: number;

  width: number;
  height: number;

  price:number;

  location: EquipmentLocation;

  x: number | null;
  y: number | null;

  slot?: EquipmentSlot;
  beltSlot?: number;
  alchemySlot?:number;

  text:string;
  bonus:Partial<Record<StatName, number>>;
};


export type EquipmentSave = {
  id: number;
  basicEquipmentId:number;
  name: string;
  type: EquipmentType;
  image: number;

  width: number;
  height: number;

  price:number;

  location: EquipmentLocation;

  x: number | null;
  y: number | null;

  slot?: EquipmentSlot;
  beltSlot?: number;
  alchemySlot?:number;

  text:string;
  bonus:Partial<Record<StatName, number>>;
};


export type EquipmentType = "sword" | "helm" | "armor" | "shield" | "potion" | "ingredient" | "item"




export type MoveObjectResult = {
    result:boolean,
    newEquipmentDragged:number,

}

import type { GameStateView } from "./gameStateView";

export type MoveObjectResponse = {
  moveResult: MoveObjectResult;
  gameState: GameStateView;
};