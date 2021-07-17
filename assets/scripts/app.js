//.........set user/computer values for the game
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 50;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

//.........global constants for storing string values(identifiers)for the game
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK ';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';



let battleLog = [];//..variable containing emtpy array for writeBattlelog function
let lastLoggedEntry;//....variable to keep track of last event logged for battleLog


//....function which allows players to select the amount of health they would 
//....like to us in the game
function getMaxlifeValues() {
  const enteredValue = prompt('maxium life choose', '100');//..enter value into prompt

  const parsedValue = parseInt(enteredValue);//..convert input string to number

  if (isNaN(parsedValue) || chosenMaxLife <= 0) {
    throw { message: 'error message' };//...throw error message if not a number or -0 value
  }
  return parsedValue;
}

let chosenMaxLife;
try{//...try-catch created to catch any error with input value
  chosenMaxLife = getMaxlifeValues()
}catch(error){
  console.log(error);
  chosenMaxLife = 100
  alert('value must be a number')
}


let currentMosterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);


//....function to creates conditional battlelog which contain internal data and events for the game
//....switch-case statement used to collected needed data, 
function writeBattleLog(event, value, monsterHealth, playerHealth) {
 
      let logEntry = {//..populate logEntry object with game data

        event: event,
        value: value,  
        finalmonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      }

switch(event){
  case LOG_EVENT_PLAYER_ATTACK:
    logEntry.target = 'MONSTER';
    break;
   case LOG_EVENT_PLAYER_STONG_ATTACK:
    logEntry = {
      event: event,
      value: value,
      target: 'MONSTER',
      finalmonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
    break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: 'PLAYER',
        finalmonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      case  LOG_EVENT_PLAYER_HEAL:
        logEntry = {
          event: event,
          value: value,
          target: 'PLAYER',
          finalmonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth,
        };
    break;
      case LOG_EVENT_GAME_OVER:
        logEntry = {
          event: event,
          value: value,
    
          finalmonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth,
        }
        break;
        default:
          logEntry = {}
}

  battleLog.push(logEntry);//..push log entry data onto battleLog array
}


//....reset the game and health bars when ever game is over
function reset() {
  currentMosterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);//..reset() called in vender js
}


//....main game logic, compare health, determine winner

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);//..call function in vnder js
  currentPlayerHealth -= playerDamage;
  writeBattleLog(//..call writeBattleLog function,send data
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMosterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {//...activate bonus life if available
    hasBonusLife = false;
    removeBonusLife();//...call function in vender.js
    currentPlayerHealth = initialPlayerHealth;
    alert('bonus life worked');
    setPlayerHealth(initialPlayerHealth);//...update player health in vender js
  }

  if (currentMosterHealth <= 0 && currentPlayerHealth > 0) {//..player win
    alert('You won!');
    writeBattleLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER ONE WON',
      currentMosterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMosterHealth > 0) {//..monster win
    alert('You lost!');
    writeBattleLog(
      LOG_EVENT_GAME_OVER,
      'MONSTER WON',
      currentMosterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMosterHealth <= 0) {//..draw
    alert('You have a draw!');
    writeBattleLog(
      LOG_EVENT_GAME_OVER,
      'DRAW',
      currentMosterHealth,
      currentPlayerHealth
    );
  }
  if (currentMosterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();//....call reset function for new game
  }
}

//....function which deals players damage to monster
function attackMonster(mode) {

  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE ;

  const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK: LOG_EVENT_PLAYER_STONG_ATTACK ;

  const damage = dealMonsterDamage(maxDamage);//..call function in vender js
  currentMosterHealth -= damage;
  writeBattleLog(logEvent, damage, currentMosterHealth, currentPlayerHealth);//..call writeBattleLog function,send data
  endRound();
}

//....trigger attack button to deal damage to monster, calls attackMonster function
function attackHandler() {
  attackMonster(MODE_ATTACK);
  endRound();
}

//....trigger strong attack button to deal damage to monster, calls attackMonster function
//....applies MODE_STRONG_ATTACK higher value
function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}


//....heal player function, adds heal value(set with const HEAL_VALUE) to players health
//....when heal button is triggered
function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);//....call function in vender.js
  currentPlayerHealth += healValue;
  writeBattleLog(//....send data/info to internal battle log
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMosterHealth,
    currentPlayerHealth
  );
}

//....prints data from writeBattleLog function with all input data and info,which is visiable in dev tools
//....loop through data stored in battlelog array on event by event basis
function printLogHandler() {

  let i = 0;//....
  for (const logEntry of battleLog) {
    if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {//...if statement uses variable lastLoggedEntry to create log event by event(when show log is pressed)
                                                                             //...allowing access to for in loop
      console.log(`$${i}`);//....position of log entry
      for (const key in logEntry) {//...for in loop used to loop through the logEntry object
        console.log(`${key} => ${logEntry[key]}`);//...output readable string of the data for each log entry
      }
      lastLoggedEntry = i;//..increment lastLogged entry by one to log event by event
      
        break;  //...use break to exit loop on last entry 
    }
    i++;//...incrememt i by one to count the position of each log entry
  
  }
}


attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);


