import type { PjView } from "./fighterView";

export type GameStateView = {
  pjs: PjView[];
  currentRoomId: number | null;
  currentPageId: number | null;
  consequenceIds: Set<number>;
};