export function getPjImagePath(image: number) {
  return `/sprites/pj/pj${image}/pj${image}`;
}

export function getNpcImagePath(image: number) {
  return `/sprites/npc/npc${image}/npc${image}`;
}


export function getBmImagePath(image: number) {
 return `/sprites/bm/bm${image}.png`;
}


export function getIntentImagePath(action:number):string {
  return `/sprites/npc-action/action${action}.png`;
}

export const getHistoryImage = (
  id: number
): string => {
  return `/room/room${id}.png`;
};


import type { TypeEquipment } from "../../shared/types/equipmentView";
export function getImageEquipment(type:TypeEquipment, image:number) {
    return `/sprites/equipment/${type}${image}.png`;
}