package 
{
	import Anim.*
	
	import DB.*
	import Display.BattleField_Display;
	import flash.events.EventDispatcher;
	import flash.display.Sprite;
	import Display.Dungeon_Display;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	import flash.text.TextFormat;
	
	/**
	 * ...
	 * @author Aurélien
	 */
	public class InterAction extends Sprite
	{
		
		
		private var _dataGame:DataGame;
		private var _activePlayer:Player;
		private var _player:Array;
		private var _npc:Array;
		private var _action:String;
		private var _param:Array;
		private var _actionParam:Array;
		private var _animation:Array;
	
		//private var _resultText:String; 
		
		private var _battleField:BattleField_Display;
		
		
		public function InterAction(data:DataGame, battle:BattleField_Display)
		{
			
			_dataGame = data;
			_battleField = battle;
		}
	
		public function init(battle:BattleField_Display):void
		{
			_player = new Array();
			_npc = new Array();
			_param = new Array();
			_action = "";
			_param["drop"] = 0;
			_param["target_dead"] = 0;
			_param["attacker_damage"] = 0;
			_activePlayer = _dataGame.getActivePlayer();
			setBattle(battle);
			
		}
	
		
		
		public function setActivePlayer(p:Player):void
		{
			_activePlayer = p;
		}
	
		public function setAction(str:String):void
		{
			_action = str;
		}
	
		public function setBattle(battle:BattleField_Display):void
		{
			_battleField = battle;
		}
		
		public function getAction():String 
		{
			return _action;
		}
	
		public function getBattleField():BattleField_Display 
		{
			return _battleField;
		}
	
		public function getResult():Array 
		{
			return _param;
		}
	
		public function resetParam():void
		{
			_param["attacker_hp"] = 0;
			_param["player_dead"] = 0;
		}
		
		public function addPlayer(p:Player):void
		{
			_player.push(p);
			checkExecuteAction();
		
		}
		
		public function addNpc(n:DBNpc):void
		{ 
			if (n.getTable("currhp") != 0)
			{
				_npc.push(n);
				checkExecuteAction();
			}
		}
		public function checkExecuteAction():void
		{
			_activePlayer = _dataGame.getActivePlayer();
			Dungeon_Display(parent).refreshActionBar();
			if (_action != "")
				executeAction();
		}
		
		public function waitingFor():String 
		{
			_activePlayer = _dataGame.getActivePlayer();
			if (_action == "attack")
				return "foe";
			
			if (_action == "shield")
			 return "self";
			
			if(_action != "")
			{
				
				
				return _activePlayer.getAction(_activePlayer.getThisAction(_action))[1].getBasicTable("target");
			}
			
			return "nothing";
		}
		
		public function testConditionActionWithEnemyTarget():Boolean
		{
			_param["player_name"] = _activePlayer.getTable("name");
			var range:int;
			var ap:int;
			var format:TextFormat = new TextFormat();
				var sp:MySprite;
			var animation:TextLift_Anim;
			
			if (_action == "attack")
				ap = 1;
			else
			{
				var num_Action:int = _activePlayer.getThisAction(_action);
				if (num_Action != -1)
					ap = _activePlayer.getParam(getAction(), "ap");
					
			}
			
			
		    //Test 1 : le joueur possède l'action
			if (num_Action == -1 && _action != "attack")
			{
				
				_param["action"] = Constant.ACTION_NOT_KNOWN;
				dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
				return false;
			}
		
			//Test 2 : assez de PA
			if (_activePlayer.getTable("ap") < ap)
			{
				_param["action"] = Constant.ACTION_NOT_ENOUGH_AP;
				dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
				format.size = 24;
				format.font="Chiller";
				format.color = Constant.COLOR_HIT;
				sp = _battleField.getPj(_dataGame.getTeamPlayerById( _activePlayer.getTable("id")));
				animation = new TextLift_Anim(sp.parent.parent.x+sp.x, sp.parent.parent.y+sp.y,"Not enough AP !",format, null, 3, -40); 
				addChild(animation);
				//animation.pushSound(_dataGame.getSound(15));
				animation.play();
				return false;
				
			}
			
			if (_battleField.getProvocation() != null)
			{
				if (_npc[0].getTable("id") != _battleField.getProvocation().getTable("id"))
				{
					_param["action"] = Constant.ACTION_NOT_ENOUGH_AP;
					dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
					format.size = 24;
					format.font="Chiller";
					format.color = Constant.COLOR_HIT;
					sp = _battleField.getPj(_dataGame.getTeamPlayerById( _activePlayer.getTable("id")));
					animation = new TextLift_Anim(sp.parent.parent.x+sp.x, sp.parent.parent.y+sp.y,"Cannot reach this target !",  format,null,3, -40); 
					addChild(animation);
					//animation.pushSound(_dataGame.getSound(15));
					animation.play();
					return false;
				}
			}
			
			return true;
			
		}
		
		public function testConditionActionWithAllyTarget():Boolean
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
				var format:TextFormat = new TextFormat();
					var sp:MySprite;
			var animation:TextLift_Anim;
		
			if (num_Action != -1)
				var ap:int = _activePlayer.getParam(getAction(), "ap");
			else
			{
				_param["action"] = Constant.ACTION_NOT_KNOWN;
				dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
				return false;
			}
			
			//Test 2 : assez de PA
			if (_activePlayer.getTable("ap") < ap)
			{
				_param["action"] = Constant.ACTION_NOT_ENOUGH_AP;
				format.size = 24;
				format.font="Chiller";
				format.color = Constant.COLOR_HIT;
				sp = _battleField.getPj(_dataGame.getTeamPlayerById( _activePlayer.getTable("id")));
				animation = new TextLift_Anim(sp.parent.parent.x + sp.x, sp.parent.parent.y + sp.y,"Not enough AP !", format,null,3, -40); 
				addChild(animation);
				animation.play();
				dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
				return false;
				
			}
			return true;
			
		}
		
		public function testConditionActionWithSelfTarget():Boolean
		{
			_param["player_name"] = _activePlayer.getTable("name");

			var format:TextFormat = new TextFormat();
			var sp:MySprite;
			var animation:TextLift_Anim;
			var ap:int = 1;
			var num_Action:int = _activePlayer.getThisAction(_action);
			
			if (num_Action != -1)
				ap = _activePlayer.getParam(getAction(), "ap");
			
			else if(_action != "shield")
			{
				_param["action"] = Constant.ACTION_NOT_KNOWN;
				dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
				return false;
			}
		
			
			//Test 2 : assez de PA
			if (_activePlayer.getTable("ap") < ap)
			{
				_param["action"] = Constant.ACTION_NOT_ENOUGH_AP;
				dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
				format.size = 24;
				format.font="Chiller";
				format.color = Constant.COLOR_HIT;
				sp = _battleField.getPj(_dataGame.getTeamPlayerById( _activePlayer.getTable("id")));
				animation = new TextLift_Anim(sp.parent.parent.x + sp.x, sp.parent.parent.y + sp.y,"Not enough AP !", format,null,3, -40); 
				addChild(animation);
				//animation.pushSound(_dataGame.getSound(15));
				animation.play();
				return false;
			}
				
			return true;
			
		}
		
		public function executeAction():void
		{
			trace("excuteAction", _action);
			_animation = new Array();
			
			
			_param["pc"] = 1;
			if (_action == "attack")
			{
				if (testConditionActionWithEnemyTarget())
						attack();
			}
			else if (_action == "shield")
			{
				if (testConditionActionWithSelfTarget())
						shield();
			}
			else
			{
				var num_Action:int = _activePlayer.getThisAction(_action);
				if (num_Action == -1)
				{
					_param["action"] = Constant.ACTION_NOT_KNOWN;
					dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
				}
				else if (_activePlayer.getAction(num_Action)[0] == "ability")
				{
					switch(_activePlayer.getAction(num_Action)[1].getTable("id_BasicAbility"))
					{
				  		case 1 :   
						if (testConditionActionWithEnemyTarget())
							brutalBlow();
						break;
				
						case 2 :
						if (testConditionActionWithEnemyTarget())
							twirl();
						break;
						
						case 3 :   
						if (testConditionActionWithSelfTarget())
							athlanShield();
						break;
						
						case 4 :
					    if (testConditionActionWithSelfTarget())
							skinOfRock(); 
						break;
						
						case 5 :
						if (testConditionActionWithEnemyTarget())
							powerfulAttack(); 
						break;
						
						case 6 :
					    if (testConditionActionWithEnemyTarget())
							deepThrust(); 
						break;
						case 7 :
						if (testConditionActionWithSelfTarget())
							reflexGuard();
						break;
						case 8 : 
						if (testConditionActionWithSelfTarget())
							autoRegeneration();
						break;
						case 9:
						if (testConditionActionWithEnemyTarget())
							parry();
						break;
						
						default : 	dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
						_param["action"] = "unknown action";  break
					}
				}
				else if(_activePlayer.getAction(num_Action)[0] == "spell")
				{
					
					switch(_activePlayer.getAction(num_Action)[1].getTable("id_BasicSpell"))
					{
				 		case 1 :
							if (testConditionActionWithAllyTarget())
								tearsOfLife(); 
						break;
						case 2 :
							  if (testConditionActionWithEnemyTarget())
									curseOfArcxos(); 
							break;
						case 3 :
							if (testConditionActionWithAllyTarget())
								wingsOfAnger(); 
							break;
						case 4 :
							if (testConditionActionWithAllyTarget())
								fireBarrier();
							break;
						case 5 :
							if (testConditionActionWithAllyTarget())
								armorOfAthlan(); 
							break;
						case 6 :
							if (testConditionActionWithAllyTarget())
								regeneration(); 
							break;
						case 7 :
							if (testConditionActionWithEnemyTarget())
								fireball(); 
							break;
						case 8 :
							if (testConditionActionWithAllyTarget())
								athlanBlow(); 
							break;
						case 9 :
							if (testConditionActionWithAllyTarget())
								leithanProtection(); 
							break;
						case 10 :
							if (testConditionActionWithAllyTarget())
								shieldOfAthlan(); 
							break;
						case 11 :
							if (testConditionActionWithEnemyTarget())
								darkBeam(); 
							break;
						case 12 :
							if (testConditionActionWithAllyTarget())
								enchantLife(); 
							break;
						default : 	dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
								_param["action"] = "unknown action";  break
					}
				}
				else
				{
					switch(_activePlayer.getAction(num_Action)[1].getTable("id_BasicTalent"))
					{
				 		case 1 :
							if (testConditionActionWithEnemyTarget())
									provocation(); 
						break;
						case 2 :
							  if (testConditionActionWithEnemyTarget())
									bucklerHit(); 
							break;
						case 3 :
							if (testConditionActionWithSelfTarget())
								shieldExpert();
							break;
						case 4 :
							if (testConditionActionWithSelfTarget())
								guardianConcentration();
							break;
						case 5 :
							if (testConditionActionWithEnemyTarget())
								shatteredCurse();
							break;
						case 6 :
							if (testConditionActionWithEnemyTarget())
								exposedCurse();
							break;
								break;
						case 7 :
							if (testConditionActionWithSelfTarget())
								rage();
							break;	
						case 8 :
							if (testConditionActionWithSelfTarget())
								holyTouch();
							break;	
						case 9 :
							if (testConditionActionWithAllyTarget())
								sun();
							break;	
						default : 	dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
								_param["action"] = "unknown action";  break
					}
				}
			
			}
			endAction();
			
		}
		
		public function npcKilled():void
		{
			trace("hip");
			var timer:Timer;
			var npc:DBNpc;
			//var max:int = 
			for (var i:int = 0; i < _battleField.getNBMonster(); i++)
			{
				npc = _battleField.getOpponent()[i];
				if (npc.getTable("currhp") == 0)
				{
					
					//_dataGame.dealXP(npc.getTable("level"));
								
					//Récupération du drop
					var basicRace:DBBasicRace = _dataGame.getFromID("basicRace", npc.getTable("id_BasicRace"));
					if (basicRace.getTable("drop") != 0)
					{
						var equipment:DBEquipment = new DBEquipment(_dataGame, basicRace.getTable("drop"));
						var result:Array = _activePlayer.isDropPossible(equipment);
						if(result != null)
						{
							_param["drop"] = 1;
							_dataGame.insertEquipment(equipment);
							_param["equipment_name"] = equipment.getTable("name");
							_param["inventory"] = result[0];
							_activePlayer.outsideObjectToInventory(equipment, result);
						}
					}
			
					
					//Suppression du npc
					_battleField.removeNpc(i);
					i--;
					_dataGame.removeNpc(npc.getTable("id"));
				
			
					//Room clear si plus de npc dans l'aire
					if (_battleField.getNBMonster() == 0)
					{
						Dungeon_Display(parent).hideNextTurnButton();
						timer = new Timer(800, 1);
						timer.addEventListener(TimerEvent.TIMER, roomClear);
						timer.start();
					}
				   
				}
			}
		}
		
		
		
		public function roomClear(e:TimerEvent):void
		{
			dispatchEvent(new MyEvent(MyEvent.INTERACTION_MISSION_COMPLETE));
		}
		
		public function bonusXP(e:TimerEvent):void
		{
			
			_param["bonus_xp"] = 10;
			_activePlayer.add("xp", 10, _dataGame);
			
			_param["action"] = Constant.FIRST_KILL_BONUS;
			dispatchEvent(new MyEvent(MyEvent.INTERACTION_TEXT));
			
			
		}
		
	
			
		public function endAction(e:TimerEvent=null):void
		{
			
			_player = new Array();
			_npc = new Array();
			_param = new Array();
			resetParam();
			
		}
	
			
		public function spikePassive():void
		{
			_param["player_dead"] = 0;
			var enchant:int = _npc[0].getThisEnchantment(Constant.BM_SPIKE);
			_param["attacker_hp"] = 0; 
			var animParam:Array = new Array();
			
			if (enchant != -1 )
			{
				var bm:BM = _npc[0].getEnchantment(enchant);
				
				animParam["shieldStart"] = _activePlayer.getFight("shield");
				animParam["hpStart"] = _activePlayer.getTable("currhp");
				
				_param["attacker_damage"] = bm.getTable("hp");
				_param["attacker_hp"] = Math.max(0, _param["attacker_damage"] -_activePlayer.getFight("shield"));
				
				if (_param["attacker_hp"] > 0)
				{
					 _activePlayer.setEnchantmentValue(Constant.BM_SHIELD, 0, _dataGame);
					if(_activePlayer.getTable("currhp") > _param["attacker_hp"])
						_activePlayer.getHit(-_param["attacker_hp"], _dataGame);
					else
					{
						_param["player_dead"] = 1;
						animParam["result"] = "dead";
						_activePlayer.setTable("currhp", 0);
					}
					
					animParam["result"] = "hit";
					animParam["hp"] = _param["attacker_hp"];
					
				}
				else	
				{	
					animParam["result"] = "blocked";
					_activePlayer.incEnchantmentValue(Constant.BM_SHIELD, -_param["attacker_damage"], _dataGame);
				}
				 
				animParam["shieldEnd"] = _activePlayer.getFight("shield");
				animParam["hpEnd"] = _activePlayer.getTable("currhp");
				
				 //Animation
				 _animation.push(new Array("shieldChanging",  _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), animParam, 2));
				 _animation.push(new Array("hpChanging", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  animParam, 2));
				 _animation.push(new Array("textLift",  _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  animParam, 2));
				
			}
		}
		
		
		/* ***************************************************************** LES ACTIONS DE BASE *************************************************************** */
		
		public function attack():void
		{
			//Init
			_param["action"] = "pj_attack";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _npc[0].getTable("racename");
			_param["target_dead"] = 0;
			
			_param["hp"] = 0;
			_param["sound"] = null;
			_param["hpStart"] = _npc[0].getTable("currhp"); 
			_param["shieldStart"] = _npc[0].getFight("shield");
			//Execution
			_activePlayer.add("ap", -1);
			
			if (_npc[0].getFight("evasion") != 0)
			{
				_param["result"] = "dodged";
				_animation.push(new Array("removeBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), _npc[0].getEnchantment(_npc[0].getThisEnchantment(Constant.BM_EVASION)), 3));
				_npc[0].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
				_animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
			}
			else
			{
				spikePassive();
				_param["hpStart"] = _npc[0].getTable("currhp"); 
				_param["shieldStart"] = _npc[0].getFight("shield");
				if (_param["player_dead"] == 0)
				{
					_param["damage"] = 5 + _activePlayer.getFight("strength");
					if (_npc[0].haveEnchantment(Constant.BM_EXPOSED_CURSE))
						_param["damage"] = int(1.5 * _param["damage"]);
					
					_param["hp"] = Math.max(0,  _param["damage"] - _npc[0].getFight("shield"));
					if (_param["hp"] > 0)
					{
						if (_npc[0].getTable("currhp") - _param["hp"] <= 0)
						{
							_param["result"] = "dead";
							_npc[0].setTable("currhp", 0);
						}
						else
						{
							_npc[0].add("currhp", -_param["hp"]);
							_npc[0].setEnchantmentValue(Constant.BM_SHIELD, 0, _dataGame);
							_param["result"] = "hit";
						}
					}
					else
					{
						_param["result"] = "blocked";
						_npc[0].incEnchantmentValue(Constant.BM_SHIELD, -_param["damage"], _dataGame);
					}
				
					_param["hpEnd"] = _npc[0].getTable("currhp"); 
					_param["shieldEnd"] = _npc[0].getFight("shield");
					_animation.push(new Array("hpChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
					_animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
				}
			}
			
			
			
		
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("shieldChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")), _param, 3));
			
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function shield():void
		{
			//Init
			_param["action"] = "pj_shield";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["result"] = "buff";
			_param["defense_bonus"] = (3 + _activePlayer.getFight("constitution"));
			_param["str"] = "+" + _param["defense_bonus"] + " shield";
			_param["shieldStart"] = _activePlayer.getFight("shield");
			
			//Execution
			_activePlayer.add("ap", -1);
			_activePlayer.incEnchantmentValue(Constant.BM_SHIELD, _param["defense_bonus"], _dataGame);
			_param["shieldEnd"] = _activePlayer.getFight("shield");
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("shieldChanging", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 2));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		
		/* ***************************************************************** Les COMPetences ***************************************************************** */
		public function brutalBlow():void
		{
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "pj_attack";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _npc[0].getTable("racename");
			_param["damage"] = 11 + 3 * _activePlayer.getFight("strength");
			_param["hpStart"] = _npc[0].getTable("currhp"); 
			_param["shieldStart"] = _npc[0].getFight("shield");
			
			if (_npc[0].haveEnchantment(Constant.BM_EXPOSED_CURSE))
				_param["damage"] = int(1.5 * _param["damage"]);
			_param["target_dead"] = 0;
			_param["hp"] = 0;
			if (_npc[0].getFight("evasion") != 0)
			{
				_param["result"] = "dodged";
				_animation.push(new Array("removeBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), _npc[0].getEnchantment(_npc[0].getThisEnchantment(Constant.BM_EVASION)), 3));
				_npc[0].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
			}
			else
			{
				spikePassive();
				if (_param["player_dead"] == 0)
				{
					_param["hpStart"] = _npc[0].getTable("currhp"); 
					_param["shieldStart"] = _npc[0].getFight("shield");
					if (_param["damage"] - _npc[0].getFight("shield") > 0)
					{

						_param["hp"] = _param["damage"]- _npc[0].getFight("shield");
						if (_npc[0].getTable("currhp") - _param["hp"] <= 0)
						{
							_param["target_dead"] = 1;
							_param["result"] = "dead";
							_npc[0].setTable("currhp", 0);
						}
						else
						{
							_param["result"] = "hit";
							_npc[0].add("currhp", -_param["hp"]);
							_npc[0].setEnchantmentValue(Constant.BM_SHIELD, 0, _dataGame);
						}
					}
					else
					{
						_param["block"] = 1;
						_param["result"] = "blocked";
						_npc[0].incEnchantmentValue(Constant.BM_SHIELD, -_param["damage"], _dataGame);
					}
					
					_param["hpEnd"] = _npc[0].getTable("currhp"); 
					_param["shieldEnd"] = _npc[0].getFight("shield");
					_animation.push(new Array("hpChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
					_animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
					
				}
			}
		
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("shieldChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")), _param, 3));
		
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
			
		public function athlanShield():void
		{
			
			//Init	
			_param["result"] = "buff";
			_param["action"] = "pj_shield";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["defense_bonus"] = (7 + 3*_activePlayer.getFight("constitution"));
			_param["str"] = "+" + _param["defense_bonus"] + " shield";
			_param["shieldStart"] = _activePlayer.getFight("shield");
			
			//Execution
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_activePlayer.incEnchantmentValue(Constant.BM_SHIELD, _param["defense_bonus"], _dataGame);
		
			_param["shieldEnd"] = _activePlayer.getFight("shield");
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("shieldChanging", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 2));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function parry():void
		{
			var animParam:Array = new Array();
			//Init Damage
			_param["damage"] = 3 + _activePlayer.getFight("strength");
			if (_npc[0].haveEnchantment(Constant.BM_EXPOSED_CURSE))
				_param["damage"] = int(1.5 * _param["damage"]);
			
			//Init Shield
			_param["player_shield1"] = _activePlayer.getFight("shield"); 
			_param["shield"] = 1 + _activePlayer.getFight("constitution");
			_param["shieldStart"] = _activePlayer.getFight("shield"); 
			animParam["shieldStart"] = _npc[0].getFight("shield");
			animParam["hpStart"] = _npc[0].getTable("currhp");
			
			//Phase 1
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_activePlayer.incEnchantmentValue(Constant.BM_SHIELD, _param["shield"], _dataGame);
			_param["shieldEnd"] = _activePlayer.getFight("shield"); 
			_param["currhp"] = _npc[0].getTable("currhp");
			animParam["str"] = "+" + _param["shield"] + " shield";
			animParam["result"] = "buff";
			
			
			
			_param["target_dead"] = 0;
			_param["hp"] = 0;
			
			var paramAnimation:Array = new Array();
			paramAnimation["result"] = "buff";
			paramAnimation["str"] = "+"+_param["shield"]+" shield";
			
			
			
			if (_npc[0].getFight("evasion") != 0)
			{
				_param["result"] = "dodged";
				_npc[0].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
			}
			else
			{
				spikePassive();
				if (_param["damage"] - _npc[0].getFight("shield") > 0)
				{
					_param["hp"] = _param["damage"]- _npc[0].getFight("shield");
					if (_npc[0].getTable("currhp") - _param["hp"] <= 0)
					{
						_param["target_dead"] = 1;
						_param["result"] = "dead";
						_npc[0].setTable("currhp", 0);
				
					}
					else
					{
						_npc[0].add("currhp", -_param["hp"]);
						_npc[0].setEnchantmentValue(Constant.BM_SHIELD, 0, _dataGame);
						_param["result"] = "hit";
					}
				}
				else
				{
					 _param["result"] = "blocked";
					 _npc[0].incEnchantmentValue(Constant.BM_SHIELD, -_param["damage"], _dataGame);
				}
			}
			
			animParam["shieldEnd"] = _npc[0].getFight("shield");
			animParam["hpEnd"] = _npc[0].getTable("currhp");
			
			//Animation
			_animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			_animation.push(new Array("shieldChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")), animParam, 3));
			_animation.push(new Array("hpChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  animParam, 3));
			_animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
		
			 _animation.push(new Array("shieldChanging", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  animParam, 1));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function skinOfRock():void
		{
			
			var num_Action:int = _activePlayer.getThisAction(_action);
			var ability:DBAbility = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			
			_param["action"] = "skin of rock";
			_param["armor_bonus"] = 2 + _activePlayer.getFight("constitution");
			_param["str"] = "+" + _param["armor_bonus"] + " armor";
			_param["result"] = "buff";
		
			
			var bm:BM = new BM();
			bm.setTable("category", "enchantment");
			bm.setTable("display", 1);
			bm.setTable("type", 0);
			bm.setTable("num_Image", 15);
			bm.setTable("main_effect", "armor");
			bm.setTable("alignment", 1);
			bm.setTable("armor", _param["armor_bonus"]); 
			bm.setTable("name", Constant.BM_SKIN);
			bm.setTable("life", ability.getTable("duration"));
			_activePlayer.operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
		
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_activePlayer.getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function reflexGuard():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var ability:DBAbility = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "skin of rock";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["armor_bonus"] = 2 + _activePlayer.getFight("constitution");
			_param["result"] = "buff";
			_param["str"] = "+" + _param["armor_bonus"] + "shield reflex";
			var bm:BM = new BM();
			bm.setTable("category", "enchantment");
			bm.setTable("display", 1);
			bm.setTable("type", 0);
			bm.setTable("num_Image", 8);
			bm.setTable("alignment", 1);
			bm.setTable("main_effect", "shield_reflex");
			bm.setTable("shield_reflex", _param["armor_bonus"]); 
			bm.setTable("name", Constant.BM_SHIELD_REFLEX);
			bm.setTable("life", ability.getTable("duration"));
			
			
			_activePlayer.operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_activePlayer.getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function autoRegeneration():void
		{
			
			_param["hpStart"] = _activePlayer.getTable("currhp"); 
			
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "auto regeneration";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["hpEnd"] = _activePlayer.getTable("currhp");
			_param["result"] = "heal";
			_param["diff"] = Math.max(0, 10 + _activePlayer.getFight("constitution") * 6 - _activePlayer.getTable("currhp"));
			_param["hp_restored"] = _activePlayer.getHealed(_param["diff"]);
			//_param["str"] = "+" + _param["hp"] + "hp";
			_param["hpEnd"] = _activePlayer.getTable("currhp"); 
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("hpChanging", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 3));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 3));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function deepThrust():void
		{
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "pj_attack";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _npc[0].getTable("racename");
			_param["shield"] = _npc[0].getFight("shield");
			_param["currhp"] = _npc[0].getTable("currhp");
			_param["damage"] = 8;
				_param["hpStart"] = _npc[0].getTable("currhp"); 
			_param["shieldStart"] = _npc[0].getFight("shield");
			
			if (_npc[0].haveEnchantment(Constant.BM_EXPOSED_CURSE))
					_param["damage"] = int(1.5 * _param["damage"]);
			_param["target_dead"] = 0;
		
			if (_npc[0].getFight("evasion") != 0)
			{
				_param["result"] = "dodged";
				_npc[0].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
				_animation.push(new Array("removeBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), _npc[0].getEnchantment(_npc[0].getThisEnchantment(Constant.BM_EVASION)), 3));
			}
			else
			{
				spikePassive();
				_param["hpStart"] = _npc[0].getTable("currhp"); 
				_param["shieldStart"] = _npc[0].getFight("shield");
				if (_param["damage"] - _npc[0].getFight("shield") > 0)
				{
					_param["hp"] = _param["damage"]- _npc[0].getFight("shield");
					if (_npc[0].getTable("currhp") - _param["hp"] <= 0)
					{
						_param["target_dead"] = 1;
						_param["result"] = "dead";
						_npc[0].setTable("currhp", 0);
				
					}
					else
					{
						
						var bm:BM = new BM();
						bm.setTable("hp", -(_activePlayer.getFight("strength")+2));
						bm.setTable("life", _activePlayer.getFight("strength")+2);
						bm.setTable("display", 1);
						bm.setTable("name", Constant.BM_BLEED);
						bm.setTable("main_effect", "hp");
						bm.setTable("num_Image", 14);
						bm.setTable("category", "enchantment");
						bm.setTable("type", 1);
						_npc[0].operateEnchantment(bm,_dataGame, Constant.OPTION_ADD_ALL);		
						_npc[0].add("currhp", -_param["hp"]);
						_npc[0].setEnchantmentValue(Constant.BM_SHIELD, 0, _dataGame);
						_param["result"] = "hit";
						_animation.push(new Array("addBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), bm, 3));
					}
				}
				else
				{
					 _param["result"] = "blocked";
					 _npc[0].incEnchantmentValue(Constant.BM_SHIELD, -_param["damage"], _dataGame);
				}
			}
			
					_param["hpEnd"] = _npc[0].getTable("currhp"); 
			_param["shieldEnd"] = _npc[0].getFight("shield");
			
		
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("shieldChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")), _param, 3));
			 _animation.push(new Array("hpChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
			 _animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
			 _battleField.pushAnimation(_animation);
			 endAction();
		  
			
		}	
		
		public function twirl():void
		{
			
			
			var opp:Array = new Array();  
			var twirlparam:Array = new Array();
			for (var i:int = 0; i < _battleField.getNBMonster(); i++)
			{
			
				twirlparam[i] = new Array();
				opp[i] = _battleField.getNpc(i);
			}
			
			var npc:Array  = _battleField.getOpponent();
			if (_battleField.getProvocation() != null)
			{
				//opp = new Array();
				//opp.push(_battleField.getNpcDisplayByID(_npc[0].getTable("id")));
				npc = new Array();
				npc.push(_npc[0]);
			}
			
		 	_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "twirl";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["damage"] = 5 + _activePlayer.getFight("strength");
			_param["target_dead"] = 0;
			
				
			for (i =0; i < npc.length; i++)
			{
				twirlparam[i]["target_name"] = npc[i].getTable("racename");
				twirlparam[i]["hpStart"] = npc[i].getTable("currhp"); 
				twirlparam[i]["shieldStart"] = npc[i].getFight("shield");
				if (npc[i].getFight("evasion") != 0)
				{
				
					twirlparam[i]["result"] = "dodged";
					npc[i].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
					_animation.push(new Array("removeBm",_battleField.getNpcDisplayById(npc[i].getTable("id")), npc[i].getEnchantment(npc[i].getThisEnchantment(Constant.BM_EVASION)), 3));
				}
				else
				{
					twirlparam[i]["damage"] = _param["damage"];
					if (npc[i].haveEnchantment(Constant.BM_EXPOSED_CURSE))
						twirlparam[i]["damage"] = int(1.5 * _param["damage"]);
					
					if (twirlparam[i]["damage"] - npc[i].getFight("shield") > 0)
					{
						twirlparam[i]["hp"] = twirlparam[i]["damage"] - npc[i].getFight("shield");
						twirlparam[i]["result"] = "hit";
						if (npc[i].getTable("currhp") - twirlparam[i]["hp"] <= 0)
						{
							npc[i].setTable("currhp", 0);
							twirlparam[i]["target_dead"] = 1;
							_param["target_dead"]++;
							
							
						}
						else
						{
							npc[i].add("currhp", -twirlparam[i]["hp"]);
							npc[i].setEnchantmentValue(Constant.BM_SHIELD, 0, _dataGame);
							
							
						}
					}
					else
					{
						twirlparam[i]["result"] = "blocked";
						npc[i].incEnchantmentValue(Constant.BM_SHIELD, -twirlparam[i]["damage"], _dataGame);
					}
				}
				twirlparam[i]["hpEnd"] = npc[i].getTable("currhp"); 
				twirlparam[i]["shieldEnd"] = npc[i].getFight("shield");
				_animation.push(new Array("shieldChanging", _battleField.getNpcDisplayById(npc[i].getTable("id")), twirlparam[i], 3));
				_animation.push(new Array("hpChanging", _battleField.getNpcDisplayById(npc[i].getTable("id")),  twirlparam[i], 3));
				_animation.push(new Array("textLift", _battleField.getNpcDisplayById(npc[i].getTable("id")), twirlparam[i], 3));
				
			}
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			  _battleField.pushAnimation(_animation);
			 endAction();
			
			
			
			
			
			
		}
		
		public function powerfulAttack():void
		{
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "pj_powerfulAttack";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _npc[0].getTable("racename");
			_param["dodge"] = 0;
			_param["target_dead"] = 0;
			_param["damage"] = 2 + _activePlayer.getFight("strength");
		
			if (_npc[0].getFight("evasion") != 0)
			{
				_param["result"] = "dodged";
				_npc[0].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
				_animation.push(new Array("removeBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), _npc[0].getEnchantment(_npc[0].getThisEnchantment(Constant.BM_EVASION)), 3));
			}
			else
			{
				spikePassive();
				_param["armorStart"] = _npc[0].getTable("armor");
				
				
				_npc[0].setTable("armor", Math.max(0, _npc[0].getTable("armor") -_param["damage"]));
				_param["result"] = "debuff";
				_param["str"] = "-" + _param["damage"] + " armor";
				
				_param["armorEnd"] = _npc[0].getTable("armor");
				_animation.push(new Array("armorChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
				 
			}
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		/* ***************************************************************** Les Sortilèges ***************************************************************** */
	
		public function tearsOfLife():void
		{
		
			
			var num_Action:int = _activePlayer.getThisAction(_action);
			var spell:DBSpell = _activePlayer.getAction(num_Action)[1];
			
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
		
			_param["action"] = "tearsOfLife";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _player[0].getTable("name");
			_param["result"] = "heal";
			_param["hpStart"] = _player[0].getTable("currhp");
			_param["hp_restored"] = _player[0].getHealed(5 + 2 * _activePlayer.getFight("magicSkill"));
			_param["hpEnd"] = _player[0].getTable("currhp");
			//Animation
			
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("hpChanging", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 3));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 3));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function wingsOfAnger():void
		{
			
			
			var num_Action:int = _activePlayer.getThisAction(_action);
			
			var spell:DBSpell = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "wingsOfAnger";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _player[0].getTable("name");
			_param["strength_bonus"] = 1 + _activePlayer.getFight("magicSkill");
			_param["result"] = "buff";
			_param["str"] = "+" + _param["strength_bonus"] + "strength";
			
			
			var bm:BM = new BM();
			bm.setTable("id", _dataGame.getNewID("bm"));
			bm.setTable("name", Constant.BM_WINGS);
			bm.setTable("strength", _param["strength_bonus"]);
			bm.setTable("type", 0);
			bm.setTable("origin", "spell");
			bm.setTable("main_effect", "strength");
			bm.setTable("display", 3);
			bm.setTable("alignment", 1);
			bm.setTable("life", _activePlayer.getParam(getAction(), "duration"));
			bm.setTable("num_Image", 9);
			_param["life"] = spell.getAttWithBonus("duration");
			bm.setTable("category", "enchantment");
			_player[0].operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function armorOfAthlan():void
		{
			
			var num_Action:int = _activePlayer.getThisAction(_action);
			var ability:DBSpell = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "skin of rock";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["armor_bonus"] = 2 + _activePlayer.getFight("magicSkill");
			_param["result"] = "buff";
			_param["str"] = "+" + _param["armor_bonus"] + " armor";
			
			var bm:BM = new BM();
			bm.setTable("category", "enchantment");
			bm.setTable("display", 1);
			bm.setTable("type", 0);
			bm.setTable("num_Image", 10);
			bm.setTable("main_effect", "armor");
			bm.setTable("armor", _param["armor_bonus"]); 
			bm.setTable("name", Constant.BM_ARMOR);
			bm.setTable("life", ability.getTable("duration"));
			_player[0].operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function shieldOfAthlan():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var ability:DBSpell = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "shield of Athlan";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["shield_bonus"] = 5 + 2 * _activePlayer.getFight("magicSkill");
			_param["str"] = "+" + _param["shield_bonus"] + " shield";
			_param["result"] = "buff";
			_param["shieldStart"] = _player[0].getFight("shield");
			_player[0].incEnchantmentValue(Constant.BM_SHIELD, _param["shield_bonus"], _dataGame);
			_param["shieldEnd"] = _player[0].getFight("shield");
			
			 //Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("shieldChanging", _battleField.getPlayerDisplayById(_player[0].getTable("id")), _param, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function fireball():void
		{
			_param["hpStart"] = _npc[0].getTable("currhp"); 
			_param["shieldStart"] = _npc[0].getFight("shield");
			 
			
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "pj_fireball";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _npc[0].getTable("racename");
			_param["damage"] = 6;
			if (_npc[0].haveEnchantment(Constant.BM_EXPOSED_CURSE))
					_param["damage"] = int(1.5 * _param["damage"]);
			
			_param["target_dead"] = 0;
		
			if (_npc[0].getFight("evasion") != 0)
			{
				_param["result"] = "dodged";
				_npc[0].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
				_animation.push(new Array("removeBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), _npc[0].getEnchantment(_npc[0].getThisEnchantment(Constant.BM_EVASION)), 3));
			}
			else
			{
				if (_param["damage"] - _npc[0].getFight("shield") > 0)
				{
					_param["result"] = "hit";
					_param["hp"] = _param["damage"]- _npc[0].getFight("shield");
					if (_npc[0].getTable("currhp") - _param["hp"] <= 0)
					{
						_param["target_dead"] = 1;
						_npc[0].setTable("currhp", 0);
						
					}
					else
					{
						_npc[0].add("currhp", -_param["hp"]);
						_npc[0].setEnchantmentValue(Constant.BM_SHIELD, 0, _dataGame);
						var bm:BM = new BM();
						bm.setTable("id", _dataGame.getNewID("bm"));
						bm.setTable("name", Constant.BM_BURN);
						bm.setTable("origin", "spell");
						bm.setTable("hp", -(_activePlayer.getFight("magicSkill") + 1));
						bm.setTable("life", _activePlayer.getParam(getAction(), "duration"));
						bm.setTable("num_Image", 22);
						bm.setTable("category", "enchantment");
						bm.setTable("main_effect", "hp");
						bm.setTable("display", 1);
						bm.setTable("type", 1);
						_npc[0].incEnchantment(bm, _dataGame, 1);
						 _animation.push(new Array("addBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), bm, 3));
					
						
						
						_param["malus"] = -(_activePlayer.getFight("magicSkill") + 1);
						_param["life"] = bm.getTable("life");
						_param["success"] = 1;
					}
				}
				else
				{
					_param["result"] = "blocked";
					 _npc[0].incEnchantmentValue(Constant.BM_SHIELD, -_param["damage"], _dataGame);
				}
			}
			
			_param["hpEnd"] = _npc[0].getTable("currhp"); 
			_param["shieldEnd"] = _npc[0].getFight("shield");
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("hpChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
				_animation.push(new Array("shieldChanging", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
			 _animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function darkBeam():void
		{
			
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "pj_darkBeam";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _npc[0].getTable("racename");
			_param["result"] = "debuff";
			
			_param["target_dead"] = 0;
			_param["damage"] = 2 + _activePlayer.getFight("magicSkill");
			_param["str"] = "-" + _param["damage"] + " armor";
		
			if (_npc[0].getFight("evasion") != 0)
			{
				_param["dodge"] = 1;
				_npc[0].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
				_animation.push(new Array("removeBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), _npc[0].getEnchantment(_npc[0].getThisEnchantment(Constant.BM_EVASION)), 3));
			}
			else
			{
				_npc[0].setTable("armor", Math.max(0, _npc[0].getTable("armor") -_param["damage"]));
				_param["success"] = 1;
			}
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 3));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function regeneration():void
		{
			
			var num_Action:int = _activePlayer.getThisAction(_action);
			var spell:DBSpell = _activePlayer.getAction(num_Action)[1];
			
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			
			_param["action"] = "regeneration";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _player[0].getTable("name");
			_param["hp"] =  _activePlayer.getFight("magicSkill");
			_param["result"] = "buff";
			_param["str"] = "+" + _param["hp"] + " hp/turn";
			
			var bm:BM = new BM();
			bm.setTable("id", _dataGame.getNewID("bm"));
			bm.setTable("name", Constant.BM_REGEN);
			bm.setTable("origin", "spell");
			bm.setTable("life", _activePlayer.getParam(getAction(), "duration"));
			bm.setTable("num_Image", 17);
			bm.setTable("category", "enchantment");
			bm.setTable("display", 1);
			bm.setTable("type", 1);
			bm.setTable("alignment", 1);
			bm.setTable("hp", _param["hp"]);
			bm.setTable("main_effect", "hp");
			_player[0].operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			_param["life"] = bm.getTable("life");
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		
		}
		
		public function fireBarrier():void
		{
			
			var num_Action:int = _activePlayer.getThisAction(_action);
			var spell:DBSpell = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));	
			
			_param["action"] = "fireBarrier";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _player[0].getTable("name");
			_param["damage"] =  1 + _activePlayer.getFight("magicSkill");
			_param["result"] = "buff";
			_param["str"] = "Fire Barrier";
			
			var bm:BM = new BM();
			bm.setTable("id", _dataGame.getNewID("bm"));
			bm.setTable("name", spell.getTable("name"));
			bm.setTable("hp", _param["damage"]);
			bm.setTable("type", 2);
			bm.setTable("origin", "spell");
			bm.setTable("display", 1);
			bm.setTable("main_effect", "hp")
			bm.setTable("life", _activePlayer.getParam(getAction(), "duration"));
			bm.setTable("num_Image", 11);
			bm.setTable("alignment", 1);
			_param["life"] = _activePlayer.getParam(getAction(), "duration");
			bm.setTable("category", "enchantment");
			_player[0].operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			
				//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function enchantLife():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var spell:DBSpell = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));	
			
			_param["result"] = "buff";
			_param["life"] =  _activePlayer.getFight("magicSkill");
			_param["str"] = "Enchantment life +" + _param["life"];
			
			for (var i:int = 0; i < _player[0].getNBEnchantment(); i++)
			{
				_player[0].getEnchantment(i).getTable("aligment")
				if (_player[0].getEnchantment(i).getTable("alignment") == 1)
				{
					_player[0].getEnchantment(i).setTable("life", _player[0].getEnchantment(i).getTable("life") + _param["life"]);
					 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), _player[0].getEnchantment(i), 2));
				}
			}
		
			//Animation
			_battleField.getPlayerDisplayById(_player[0].getTable("id")).animTextLift(2, _param);
			_battleField.getPlayerDisplayById(_activePlayer.getTable("id")).animShake(1);
			_battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function athlanBlow():void
		{
			
			
			var num_Action:int = _activePlayer.getThisAction(_action);
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["bonus"] = 1 + _activePlayer.getFight("magicSkill");
			_param["result"] = "buff";
			_param["str"] = "Ailment -" + _param["bonus"];
		
			if(_player[0].haveEnchantment(Constant.BM_BLEED))
		    {
				_player[0].incEnchantmentValue(Constant.BM_BLEED, _param["bonus"], _dataGame);
				_animation.push(new Array("removeBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), _player[0].getEnchantment(_player[0].getThisEnchantment(Constant.BM_BLEED)), 2));
			}
			if(_player[0].haveEnchantment(Constant.BM_POISON))
		    {
				_player[0].incEnchantmentValue(Constant.BM_POISON, _param["bonus"], _dataGame);
				_animation.push(new Array("removeBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), _player[0].getEnchantment(_player[0].getThisEnchantment(Constant.BM_POISON)), 2));
			}
			if(_player[0].haveEnchantment(Constant.BM_BLIGHT))
		    {
				_player[0].incEnchantmentValue(Constant.BM_BLIGHT, _param["bonus"], _dataGame);
				_animation.push(new Array("removeBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), _player[0].getEnchantment(_player[0].getThisEnchantment(Constant.BM_BLIGHT)), 2));
			}
			if(_player[0].haveEnchantment(Constant.BM_BURN))
		    {
				_player[0].incEnchantmentValue(Constant.BM_BURN, _param["bonus"], _dataGame);
				_animation.push(new Array("removeBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), _player[0].getEnchantment(_player[0].getThisEnchantment(Constant.BM_BURN)), 2));
			}		
				
			
				//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}
		
		public function leithanProtection():void
		{
		
			var num_Action:int = _activePlayer.getThisAction(_action);
			
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "leithan protection";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["ward"] = 1 + _activePlayer.getFight("magicSkill");
			_param["result"] = "buff";
			_param["str"] = "+" + _param["ward"] + " ward";
			
			var bm:BM = new BM();
			bm.setTable("name", Constant.BM_WARD);
			bm.setTable("main_effect", "ward");
			bm.setTable("category", "enchantment");
			bm.setTable("display", 2);
			bm.setTable("type", 2);
			bm.setTable("ward", _param["ward"]);
			bm.setTable("num_Image", 28);
			bm.setTable("life", -1);
			
			_player[0].operateEnchantment(bm, _dataGame, Constant.OPTION_ADD);
		
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_player[0].getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function curseOfArcxos():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var spell:DBSpell = _activePlayer.getAction(num_Action)[1];
			
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			
			_param["action"] = "curse of Arcxos";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["result"] = "debuff";
			
			
				
			var bm:BM = new BM();
			bm.setTable("id", _dataGame.getNewID("bm"));
			bm.setTable("name", Constant.BM_ARCXOS);
			bm.setTable("origin", "spell");
			bm.setTable("life", _activePlayer.getParam(getAction(), "duration"));
			bm.setTable("num_Image", 18);
			bm.setTable("category", "enchantment");
			bm.setTable("display", 1);
			bm.setTable("type", 0);
			_param["malus"] = -(_activePlayer.getFight("magicSkill") + 1);
			bm.setTable("strength", _param["malus"]);
			bm.setTable("main_effect", "strength");
			_npc[0].replaceEnchantment(bm, _dataGame);
			
			_param["life"] = bm.getTable("life");
			_param["str"] = _param["malus"] + " strength";
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}
	
		
		
		/* ************************************************************************ LES TALENTS *************************************************** */
		
		public function provocation():void
		{
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "pj_provocation";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _npc[0].getTable("racename");
			_param["dodge"] = 0;
			_param["result"] = "debuff";
			_param["str"] = "provoked";
			
			if(_npc[0].getTable("id_Target") > 0)
				_npc[0].setTable("id_Target", _activePlayer.getTable("id"));
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();	
			
		}	
		
		public function bucklerHit():void
		{
			
			
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "pj_attack";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["target_name"] = _npc[0].getTable("racename");
			_param["damage"] = _activePlayer.getFight("shield");
			if (_npc[0].haveEnchantment(Constant.BM_EXPOSED_CURSE))
					_param["damage"] = int(1.5 * _param["damage"]);
			_param["target_dead"] = 0;
		
			if (_npc[0].getFight("evasion") != 0)
			{
				_param["dodge"] = 1;
				_npc[0].incEnchantmentValue(Constant.BM_EVASION, -1, _dataGame);
			}
			else
			{
				spikePassive();
				if (_param["damage"] - _npc[0].getFight("shield") > 0)
				{
					_param["hp"] = _param["damage"]- _npc[0].getFight("shield");
					if (_npc[0].getTable("currhp") - _param["hp"] <= 0)
					{
						_param["target_dead"] = 1;
						_npc[0].setTable("currhp", 0);
				
					}
					else
					{
						_npc[0].add("currhp", -_param["hp"]);
						_npc[0].setEnchantmentValue(Constant.BM_SHIELD, 0, _dataGame);
						_param["success"] = 1;
					}
				}
				else
				{
					 _param["block"] = 1;
					 _npc[0].incEnchantmentValue(Constant.BM_SHIELD, -_param["damage"], _dataGame);
				}
			}
			
			
			
		}	
		
		public function shieldExpert():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var talent:DBTalent = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "shield expert";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["result"] = "buff";
			_param["str"] = "Shield Expert";
		
			var bm:BM = new BM();
			bm.setTable("category", "enchantment");
			bm.setTable("display", 3);
			bm.setTable("type", 0);
			bm.setTable("num_Image", 21);
			//bm.setTable("main_effect", "shield_expert");
			bm.setTable("name", talent.getBasicTable("name"));
			bm.setTable("life", talent.getBasicTable("duration"));
			_activePlayer.operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_activePlayer.getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}	
		
		public function guardianConcentration():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var talent:DBTalent = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "shield expert";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["result"] = "buff";
			_param["str"] = "Guardian Concentration";
		
			var bm:BM = new BM();
			bm.setTable("category", "enchantment");
			bm.setTable("display", 2);
			bm.setTable("type", 0);
			bm.setTable("num_Image", 24);
			bm.setTable("main_effect", "constitution");
			bm.setTable("name", talent.getBasicTable("name"));
			bm.setTable("life", talent.getBasicTable("duration"));
			bm.setTable("constitution", 1);
			_param["main_effect"] = "Constitution";
			_param["bonus"] = 1;
			_activePlayer.operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_activePlayer.getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function warriorConcentration():void
		{
			var sp:MySprite = _battleField.getPj(_dataGame.getTeamPlayerById( _activePlayer.getTable("id")));
			var num_Action:int = _activePlayer.getThisAction(_action);
			var talent:DBTalent = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "Warrior Concentration";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["result"] = "buff";
			_param["str"] = "Guardian Concentration";
		
			var bm:BM = new BM();
			bm.setTable("category", "enchantment");
			bm.setTable("display", 2);
			bm.setTable("type", 0);
			bm.setTable("num_Image", 27);
			bm.setTable("main_effect", "strength");
			bm.setTable("name", talent.getBasicTable("name"));
			bm.setTable("life", talent.getBasicTable("duration"));
			bm.setTable("constitution", 1);
			_param["main_effect"] = "Strength";
			_param["bonus"] = 1;
			_activePlayer.operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
		
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_activePlayer.getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function MageConcentration():void
		{
		
			var num_Action:int = _activePlayer.getThisAction(_action);
			var talent:DBTalent = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "shield expert";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["result"] = "buff";
			_param["str"] = "Marge Concentration";
		
			var bm:BM = new BM();
			bm.setTable("category", "enchantment");
			bm.setTable("display", 2);
			bm.setTable("type", 0);
			bm.setTable("num_Image", 26);
			bm.setTable("main_effect", "magicSkill");
			bm.setTable("name", talent.getBasicTable("name"));
			bm.setTable("life", talent.getBasicTable("duration"));
			bm.setTable("magicSkill", 1);
			_param["main_effect"] = "MagicSkill";
			_param["bonus"] = 1;
			_activePlayer.operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_activePlayer.getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}	
		
		public function shatteredCurse():void
		{
				
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["result"] = "debuff";
			
			var bm:BM = new BM();
			bm.setTable("id", _dataGame.getNewID("bm"));
			bm.setTable("name", Constant.BM_SHATTERED_CURSE);
			bm.setTable("display", 3);
			bm.setTable("life", _activePlayer.getParam(getAction(), "duration"));
			bm.setTable("num_Image", 23);
			bm.setTable("category", "enchantment");
			bm.setTable("display", 3);
			bm.setTable("type", 0);
			_npc[0].replaceEnchantment(bm, _dataGame);
			_param["life"] = bm.getTable("life");
			
			_param["str"] = "Shattered";		
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
			
		}
		
		public function exposedCurse():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["result"] = "debuff";
			
			var bm:BM = new BM();
			bm.setTable("id", _dataGame.getNewID("bm"));
			bm.setTable("name", Constant.BM_EXPOSED_CURSE);
			bm.setTable("display", 3);
			bm.setTable("life", _activePlayer.getParam(getAction(), "duration"));
			bm.setTable("num_Image", 25);
			bm.setTable("category", "enchantment");
			bm.setTable("display", 3);
			bm.setTable("type", 0);
			_npc[0].incEnchantment(bm, _dataGame);
		
				//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getNpcDisplayById(_npc[0].getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getNpcDisplayById(_npc[0].getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		}
		
		public function rage():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var talent:DBTalent = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "rage";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["str"] = "+Rage";
			_param["result"] = "buff";
		
			var bm:BM = new BM();
			bm.setTable("category", "enchantment");
			bm.setTable("num_Image", 36);
			bm.setTable("display", 3);
			bm.setTable("type", 0);
			bm.setTable("main_effect", "strength");
			bm.setTable("name", talent.getBasicTable("name"));
			bm.setTable("life", talent.getBasicTable("duration"));
			_activePlayer.operateEnchantment(bm, _dataGame, Constant.OPTION_REPLACE);
			
			//Animation
			 _animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			 _animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")),  _param, 2));
			 _animation.push(new Array("addBm",_battleField.getPlayerDisplayById(_activePlayer.getTable("id")), bm, 2));
			 _battleField.pushAnimation(_animation);
			 endAction();
		
			
		}	
		
		public function holyTouch():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var talent:DBTalent = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "holy touch";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["str"] = "+ 1 ap";
			_param["result"] = "buff";
		
			if (_player[0].getTable("ap") == 3) 
				_param["str"] = "+ 0 ap";
			
			else
				_player[0].add("ap", 1);
					
			
			//Animation
			_animation.push(new Array("shake", _battleField.getPlayerDisplayById(_activePlayer.getTable("id")), _param, 1));
			_animation.push(new Array("textLift", _battleField.getPlayerDisplayById(_player[0].getTable("id")),  _param, 2));
			_battleField.pushAnimation(_animation);
			endAction();
			
		}	
		
		public function sun():void
		{
			var num_Action:int = _activePlayer.getThisAction(_action);
			var talent:DBTalent = _activePlayer.getAction(num_Action)[1];
			_activePlayer.add("ap", -_activePlayer.getParam(getAction(), "ap"));
			_param["action"] = "healing sun";
			_param["attacker_name"] = _activePlayer.getTable("name");
			_param["str"] = "Healing Sun";
			_param["result"] = "buff";
			var bm:BM;
			
			for (var i:int = 0; i < _dataGame.getTeamSize(); i++)
			{
				bm = new BM();
				bm.setTable("life",talent.getBasicTable("duration"));
				bm.setTable("display", 3);
				bm.setTable("name", Constant.BM_SUN);
				bm.setTable("num_Image", 37);
				bm.setTable("category", "enchantment");
				bm.setTable("type", 2);
				bm.setTable("alignment", 1);
				
				
			}

			
		}	
		
		
}
}