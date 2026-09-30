import type { HistoryChoice } from "../types/history";


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
        id: 27,
         consequenceId:11, 
          
      },
      condition: (gameState) => gameState.team.profession.alchemy > 0,
    },
    {
       id:24,
      text: "Prendre soin de votre épée. Jusqu'ici, cette lame est peut-être la seule chose qui vous ait maintenu en vie.",
      destination: {
        type: "text",
        id: 27,
         consequenceId:12, 
      },
    },
  ],
};


// Choix de confiance envers Gladys
export const Choice61: HistoryChoice = {
  choices: [
    {
       id:26,
      text: "Faire confiance à Gladys et raconter l'histoire complète de votre amnésie partielle et votre réveil dans les égouts.",
      destination: {
        type: "text",
        id: 66,
         consequenceId:13, 
      },
    },
    {
       id:27,
      text: "Répondre honnêtement, mais rester vague sur votre amnésie et les circonstances de votre réveil.",
      destination: {
        type: "text",
        id: 66,
         consequenceId:14, 
      },
    },
    {
       id:28,
      text: "Inventer une histoire. Après tout, vous ne connaissez presque rien de cette jeune femme.",
      destination: {
        type: "text",
        id: 66,
         consequenceId:15, 
      },
    },
  ],
};

// Choix de l'équipment de récompenses pour avoir sauver le vieil homme des loups
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


// Choix du métier
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
      text: "Prélever la fourrure. Quelques morceaux correctement découpés pourraient former de bonnes protections.",
      destination: {
        type: "text",
        id: 4,
         consequenceId:21, 
      },
    },
  ],
};



// Choix du bouclier
export const Choice28: HistoryChoice = {
  choices: [
    {
       id:38,
      text: "Laissez passer l'occasion. Le jeu n'en vaut pas la chandelle",
      destination: {
        type: "text",
        id: 31,
         consequenceId:22, 
      },
    },
    {
       id:39,
      text: "Descendre dans la crevasse chercher le bouclier",
      destination: {
        type: "text",
        id: 48,
         consequenceId:23, 
      },
    },
    {
       id:40,
      text: "Demander à Gladys de descendre chercher le bouclier.",
      destination: {
        type: "text",
        id: 49,
         consequenceId:24, 
      },
    },
  ]
};


// Choix de redescente
export const Choice32: HistoryChoice = {
  choices: [
    {
       id:39,
      text: "Empruntez les anciennes mines",
      destination: {
        type: "text",
        id: 35,     
      },
    },
    {
       id:40,
      text: "Tentez malgré tout de redescendre par le sentier",
      destination: {
        type: "text",
        id: 51, 
        consequenceId:22,      
      },
    }
  ],
};



// Liberer le prisonnier
export const Choice36: HistoryChoice = {
  choices: [
    {
       id:43,
      text: " Tenter de libérer discrètement le prisonnier avant d'affronter les kobolds.",
      destination: {
        type: "text",
        id: 40,  
      }
    },
       {
       id:44,
      text: "Affrontez les trois Kobolds puis libérer le prisonnier.",
      destination: {
        type: "text",
        id: 39,       
      },
       }
  ],
};


// Aider Siguis
export const Choice42: HistoryChoice = {
  choices: [
    {
       id:50,
      text: "Confier les racines de Grisal à Siguis et lui souhaiter bonne chance.",
      destination: {
        type: "text",
        id: 102,
         
      },
    },
    {
       id:51,
      text: "Proposer à Siguis de lui vendre les racines avant de reprendre votre route avec Gladys.",
      destination: {
        type: "text",
        id: 103,
        
      }
    },
       {
       id:52,
      text: "Accepter de suivre le plan de Siguis.",
      destination: {
        type: "text",
        id: 45,
        consequenceId:25       
      },
       }
  ],
};


// Le choix d'ouvrir le tombeau
export const Choice48: HistoryChoice = {
  choices: [
    {
      id:58,
      text: "Ecouter la sagesse de Siguis et laisser le tombeau scellé",
      destination: {
        type: "text",
        id: 57,
         
      },
    },
    {
       id:59,
      text: "Affronter le chatiment réservés aux pilleurs de tombeau",
      destination: {
        type: "text",
        id: 55,
        
      }
    }
  ],
};


// Le choix  Racine ou Fermier
export const Choice67: HistoryChoice = {
  choices: [
    {
      id:72,
      text: "Allez dans le sens de Gladys et accepter de venir en aide aux familles de fermier",
      destination: {
        type: "text",
        id: 73,
      },
    },
     {
      id:73,
      text: "Partir pour la montagne. Vous aiderez les fermier si vous en avez encore le temps.",
      destination: {
        type: "text",
        id: 29,
      },
    },
  ],
};



 