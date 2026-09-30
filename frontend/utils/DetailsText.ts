import { BmView } from "@shared/types/bmView";
import { BM_ID, BM_NAME } from "../../shared/utils/bmConstant";
import Bm from "@/components/fight/fighters/Bm";
import { NpcIntentView } from "@shared/types/npcIntentView";
import { NPC_ACTION_ID} from "@shared/utils/npcActionConstant";
import type { AbilityView } from "@shared/types/abilityView";
import { PjView } from "@shared/types/fighterView";
import { Stats } from "fs";
import { ABILITY_ID } from "@shared/utils/abilityConstant";

export const getBmEffectText = ( bm:BmView):string => {
  switch (bm.basicBmId) {

    //Armure
    case -1 : return `Effet : génére ${bm.bonus.armor} point(s) de bouclier à chaque nouveau tour`;
    
    case BM_ID.BLEAK:
    return `Effet : inflige ${Math.abs(bm.bonus.regen ?? 0)} hp au début du tour. La putréfaction progresse de 1 à chaque nouveau tour`;
    
    case BM_ID.BURN :
    return `Effet : inflige ${Math.abs(bm.bonus.regen ?? 0)} hp au début du tour.`;

    case BM_ID.BLEED : 
    return `Effet : inflige ${Math.abs(bm.bonus.regen ?? 0)} hp au début du tour. Le saignement est réduit de 1 à chaque nouveau tour`;

    case BM_ID.ETHEREAL : 
    return `Effet : une créature éthérée ne peut perdre qu'un seul point de vie par attaque`;

    case BM_ID.SHORT_LIVED_ETHEREAL : 
    return `Effet : une créature éthérée ne peut perdre qu'un seul point de vie par attaque`;

    case BM_ID.FATIGUE_MM :
    return `Effet : la maitrise de la magie est réduit de ${Math.abs(bm.bonus.magicSkill ?? 0)} point(s)`;

    case BM_ID.FATIGUE_STR :
    return `Effet : la force est réduit de ${Math.abs(bm.bonus.strength ?? 0)} `;

    case BM_ID.PROVOCATION :
    return `Effet : interdit de cibler une créature qui ne possède pas provocation`;

    case BM_ID.EVASION :
    return `Effet : permet d'esquiver la prochaine attaque`;

    case BM_ID.FIRE_BARRIER :
    return `Effet : inflige ${bm.bonus.spike} point(s) de dégât à toutes créature qui attaque`;

    case BM_ID.REGENERATION :
    return `Effet : récupère ${bm.bonus.regen} point(s) de vie au début du tour`;

    case BM_ID.SHIELD_EXPERT :
    return `Effet : les points de bouclier ne sont pas perdus à la fin du tour`;

    case BM_ID.STRATEGIC_WAIT :
    return `Effet : gagne 1 PA supplémentaire au prochain tour`;

    case BM_ID.ROCK_SKIN :
    return `Effet : procure ${bm.bonus.armor} point(s) d'armure`;

    case BM_ID.TROLL_REGEN :
    return `Effet : récupère ${bm.bonus.regen} point(s) de vie au début du tour`;

    case BM_ID.TROLL_STR :
    return `Effet : les dégats sont augmentés de ${bm.bonus.damage} point(s)`;

    case BM_ID.WARD :
    return `Effet : confère ${bm.bonus.ward} protection contre tous les maux : saignement, malédictions, brulûres...`;

    case BM_ID.WINGS :
    return `Effet : confère ${bm.bonus.strength} point(s) de force`;

    case BM_ID.WOLF_CRY : 
    return `Effet : les dégats sont augmentés de ${bm.bonus.damage} point(s)`;

    case BM_ID.MM_POTION : 
    return `Effet : la maitrise de la magie est augmentée de ${bm.bonus.damage} point(s)`;

    case BM_ID.STR_POTION : 
    return `Effet : la force est augmentée de ${bm.bonus.damage} point(s)`;

    case BM_ID.SHATTERED : 
    return `Effet : la génération de bouclier est réduite de ${Math.abs(bm.bonus.shield_bonus ?? 0)} point(s)`;

    case BM_ID.WEAK : 
    return `Effet : la force est réduites de ${Math.abs(bm.bonus.strength ?? 0)} point(s)`;

    case BM_ID.EXPOSED : 
    return `Effet : les dégâts subits sont augmentés de ${Math.abs(bm.bonus.exposed ?? 0)} point(s)`;

    case BM_ID.DEEP_WOUND :
    return `Effet : les dégâts sont réduit de ${bm.bonus.damage} point(s)`;
  
    case BM_ID.ARCXOS : 
    return `Effet : les dégâts sont réduit de ${bm.bonus.damage} point(s)`;
     
    case BM_ID.GUARD_REFLEX :
    return `Effet : récupère ${bm.bonus.reflex} points de bouclier après une perte de vie`;

    case BM_ID.SLOWNESS :
    return `Effet : le nombre de point d'action récupéré en début de tour est réduit de 1`;

    
    case BM_ID.DAMAGE_CURSE:
    return `Effet : les dégâts subis lors de la prochaine attaque sont doublés`;
    
    default: return "";

  }
};


