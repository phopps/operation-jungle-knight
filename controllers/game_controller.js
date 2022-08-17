// console.log("that which does the game logic.")

class GameController {
  constructor() {
    //TODO: do we even need to instantiate this? Can we just have everything static?
  }
  /**
   * First step combat handler.
   * @param {number} userid - userid whose game is being handled
   * @param {number} runid - run id currently being handled
   * @param {Object} turn_data - organized turn data containing the player's submitted Actions.
   * @param {number[]} turn_data.actions - software ids of actions being taken this turn.
   * 
   * @returns {Object} The turn's result, ordered to include player action results, and enemy responses.
   */
  handleCombat(userid, runid, turn_data) {
    console.log("static GameController.handleCombat");
    console.log("params: (userid="+userid+", runid="+runid+", turn_data="+turn_data);
    //get data for user and run, to make sure requested moves are valid
    // they can only take actions if they have the matching software for the id, and it is off cooldown
    // they also can't submit more actions than their maximum actions per turn.
    // either of those cases will return an error.

    // get user game session information from database

    this.validateTurnSubmission();

    let result_mock = {
      victory: true,
      gameover: false,
      defeat: false,
      actions: [ //'actions' is basically a script for the front-end to animate, so make sure to include all required bits there.
        {
          type: 'player_attack_1',
          skill_id: 1,
          target: 1, //NOTE: target is the position id of the affected enemy. 0 means 'no enemies' -1 means 'all enemies'
          damage: 5,
          defeated: false //did this attack destroy the enemy?
        },{
          type: 'enemy_attack_1',
          enemy_skill_id: 2,
          source: 1, //which enemy used the skill
          damage: 2,
          defeated: false //FIXME: do we want a distinct property name for player kill vs enemy kill?
        }
      ],
      next_turn: {
        player: {
          hp: 30,
          defense: 5,
          statuses: [], //both positive and negative.
          skills: [] //skill cooldown state.
        },
        enemies: [
          {
            id: 1,
            hp: 10,
            defense: 5,
            statuses: [],
            intent: "attack"
          }
        ]
      }
    }
    /*
    Order of operations! This is going to be critical. Make sure things happen in the same order
    every time. No race conditions!

    Also note that we should hold on to 'Victory' and 'Defeat' booleans that can be set by any of 
    these steps if we detect that the player should definitely win or lose. At that point, that
    becomes a hard override for any future actions. 'Defeat' skips everything else, and 'Victory'
    skips all 'negative' effects that don't carry over (heals should still take effect, etc).

    Abilities:
    1: player heals. Any restorative effects. This includes both HP and 'Defense'
    2: defensive abilities, any buffs and protections. This includes Connection and Obfuscation.
    3: mass attacks (things that target multiple/all enemies)
    4: single target attacks (things that target a single enemy)
    Status effects:
    5: beneficial effects on the player
    6: beneficial effects on enemies
    7: detrimental effects on enemies
    8: detrimental effects on players
    Enemy behavior:
    9: each enemy attack, in order from front to back. No randomness here! This is simply resolving intents.

    */
    this.handlePlayerHeals();
    this.handlePlayerDefense();
    this.handlePlayerAttacks();
    this.handleStatusEffects();
    this.handleEnemyAttacks();

    
    /**
     * Ability target keywords:
     * ALL
     * FRONT1
     * FRONT2, etc
     * BACK1
     * BACK2, etc
     * SELF
     * LOWEST
     * HIGHEST
     */
    
    /**
     * Ability effect keywords:
     * HEAL - heal player
     * DAMAGE - damage enemy
     * DEFEND - increase player defense
     */

    return result_mock;
  }

  validateTurnSubmission(){
    return false;
  }
  handlePlayerHeals(){
    return false;
  }
  handlePlayerDefense(){
    return false;
  }
  handlePlayerAttacks(){
    return false;
  }
  handleStatusEffects(){
    return false;
  }
  handleEnemyAttacks(){
    return false;
  }

  /**
   * Generate a list of valid Software item ids based on inputs
   * @param {String} seed hex value seed string
   * @param {Number} userid unique identifier of the user
   */
  generateSoftwareRewards(seed, userid) {
    //TODO: generate ids based on seed data and user data.
    let list = [1,4,6];

    return list;
  }

  /**
   * Generate a list of valid Hardware item ids based on inputs
   * @param {String} seed hex value seed string
   * @param {Number} userid unique identifier of the user
   */
  generateHardwareRewards(seed, userid) {
    //TODO: generate properly later.
    let list = [2,3,5];

    return list;
  }

  validateRewardSelection(seed, userid, rewardid) {
    //FIXME: actually validate
    return true
  }

  generateDefaultPlayer() {
    let playerObj = {
      current_hp: 50,
      max_hp: 50,
      current_defense: 0,
      connection: 1.0,
      obfuscation: 0,
      software_list:[{
        id: 1,
        cooldown:0
      }],
      hardware_list:[{
        id: 2
      }],
      statuses:[]
    }

    return playerObj;
  }

  initializePlayerForCombat(current_player) {
    //if new run, call generateDefaultPlayer, else
    if(!current_player) {
      return this.generateDefaultPlayer();
    } else {
      let initialized = current_player;
      initialized.statuses = [];
      for(let i=0; i<initialized.software_list.length; i++) {
        initialized.software_list[i].cooldown = 0
      }
      initialized.current_defense = 0;
      initialized.connection = 1.0;
      initialized.obfuscation = 0;

      //TODO: apply pre-combat relic effects

      return initialized
    }
  }
}

module.exports = GameController