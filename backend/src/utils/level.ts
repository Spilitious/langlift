interface Level {
    image: number;
    npc_start: string;
    npc_basicRace: string;
    npc_level_min: string;
    npc_level_max: string;
    id_nextRoom : number;
    reward: number;
}

export const splitAttribute = (level: Level, attribute: keyof Level): number[] => {
    // Récupérer la chaîne de l'attribut et la découper en utilisant le séparateur '-'
    const value = level[attribute] as string;
    return value.split('-').map(Number);
};

export const levels: Level[] = [
    {
        image: 1,
        npc_start: "8",
        npc_basicRace: "0",
        npc_level_min: "1",
        npc_level_max: "2",
        id_nextRoom: 1,
        reward: 0,
    },
    {
        image: 8,
        npc_start: "2-3",
        npc_basicRace: "0-0",
        npc_level_min: "1-1",
        npc_level_max: "1-1",
        id_nextRoom: 2,
        reward: 40,
    },
    {
        image: 2,
        npc_start: "1-4-5",
        npc_basicRace: "1-1-1",
        npc_level_min: "1-1-1",
        npc_level_max: "1-1-1",
        id_nextRoom: 3,
        reward: 0,
    },
    {
        image: 1,
        npc_start: "1",
        npc_basicRace: "2",
        npc_level_min: "1",
        npc_level_max: "1",
        id_nextRoom: 4,
        reward: 40,
    },
    {
        image: 1,
        npc_start: "2-3",
        npc_basicRace: "2-2",
        npc_level_min: "1-1",
        npc_level_max: "1-1",
        id_nextRoom: 5,
        reward: 40,
    },
    {
        image: 3,
        npc_start: "2-3-6",
        npc_basicRace: "3-3-3",
        npc_level_min: "2-2-2",
        npc_level_max: "3-3-3",
        id_nextRoom: 6,
        reward: 40,
    },
    {
        image: 7,
        npc_start: "2-3-6",
        npc_basicRace: "4-4-4",
        npc_level_min: "3-5-3",
        npc_level_max: "3-5-5",
        id_nextRoom: 7,
        reward: 40,
    },
    {
        image: 7,
        npc_start: "1",
        npc_basicRace: "5",
        npc_level_min: "7",
        npc_level_max: "9",
        id_nextRoom: 8,
        reward: 40,
    },
    {
        image: 4,
        npc_start: "2-3-6",
        npc_basicRace: "6-6-7",
        npc_level_min: "4-4-6",
        npc_level_max: "6-6-8",
        id_nextRoom: 9,
        reward: 40,
    },

    {
        image: 6,
        npc_start: "1-6",
        npc_basicRace: "8-9",
        npc_level_min: "7-3",
        npc_level_max: "9-4",
        id_nextRoom: 9,
        reward: 40,
    },
   
];
