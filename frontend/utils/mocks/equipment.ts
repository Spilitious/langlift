
import type { Equipment } from "@/types/equipment";

export const equipments: Equipment[] = [
  {
    id: 1,
    name: "Grande épée",
    type : "sword", 
    image: 1,
    width: 2,
    height: 3,
    location: "inventory",
    x:0,
    y:0,
  },
  {
    id: 2,
    name: "Casque",
    type:"helm",
    image: 1,
    width: 2,
    height: 1,
    location : "inventory",
     x:4,
    y:0,
    
  },
  {
    id: 4,
    name: "Potion de force",
    type: "potion",
    image: 1,
    width: 1,
    height: 1,
    location :"belt",
     x:3,
    y:1,
    beltSlot: 0,
  },
];