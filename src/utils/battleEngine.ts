import type { Creature } from './creatureGenerator';

export type MoveType = 'basic' | 'special' | 'defend' | 'wild';

export interface Move {
  type: MoveType;
  label: string;
  description: string;
  icon: string;
}

export const PLAYER_MOVES: Move[] = [
  { type: 'basic', label: 'Basic Attack', description: 'Reliable medium damage', icon: 'sword' },
  { type: 'special', label: 'Special Ability', description: 'High damage unique move', icon: 'sparkles' },
  { type: 'defend', label: 'Defend', description: 'Reduce incoming damage by 50%', icon: 'shield' },
  { type: 'wild', label: 'Wild Strike', description: 'Random — huge hit or miss!', icon: 'dices' },
];

export interface Fighter {
  creature: Creature;
  hp: number;
  maxHp: number;
  isDefending: boolean;
  sp: number;
}

export interface TurnResult {
  playerMove: Move;
  cpuMove: Move;
  playerDamage: number;
  cpuDamage: number;
  playerMessage: string;
  cpuMessage: string;
  isPlayerSpecial: boolean;
  isCpuSpecial: boolean;
}

export interface BattleState {
  player: Fighter;
  cpu: Fighter;
  turn: number;
  logs: TurnResult[];
  winner: 'player' | 'cpu' | null;
  phase: 'select' | 'resolve' | 'gameover';
  playerWentFirst: boolean;
}

function calcMaxHp(creature: Creature): number {
  return 100 + Math.floor(creature.defense * 0.8);
}

function calcBasicDamage(attacker: Creature, defenderDefending: boolean): number {
  const base = Math.floor(attacker.attack * 0.6 + Math.random() * 15);
  return defenderDefending ? Math.floor(base * 0.5) : base;
}

function calcSpecialDamage(attacker: Creature, defenderDefending: boolean): number {
  const base = Math.floor(attacker.attack * 0.5 + attacker.magic * 0.5 + Math.random() * 20);
  return defenderDefending ? Math.floor(base * 0.5) : base;
}

function calcWildDamage(attacker: Creature, defenderDefending: boolean): number {
  const roll = Math.random();
  let base = 0;
  if (roll < 0.2) base = 0; // miss
  else if (roll < 0.6) base = Math.floor(attacker.attack * 0.8 + Math.random() * 10);
  else base = Math.floor(attacker.attack * 1.4 + Math.random() * 25); // big hit
  return defenderDefending ? Math.floor(base * 0.5) : base;
}

function cpuPickMove(cpu: Fighter, _player: Fighter): Move {
  const cpuHpPct = cpu.hp / cpu.maxHp;
  const weights: Record<MoveType, number> = {
    basic: 40,
    special: cpu.sp > 0 ? 25 : 0,
    defend: cpuHpPct < 0.4 ? 30 : 10,
    wild: 20,
  };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const [type, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) return PLAYER_MOVES.find(m => m.type === type as MoveType)!;
  }
  return PLAYER_MOVES[0];
}

export function initBattle(playerCreature: Creature, cpuCreature: Creature): BattleState {
  return {
    player: { creature: playerCreature, hp: calcMaxHp(playerCreature), maxHp: calcMaxHp(playerCreature), isDefending: false, sp: 3 },
    cpu: { creature: cpuCreature, hp: calcMaxHp(cpuCreature), maxHp: calcMaxHp(cpuCreature), isDefending: false, sp: 3 },
    turn: 1,
    logs: [],
    winner: null,
    phase: 'select',
    playerWentFirst: true,
  };
}

