
export enum ABILITY_ID {
  ATTACK = 1,
  SHIELD = 2,

  //GUARDIAN
  ROCK_SKIN = 3,
  AUTOREGENERATION = 4,
  GUARD_REFLEX = 12,
  GUARD = 18,
  CHARGE =21,

  //WARRIOR
  BRUTAL_BLOW = 10,
  DEEP_THRUST =6,
  TWIRL =7,
  SHATTERING_ATTACK=24,


  //ASSASSIN
  PARRY = 5,
  MULTIPLE_ATTACK = 20,
  TREACHEROUS_ATTACK=22,
  
  //GUERISON
  LIFE_TEARS =9,
  REGENERATION = 17,


  //PROTECTION
  ATHLAN_SHIELD = 11,
  ATHLAN_ARMOR = 14,
  WARD = 23,

  //ALTERATION
  WINGS = 13,
  ARCXOS = 19,
  
  //DESTRUCTION
  VOID_RAY = 15,
  FIRE_BARRIER = 16,
  FIREBALL =8,
  BLAZING_FIRE = 25,

  //PALADIN 
  CALL_OF_LIGHT=47,
  

  /* *************************** TALENT ****************************** */

  //BASE
  PROVOCATION = 26,
  FIRST_AID = 27, 
  BUCKLER_HIT=28,  
  STRATEGIC_WAIT = 29, 
  DAMAGE_CURSE = 30,
  LIGHT_TOUCH = 31,  
  EVASION=32,
  ENCHANTMENT_EXPERT =33,
  KNIVE_THROWING= 34,

  
  //NIVEAU 2 
  SHIELD_EXPERT = 40,
  HEAL_CURSE = 41,
  SHIELD_CURSE =42,

  //NIVEAU 3 
  WARRIOR_CONCENTRATION = 43,
  GARDIAN_CONCENTRATION = 44,
  WIZARD_CONCENTRATION = 45,
  RESURRECT = 46,

  
  //


  /*
  NATURAL_ARMOR=42,
  NATURAL_REGEN=43,
  NATURAL_HEALH=44,
  NATURAL_AGILITY=33,

  STRATEGIC_MIND= 34, // Commence le combat avec 1pa sup
  TEMERITY = 35, // Premier dégât infligé doublé 
  DEFENSE_MASTER = 36, //Tous les personnages commence le combat avec 5 points de bouclier
  NINJA_MASTER = 37, // Commence le combat avec une evasion
  BENEDICTION = 42, // Tous les combattants commence le combat avec un ward 
  ANATOMIE_EXPERT   // inflige deep_wound = 1 automatiquement

  GUERISON_EXPERT = 38,
  ALTERATION_EXPERT = 39,
  PROTECTION_EXPERT = 40,
  DESTRUCTION = 41,  */


}