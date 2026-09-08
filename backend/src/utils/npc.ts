interface BasicRace {
    
    racename: string;
    image: number;
    level_min: number;
    hp: number;
    hp_upgrade_rate: number;
    strength: number;
    strength_upgrade_rate: number;
    armor: number;
    armor_upgrade_rate: number;
    magicSkill:number;
    magicSkill_upgrade_rate:number;
    bonus:number;
    bonus_upgrade_rate:number;
}

export const basicRaces: BasicRace[] = [
    
        
       
   

    {
       
        racename: 'Wolf',
        image: 7,
        level_min: 2,
        hp: 45,
        hp_upgrade_rate: 40,
        strength: 5,
        strength_upgrade_rate:50,
        armor: 0,
        armor_upgrade_rate: 0,
        magicSkill:1,
        magicSkill_upgrade_rate:10,
        bonus:0,
        bonus_upgrade_rate:0,
    },
    {
       
        racename: 'Kobold',
        image: 13,
        level_min: 3,
        hp: 38,
        hp_upgrade_rate: 40,
        strength: 0,
        strength_upgrade_rate:0,
        armor: 0,
        armor_upgrade_rate: 0,
        magicSkill:5,
        magicSkill_upgrade_rate:60,
        bonus:0,
        bonus_upgrade_rate:0,
    },
    {
       
        racename: 'Troll',
        image: 11,
        level_min: 7,
        hp: 148,
        hp_upgrade_rate: 40,
        strength: 13,
        strength_upgrade_rate:30,
        armor: 4,
        armor_upgrade_rate: 30,
        magicSkill:2,
        magicSkill_upgrade_rate: 0,
        bonus:0,
        bonus_upgrade_rate:0,
    },
    {
       
        racename: 'Warrior Ant',
        image: 8,
        level_min: 4,
        hp: 45,
        hp_upgrade_rate: 30,
        strength: 7,
        strength_upgrade_rate:30,
        armor: 2,
        armor_upgrade_rate: 40,
        magicSkill:0,
        magicSkill_upgrade_rate: 0,
        bonus:0,
        bonus_upgrade_rate:0,
    },

    {
       
        racename: 'Queen Ant',
        image: 9,
        level_min: 6,
        hp: 95,
        hp_upgrade_rate: 30,
        strength: 4,
        strength_upgrade_rate:30,
        armor: 7,
        armor_upgrade_rate: 40,
        magicSkill:3,
        magicSkill_upgrade_rate: 0,
        bonus:0,
        bonus_upgrade_rate:0,
    },

    {
        racename: 'Ogre',
        image: 6,
        level_min: 7,
        hp: 127,
        hp_upgrade_rate: 30,
        strength: 9,
        strength_upgrade_rate:30,
        armor: 7,
        armor_upgrade_rate: 40,
        magicSkill:2,
        magicSkill_upgrade_rate: 0,
        bonus:0,
        bonus_upgrade_rate:0,
    },

    {
        racename: 'Brigand',
        image: 5,
        level_min: 3,
        hp: 19,
        hp_upgrade_rate: 30,
        strength: 3,
        strength_upgrade_rate:20,
        armor: 1,
        armor_upgrade_rate: 50,
        magicSkill:0,
        magicSkill_upgrade_rate: 0,
        bonus:0,
        bonus_upgrade_rate:0,
    },
];
