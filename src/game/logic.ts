import { buyMaxOrder, initialGameState, itemDefinitions, itemOrder, wispStages } from "./constants";
import type { GameState, ItemId, WispStage } from "./types";

const BASE_PRODUCTION = 1;
const CLEAR_FIRE = 1e308;

export function cloneGameState(state: GameState): GameState {
  return {
    resources: { ...state.resources },
    totalEarnedFire: state.totalEarnedFire,
    items: {
      coal: { ...state.items.coal },
      marshmallow: { ...state.items.marshmallow },
      ghost: { ...state.items.ghost },
      medal: { ...state.items.medal },
    },
    bestFireSinceCool: state.bestFireSinceCool,
    lastSavedAt: state.lastSavedAt,
    gameClear: state.gameClear,
  };
}

export function createInitialGameState(): GameState {
  return cloneGameState(initialGameState);
}

export function getPrestigeMultiplier(state: GameState): number {
  return 1 + 0.1 * state.resources.frost;
}

export function getItemCost(state: GameState, itemId: ItemId): number {
  const definition = itemDefinitions[itemId];
  return definition.baseCost * definition.costMultiplier ** state.items[itemId].level;
}

export function isUnlocked(state: GameState, itemId: ItemId): boolean {
  return state.totalEarnedFire >= itemDefinitions[itemId].unlockFire;
}

export function canBuy(state: GameState, itemId: ItemId): boolean {
  return isUnlocked(state, itemId) && state.resources.fire >= getItemCost(state, itemId);
}

export function getItemProduction(state: GameState, itemId: ItemId): number {
  const item = state.items[itemId];
  if (item.count === 0) return 0;
  return BASE_PRODUCTION * 2 ** item.level * item.count * getPrestigeMultiplier(state);
}

export function getFirePerSecond(state: GameState): number {
  return getItemProduction(state, "coal");
}

export function updateFireMilestones(state: GameState): void {
  state.bestFireSinceCool = Math.max(state.bestFireSinceCool, state.resources.fire);
  if (state.resources.fire >= CLEAR_FIRE || !Number.isFinite(state.resources.fire)) {
    state.gameClear = true;
  }
}

export function tick(state: GameState, deltaTime: number): void {
  const safeDelta = Math.max(0, Math.min(deltaTime, 1));
  const fireGain = getItemProduction(state, "coal") * safeDelta;
  const coalGain = getItemProduction(state, "marshmallow") * safeDelta;
  const marshmallowGain = getItemProduction(state, "ghost") * safeDelta;
  const ghostGain = getItemProduction(state, "medal") * safeDelta;

  state.resources.fire += fireGain;
  state.resources.coal += coalGain;
  state.resources.marshmallow += marshmallowGain;
  state.resources.ghost += ghostGain;
  state.totalEarnedFire += fireGain;

  updateFireMilestones(state);
}

export function handleClickGain(state: GameState): number {
  const gain = 1 + getFirePerSecond(state) * 0.05;
  state.resources.fire += gain;
  state.totalEarnedFire += gain;
  updateFireMilestones(state);
  return gain;
}

export function buyOne(state: GameState, itemId: ItemId): boolean {
  if (!canBuy(state, itemId)) return false;
  state.resources.fire -= getItemCost(state, itemId);
  state.items[itemId].level += 1;
  state.items[itemId].count += 1;
  return true;
}

export function buyMax(state: GameState, itemId: ItemId): number {
  let safety = 10_000;
  let bought = 0;
  while (canBuy(state, itemId) && safety > 0) {
    buyOne(state, itemId);
    bought += 1;
    safety -= 1;
  }
  return bought;
}

export function buyMaxAll(state: GameState): number {
  return buyMaxOrder.reduce((total, itemId) => total + buyMax(state, itemId), 0);
}

export function getNextFrost(state: GameState): number {
  return Math.floor(Math.max(0, Math.log10(Math.max(1, state.bestFireSinceCool)) - 5));
}

export function getFrostGain(state: GameState): number {
  return getNextFrost(state) - state.resources.frost;
}

export function canCoolDown(state: GameState): boolean {
  return getFrostGain(state) > 0;
}

export function coolDown(state: GameState): boolean {
  const nextFrost = getNextFrost(state);
  if (nextFrost <= state.resources.frost) return false;

  state.resources.fire = 0;
  state.resources.coal = 0;
  state.resources.marshmallow = 0;
  state.resources.ghost = 0;
  state.resources.frost = nextFrost;
  for (const itemId of itemOrder) {
    state.items[itemId] = { level: 0, count: 0 };
  }
  state.totalEarnedFire = 0;
  state.bestFireSinceCool = 0;
  state.gameClear = false;
  return true;
}

export function getCurrentWispStage(fire: number): WispStage {
  return wispStages.reduce((current, stage) => (fire >= stage.minFire ? stage : current), wispStages[0]);
}