export function resolveTurn(state: BattleState, playerMove: Move): BattleState {
  const cpuMove = cpuPickMove(state.cpu, state.player);

  let playerDamage = 0;
  let cpuDamage = 0;
  let playerMessage = '';
  let cpuMessage = '';
  let isPlayerSpecial = false;
  let isCpuSpecial = false;

  const newPlayerSp = playerMove.type === 'special' ? state.player.sp - 1 : state.player.sp;
  const newCpuSp = cpuMove.type === 'special' ? state.cpu.sp - 1 : state.cpu.sp;

  // Player move
  switch (playerMove.type) {
    case 'basic':
      playerDamage = calcBasicDamage(state.player.creature, state.cpu.isDefending);
      playerMessage = `[SWORD] You use Basic Attack → ${playerDamage} damage!`;
      break;
    case 'special':
      if (state.player.sp > 0) {
        playerDamage = calcSpecialDamage(state.player.creature, state.cpu.isDefending);
        playerMessage = `[SPECIAL] You unleash ${state.player.creature.ability} → ${playerDamage} damage!`;
        isPlayerSpecial = true;
      } else {
        playerDamage = calcBasicDamage(state.player.creature, state.cpu.isDefending);
        playerMessage = `[SWORD] No SP left! Basic Attack instead → ${playerDamage} damage!`;
      }
      break;
    case 'defend':
      playerDamage = 0;
      playerMessage = `[SHIELD] You take a defensive stance!`;
      break;
    case 'wild':
      playerDamage = calcWildDamage(state.player.creature, state.cpu.isDefending);
      playerMessage = playerDamage === 0
        ? `[MISS] Wild Strike missed!`
        : playerDamage > state.player.creature.attack
          ? `[CRIT] Wild Strike CRITS → ${playerDamage} damage!`
          : `[WILD] Wild Strike → ${playerDamage} damage!`;
      break;
  }

  // CPU move
  switch (cpuMove.type) {
    case 'basic':
      cpuDamage = calcBasicDamage(state.cpu.creature, playerMove.type === 'defend');
      cpuMessage = `[SWORD] ${state.cpu.creature.name.split(',')[0]} uses Basic Attack → ${cpuDamage} damage!`;
      break;
    case 'special':
      if (state.cpu.sp > 0) {
        cpuDamage = calcSpecialDamage(state.cpu.creature, playerMove.type === 'defend');
        cpuMessage = `[SPECIAL] ${state.cpu.creature.name.split(',')[0]} unleashes ${state.cpu.creature.ability} → ${cpuDamage} damage!`;
        isCpuSpecial = true;
      } else {
        cpuDamage = calcBasicDamage(state.cpu.creature, playerMove.type === 'defend');
        cpuMessage = `[SWORD] ${state.cpu.creature.name.split(',')[0]} uses Basic Attack → ${cpuDamage} damage!`;
      }
      break;
    case 'defend':
      cpuDamage = 0;
      cpuMessage = `[SHIELD] ${state.cpu.creature.name.split(',')[0]} takes a defensive stance!`;
      break;
    case 'wild':
      cpuDamage = calcWildDamage(state.cpu.creature, playerMove.type === 'defend');
      cpuMessage = cpuDamage === 0
        ? `[MISS] ${state.cpu.creature.name.split(',')[0]}'s Wild Strike missed!`
        : cpuDamage > state.cpu.creature.attack
          ? `[CRIT] ${state.cpu.creature.name.split(',')[0]}'s Wild Strike CRITS → ${cpuDamage} damage!`
          : `[WILD] ${state.cpu.creature.name.split(',')[0]}'s Wild Strike → ${cpuDamage} damage!`;
      break;
  }

  // Determine who goes first based on speed
  const playerGoesFirst = state.player.creature.speed >= state.cpu.creature.speed
    ? Math.random() < 0.75  // faster creature goes first 75% of time
    : Math.random() < 0.35; // slower creature goes first 35% of time

  let newPlayerHp = state.player.hp;
  let newCpuHp = state.cpu.hp;
  let winner: 'player' | 'cpu' | null = null;

  if (playerGoesFirst) {
    // Player attacks first
    newCpuHp = Math.max(0, state.cpu.hp - playerDamage);
    if (newCpuHp <= 0) {
      winner = 'player';
    } else {
      // CPU attacks back only if still alive
      newPlayerHp = Math.max(0, state.player.hp - cpuDamage);
      if (newPlayerHp <= 0) winner = 'cpu';
    }
  } else {
    // CPU attacks first
    newPlayerHp = Math.max(0, state.player.hp - cpuDamage);
    if (newPlayerHp <= 0) {
      winner = 'cpu';
    } else {
      // Player attacks back only if still alive
      newCpuHp = Math.max(0, state.cpu.hp - playerDamage);
      if (newCpuHp <= 0) winner = 'player';
    }
  }

  // If target died on first strike, suppress the second attacker's message
  const finalCpuMessage = playerGoesFirst && newCpuHp <= 0
    ? `[SHIELD] ${state.cpu.creature.name.split(',')[0]} was defeated before they could act!`
    : cpuMessage;

  const finalPlayerMessage = !playerGoesFirst && newPlayerHp <= 0
    ? `[SHIELD] You were defeated before you could act!`
    : playerMessage;

  const turnResult: TurnResult = {
    playerMove, cpuMove, playerDamage, cpuDamage,
    playerMessage: finalPlayerMessage,
    cpuMessage: finalCpuMessage,
    isPlayerSpecial, isCpuSpecial,
  };

  return {
    ...state,
    player: { ...state.player, hp: newPlayerHp, isDefending: playerMove.type === 'defend', sp: newPlayerSp },
    cpu: { ...state.cpu, hp: newCpuHp, isDefending: cpuMove.type === 'defend', sp: newCpuSp },
    turn: state.turn + 1,
    logs: [...state.logs, turnResult],
    winner,
    phase: winner ? 'gameover' : 'resolve',
    playerWentFirst: playerGoesFirst,
  };
}
