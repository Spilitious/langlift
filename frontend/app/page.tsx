import { GameProvider } from "@/context/GameContext";
import Game from "@/components/Game";


export default function Page() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

