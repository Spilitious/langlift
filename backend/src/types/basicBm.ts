export const Const_Bm = {
  EVASION: 1,
  FATIGUE: 2,
  STUN: 3,
} as const;



export type BasicBm = {
 
  id: number;
  name: string;
  image: number;
  value:number;
}
 