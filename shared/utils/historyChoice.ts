import type { HistoryChoice } from "../types/history";

export const Choice1: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 2,
      },
    },
     ],
};

// Avant le combat du rat
export const Choice2: HistoryChoice = {
  choices: [
    {
      text: "Votre constitution. Depuis toujours, vous êtes dur au mal et capable d'endurer les pires épreuves.",
      destination: {
        type: "text",
        id: 3,
        consequenceId:1,  //Ajout d'un point de constitution
      },
    },

    {
      text: "Votre force. Les longues années de labeur à la ferme vous ont forgé un corps puissant.",
      destination: {
        type: "text",
        id: 3,
        consequenceId: 2 //Ajoute d'un point de force
      },
    },

    {
      text: "Votre affinité avec les énergies qui vous entourent. Depuis l'enfance, vous percevez parfois ce que les autres ne ressentent pas.",
      destination: {
        type: "text",
        id: 3,
        consequenceId:3  //Ajoute d'un point de MM
      },
    },
  ],
};


// Vers le combat du rat 
export const Choice3: HistoryChoice = {
  choices: [
    {
      text: "Combattre",
      destination: {
        type: "fight",
        id: 1,
      },
    },
  ],
};


// Vers le marecage
export const Choice4: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 5,
      },
    },
  ],
};


// Vers le crapaud
export const Choice5: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 6,
      },
    },
  ],
};

// Choix de la potion
export const Choice6: HistoryChoice = {
  choices: [
    {
      text: "Ramasser la potion et prendre la fuite.",
      destination: {
        type: "text",
        id: 7,
         consequenceId:4, 
      },
    },

    {
      text: "Abandonner la potion et fuir immédiatement.",
      destination: {
        type: "text",
        id: 8,
         consequenceId:5, 
      },
    },

    {
      text: "Ramasser la potion et faire face à la créature.",
      destination: {
        type: "text",
        id: 9,
         consequenceId:5, 
      },
    },
  ],
};


// Combat contre le crapaud
export const Choice7: HistoryChoice = {
  choices: [
    {
      text: "Combattre",
      destination: {
        type: "fight",
        id: 3,
      },
    },
  ],
};


//Fin du combat contre le crapaud
export const Choice8: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 11,
      },
    },
  ],
};


//Arrivé dans la grotte
export const Choice9: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 12,
      },
    },
  ],
};


// Choix du type de poursuite de Gladys
export const Choice10: HistoryChoice = {
  choices: [
    {
      text: "Sans réfléchir vous vous lancez à sa poursuite",
      destination: {
        type: "text",
        id: 13,
         consequenceId:7, 
      }
      },
       {
      text: "Vous dégainnez votre arme et avancez prudemment",
      destination: {
        type: "text",
        id: 13,
        consequenceId:8, 
      }
    },
       {
      text: "Autre",
      destination: {
        type: "text",
        id: 13,
        consequenceId:9, 
       }
      },
    
  ],
};


// Annonce du combat contre les chauves souris
export const Choice11: HistoryChoice = {
  choices: [
    {
      text: "Combattre",
      destination: {
        type: "fight",
        id: 5,
      },
    },
  ],
};

// Rencontre avec Gladys
export const Choice12: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 15,
      },
    },
  ],
};


// Arrivé dans la forêt
export const Choice13: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 16,
      },
    },
  ],
};


// Arrivé dans la forêt
export const Choice14: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 17,
      },
    },
  ],
};


// Le vieillard
export const Choice15: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 18,
      },
    },
  ],
};


// Le campement
export const Choice16: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 19,
      },
    },
  ],
};


// Choix d'activité avant de dormir
export const Choice17: HistoryChoice = {
  choices: [
    {
      text: "Suivre leur exemple et vous coucher. Après cette journée, vous avez grand besoin de repos.",
      destination: {
        type: "text",
        id: 20,
         consequenceId:10, 
      },
    },
    {
      text: "Profiter du calme pour vous exercer à l'épée. Les combats d'aujourd'hui vous ont montré tout ce qu'il vous reste à apprendre.",
      destination: {
        type: "text",
        id: 20,
         consequenceId:11, 
      },
    },
    {
      text: "Prendre soin de votre épée. Jusqu'ici, cette lame est peut-être la seule chose qui vous ait maintenu en vie.",
      destination: {
        type: "text",
        id: 20,
         consequenceId:12, 
      },
    },
  ],
};


// Combat contre les loups
export const Choice18: HistoryChoice = {
  choices: [
    {
      text: "Combattre",
      destination: {
        type: "fight",
        id: 6,
      },
    },
  ],
};


// Choix de confiance envers Gladys
export const Choice19: HistoryChoice = {
  choices: [
    {
      text: "Décider de confiance à Gladys et lui raconter votre amnésie partielle et votre réveil dans les égouts.",
      destination: {
        type: "text",
        id: 21,
         consequenceId:13, 
      },
    },
    {
      text: "Lui répondre honnêtement, mais rester vague sur votre amnésie et les circonstances de votre réveil.",
      destination: {
        type: "text",
        id: 21,
         consequenceId:14, 
      },
    },
    {
      text: "Inventer une histoire. Après tout, vous ne connaissez presque rien de cette jeune femme.",
      destination: {
        type: "text",
        id: 21,
         consequenceId:15, 
      },
    },
  ],
};


// Fin du combat contre les loups
export const Choice20: HistoryChoice = {
  choices: [
    {
      text: "Next",
      destination: {
        type: "text",
        id: 23,
      },
    },
  ],
};

export const Choice21: HistoryChoice = {
  choices: [
    {
      text: "Une épée de belle facture autrement plus fiable que votre vieille lame.",
      destination: {
        type: "text",
        id: 24,
         consequenceId:16, 
      },
    },
    {
      text: "Un bâton de mage qui dégage une grande énergie.",
      destination: {
        type: "text",
        id: 24,
         consequenceId:17, 
      },
    },
    {
      text: "Une armure de cuir renforcé, légère et robuste",
      destination: {
        type: "text",
        id: 24,
         consequenceId:18, 
      },
    },
  ],
};