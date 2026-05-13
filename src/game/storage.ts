import { initialGameState, SAVE_KEY } from "./constants";
import type { GameState } from "./types";
import { cloneGameState } from "./logic";

/**
 * ゲーム状態を正規化する
 * @param value 正規化するゲーム状態の部分的な値
 * @returns 正規化されたゲーム状態
 */
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

/**
 * ゲーム状態をロードする
 * @returns ロードされたゲーム状態
 */
export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return cloneGameState(initialGameState);
    return normalizeGameState(JSON.parse(raw) as Partial<GameState>);
  } catch {
    return cloneGameState(initialGameState);
  }
}

/**
 * ゲーム状態を保存する
 * @param state 保存するゲーム状態
 */
export function saveGame(state: GameState): void {
  const nextState = cloneGameState(state);
  nextState.lastSavedAt = new Date().toISOString();
  state.lastSavedAt = nextState.lastSavedAt;
  localStorage.setItem(SAVE_KEY, JSON.stringify(nextState));
}

/**
 * セーブデータをリセットする
 */
export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
