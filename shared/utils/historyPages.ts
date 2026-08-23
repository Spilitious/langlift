import type { HistoryPage } from "../types/history.js";
import * as HistoryChoices from "../utils/historyChoice";

export const historyPages: HistoryPage[] = [
  {
    id: 1,    // Le reveil 
    textId: 1,
    imageId: 1,
    choices: HistoryChoices.Choice1,
  },

  {
    id: 2,   // Choix de caractéristique 
    textId: 2,
    imageId: 1,
    choices: HistoryChoices.Choice2,
  },

  {
    id: 3,  // Annonce du combat contre le Rat Géant
    textId: 3,
    imageId: 2,
    choices: HistoryChoices.Choice3,
  },
   {
    id: 4,  // Fin du combat et direction le marécage 
    textId: 4,
    imageId: 3,
    choices: HistoryChoices.Choice4,
  },
   {
    id: 5,  // Arrivée au marécage
    textId: 5,
    imageId: 4,
    choices: HistoryChoices.Choice5,
  },
 {
    id: 6,  // Choix avant le combat contre le crapaud (potion qui tombe)
    textId: 6,
    imageId: 5,
    choices: HistoryChoices.Choice6,
  },
   {
    id: 7,  // Annonce du combat  défavorable 
    textId: 7,
    imageId: 5,
    choices: HistoryChoices.Choice7,
  },
   {
    id: 8,  // Annonce du combat favorable avec perte potion
    textId: 8,
    imageId: 5,
    choices: HistoryChoices.Choice7,
  },
   {
    id: 9,  // Annonce du combat favorable sans perte potion
    textId: 9,
    imageId: 5,
    choices: HistoryChoices.Choice7,
  },
   {
    id: 10,  // Carcasse du crapaud
    textId: 10,
    imageId: 6,
    choices: HistoryChoices.Choice8,
  },
   {
    id: 11,  // Arrivé dans la grotte
    textId: 11,
    imageId: 7,
    choices: HistoryChoices.Choice9,
  },
  {
    id: 12,  // Choix du type de poursuite
    textId: 12,
    imageId: 7,
    choices: HistoryChoices.Choice10,
  },
  {
    id: 13,  // Annonce du combat des chauves-souris
    textId: 13,
    imageId: 8,
    choices: HistoryChoices.Choice11,
  },
  {
    id: 14,  // Rencontre avec Gladys
    textId: 14,
    imageId: 9,
    choices: HistoryChoices.Choice12,
  },
   {
    id: 15,  // Dialogue avec Gladys 
    textId: 15,
    imageId: 9,
    choices: HistoryChoices.Choice13,
  },
   {
    id: 16,    // Choix de faire confiance à Gladys
    textId: 16,
    imageId: 9,
    choices: HistoryChoices.Choice19,
  },
   {
    id: 17,  // Arrivée dans la forêt
    textId: 17,
    imageId: 10,
    choices: HistoryChoices.Choice15,
  },
  {
    id: 18,  // Recontre avec le vieillard
    textId: 18,
    imageId: 11,
    choices: HistoryChoices.Choice16,
  },
  {
    id: 19,  // Etablissement du camps
    textId: 19,
    imageId: 10,
    choices: HistoryChoices.Choice17,
  },
  {
    id: 20,  // Arrivée des loups
    textId: 20,
    imageId: 12,
    choices: HistoryChoices.Choice18,
  },
  {
    id: 21,  // Gladys resonne le hero de ne pas retourner en ville
    textId: 21,
    imageId: 9,
    choices: HistoryChoices.Choice14,
  },
  {
    id: 22,  // Fin du combat contre les loups
    textId: 22,
    imageId: 10,
    choices: HistoryChoices.Choice20,
  },
  {
    id: 23,  // Irostat et le choix de l'équipement
    textId: 23,
    imageId: 13,
    choices: HistoryChoices.Choice21,
  },

];