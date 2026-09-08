import Image from "next/image";
import GraphicBar from "./GraphicBar";
// import LevelUPButton from "./LevelUpButton";
import type { PjView } from "@shared/types/fighterView";
import { getPjAvatarPath } from "@/utils/spritePaths";

type PlayerProfilProps = {
  player: PjView;
  active: boolean;
  onClick: () => void;
};

const PlayerProfil = ({
  player,
  active,
  onClick,
}: PlayerProfilProps) => {

  const avatar = `/Avatar/Portrait${player.avatar}.png`;

  const textStyle: React.CSSProperties = {
    userSelect: "none",
    fontFamily: "'Uncial Antiqua', serif",
  };

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: 270,
        height: 190,
        cursor: "pointer",
      }}
    >
      {/* Fond */}
      <Image
        src="/ui/20.png"
        alt=""
        fill
        sizes="270px"
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Marque du personnage sélectionné */}
      {active && (
        <div
          style={{
            position: "absolute",
            top: 155,
            left: 230,
          }}
        >
          <Image
  src="/ui/23.png"
  alt="Personnage sélectionné"
  width={22}
  height={22}
  style={{
    width: "22px",
    height: "22px",
  }}
/>

          
        </div>
      )}

      {/* Portrait */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: 15,
        }}
      >
        <Image
          src={getPjAvatarPath(player.avatar)}
          alt={player.name}
          width={90}
          height={108}
        />
      </div>

      {/*
      Level up

      {player.xp >= player.nextLevelXp && (
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 83,
          }}
        >
          <LevelUPButton />
        </div>
      )}
      */}

      {/* Nom */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 112,
          fontSize: 22,
          ...textStyle,
        }}
      >
        {player.name}
      </div>

      {/* Niveau + barres */}
      <div
        style={{
          position: "absolute",
          top: 35,
          left: 113,
        }}
      >
        <div
          style={{
            marginTop: 4,
            fontSize: 14,
            ...textStyle,
          }}
        >
          Aventurier niveau {player.level}
        </div>

        {/* HP */}
        <div style={{ marginTop: 4 }}>
          <GraphicBar
            color="#FF0000"
            curr={player.base_att.currhp}
            max={player.stats.maxhp}
            text="HP"
            width={140}
            height={12}
            borderWidth={3}
          />
        </div>

        {/* AP */}
        <div style={{ marginTop: 2 }}>
          <GraphicBar
            color="#00FF00"
            curr={player.ap}
            max={3}
            text="AP"
            width={140}
            height={12}
            borderWidth={3}
          />
        </div>

        {/* XP */}
        <div style={{ marginTop: 2 }}>
          <GraphicBar
            color="#0000FF"
            curr={player.xp}
            max={player.nextLevelXp}
            text="XP"
            width={140}
            height={12}
            borderWidth={3}
          />
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 15,
          fontSize: 14,
          ...textStyle,
        }}
      >
        {/* Ligne 1 */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              minWidth: 120,
              userSelect: "none",
            }}
          >
            Constitution : {player.stats.constitution}
          </div>

          <div style={{ userSelect: "none" }}>
            Force : {player.stats.strength}
          </div>
        </div>

        {/* Ligne 2 */}
        <div
          style={{
            display: "flex",
            marginTop: 0,
          }}
        >
          <div
            style={{
              minWidth: 120,
              userSelect: "none",
            }}
          >
            Magie : {player.stats.magicSkill}
          </div>

          <div style={{ userSelect: "none" }}>
            Armure : {player.stats.armor}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfil;