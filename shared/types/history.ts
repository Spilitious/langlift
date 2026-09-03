import type {GameStateView} from "./gameStateView"

export type HistoryPage = {
    id:number,
    textId: number,
    imageId: number,
    choices:HistoryChoice,
}


export type HistoryDestination =
  | {
      type: "text";
      id: number;
      consequenceId?: number;
    }
  | {
      type: "fight";
      id: number;
      consequenceId?: number;
    }
   | {
      type: "shop";
      id: number;
      consequenceId?:number;
    }
    | {
      type: "profession";
      id: number;
      consequenceId?:number;
    };


export type HistoryChoiceItem = {
  id:number;
  text: string;
  destination: HistoryDestination;
  condition?: (gameState: GameStateView) => boolean;
};

export type HistoryChoice = {
  choices: HistoryChoiceItem[];
};