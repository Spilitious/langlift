import type { HistoryPage, HistoryChoice } from "../types/history.js";
import * as HistoryChoices from "../utils/historyChoice";


const getNextChoice = (pageId:number):HistoryChoice => {
    return { 
      choices: [
      {
        id:1,
        text: "Next",
        destination: {
          type: "text",
          id: pageId,
        },
      },
      ] 
    }
}


const getFightChoice = (fightId:number):HistoryChoice => {
    return { 
      choices: [
      {
        id:2,
        text: "Combattre",
        destination: {
          type: "fight",
          id: fightId,
        },
      },
      ] 
    }
}
export const historyPages: HistoryPage[] = [
  {
    id: 1,    // Le reveil 
    textId: 1,
    imageId: 1,
    choices: getNextChoice(2),
    teamAccess:true,
  },

  {
    id: 2,   // Choix de caractéristique 
    textId: 2,
    imageId: 1,
    choices: HistoryChoices.Choice2,
    teamAccess:true,
  },

  {
    id: 3,  // Annonce du combat contre le Rat Géant
    textId: 3,
    imageId: 2,
    choices: getFightChoice(1),
    teamAccess:true,
  },
   {
    id: 4,  // Fin du combat et direction le marécage 
    textId: 4,
    imageId: 3,
    choices: getNextChoice(5),
    teamAccess:true,
  },
   {
    id: 5,  // Arrivée au marécage
    textId: 5,
    imageId: 4,
    choices: getNextChoice(6),
    teamAccess:true,
  },
 {
    id: 6,  // Choix avant le combat contre le crapaud (potion qui tombe)
    textId: 6,
    imageId: 5,
    choices: HistoryChoices.Choice6,
    teamAccess:false,
  },
   {
    id: 7,  // Annonce du combat  défavorable 
    textId: 7,
    imageId: 5,
    choices: getFightChoice(3),
    teamAccess:false,
  },
   {
    id: 8,  // Annonce du combat favorable avec perte potion
    textId: 8,
    imageId: 5,
    choices: getFightChoice(3),
    teamAccess:false,
  },
   {
    id: 9,  // Annonce du combat favorable sans perte potion
    textId: 9,
    imageId: 5,
    choices: getFightChoice(3),
    teamAccess:false,
  },
   {
    id: 10,  // Carcasse du crapaud
    textId: 10,
    imageId: 6,
    choices: getNextChoice(11),
    teamAccess:true,
    music:`sounds/ambiences/swamp_rain_toad.mp3`,
  },
   {
    id: 11,  // Arrivé dans la grotte
    textId: 11,
    imageId: 7,
    choices: getNextChoice(12),
    teamAccess:true,
    music:`sounds/ambiences/cave_entrance.mp3`,
  },
  {
    id: 12,  // Choix du type de poursuite
    textId: 12,
    imageId: 7,
    choices: HistoryChoices.Choice10,
    teamAccess:true,
    music:`sounds/ambiences/gladys_run.mp3`,
  },
  {
    id: 13,  // Annonce du combat des chauves-souris
    textId: 13,
    imageId: 8,
    choices: getFightChoice(5),
    teamAccess:false,
    music:`sounds/ambiences/bat_fight.mp3`,
  },
  {
    id: 14,  // Rencontre avec Gladys
    textId: 14,
    imageId: 9,
    choices: getNextChoice(15),
    teamAccess:true,
  },
   {
    id: 15,  // Dialogue avec Gladys 
    textId: 15,
    imageId: 9,
    choices: getNextChoice(16),
    teamAccess:true,
  },
   {
    id: 16,    // Choix de faire confiance à Gladys
    textId: 16,
    imageId: 9,
    choices: getNextChoice(21),
    teamAccess:true,
  },
   {
    id: 17,  // Arrivée dans la forêt
    textId: 17,
    imageId: 10,
    choices: getNextChoice(67),
    teamAccess:true,
  },
  {
    id: 18,  // Recontre avec le vieillard
    textId: 18,
    imageId: 11,
    choices: getNextChoice(19),
    teamAccess:true,
  },
  {
    id: 19,  // Etablissement du camps
    textId: 19,
    imageId: 14,
    choices: HistoryChoices.Choice17,
    teamAccess:true,
  },
  {
    id: 20,  // Arrivée des loups
    textId: 20,
    imageId: 12,
    choices: getFightChoice(6),
    teamAccess:false,
  },
  {
    id: 21,  // Gladys resonne le hero de ne pas retourner en ville
    textId: 21,
    imageId: 9,
    choices: getNextChoice(17),
    teamAccess:true,
  },
  {
    id: 22,  // Fin du combat contre les loups
    textId: 22,
    imageId: 15,
    choices: getNextChoice(23),
    teamAccess:true,
  },
  {
    id: 23,  // Irostat et le choix de l'équipement
    textId: 23,
    imageId: 13,
    choices: HistoryChoices.Choice21,
    teamAccess:true,
  },
  {
    id: 24,  // Dialogue avec le chef de la garde
    textId: 24,
    imageId: 17,
    choices: getNextChoice(25),
    teamAccess:true,
  },
   {
    id: 25,  // Gladys entraine Troylan à l'équipement
    textId: 25,
    imageId: 18,
    choices: HistoryChoices.Choice23,
    teamAccess:true,
  },
   {
    id: 26,  // Choix d'un métier
    textId: 26,
    imageId: 3,
    choices: HistoryChoices.Choice24,
    teamAccess:true,
  },
  
   {
    id: 27,  // Accéder à l'inventaire
    textId: 27,
    imageId: 10,
    choices: getNextChoice(20),
    teamAccess:true,
  },
  {
    id: 28,  // La proposition pour les fleurs
    textId: 28,
    imageId: 32,
    choices: getNextChoice(68),
    teamAccess:true,
  },
    {
    id: 29,  // Le début de la route vers la montagne
    textId: 29,
    imageId: 19,
    choices: getNextChoice(30),
    teamAccess:true,
  },
    {
    id: 30,  //Choix du bouclier
    textId: 30,
    imageId: 20,
    choices: HistoryChoices.Choice28,
    teamAccess:true,
  },
  
  {
    id: 31,  //Le troll arrive
    textId: 31,
    imageId: 21,
    choices: getFightChoice(16),
    teamAccess:false,
  },
  {
    id: 32,  //Le troll meurt
    textId: 32,
    imageId: 22,
    choices: getNextChoice(33),
    teamAccess:true,
  },
  {
    id: 33,  //Le ramassage des racines 
    textId: 33,
    imageId: 23,
    choices: getNextChoice(34),
    teamAccess:true,
  },
  {
    id: 34,  //Choix de redescnte 
    textId: 34,
    imageId: 23,
    choices: HistoryChoices.Choice32,
    teamAccess:true,
  },
   {
    id: 35,  //L'entrée des mines 
    textId: 35,
    imageId: 24,
    choices: getNextChoice(36),
    teamAccess:true,
  },
    {
    id: 36,  //Le choix d'espionner  
    textId: 36,
    imageId: 25,
    choices: getNextChoice(37),
    teamAccess:true,
  },
   {
    id: 37,  //Le prisonnier  
    textId: 37,
    imageId: 26,
    choices: getNextChoice(38),
    teamAccess:false,
  },
   {
    id: 38,  //Le choix des Kobolds  
    textId: 38,
    imageId: 26,
    choices: HistoryChoices.Choice36,
    teamAccess:false,
  },
   {
    id: 39,  //Combat contre 3 kobolds  
    textId: 39,
    imageId: 26,
    choices: getFightChoice(10),
    teamAccess:false,
  },

  {
    id: 40,  //Libération du prisonnier
    textId: 40,
    imageId: 26,
    choices: getNextChoice(41),
    teamAccess:false,
  },
  {
    id: 41,  //Combat contre 5 kobolds
    textId: 41,
    imageId: 26,
    choices: getFightChoice(8),
    teamAccess:false,
  },
   {
    id: 42,  //La mort des Kobolds
    textId: 42,
    imageId: 27,
    choices: getNextChoice(43),
    teamAccess:true,
  },
  {
    id: 43,  //Le retour à Irostat
    textId: 43,
    imageId: 28,
    choices: getNextChoice(44),
    teamAccess:true,
  },
  {
    id: 44,  //Aider sigil
    textId: 44,
    imageId: 29,
    choices: HistoryChoices.Choice42,
    teamAccess:true,
  },
  {
    id: 45,  //La petite fille pour les racines
    textId: 45,
    imageId: 18,
    choices: getNextChoice(46),
    teamAccess:false,
  },
  {
    id: 46,  //Les catacombes 
    textId: 46,
    imageId: 30,
    choices: getNextChoice(53),
    teamAccess:true,
  },

   {
    id: 47,  //Les goules 
    textId: 47,
    imageId: 33,
    choices: getFightChoice(11),
    teamAccess:false,
  },

  {
    id: 48,  //Combat contre le Trool 
    textId: 48,
    imageId: 21,
   choices: getFightChoice(9),
    teamAccess:false,
  },

  {
    id: 49,  //Combat contre le Troll 
    textId: 49,
    imageId: 21,
    choices: getFightChoice(9),
    teamAccess:false,
  },
   {
    id: 50,  //Libération du dorane
    textId: 50,
    imageId: 27,
    choices: getNextChoice(43),
    teamAccess:false,
  },
   {
    id: 51,  //Descente par le sentier escarpés
    textId: 51,
    imageId: 46,
    choices: getNextChoice(75),
    teamAccess:false,
  },
  {
    id: 52,  //La mort des goules
    textId: 52,
    imageId: 35,
    choices: getNextChoice(54),
    teamAccess:true,
  },
   {
    id: 53,  //Le premier niveau des catacombes
    textId: 53,
    imageId: 38,
    choices: getNextChoice(47),
    teamAccess:true,
  },
{
    id: 54,  //Le tombeau royal
    textId: 54,
    imageId: 34,
    choices: HistoryChoices.Choice48,
    teamAccess:true,
  },
  {
    id: 55,  //Combat contre l'âme en peine
    textId: 55,
    imageId: 36,
    choices: getFightChoice(12),
    teamAccess:false,
  },

  {
    id: 56,  //Mort de l'âme en peine
    textId: 56,
    imageId: 34,
    choices: getNextChoice(57),
    teamAccess:true,
  },

  {
    id: 57,  //Après le tombeau
    textId: 57,
    imageId: 34,
    choices: getNextChoice(58),
    teamAccess:true,
  },
  {
    id: 58,  //Découverte du laboratoire
    textId: 58,
    imageId: 34,
    choices: getNextChoice(59),
    teamAccess:true,
  },
  {
    id: 59,  //Après le tombeau
    textId: 59,
    imageId: 34,
    choices: getNextChoice(60),
    teamAccess:true,
  },

  {
    id: 60,  //Explication 1
    textId: 60,
    imageId: 37,
    choices: getNextChoice(61),
    teamAccess:true,
  },
  {
    id: 61,  //Explication 2
    textId: 61,
    imageId: 37,
    choices: getNextChoice(62),
    teamAccess:true,
  },
  {
    id: 62,  //Combat contre le frère de Siguis
    textId: 62,
    imageId: 37,
    choices: getFightChoice(13),
    teamAccess:false,
  },
  {
    id: 63,  //Fin du combat
    textId: 63,
    imageId: 37,
    choices: getNextChoice(64),
    teamAccess:true,
  },
  {
    id: 64,  //Les adieux de SIguis
    textId: 64,
    imageId: 37,
    choices: getNextChoice(65),
    teamAccess:true,
  },
  {
    id: 65,  //Retour à Irostat
    textId: 65,
    imageId: 34,
    choices: getNextChoice(66),
    teamAccess:true,
  },
  {
    id: 66,  //Rencontre avec le veillard
    textId: 66,
    imageId: 11,
    choices: getNextChoice(18),
    teamAccess:true,
  },
  {
    id: 67,  //Discussion avec Gladys sorti de la grotte
    textId: 67,
    imageId: 10,
    choices: HistoryChoices.Choice61,
    teamAccess:true,
  },
  {
    id: 68,  //La fermière et les fourmis géantes
    textId: 68,
    imageId: 39,
    choices: getNextChoice(69),
    teamAccess:true,
  },
  {
    id: 69,  //La fermière et les fourmis suite
    textId: 69,
    imageId: 39,
    choices: getNextChoice(70),
    teamAccess:true,
  },
  {
    id: 70,  //Elément de choix entre fermiers et racines
    textId: 70,
    imageId: 41,
    choices: getNextChoice(71),
    teamAccess:true,
  },
  {
    id: 71,  //Suite d'élement 
    textId: 71,
    imageId: 41,
    choices: getNextChoice(72),
    teamAccess:true,
  },
  {
    id: 72,  //Le choix entre montagne et fermier
    textId: 72,
    imageId: 40,
    choices: HistoryChoices.Choice67,
    teamAccess:true,
  },
  {
    id: 73,  //En route pour le hameau
    textId: 73,
    imageId: 40,
    choices: getNextChoice(74),
    teamAccess:true,
  },
  {
    id: 74, // Arrivée au hameau
    textId: 74,
    imageId: 40,
    choices: getNextChoice(75),
    teamAccess:true,
  },
   {
    id: 75,  // La chut de la montagne
    textId: 75,
    imageId: 44,
    choices: getNextChoice(76),
    teamAccess:false,
  },
   {
    id: 76,  // Réveillé par Gunthar
    textId: 76,
    imageId: 43,
    choices: getNextChoice(77),
    teamAccess:false,
  },
   {
    id: 77,  // Les mantes religieuse
    textId: 77,
    imageId: 42,
    choices: getFightChoice(16),
    teamAccess:false,
  },
   {
    id: 78,  // Fin des mantes
    textId: 78,
    imageId: 45,
    choices: getNextChoice(79),
    teamAccess:false,
  },
   {
    id: 79,  // Echange avec le nain
    textId: 79,
    imageId: 45,
    choices: getNextChoice(80),
    teamAccess:false,
  },
   {
    id: 80,  // Annonce de la quête
    textId: 80,
    imageId: 45,
    choices: getFightChoice(81),
    teamAccess:false,
  },

];