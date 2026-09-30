

export type AnimationFrame = {
  image: string;
  x: number;
  y: number;
  duration: number;
  sound?: string;
};



/* ****************************************************************************************************************** */
/* ******************************************** FRAME POUR NPC  ************************************************** */
/* ****************************************************************************************************************** */


export const getNpcAttackFrames = (
  image: number
): AnimationFrame[] => {
  switch (image) {
    case 1:
      return [
        {
          image: "/sprites/npc/npc1/npc1-idle.png",
          x: 0,
          y: 0,
          duration: 250,
          sound: "/sounds/npc1/npc1-attack.mp3",
        },
        {
          image: "/sprites/npc/npc1/npc1-attack1.png",
          x: 0,
          y: 0,
          duration: 250,
         
        },
        {
          image: "/sprites/npc/npc1/npc1-attack2.png",
          x: -40,
          y: -40,
          duration: 250,
        },
        {
          image: "/sprites/npc/npc1/npc1-attack3.png",
          x: -80,
          y: -20,
          duration: 250,
        },
      ];

    case 2:
      return [
        {
          image: "/sprites/npc/npc2/npc2-idle.png",
          x: 0,
          y: 0,
          duration: 50,

        },
        {
          image: "/sprites/npc/npc2/npc2-attack1.png",
          x: 0,
          y: 0,
          duration: 450,
          sound: "/sounds/npc2/npc2-attack.mp3",
        },
        {
          image: "/sprites/npc/npc2/npc2-attack2.png",
          x: 0,
          y: 0,
          duration: 450,
        },
      ];

    case 3:
     return [
        {
          image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
          x: 0,
          y: 0,
          duration: 50,
        },
        {
          image: `/sprites/npc/npc${image}/npc${image}-attack1.png`,
          x: -60,
          y: 30,
          duration: 750,
           sound: "/sounds/npc3/npc3-attack.mp3",
        },
      ];

   
   
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
   
    
      return [
        {
          image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
          x: 0,
          y: 0,
          duration: 50,
        },
        {
          image: `/sprites/npc/npc${image}/npc${image}-attack1.png`,
          x: -30,
          y: 0,
          duration: 750,
          sound: `/sounds/npc${image}/npc${image}-attack.mp3`,
        },
      ];
    case 14:
    case 15:
 return [
        {
          image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
          x: 0,
          y: 0,
          duration: 50,
        },
        {
          image: `/sprites/npc/npc${image}/npc${image}-attack1.png`,
          x: 0,
          y: 0,
          duration: 750,
          sound: `/sounds/npc${image}/npc${image}-attack.mp3`,
        },
      ];
       case 20:
        const soundId = Math.floor(1+Math.random()*5);
      return [
        {
          image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
          x: 0,
          y: 0,
          duration: 50,
        },
        {
          image: `/sprites/npc/npc${image}/npc${image}-attack${soundId}.png`,
          x: -30,
          y: 0,
          duration: 350,
          sound: `/sounds/npc${image}/npc${image}-attack${soundId}.mp3`,
        },
      ];
    default:
      return [];
  }
};

export const getNpcDodgeFrames = (
  image: number
): AnimationFrame[] => [
  {
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 50,
  },
  {
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: -60,
    y: -10,
    duration: 650,
    sound: `/sounds/npc${image}/npc${image}-dodge.mp3`,
  },
];


export const getNpcHurtFrames = (
  image: number
): AnimationFrame[] => [
  {
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 50,
  },
  {
    image: `/sprites/npc/npc${image}/npc${image}-hurt1.png`,
    x: 0,
    y: 0,
    duration: 750,
    sound: `/sounds/npc${image}/npc${image}-hurt.mp3`,
  },
];


export const getNpcDeathFrames = (
  image: number
): AnimationFrame[] => [
  {
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 50,
  },
  {
    image: `/sprites/npc/npc${image}/npc${image}-hurt1.png`,
    x: 0,
    y: 0,
    duration: 600,
    sound: `/sounds/npc${image}/npc${image}-death.mp3`,
  },
  { 
    image: `/sprites/npc/npc${image}/npc${image}-dead.png`,
    x: 0,
    y: 0,
    duration: 1000,
  },
];


