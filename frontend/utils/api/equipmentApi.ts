import type {
  EquipmentSlot,
  MoveObjectResponse,
} from "@shared/types/equipmentView";

import type { CreatePotionResult } from "@shared/types/actionResult";

export async function moveEquipmentToInventory(
  pjId: number,
  equipmentId: number,
  x: number,
  y: number
): Promise<MoveObjectResponse> {

  const response = await fetch(
    "http://localhost:3001/api/equipment/inventory",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        pjId,
        equipmentId,
        x,
        y,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur déplacement équipement vers inventaire"
    );
  }

  return response.json();
}


export async function moveEquipmentToBelt(
  pjId: number,
  equipmentId: number,
  slot: number
): Promise<MoveObjectResponse> {

  const response = await fetch(
    "http://localhost:3001/api/equipment/belt",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        pjId,
        equipmentId,
        slot,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur déplacement équipement vers ceinture"
    );
  }

  return response.json();
}


export async function equipEquipment(
  pjId: number,
  equipmentId: number,
  slot: EquipmentSlot
): Promise<MoveObjectResponse> {

  const response = await fetch(
    "http://localhost:3001/api/equipment/equip",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        pjId,
        equipmentId,
        slot,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur équipement de l'objet"
    );
  }

  return response.json();
}

import type { BuyResult } from "@shared/types/shop";
import type { GameStateView } from "@shared/types/gameStateView";

type BuyEquipmentResponse = {
  buyResult: BuyResult;
  gameState: GameStateView;
};

export async function buyEquipment(
  shopId: number,
  pjId: number,
  equipmentId: number,
  x: number,
  y: number,
  price: number
): Promise<BuyEquipmentResponse> {

  const response = await fetch(
    "http://localhost:3001/api/equipment/buy",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        shopId,
        pjId,
        equipmentId,
        x,
        y,
        price,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur achat équipement"
    );
  }

  return response.json();
}


type SellEquipmentResponse = {
  sellResult: boolean;
  gameState: GameStateView;
};

export async function sellEquipment(
  pjId: number,
  equipmentId: number,
  price: number
): Promise<SellEquipmentResponse> {

  const response = await fetch(
    "http://localhost:3001/api/equipment/sell",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        pjId,
        equipmentId,
        price,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la vente de l'équipement"
    );
  }

  return response.json();
}

export async function createPotion(
  pjId: number,
  ingredientIds: (number | null)[],
  power: number
): Promise<CreatePotionResult> {

  const response = await fetch(
    "http://localhost:3001/api/alchemy/create-potion",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pjId,
        ingredientIds,
        power,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la création de la potion"
    );
  }

  return response.json();
}