import type { GameStateView, SavePreview, NewGameResponse} from "@shared/types/gameStateView";


export const newGame = async (): Promise<NewGameResponse> => {
  const response = await fetch(
    "http://localhost:3001/api/gameState/newGame",
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la création de la partie"
    );
  }

  return response.json();
};


export const reloadGameState =
  async (): Promise<GameStateView | null> => {

    const response = await fetch(
      "http://localhost:3001/api/gameState/reload"
    );

    if (!response.ok) {
      throw new Error(
        "Erreur lors du rechargement du GameState"
      );
    }

    return response.json();
  };
  

export async function resetGameState(): Promise<GameStateView> {
  const response = await fetch(
    "http://localhost:3001/api/gameState/reset",
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de reset le GameState"
    );
  }

  return response.json();
}

export const saveGame = async () => {
  const response = await fetch(
    "http://localhost:3001/api/gameState/save",
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la sauvegarde"
    );
  }

  return response.json();
};



  

export const getSaves = async ():Promise<SavePreview[]> => {
    const response = await fetch(
          "http://localhost:3001/api/gameState/saves"
        );

        if (!response.ok) {
          throw new Error(
            "Erreur lors du chargement des sauvegardes"
          );
        }

        const data: SavePreview[] = await response.json();
        
        return data;

};



export const loadGame = async (saveId:number):Promise<GameStateView> => {
    const response = await fetch(
          `http://localhost:3001/api/gameState/loadGame/${saveId}`
        );

        if (!response.ok) {
          throw new Error(
            "Erreur lors du chargement de la sauvegarde"
          );
        }
        
        return response.json();

};

export const deleteSave = async (
  saveId: number
): Promise<void> => {
  const response = await fetch(
    `http://localhost:3001/api/gameState/save/${saveId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la suppression de la sauvegarde"
    );
  }
};