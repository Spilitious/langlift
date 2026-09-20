
		
export function massSupport(npc:Npc, fight: Fight):void
		{
			for (let i:number = 0; i < fight.getNbOpponent(); i++)
			{
				
				//if (_opponent[i].haveEnchantment(Constant.BM_SHATTERED_CURSE))
				//	_param[i]["shield"] = int(_param[i]["shield"] / 2);
					
				fight.getOpponent(i).set("shield", npc.getValueAttack());
				fight.getOpponent(i).getHealed(npc.getValueAttack());
			}	
			
		}
		
export function AttackAndShield(npc:Npc, player:Player):void
		{
            npc.set("shield", npc.get("shield")+npc.getValueAttack());
			Attack(player, npc);	
		}	

export function Invoke(npc:Npc, fight:Fight):void
		{
            let position:number = 2;
            let ground_position:number = 3;

            if(fight.getNbOpponent() == 1)
                {
                    position = 1;
                    ground_position = 2;
    
                }
          	var new_npc:Npc = new Npc(6);
            new_npc.generate(4, ground_position);
			new_npc.selectNewHostileTarget(fight);
            new_npc.set("num_attack", 1);
            new_npc.set("team_position", position);
			fight.addOpponent(new_npc);	

		}

  

export function TrollFury(npc:Npc):void
		{
			
			var bm:Bm = new Bm();
			bm.init(BM_NAME.TROLL_FURY, npc.getValueAttack());
			npc.addBm(bm);
		}	
		
        
export function Fireball(npc:Npc, player:Player):void
		{
			
			let damage = npc.getValueAttack();
            let shield = player.get("shield");
            if(shield >= damage)
                player.set("shield", player.get("shield")- damage);
            else {
                player.set("shield", 0);
                player.getHit(damage-shield);
				var b:Bm = new Bm();
				b.init(BM_NAME.BURN, Math.floor(npc.getValueAttack()/4));
				player.addBm(b);
                
            }
            if(player.haveBm(BM_NAME.GUARD_REFLEX))
                player.set("shield", player.getAbilityByName(ABILITY_NAME.GUARD_REFLEX).get("reflex"));

		}	

export function Autoregenation(npc:Npc):void
		{
			npc.getHealed(Math.floor(8*npc.get("hp") /10));
			npc.set("magicSkill", npc.get("magicSkill")-1);
			
		}
		
export function PiercingDamage(npc:Npc, player:Player):void
		{
            let damage = npc.getValueAttack();
            
            if(player.haveBm(BM_NAME.EVASION))
            {
                npc.updateBM(BM_NAME.EVASION, "evasion", -1);
            }
            else {
                player.getHit(damage);
                if(npc.haveBm(BM_NAME.TREACHEROUS_ATTACK))
                {
                    var bm:Bm = new Bm();
                    bm.init(BM_NAME.BLEED, npc.getBmByName(BM_NAME.TREACHEROUS_ATTACK).getBonus("bleed"));
                    player.addBm(bm);
                }    
            }
		}	