export const getAbilityDetailsText = (
  ab: AbilityView,
  pj: PjView
): string => {

  switch (ab.basicAbilityId) {

    // Attaque de base
    case 1:
      return `Effet : inflige ${
        5 + pj.stats.strength + pj.stats.damage
      } points de dégât`;

    // Bouclier de base
    case 2:
      return `Effet : génère ${
        3 + pj.stats.constitution + pj.stats.shield_bonus
      } points de bouclier`;


    // =========================
    // GUERRIER / GARDIEN
    // =========================

    case ABILITY_ID.BRUTAL_BLOW:
      return `Effet : inflige ${
        11 + pj.stats.strength * 3 + pj.stats.damage
      } points de dégât`;

    case ABILITY_ID.GUARD:
      return `Effet : génère ${
        7 + pj.stats.constitution * 3 + pj.stats.shield_bonus
      } points de bouclier`;

    case ABILITY_ID.ROCK_SKIN:
      return `Effet : procure ${
        2 + pj.stats.constitution
      } points d'armure pour 3 tours`;

    case ABILITY_ID.PARRY:
      return `Effet : inflige ${
        3 + pj.stats.strength + pj.stats.damage
      } points de dégât et génère ${
        1 + pj.stats.constitution + pj.stats.shield_bonus
      } points de bouclier`;

    case ABILITY_ID.AUTOREGENERATION:
      return `Effet : restaure ${
        7 + 3 * pj.stats.constitution
      } points de vie`;

    case ABILITY_ID.GUARD_REFLEX:
      return `Effet : génère ${
        2 + pj.stats.constitution
      } points de bouclier après une perte de vie`;

    case ABILITY_ID.TWIRL:
      return `Effet : inflige ${
        5 + 3 * pj.stats.strength + pj.stats.damage
      } points de dégât à tous les ennemis`;

    case ABILITY_ID.CHARGE:
      return `Effet : inflige ${
        14 + 5 * pj.stats.constitution + pj.stats.damage
      } points de perte de bouclier - Aucune perte de PV`;

    case ABILITY_ID.SHATTERING_ATTACK:
      return `Effet : détruit l'armure de la cible de ${
        1 + 2 * pj.stats.strength
      } points`;


    // =========================
    // ASSASSIN
    // =========================

    case ABILITY_ID.DEEP_THRUST:
      return `Effet : inflige ${
        6 + pj.stats.strength + pj.stats.damage
      } points de dégât et applique un saignement à hautuer de ${1+pj.stats.strength}`;

    case ABILITY_ID.MULTIPLE_ATTACK:
      return `Effet : effectue ${1+pj.stats.constitution} attaques infligeant chacune ${
        2 + pj.stats.strength + pj.stats.damage
      } points de dégât`;

    case ABILITY_ID.TREACHEROUS_ATTACK:
     return `Effet : inflige ${
        6 + pj.stats.strength + pj.stats.damage
      } point de dégât applique blessure à hauteur de ${(1+pj.stats.strength)*(1+pj.stats.constitution)}`;


    // =========================
    // DESTRUCTION
    // =========================

    case ABILITY_ID.FIREBALL:
      return `Effet : inflige ${
        6 + pj.stats.magicSkill
      } points de dégât et applique Brûlure à hauteur de ${1+pj.stats.magicSkill} pour 3 tours `;

    case ABILITY_ID.VOID_RAY:
      return `Effet : détruit l'armure de la cible à hauteur de ${
        2 + pj.stats.magicSkill
      } points`;

    case ABILITY_ID.FIRE_BARRIER:
      return `Effet : confère ${
        1 + 2 * pj.stats.magicSkill
      } points d'épines`;

    case ABILITY_ID.BLAZING_FIRE:
      return `Effet : inflige ${
        6 + 3 * pj.stats.magicSkill
      } points de dégât à toutes les créatures`;


    // =========================
    // GUÉRISON
    // =========================

    case ABILITY_ID.LIFE_TEARS:
      return `Effet : restaure ${
        11 + 3 * pj.stats.magicSkill
      } points de vie`;

    case ABILITY_ID.REGENERATION:
      return `Effet : restaure ${
        1 + 2 * pj.stats.magicSkill
      } points de vie au début de chaque tour`;


    // =========================
    // ALTÉRATION
    // =========================

    case ABILITY_ID.WINGS:
      return `Effet : augmente les dégâts de ${
        2 + pj.stats.magicSkill
      } points`;

    case ABILITY_ID.ARCXOS:
      return `Effet : réduit les dégâts de la cible de ${
        1 + 3 * pj.stats.magicSkill
      } points`;


    // =========================
    // PROTECTION
    // =========================

    case ABILITY_ID.ATHLAN_SHIELD:
      return `Effet : génère ${
        1 + 2 * pj.stats.magicSkill
      } points de bouclier`;

    case ABILITY_ID.ATHLAN_ARMOR:
      return `Effet : procure ${
        1 + 3 * pj.stats.magicSkill
      } points d'armure pour 3 tours`;

    case ABILITY_ID.WARD:
      return `Effet : confère ${
        1 + pj.stats.magicSkill
      } point(s) de ${BM_NAME.WARD}`;


    // =========================
    // TALENTS
    // =========================

    case ABILITY_ID.PROVOCATION:
      return `Effet : applique Provocation à la cible`;

    case ABILITY_ID.FIRST_AID:
      return `Effet : restaure 10 % des points de vie de la cible`;

    case ABILITY_ID.BUCKLER_HIT:
      return `Effet : inflige des dégâts égaux au nombre de points de bouclier du lanceur`;

    case ABILITY_ID.STRATEGIC_WAIT:
      return `Effet : gagne 1 point d'action supplémentaire au prochain tour`;

    case ABILITY_ID.LIGHT_TOUCH:
      return `Effet : transfère 1 point d'action à la cible`;

    case ABILITY_ID.DAMAGE_CURSE:
      return `Effet : double la prochaine perte de points de vie de la cible`;

    case ABILITY_ID.EVASION:
      return `Effet : octroie une Évasion à la cible`;

    case ABILITY_ID.ENCHANTMENT_EXPERT:
      return `Effet : augmente la durée de tous les enchantements positifs d'un tour`;

    case ABILITY_ID.KNIVE_THROWING:
      return `Effet : inflige 3 points de dégât perforants à la cible. Le bouclier est ignoré.`;

    default:
      return "";
  }
};

