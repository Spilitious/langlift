import type { HistoryChoice } from "../types/history";

export const Choice1: HistoryChoice = {
  choices: [
    {
      id:1,
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
      id:2,
      text: "Votre constitution. Depuis toujours, vous êtes dur au mal et capable d'endurer les pires épreuves.",
      destination: {
        type: "text",
        id: 3,
        consequenceId:1,  //Ajout d'un point de constitution
      },
    },

    {
      id:3,
      text: "Votre force. Les longues années de labeur à la ferme vous ont forgé un corps puissant.",
      destination: {
        type: "text",
        id: 3,
        consequenceId: 2 //Ajoute d'un point de force
      },
    },

    {
      id:4,
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
      id:5,
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
      id:6,
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
      id:7,
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
      id:8,
      text: "Ramasser la potion et prendre la fuite.",
      destination: {
        type: "text",
        id: 7,
         consequenceId:4, 
      },
    },

    {
      id:9,
      text: "Abandonner la potion et fuir immédiatement.",
      destination: {
        type: "text",
        id: 8,
         consequenceId:5, 
      },
    },

    {
      id:10,
      text: "Ramasser la potion et faire face à la créature.",
      destination: {
        type: "text",
        id: 9,
         consequenceId:6, 
      },
    },
  ],
};


// Combat contre le crapaud
export const Choice7: HistoryChoice = {
  choices: [
    {
      id:11,
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
      id:12,
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
      id:13,
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
      id:14,
      text: "Vous réagissez rapidement et vous vous lancez à sa poursuite",
      destination: {
        type: "text",
        id: 13,
         consequenceId:7, 
      }
      },
       {
        id:15,
      text: "Vous dégainnez votre arme et avancez prudemment",
      destination: {
        type: "text",
        id: 13,
        consequenceId:8, 
      }
    },
         
  ],
};


// Annonce du combat contre les chauves souris
export const Choice11: HistoryChoice = {
  choices: [
    {
      id:16,
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
      id:17,
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
      id:18,
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
      id:19,
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
      id:20,
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
       id:21,
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
       id:22,
      text: "Suivre leur exemple et vous coucher. Après cette journée, vous avez grand besoin de repos.",
      destination: {
        type: "text",
        id: 20,
        consequenceId:10, 
      },
    },
    {
       id:23,
      text: "Il est temps de regarder si vous pouvez tirer quelque chose de ces ingrédients que vous avez récupérés sur les différents monstres.",
      destination: {
        type: "text",
        id: 20,
         consequenceId:11, 
          
      },
      condition: (gameState) => gameState.team.profession.alchimie > 0,
    },
    {
       id:24,
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
       id:25,
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
       id:26,
      text: "Décider de confiance à Gladys et lui raconter votre amnésie partielle et votre réveil dans les égouts.",
      destination: {
        type: "text",
        id: 21,
         consequenceId:13, 
      },
    },
    {
       id:27,
      text: "Lui répondre honnêtement, mais rester vague sur votre amnésie et les circonstances de votre réveil.",
      destination: {
        type: "text",
        id: 21,
         consequenceId:14, 
      },
    },
    {
       id:28,
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
       id:29,
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
       id:30,
      text: "Une épée de belle facture autrement plus fiable que votre vieille lame.",
      destination: {
        type: "text",
        id: 24,
         consequenceId:16, 
      },
    },
    {
       id:31,
      text: "Un bâton de mage qui dégage une grande énergie.",
      destination: {
        type: "text",
        id: 24,
         consequenceId:17, 
      },
    },
    {
       id:32,
      text: "Une armure de cuir renforcé, légère et robuste",
      destination: {
        type: "text",
        id: 24,
         consequenceId:18, 
      },
    },
  ],
};


// Le récit du chef de la garde
export const Choice22: HistoryChoice = {
  choices: [
    {
       id:33,
      text: "Next",
      destination: {
        type: "text",
        id: 25,
      },
    },
  ],
};



// Gladys entraine troylan au shop
export const Choice23: HistoryChoice = {
  choices: [
    {
       id:34,
      text: "Next",
      destination: {
        type: "shop",
        id: 1,
      },
    },
  ],
};


// Gladys entraine troylan au shop
export const Choice24: HistoryChoice = {
   choices: [
    {
       id:35,
      text: "Prélever la queue du rat. Vous avez entendu dire qu'ils sont des ingrédients précieux pour la fabrication de potions.",
      destination: {
        type: "text",
        id: 4,
         consequenceId:19, 
      },
    },
    {
       id:36,
      text: "Récupérer les dents du rat. Leur surface rugueuse pourrait servir à reprendre grossièrement le fil de votre épée.",
      destination: {
        type: "text",
        id: 4,
         consequenceId:20, 
      },
    },
    {
       id:37,
      text: "Prélever la fourrure. Quelques morceaux correctement découpés pourraient renforcer vos protections aux endroits les plus exposés.",
      destination: {
        type: "text",
        id: 4,
         consequenceId:21, 
      },
    },
  ],
};

