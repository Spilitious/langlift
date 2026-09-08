export function getPjImagePath(image: number) {
  return `/sprites/pj/pj${image}/pj${image}`;
}

export function getPjAvatarPath(image: number) {
  return `/avatar/avatar${image}.png`;
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

export const getActionImagePath = (
  image: number,
 
) => {
  return `/actions/ability${image}.png`;
};

import type { EquipmentType } from "../../shared/types/equipmentView";
export function getImageEquipment(type:EquipmentType, image:number) {
    return `/sprites/equipment/${type}${image}.png`;
}