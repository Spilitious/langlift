
import { Ability } from './abitlity';
import {Bm} from './bm';
import { Character } from './character';
import { BM_NAME } from '../constants/constants';


//
//import path from 'path'; // Importer le module path pour la gestion des chemins



export class Player extends Character {
   
    _att: Record<string, any>;
    _bm : Bm[];
    _ability: Ability[];

    _actions: [string, number][];


    constructor() {
      super()
      this._att = {
        "id":1,
        "name": "Indiana",
        "race": "humain",
        "gender" : "M",
        "level" : 1,
        "image" : 1,
        "avatar" :1,
        "currhp" : 10,
        "xp" : 0,
        "ap" : 3,
        "position" : 0,

        "constitution": 5, 
        "strength" : 5,
        "magicSkill" : 1, 
        "armor" : 0,
        "shield" : 0,

      };
      this._ability = [];
      this._bm = [];
      this._actions = Array.from({ length: 9 }, () => ["empty", -1]);
    }

   

    getAction(index: number): [string, number] {
      if (index >= 0 && index < this._actions.length) {
        return this._actions[index];
      } else {
        throw new Error("Index out of bounds");
      }
    }

    getBmList():Bm[] {
      return this._bm;
    }
  
    getNbAction():number
    {
      return 0;
    }

    getMaxHp(): number {
      return 28 + this.get("constitution") * this.get("level") * 6 + this.get("strength") * 2 * this.get("level")+ this.get("level") *2;
    }

    getMaxHpLevel(level:number): number {
      return 28 + this.get("constitution") * level * 6 + this.get("strength") * 2 * level + level *2;
    }

    getHealed(hp:number):number {
      let delta = Math.min(this.getMaxHp()-this.get("currhp"), hp);
      this.set("currhp", this.get("currhp")+delta);
      return delta;
    }

    getNextLevelXP():number {
		return  this.get("level") * 20;      
	  }
	
    addXp(xp:number) {
      this.set("xp", this.get("xp")+xp);
    }

	  levelUp():void {
		  this.set("xp", this.get("xp") - this.getNextLevelXP());
		  this.set("level", this.get("level") + 1);
		  this.set("currhp", this.getMaxHp());
	  }
	  
    getNbAbility():number {
      return this._ability.length;
    }
    
    getAbility(index:number):Ability
    {
      return this._ability[index];
    }
    
    getAbilityByName(name:string) : Ability {
      let ability:Ability= new Ability();
      for(let i:number = 0; i < this._ability.length; i++)
        {
          if(this._ability[i].get("name") == name)
            return this._ability[i];
        }
        return ability;
  
      }
    learnAbility(id:number):void
    {
      let ability:Ability = new Ability();
      ability.loadFromBasicAbility(id);
      this._ability.push(ability);
      
    }

    haveAbility(id:number):boolean
    {
      for(let i:number=0 ; i < this.getNbAbility(); i++)
        if(this.getAbility(i).get("id") == id)
            return true;
      return false;
    }

    newFight():void {
       this.set("currhp", this.getMaxHp());
       this.set("ap", 3);
       this.resetBm();

    }

    newTurn():void {
      this.set("ap", 3);
      this.set("shield", this.getWithBonus("armor"));
      
      let regen:number = 0;
      for(let i:number = 0; i < this.getNbBm(); i++ )
          regen += this.getBm(i).getBonus("regen");
      this.set("currhp", this.get("currhp")+regen);

      for(let i:number = 0; i < this._bm.length; i++)
        {
          if(this._bm[i].get("life") != -1)
          {
            this._bm[i].set("life", this._bm[i].get("life") -1 );
            if(this._bm[i].get("name") == BM_NAME.BLEED)
              this._bm[i].incBonus("regen",1);
          }
          if(this._bm[i].get("life") == 0)
          {
            this.deleteBM(i);
            i--;
          }
        }
      
    }

   

    resetBm():void {
      this._bm = [];
    }

   /*
    loadFromSave(id_Player:number) {
      let player = players[id_Player];
      this.set("id", player.id);
      this.set("name", player.name);
      this.set("race", player.race);
      this.set("gender", player.gender);
      this.set("level", player.level);
      this.set("image", player.image);
      this.set("avatar", player.avatar);
      this.set("xp", player.xp);
      this.set("position", player.position);
      this.set("constitution", player.constitution);
      this.set("strength", player.strength);
      this.set("magicSkill", player.magicSkill);
      this.set("ap", 3)
      this.set("currhp", this.getMaxHp());
      
    } */

   

    // Méthode de sérialisation
    public toJSON() {
      return {
          att: this._att,
          bm: this._bm.map(bm => bm.toJSON()), 
          ability: this._ability.map(ability => ability.toJSON())
      };
  }

  // Méthode de désérialisation
  public static fromJSON(json: any): Player {
      const player = new Player();
      player._att = json.att;
      player._bm = json.bm.map((bmJson: any) => Bm.fromJSON(bmJson));
      player._ability = json.ability.map((abilityJson: any) => Ability.fromJSON(abilityJson));
      return player;
  }

  /*
  // Méthode pour sérialiser l'objet en JSON et écrire dans un fichier
  async saveToFile(filePath: string): Promise<void> {
    try {
      // Sérialiser l'objet en chaîne JSON
      const content = JSON.stringify({
        att: this._att,
       
      }, null, 2); 
      
      // Écrire la chaîne JSON dans le fichier
      await fs.writeFile(filePath, content);

      console.log('File written successfully');
    } catch (error) {
      console.error('Failed to write file:', error.message);
    }
  } */
}
  
   
  
    


  