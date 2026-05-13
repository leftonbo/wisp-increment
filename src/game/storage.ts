import { initialGameState, SAVE_KEY } from "./constants";
import type { GameState } from "./types";
import { cloneGameState } from "./logic";

function normalizeGameState(value: Partial<GameState>): GameState {
  return {
    resources: {
      fire: value.resources?.fire ?? initialGameState.resources.fire,
      coal: value.resources?.coal ?? initialGameState.resources.coal,
      marshmallow: value.resources?.marshmallow ?? initialGameState.resources.marshmallow,
      ghost: value.resources?.ghost ?? initialGameState.resources.ghost,
      frost: value.resources?.frost ?? initialGameState.resources.frost,
    },
    totalEarnedFire: value.totalEarnedFire ?? initialGameState.totalEarnedFire,
    items: {
      coal: { ...initialGameState.items.coal, ...value.items?.coal },
      marshmallow: { ...initialGameState.items.marshmallow, ...value.items?.marshmallow },
      ghost: { ...initialGameState.items.ghost, ...value.items?.ghost },
      medal: { ...initialGameState.items.medal, ...value.items?.medal },
    },
    bestFireSinceCool: value.bestFireSinceCool ?? initialGameState.bestFireSinceCool,
    lastSavedAt: value.lastSavedAt ?? initialGameState.lastSavedAt,
    gameClear: value.gameClear ?? initialGameState.gameClear,
  };
}

export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return cloneGameState(initialGameState);
    return normalizeGameState(JSON.parse(raw) as Partial<GameState>);
  } catch {
    return cloneGameState(initialGameState);
  }
}

export function saveGame(state: GameState): void {
  const nextState = cloneGameState(state);
  nextState.lastSavedAt = new Date().toISOString();
  state.lastSavedAt = nextState.lastSavedAt;
  localStorage.setItem(SAVE_KEY, JSON.stringify(nextState));
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
