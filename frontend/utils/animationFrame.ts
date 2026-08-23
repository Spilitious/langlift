import { getCacheDirectories } from "next/dist/build/webpack-config";

export type AnimationFrame = {
  image: string;
  x: number;
  y: number;
  duration: number;
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
          duration: 50,
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
          duration: 350,
        },
        {
          image: "/sprites/npc/npc2/npc2-attack2.png",
          x: 0,
          y: 0,
          duration: 350,
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
          duration: 350,
        },
      ];

   
   
    case 4:
    case 5:
    case 6:
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
          duration: 350,
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
    x: 60,
    y: -10,
    duration: 350,
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
    duration: 350,
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
    duration: 350,
  },
  { 
    image: `/sprites/npc/npc${image}/npc${image}-dead.png`,
    x: 0,
    y: 0,
    duration: 350,
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
    duration: 100,
  },
  { 
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: -10,
    y: 0,
    duration: 100,
  },
   { 
    image: `/sprites/npc/npc${image}/npc${image}-idle.png`,
    x: 0,
    y: 0,
    duration: 100,
  },
];


export const npcFrameAnimations: Record<
  FrameAnimationName,
  (image: number) => AnimationFrame[]
> = {
  attack: getNpcAttackFrames,
  hurt: getNpcHurtFrames,
  dodged: getNpcDodgeFrames,
 
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
      duration: 400,
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
    x: 60,
    y: -10,
    duration: 350,
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
  },
  {
    image: `/sprites/pj/pj${image}/pj${image}-hurt1.png`,
    x: 0,
    y: 0,
    duration: 350,
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
      duration: 500,
    },
    {
       image: `/sprites/pj/pj${image}/pj${image}-dead.png`,
      x: 0,
      y: 0,
      duration: 1350,
    },
  ];


export const pjFrameAnimations: Record<
  FrameAnimationName,
  (image: number) => AnimationFrame[]
> = {
  attack: getPjAttackFrames,
  hurt: getPjHurtFrames,
  dodged: getPjDodgeFrames,
};


export type FrameAnimationName =
  | "attack"
  | "hurt"
  | "dodged";

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
    duration: 180,
  },
  {
    image: "/sprites/effects/heal/heal2.png",
    x: 0,
    y: 0,
    duration: 180,
  },
  {
    image: "/sprites/effects/heal/heal3.png",
    x: 0,
    y: 0,
    duration: 180,
  },
  {
    image: "/sprites/effects/heal/heal4.png",
    x: 0,
    y: 0,
    duration: 250,
  }, ],
"potion_hp" : [
  {
    image: "/sprites/effects/potion_hp/potion_hp1.png",
    x: 0,
    y: 0,
    duration: 180,
  },
  {
    image: "/sprites/effects/potion_hp/potion_hp2.png",
    x: 0,
    y: 0,
    duration: 180,
  },
  {
    image: "/sprites/effects/potion_hp/potion_hp3.png",
    x: 0,
    y: 0,
    duration: 180,
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
    duration: 180,
  },
  {
    image: "/sprites/effects/potion_standard/potion_standard2.png",
    x: 0,
    y: 0,
    duration: 180,
  },
  {
    image: "/sprites/effects/potion_standard/potion_standard3.png",
    x: 0,
    y: 0,
    duration: 180,
  },
  {
    image: "/sprites/effects/potion_standard/potion_standard4.png",
    x: 0,
    y: 0,
    duration: 250,
  }, ],
  
}
  
export type OverlayAnimationName =
  | "heal"
  | "potion_hp"
  | "potion_standard";


