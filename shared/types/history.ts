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
    };

export type HistoryChoiceItem = {
  text: string;
  destination: HistoryDestination;
};



export type HistoryChoice = {
  choices: HistoryChoiceItem[];
};