export const getNpcPowerFrames = (
  image: number
): AnimationFrame[] => [
  {
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 50,
  },
  {
    image: `/sprites/npc/npc${image}/npc${image}-power.png`,
    x: 0,
    y: 0,
    duration: 800,
    sound: `sounds/npc${image}/npc${image}-power.mp3`,
  },
  { 
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 50,
  },
];


export const getNpcChangeIntentFrames = (
  image: number
): AnimationFrame[] => [
  {
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: -10,
    y: 0,
    duration: 100,
  },
  {
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: 10,
    y: 0,
    duration: 200,
  },
  { 
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: -10,
    y: 0,
    duration: 200,
  },
   { 
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 200,
  },
];


export const npcFrameAnimations: Record<
  FrameAnimationName,
  (image: number) => AnimationFrame[]
> = {
  attack: getNpcAttackFrames,
  hurt: getNpcHurtFrames,
  dodged: getNpcDodgeFrames,
  power: getNpcPowerFrames,
 
};

/* ****************************************************************************************************************** */
/* ******************************************** FRAME POUR PJ  ************************************************** */
/* ****************************************************************************************************************** */


export const getPjAttackFrames = (
  image: number
): AnimationFrame[] => [
    {
      image: `/sprites/pj/pj${image}/pj${image}-idle.png`,
      x: 0,
      y: 0,
      duration: 50,
    },
    {
      image: `/sprites/pj/pj${image}/pj${image}-attack1.png`,
      x: 0,
      y: 0,
      duration: 600,
    },
  ];