export const getActionDetailsText = ( intent:NpcIntentView):string => {
  switch (intent.action) {

    //Armure
    case NPC_ACTION_ID.RAT_ATTACK :
    case NPC_ACTION_ID.TROLL_ATTACK:
    case NPC_ACTION_ID.TOAD_ATTACK:
    case NPC_ACTION_ID.WOLF_ATTACK:
    
    return `Effet : inflige ${intent.value} point(s) de dégât physique`;
    
    case NPC_ACTION_ID.SOUL_ATTACK: 
    return `Effet : inflige ${intent.value} point(s) de dégât magique`;

    case NPC_ACTION_ID.BURN_ATTACK: 
    return `Effet : inflige ${intent.value} point(s) de dégât physique et brulûres si touché`;

    case NPC_ACTION_ID.BLEAK_ATTACK :
    return `Effet : inflige ${intent.value} point(s) de dégât physique et inflige putréfaction si touché`;

    case NPC_ACTION_ID.SHIELD :
    return `Effet : ajoute ${intent.value} point(s) de bouclier`;

    case NPC_ACTION_ID.EVASION :
    return `Effet : ajoute ${intent.value} evasion(s)`;

    case NPC_ACTION_ID.WOLF_CRY :
    return `Effet : augmente les dégâts de tous les loups de ${intent.value} point(s)`;
    
    case NPC_ACTION_ID.TWIRL :
    return `Effet : inflige ${intent.value} point(s) de dégât physique à tous les ennemis`;
   
    case NPC_ACTION_ID.TROLL_FURY :
    return `Effet : augmente les dégâts et la régénération de ${intent.value} point(s)`;

    case NPC_ACTION_ID.VAMPIRE_ATTACK :
    return `Effet : inflige ${intent.value} point(s) de dégât physique et soigne d'autant`;

    case NPC_ACTION_ID.SOUL_CURSE :
    return `Effet : inflige Lenteur pour ${intent.value} tours, inflige ${intent.value} points de putréfaction et réduit de ${intent.value} points la génération de bouclier`;

    case NPC_ACTION_ID.BLEAK_ABSORB :
    return `Effet : absorbe les points de putréraction et se soigne d'autant`;

    case NPC_ACTION_ID.MULTIPLE_ATTACK :
    return `Effet : ${intent.value2} attaques infligeant chacune ${intent.value} point(s) de dégât`;

    case NPC_ACTION_ID.INVOKE_ZOMBIE :
    return `Effet : invoque un zombie`;
   
    case NPC_ACTION_ID.SLAY_ZOMBIE :
    return `Effet : S'accapare la puissance du zombie`;
   
    case NPC_ACTION_ID.ZONE_VAMPIRISME:
    return `Effet : inflige ${intent.value} point(s) de dégât à tous les enenmis et se soigne du total de la perte de PV`;
    
    case NPC_ACTION_ID.NECRO_BUFF :
    return `Effet : gagne ${intent.value} point(s) d'armure ainsi que 20 points de bouclier`;

    case NPC_ACTION_ID.FREEZING_RAY:
    return `Effet : inflige ${intent.value} point(s) de dégât magique`;
    
    case NPC_ACTION_ID.ANGEL_SPELL :
    return `Effet : gagne Etherée pour 1 tour et octroie ${intent.value} points de bouclier à l'autre ange`;
      

    case NPC_ACTION_ID.PIERCING_ATTACK:
      return `Effet : inflige ${intent.value} point(s) de dégât transperçant (bouclien n'est pas pris en compte)`;

    case NPC_ACTION_ID.INVOKE_ANT:
      return `Effet : invoque une créature`;

    case NPC_ACTION_ID.MULTIPLE_DEEP_WOUND:
      return `Effet : inflige ${intent.value2} fois ${intent.value} point(s) de dégât. Chaque attaque inflige 1 point de saignement`;

    case NPC_ACTION_ID.DEEP_WOUND:
      return `Effet : inflige ${intent.value} point(s) de dégât et applique un saignement`;

    case NPC_ACTION_ID.BLACK_ANGEL_RESURRECT:
      return `Effet : ressuscite l'ange noir`;

    case NPC_ACTION_ID.WHITE_ANGEL_RESURRECT:
      return `Effet : ressuscite l'ange blanc`;

    case NPC_ACTION_ID.MULTIPLE_MAGIC_ATTACK:
      return `Effet : ${intent.value2} attaques magiques infligeant chacune ${intent.value} point(s) de dégât`;

    default:
      return "";
  

  }
};

