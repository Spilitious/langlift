import type { ActionResult } from "../../../../shared/types/actionResult.js";
import { mockNpcIntent1, mockNpcIntent2 } from "./npcIntentChange.js";

type MockAction = {
  label: string;
  result: ActionResult;
};

export const getMockAction = (
  label: string
): MockAction => {
  const mock = mockActions.find(
    (action) => action.label === label
  );

  if (!mock) {
    throw new Error(
      `MockAction introuvable : ${label}`
    );
  }

  return mock;
};


export const getResultAction = (
  label: string
): ActionResult => {
  const mock = mockActions.find(
    (action) => action.label === label
  );

  if (!mock) {
    throw new Error(
      `MockAction introuvable : ${label}`
    );
  }

  return mock.result;
};

export const mockActions: MockAction[] = [
  {
    label: "PJ1 hurt NPC1 - Ongoing",
    result: {
      author_type: "pj", 
      id_author: 1,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,

            animationName: "hurt",
             new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 5,

            shield_start: 3,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-5 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ2 kill NPC1 - Victory",
    result: {
      author_type: "pj",
      id_author: 2,
      animationName: "attack",
      fightStatus: "victory",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,

            animationName: "death",
             new_intent: mockNpcIntent1,

            hp_start: 12,
            hp_end: 0,

            shield_start: 4,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-5 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

   {
    label: "PJ2 hurt NPC1",
    result: {
      author_type: "pj",
      id_author: 2,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,

            animationName: "hurt",
             new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 5,

            shield_start: 3,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-5 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ2 hurt NPC2",
    result: {
      author_type: "pj",
      id_author: 2,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 2,

            animationName: "hurt",
             new_intent: mockNpcIntent1,

            hp_start: 12,
            hp_end: 5,

            shield_start: 4,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-5 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ1 esquivé par NPC1",
    result: {
      author_type: "pj",
      id_author: 1,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,

              animationName: "dodged",
               new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 10,

            shield_start: 3,
            shield_end: 3,

            bm_end: [
              {
                id: 1,
                name: "Evasion",
                image: 5,
                value: 3,
              },
            ],

            popup: {
              text: "-1 evasion",
              type: "dodge",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ2 esquivé par NPC2",
    result: {
      author_type: "pj",
      id_author: 2,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 2,

            
            animationName: "dodged",
             new_intent: mockNpcIntent1,

            hp_start: 12,
            hp_end: 12,

            shield_start: 4,
            shield_end: 4,

            bm_end: [],

            popup: {
              text: "-1 evasion",
              type: "dodge",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ1 bloqué par NPC1",
    result: {
      author_type: "pj",
      id_author: 1,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,

            animationName: "blocked",
             new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 10,

            shield_start: 7,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-7 shield",
              type: "block",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ2 bloqué par NPC2",
    result: {
      author_type: "pj",
      id_author: 2,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 2,

            animationName: "blocked",
             new_intent: mockNpcIntent1,

            hp_start: 12,
            hp_end: 12,

            shield_start: 9,
            shield_end: 4,

            bm_end: [],

            popup: {
              text: "-5 shield",
              type: "block",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ1 kill NPC1",
    result: {
      author_type: "pj",
      id_author: 1,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,

            animationName: "death",
             new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 0,

            shield_start: 7,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-10 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ2 kill NPC2",
    result: {
      author_type: "pj",
      id_author: 2,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "npc",
            id_target: 2,

            animationName: "death",
             new_intent: mockNpcIntent1,

            hp_start: 12,
            hp_end: 0,

            shield_start: 3,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-10 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

  {
    label: "NPC1 hurt PJ2",
    result: {
      author_type: "npc",
      id_author: 1,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "pj",
            id_target: 2,

            animationName: "hurt",
             new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 5,

            shield_start: 3,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-5 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },
{
    label: "NPC2 hurt PJ1",
    result: {
      author_type: "npc",
      id_author: 2,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "pj",
            id_target: 1,

            animationName: "hurt",
             new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 5,

            shield_start: 3,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-5 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

  {
    label: "NPC1 kill PJ2",
    result: {
      author_type: "npc",
      id_author: 1,
      animationName: "attack",
      fightStatus: "victory",

      steps: [
        [
          {
            target_type: "pj",
            id_target: 2,

            animationName: "death",
             new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 0,

            shield_start: 3,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-10 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

   {
    label: "NPC2 kill PJ1",
    result: {
      author_type: "npc",
      id_author: 2,
      animationName: "attack",

      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "pj",
            id_target: 1,

            animationName: "death",
             new_intent: mockNpcIntent1,

            hp_start: 10,
            hp_end: 0,

            shield_start: 3,
            shield_end: 0,

            bm_end: [],

            popup: {
              text: "-10 HP",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

  {
    label: "PJ1 heal PJ2",
    result: {
      author_type: "pj",
      id_author: 1,
      animationName: "attack",
      fightStatus: "ongoing",

      steps: [
        [
          {
            target_type: "pj",
            id_target: 2,

            animationName: "heal",
             new_intent: mockNpcIntent1,

            hp_start: 5,
            hp_end: 12,

            shield_start: 3,
            shield_end: 3,

            bm_end: [],

            popup: {
              text: "+7 HP",
              type: "heal",
            },
          },
        ],
      ],
    },
  },
  {
    label: "PJ1 shield himself",
    result: {
      author_type: "pj",
      id_author: 1,
      animationName: "idle",
      fightStatus: "ongoing",
      steps: [
        [
          {
            target_type: "pj",
            id_target: 1,
            animationName: "shield",
             new_intent: mockNpcIntent1,
            hp_start: 80,
            hp_end: 80,
            shield_start: 0,
            shield_end: 3,
            bm_end: [],
            popup: {
              text: "+3 Shield",
              type: "heal",
            },
          },
        ],
      ],
    },
  },
   {
    label: "PJ2 shield himself",
    result: {
      author_type: "pj",
      id_author: 2,
      animationName: "attack",
      fightStatus: "ongoing",
      steps: [
        [
          {
            target_type: "pj",
            id_target: 2,
            animationName: "shield",
             new_intent: mockNpcIntent1,
            hp_start: 75,
            hp_end: 75,
            shield_start: 3,
            shield_end: 6,
            bm_end: [],
            popup: {
              text: "+3 Shield",
              type: "heal",
            },
          },
        ],
      ],
    },
  },
   {
    label: "NPC1 newTurnRegen",
    result: {
      
      animationName: "idle",
      fightStatus: "ongoing",
      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,
            animationName: "heal",
             new_intent: mockNpcIntent1,
            hp_start: 10,
            hp_end: 13,
            shield_start: 3,
            shield_end: 3,
            bm_end: [],
            popup: {
              text: "+3 hp",
              type: "heal",
            },
          },
        ],
      ],
    },
  },
  {
    label: "NPC1 newTurnHurt",
    result: {
      
      animationName: "idle",
      fightStatus: "victory",
      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,
            animationName: "hurt",
             new_intent: mockNpcIntent1,
            hp_start: 7,
            hp_end: 0,
            shield_start: 3,
            shield_end: 0,
            bm_end: [],
            popup: {
              text: "-7 hp",
              type: "damage",
            },
          },
        ],
      ],
    },
  },
 {
   label: "NPC1 intent attack on PJ1",
    result: {
      author_type: "npc",
      id_author: 1,
      animationName: "shake",
      fightStatus: "ongoing",
      steps: [
        [
          {
            target_type: "npc",
            id_target: 1,
            animationName: "change_intent",
            new_intent: mockNpcIntent1,
            hp_start: 10,
            hp_end: 10,
            shield_start: 7,
            shield_end: 7,
            bm_end: [],
            popup: {
              text: "3 hp",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

  {
   label: "NPC2 intent to shield himself",
    result: {
      author_type: "npc",
      id_author: 2,
      animationName: "shake",
      fightStatus: "ongoing",
      steps: [
        [
          {
            target_type: "npc",
            id_target: 2,
            animationName: "change_intent",
            new_intent: mockNpcIntent2,
            hp_start: 27,
            hp_end: 27,
            shield_start: 3,
            shield_end: 3,
            bm_end: [],
            popup: {
              text: "3 hp",
              type: "damage",
            },
          },
        ],
      ],
    },
  },

     {
    label: "PJ1 use hp potion on PJ2",
    result: {
      author_type: "pj",
      id_author: 1,
      animationName: "idle",
      fightStatus: "ongoing",
      steps: [
        [
          {
            target_type: "pj",
            id_target: 2,
            animationName: "potion_hp",
             new_intent: mockNpcIntent1,
            hp_start: 75,
            hp_end: 99,
            shield_start: 3,
            shield_end: 3,
            bm_end: [],
            popup: {
              text: "+24 hp",
              type: "heal",
            },          },
        ],
      ],
    },
  }, 
  {
   label: "PJ1 use potion on PJ2",
    result: {
      author_type: "pj",
      id_author: 1,
      animationName: "idle",
      fightStatus: "ongoing",
      steps: [
        [
          {
            target_type: "pj",
            id_target: 2,
            animationName: "potion_standard",
             new_intent: mockNpcIntent1,
            hp_start: 75,
            hp_end: 99,
            shield_start: 3,
            shield_end: 3,
            bm_end: [],
            popup: {
              text: "+24 hp",
              type: "heal",
            },
          },
        ],
      ],
    },
  },
  {  label: "PJ1 triple frappe NPC1",

  result: {
    author_type: "pj",
    id_author: 1,

      animationName: "attack",
      fightStatus: "ongoing",

    steps: [
      [
        {
          target_type: "npc",
          id_target: 1,
          animationName: "hurt",
           new_intent: mockNpcIntent1,
          hp_start: 15,
          hp_end: 11,
          shield_start: 0,
          shield_end: 0,
          bm_end: [],
          popup: {
            text: "-4 HP",
            type: "damage",
          },
        },
      ],

      [
        {
          target_type: "npc",
          id_target: 1,

          animationName: "hurt",
 new_intent: mockNpcIntent1,
          hp_start: 11,
          hp_end: 7,

          shield_start: 0,
          shield_end: 0,

          bm_end: [],

          popup: {
            text: "-4 HP",
            type: "damage",
          },
        },
      ],

      [
        {
          target_type: "npc",
          id_target: 1,

          animationName: "hurt",
           new_intent: mockNpcIntent1,

          hp_start: 7,
          hp_end: 2,

          shield_start: 0,
          shield_end: 0,

          bm_end: [],

          popup: {
            text: "-5 HP",
            type: "damage",
          },
        },
      ],
    ],
  },
}
];