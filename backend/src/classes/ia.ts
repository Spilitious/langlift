
  
        
        

   
        

        kobold():void
		{
            if(this.get("phase") ==1)
            {
                this.action();
            } 

            if(this.get("phase") == 2)
            {
                this._activeNpc.selectNewHostileTarget(this._fight);
                this._activeNpc.set("num_attack", 12); 
                   
            }
        }


        troll():void
		{
            if(this.get("phase") ==1)
                {
                    this.action();
                } 
                if(this.get("phase") == 2)
                {

                	if (this._activeNpc.get("num_attack") == 1 && this._fight.get("round") != 0)
					{
							this._activeNpc.set("target", 0);
							this._activeNpc.set("num_attack", 3);
					}
					else if (this._activeNpc.get("num_attack") == 3)
						 {
							this._activeNpc.set("target", 0); 
							this._activeNpc.set("num_attack", 10);
						 }
					 else if (this._activeNpc.get("num_attack") == 10)
						 { 
							this._activeNpc.set("target", 0);
							this._activeNpc.set("num_attack", 9);
						 }
					 else
						 {
							
							this._activeNpc.selectNewHostileTarget(this._fight);
							this._activeNpc.set("num_attack", 1);
						 }
                }		 
						
        }

        warriorAnt():void
		{
            if(this.get("phase") ==1)
            {
                this.action();
            } 

            if(this.get("phase") == 2)
            {
                var dice:number = Math.floor(Math.random() * 10);
                if (dice < 5)
                    {
                        this._activeNpc.selectNewHostileTarget(this._fight);
                        this._activeNpc.set("num_attack", 6); 
                    }
                    else
                    {
                         this._activeNpc.selectNewHostileTarget(this._fight);
                         this._activeNpc.set("num_attack", 1);

                    } 
            }
        }

        queenAnt():void
		{
            if(this.get("phase") ==1)
            {
                this.action();
            } 

            if(this.get("phase") == 2)
            {
                var dice:number = Math.floor(Math.random() * 10);
				if (dice > 3+2*this._fight.getNbOpponent() && this._activeNpc.get("num_attack") !=7)
               
                {
                   this._activeNpc.set("target", 0);
                   this._activeNpc.set("num_attack", 7); 
                }
                else
                {
                    this._activeNpc.selectNewHostileTarget(this._fight);
                    this._activeNpc.set("num_attack", 1);
                }
            }
        }

        ogre():void
		{
            if(this.get("phase") ==1)
            {
                this.action();
            } 

            if(this.get("phase") == 2)
            {
                var dice:number = Math.floor(Math.random() * 10);
                if (Math.floor((this._activeNpc.get("currhp")/this._activeNpc.get("hp"))*10) < 4  && this._activeNpc.get("magicSkill") > 0)
                {
                   this._activeNpc.set("target", 0);
                   this._activeNpc.set("num_attack", 13); 
                }
                else
                {
                    var shield:number = this._activeNpc.get("shield");
                    if (dice > 3 + Math.floor(this._activeNpc.get("shield") / 6))
                    {
                        this._activeNpc.set("target", 0);
                        this._activeNpc.set("num_attack", 3);
                    }
                    else
                    {
                        this._activeNpc.selectNewHostileTarget(this._fight);
                        this._activeNpc.set("num_attack", 1);
                    }
                }
            }
        }

        brigand():void
		{
            if(this.get("phase") ==1)
            {
                this.action();
            } 

            if(this.get("phase") == 2)
            {
                this._activeNpc.selectNewHostileTarget(this._fight);
                this._activeNpc.set("num_attack", 14); 
                   
            }
        }

      
    action():void
	{
        switch(this._activeNpc.get("num_attack"))
        {
            case 1 : Attack(this._fight.getPlayer(this._activeNpc.get("target")), this._activeNpc); break;
            case 2 : Evasion(this._activeNpc); break; 
            case 3 : Shield(this._activeNpc); break; 
            case 4 : WolfCry(this._activeNpc, this._fight); break; 
            //case 5 : Heal(this._activeNpc, ); break;
            case 6 : AttackAndShield(this._activeNpc, this._fight.getPlayer(this._activeNpc.get("target")) ); break;
            case 7 : Invoke(this._activeNpc, this._fight); break; 
           // case 8 : provokeAndShield(); break; 
            case 9 : Twirl(this._activeNpc,this._fight); break;
            case 10 : TrollFury(this._activeNpc); break;
            case 11 : MultipleAttack(this._activeNpc, this._fight.getPlayer(this._activeNpc.get("target")) ); break; 
            case 12 : Fireball(this._activeNpc, this._fight.getPlayer(this._activeNpc.get("target"))); break; 
            case 13 : Autoregenation(this._activeNpc); break;
            case 14 : PiercingDamage(this._activeNpc, this._fight.getPlayer(this._activeNpc.get("target"))); break; /*
            case 15 : massSupport(); break;
            case 16 : curse(); */
            default : break;
            
        }	
	}
/*
     // Sérialisation de l'instance de Ia en JSON
     public toJSON() {
        return {
            fight: this._fight.toJSON(),  // Assure-toi que Fight a une méthode toJSON
            activeNpc: this._activeNpc.toJSON(),  // Assure-toi que Npc a une méthode toJSON
            att: this._att
        };
    }

    // Désérialisation d'un objet JSON en instance de Ia
    public static fromJSON(json: any): Ia {
        // Crée une instance de Fight à partir de la JSON. 
        // Supposons que tu as une méthode Fight.fromJSON() qui recrée une instance de Fight.
        const fight = Fight.fromJSON(json.fight);

        // Crée une instance de Npc à partir de la JSON.
        // Supposons que tu as une méthode Npc.fromJSON() qui recrée une instance de Npc.
        const activeNpc = Npc.fromJSON(json.activeNpc);

        const ia = new Ia(fight);
        ia._activeNpc = activeNpc;  // Assigner le NPC actif à l'IA
        ia._att = json.att;

        return ia;
    } */
            
}