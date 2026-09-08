
import { ABILITY_ID, ABILITY_NAME, SCHOOL_NAME} from "./constants.js";
import type { BasicAbility } from "../types/basicAbility.js";

export const basicAbilities: BasicAbility[] = [
    {
        id:ABILITY_ID.BRUTAL_BLOW,
        image: 16,
        name: ABILITY_NAME.BRUTAL_BLOW,
        school: SCHOOL_NAME.WARRIOR,
        type : "ability",
        detail: "inflige des dégâts supplémentaires",
        formula: "Dégâts = 11 + 3 × force ",
        target : "npc",
        ap: 2,
        duration: 0,
        
    },
    {
        id:ABILITY_ID.GUARD,
        image: 4,
        name: ABILITY_NAME.GUARD,
        school: SCHOOL_NAME.GUARDIAN,
         type : "ability",
        detail: "Octroie un puissant bouclier",
        formula: "Bouclier = 7 + 3 × constitution ",
        target : "self",
        ap: 2,
        duration:0,
        
    },
    {
        id:ABILITY_ID.ROCK_SKIN,
        image: 8,
        name: ABILITY_NAME.ROCK_SKIN,
        school: SCHOOL_NAME.GUARDIAN,
         type : "ability",
        detail: "Procure une armure au lanceur",
        formula: "Armure = 2 + constitution ",
        target : "self",
        ap: 1,
        duration : 3,
        
    },
    {
        id:ABILITY_ID.PARRY,
        image: 9,
        name: ABILITY_NAME.PARRY,
        school: SCHOOL_NAME.ASSASSIN,
         type : "ability",
        detail: "Attaque et octroie du bouclier",
        formula: "Dégâts = 3+force - Bouclier = 1+cons ",
        target : "npc",
        ap: 1,
        duration : 0,
        
    },

    {
        id:ABILITY_ID.AUTOREGENERATION,
        image: 3,
        name: ABILITY_NAME.AUTOREGENERATION,
        school: SCHOOL_NAME.GUARDIAN,
         type : "ability",
        detail: "Restaure les Pv du lanceur",
        formula: "PV restaurés = 7 + 3 × Constitution",
        target : "self",
        ap: 2,
        duration : 0,
        
    },

    {
        id:ABILITY_ID.GUARD_REFLEX,
        image: 7,
        name: ABILITY_NAME.GUARD_REFLEX,
        school: SCHOOL_NAME.GUARDIAN,

         type : "ability",
        detail: "Génère du boulier après attaque",
        formula: "2+ Constitution",
        target : "self",
        ap: 2,
        duration : 3,
        
    },
    {
        id:ABILITY_ID.DEEP_THRUST,
        image: 6,
        name: ABILITY_NAME.DEEP_THRUST,
        school: SCHOOL_NAME.ASSASSIN,
         type : "ability",
        detail: "Inflige des dégâts et un saignement",
        formula: "dégât= 6+force - 1+2 × force 3tours",
        target : "npc",
        ap: 2,
        duration : 0,
    
    },
    {
        id:ABILITY_ID.TWIRL,
        image: 5,
        name: ABILITY_NAME.TWIRL,
        school: SCHOOL_NAME.WARRIOR,
         type : "ability",
        detail: "Cible tous les ennemis",
        formula: "Damage = 5 + 3 × force ",
        target : "npc",
        ap: 2,
        duration : 0,
    
    },
    {
        id:ABILITY_ID.FIREBALL,
        image: 19,
        name: ABILITY_NAME.FIREBALL,
        school: SCHOOL_NAME.DESTRUCTION,
         type : "spell",
        detail: "Inflige des dégâts et des brulûres",
        formula: "Dégâts = 6+MM - Brulûres= 1 + 2 × MM ",
        target : "npc",
        ap: 2,
        duration : 4,
    
    },
    {
        id:ABILITY_ID.LIFE_TEARS,
        image: 18,
        name: ABILITY_NAME.LIFE_TEARS,
        school: SCHOOL_NAME.GUERISON,
         type : "spell",
        detail: "Soigne la cible",
        formula: "Pv restauré = 11+3×MM",
        target : "pj",
        ap: 2,
        duration : 0,
    
    },
      {
        id:ABILITY_ID.WINGS,
        image: 20,
        name: ABILITY_NAME.WINGS,
        school: SCHOOL_NAME.ALTERATION,
        type : "spell",
        detail: "Procure un bonus de dégât",
        formula: "Dégâts bonus = 2+MM",
        target : "pj",
        ap: 2,
        duration : 2,
    
    },
    {
        id:ABILITY_ID.VOID_RAY,
        image: 22,
        name: ABILITY_NAME.VOID_RAY,
        school: SCHOOL_NAME.DESTRUCTION,
        type : "spell",
        detail: "Détruit l'armure de la cible",
        formula: "Armure réduite de 2+MM",
        target : "pj",
        ap: 2,
        duration : 2,
    },
     {
        id:ABILITY_ID.FIRE_BARRIER,
        image: 23,
        name: ABILITY_NAME.FIRE_BARRIER,
        school: SCHOOL_NAME.DESTRUCTION,
        type : "spell",
        detail: "Protège la cible d'une barrière de feu",
        formula: "1+ 2×MM épines",
        target : "pj",
        ap: 1,
        duration : 3,
    },
    
     {
        id:ABILITY_ID.REGENERATION,
        image: 24,
        name: ABILITY_NAME.REGENERATION,
        school: SCHOOL_NAME.GUERISON,
        type : "spell",
        detail: "Soigne pendant plusieurs tours",
        formula: "1+2×MM regen",
        target : "pj",
        ap: 1,
        duration : 3,
    },
    {
        id:ABILITY_ID.ATHLAN_SHIELD,
        image: 25,
        name: ABILITY_NAME.ATHLAN_SHIELD,
        school: SCHOOL_NAME.PROTECTION,
         type : "spell",
        detail: "Octroie un puissant bouclier",
        formula: "Bouclier = 2 + 1 × MM ",
        target : "self",
        ap: 1,
        duration:0,
        
    },
     {
        id:ABILITY_ID.ATHLAN_ARMOR,
        image: 26,
        name: ABILITY_NAME.ATHLAN_ARMOR,
        school: SCHOOL_NAME.PROTECTION,
         type : "spell",
        detail: "Octroie un puissante armure",
        formula: "Bouclier = 4 + 2 × MM ",
        target : "self",
        ap: 2,
        duration:3,
        
    },
    {
        id:ABILITY_ID.ARCXOS,
        image: 26,
        name: ABILITY_NAME.ARCXOS,
        school: SCHOOL_NAME.ALTERATION,
         type : "spell",
        detail: "Reduit la force de l'ennemi",
        formula: "Dégât réduit de 1 + 3 × MM ",
        target : "self",
        ap: 2,
        duration:2,
        
    },
];


export const getBasicAbility = (id:number):BasicAbility => {
    const ability = basicAbilities.find((ability) => ability.id === id);
   
    
    
  if (!ability) {
    throw new Error(
      `BasicAbility introuvable : ${id}`
    );
  }

  return ability;
}