export const getPjDodgeFrames = (
  image: number
): AnimationFrame[] => [
  {
    image: `/sprites/pj/pj${image}/pj${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 50,
  },
  {
    image: `/sprites/pj/pj${image}/pj${image}-idle.png`,
    x: -40,
    y: -10,
    duration: 450,
  },
];


export const getPjHurtFrames = (
  image: number
): AnimationFrame[] => [
  {
    image: `/sprites/pj/pj${image}/pj${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 50,
     sound: `/sounds/pj${image}/pj${image}-hurt.mp3`,
  },
  {
    image: `/sprites/pj/pj${image}/pj${image}-hurt1.png`,
    x: 0,
    y: 0,
    duration: 600,
   
  },
];

export const getPjSpellFrames = (
  image: number
): AnimationFrame[] => [
  {
    image: `/sprites/pj/pj${image}/pj${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 50,
  },
  {
    image: `/sprites/pj/pj${image}/pj${image}-spell.png`,
    x: 0,
    y: 0,
    duration: 600,
  },
];


export const getPjDeathFrames = (
  image: number
): AnimationFrame[] => [
    {
      image:  `/sprites/pj/pj${image}/pj${image}-idle.png`,
      x: 0,
      y: 0,
      duration: 50,
    },
    {
      image:  `/sprites/pj/pj${image}/pj${image}-hurt1.png`,
      x: 0,
      y: 0,
      duration: 700,
    },
    {
       image: `/sprites/pj/pj${image}/pj${image}-dead.png`,
      x: 0,
      y: 0,
      duration: 1300,
    },
  ];


export const pjFrameAnimations: Record<
  FrameAnimationName,
  (image: number) => AnimationFrame[]
> = {
  attack: getPjAttackFrames,
  hurt: getPjHurtFrames,
  dodged: getPjDodgeFrames,
  power: getPjSpellFrames,

};

 
export type FrameAnimationName =
  | "attack"
  | "hurt"
  | "dodged"
  | "power";

/* ****************************************************************************************************************** */
/* ***************************************************** OVERLAY ***************************************************** */
/* ****************************************************************************************************************** */


export const overlayAnimation: Record<
  OverlayAnimationName,
  AnimationFrame[]
> = {
  "heal" : [
  {
    image: "/sprites/effects/heal/heal1.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/heal/heal2.png",
    x: 0,
    y: 0,
    duration: 250,
    sound: "/sounds/spell/heal.mp3",
  },
  {
    image: "/sprites/effects/heal/heal3.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/heal/heal4.png",
    x: 0,
    y: 0,
    duration: 250,
  }, ],
   "athlan" : [
  {
    image: "/sprites/effects/athlan/athlan1.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/athlan/athlan2.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/athlan/athlan3.png",
    x: 0,
    y: 0,
    duration: 700,
  },
  {
    image: "/sprites/effects/athlan/athlan4.png",
    x: 0,
    y: 0,
    duration: 250,
  }, ],
   "ward" : [
  {
    image: "/sprites/effects/athlan/athlan1.png",
    x: 0,
    y: 0,
    duration: 50,
  },
  
  {
    image: "/sprites/effects/athlan/athlan3.png",
    x: 0,
    y: 0,
    duration: 750,
  },
  ],
   "fire_barrier" : [
  {
    image: "/sprites/effects/fire_barrier/fire_barrier1.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/fire_barrier/fire_barrier2.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/fire_barrier/fire_barrier3.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/fire_barrier/fire_barrier4.png",
    x: 0,
    y: 0,
    duration: 250,
  }, ],
"potion_hp" : [
  {
    image: "/sprites/effects/potion_hp/potion_hp1.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/potion_hp/potion_hp2.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/potion_hp/potion_hp3.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/potion_hp/potion_hp4.png",
    x: 0,
    y: 0,
    duration: 250,
  }, ],
  
"potion_standard" : [
  {
    image: "/sprites/effects/potion_standard/potion_standard1.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/potion_standard/potion_standard2.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/potion_standard/potion_standard3.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/potion_standard/potion_standard4.png",
    x: 0,
    y: 0,
    duration: 250,
  }, ],
  "wings" : [
  {
    image: "/sprites/effects/wings/wings1.png",
    x: 0,
    y: 0,
    duration: 350,
  },
  {
    image: "/sprites/effects/wings/wings2.png",
    x: 0,
    y: 0,
    duration: 350,
    sound: "/sounds/spell/wings.mp3",
  },
  {
    image: "/sprites/effects/wings/wings3.png",
    x: 0,
    y: 0,
    duration: 650,
  },
  {
    image: "/sprites/effects/wings/wings4.png",
    x: 0,
    y: 0,
    duration: 350,
  }, ],
  
  "buff" : [
  {
    image: "/sprites/effects/buff/buff1.png",
    x: 0,
    y: 0,
    duration: 250,
     sound: "/sounds/spell/buff.mp3",

  },
  {
    image: "/sprites/effects/buff/buff2.png",
    x: 0,
    y: 0,
    duration: 250,
  },
  {
    image: "/sprites/effects/buff/buff3.png",
    x: 0,
    y: 0,
    duration: 350,
  },
  ],
  "curse" : [
  {
    image: "/sprites/effects/curse/curse1.png",
    x: 0,
    y: 0,
    duration: 100,
  },
  {
    image: "/sprites/effects/curse/curse2.png",
    x: 0,
    y: 0,
    duration: 150,
    sound: "/sounds/spell/curse.mp3",
  },
  {
    image: "/sprites/effects/curse/curse3.png",
    x: 0,
    y: 0,
    duration: 150,
  },
  {
    image: "/sprites/effects/curse/curse4.png",
    x: 0,
    y: 0,
    duration: 200,
  },
{
    image: "/sprites/effects/curse/curse4.png",
    x: 0,
    y: 0,
    duration: 200,
  },
  {
    image: "/sprites/effects/curse/curse5.png",
    x: 0,
    y: 0,
    duration: 150,
    
  },
  {
    image: "/sprites/effects/curse/curse7.png",
    x: 0,
    y: 0,
    duration: 100,
  },
  {
    image: "/sprites/effects/curse/curse8.png",
    x: 0,
    y: 0,
    duration: 100,
  },{
    image: "/sprites/effects/curse/curse9.png",
    x: 0,
    y: 0,
    duration: 100,
  },
  {
    image: "/sprites/effects/curse/curse10.png",
    x: 0,
    y: 0,
    duration: 100,
    
  },
  ],
  
  
}
  
export type OverlayAnimationName =
  | "heal"
  | "athlan"
  | "fire_barrier"
  | "potion_hp"
  | "potion_standard"
  | "wings"
  | "buff"
  | "curse"
  | "ward"



