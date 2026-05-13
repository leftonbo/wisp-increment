import { buyMaxOrder, initialGameState, itemDefinitions, itemOrder, wispStages } from "./constants";
import type { GameState, ItemId, WispStage } from "./types";

/**
 * ゲームクリアに必要な火の量
 */
const CLEAR_FIRE = 1e308;

/**
 * ゲーム状態のクローンを作成
 * @param state クローン元のゲーム状態
 * @returns クローンされたゲーム状態
 */
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

/**
 * ゲームの初期状態を作成
 * @returns 初期状態のゲーム状態
 */
export function createInitialGameState(): GameState {
  return cloneGameState(initialGameState);
}

/**
 * プレステージ倍率を取得
 * @param state ゲーム状態
 * @returns プレステージ倍率
 */
export function getPrestigeMultiplier(state: GameState): number {
  return 1 + 0.1 * state.resources.frost;
}

/**
 * アイテムのコストを取得
 * @param state ゲーム状態
 * @param itemId アイテムID
 * @returns アイテムのコスト
 */
export function getItemCost(state: GameState, itemId: ItemId): number {
  const definition = itemDefinitions[itemId];
  return definition.baseCost * definition.costMultiplier ** state.items[itemId].level;
}

/**
 * アイテムがアンロックされているか
 * @param state ゲーム状態
 * @param itemId アイテムID
 * @returns アンロックされているかどうか
 */
export function isUnlocked(state: GameState, itemId: ItemId): boolean {
  return state.totalEarnedFire >= itemDefinitions[itemId].unlockFire;
}

/**
 * アイテムを購入できるか
 * @param state ゲーム状態
 * @param itemId アイテムID
 * @returns 購入できるかどうか
 */
export function canBuy(state: GameState, itemId: ItemId): boolean {
  return isUnlocked(state, itemId) && state.resources.fire >= getItemCost(state, itemId);
}

/**
 * アイテムの生産量を取得
 * @param state ゲーム状態
 * @param itemId アイテムID
 * @returns アイテムの生産量
 */
export function getItemProduction(state: GameState, itemId: ItemId): number {
  const item = state.items[itemId];
  if (item.count === 0) return 0;
  return itemDefinitions[itemId].baseProduction * 3 ** (item.level - 1) * item.count * getPrestigeMultiplier(state);
}

/**
 * 1 秒あたりの火の増加量を取得
 * @param state ゲーム状態
 * @returns 1 秒あたりの火の増加量
 */
export function getFirePerSecond(state: GameState): number {
  return getItemProduction(state, "coal");
}

/**
 * 火の量に応じたマイルストーンを更新
 * @param state ゲーム状態
 */
export function updateFireMilestones(state: GameState): void {
  state.bestFireSinceCool = Math.max(state.bestFireSinceCool, state.resources.fire);
  if (state.resources.fire >= CLEAR_FIRE || !Number.isFinite(state.resources.fire)) {
    state.gameClear = true;
  }
}

/**
 * ゲームの状態を Tick 単位で更新
 * @param state ゲーム状態
 * @param deltaTime 経過時間（秒）
 */
export function tick(state: GameState, deltaTime: number): void {
  const safeDelta = Math.max(0, Math.min(deltaTime, 1));
  const fireGain = getItemProduction(state, "coal") * safeDelta;
  const coalGain = getItemProduction(state, "marshmallow") * safeDelta;
  const marshmallowGain = getItemProduction(state, "ghost") * safeDelta;
  const ghostGain = getItemProduction(state, "medal") * safeDelta;

  state.resources.fire += fireGain;
  state.items.coal.count += coalGain;
  state.items.marshmallow.count += marshmallowGain;
  state.items.ghost.count += ghostGain;
  state.totalEarnedFire += fireGain;

  updateFireMilestones(state);
}

/**
 * クリックによる火の獲得
 * @param state ゲーム状態
 * @returns 獲得した火の量
 */
export function handleClickGain(state: GameState): number {
  const gain = 1 + state.items["coal"].level + getFirePerSecond(state) * 0.05;
  state.resources.fire += gain;
  state.totalEarnedFire += gain;
  updateFireMilestones(state);
  return gain;
}

/**
 * アイテムを1つ購入
 * @param state ゲーム状態
 * @param itemId アイテムID
 * @returns 購入できたかどうか
 */
export function buyOne(state: GameState, itemId: ItemId): boolean {
  if (!canBuy(state, itemId)) return false;
  state.resources.fire -= getItemCost(state, itemId);
  state.items[itemId].level += 1;
  state.items[itemId].count += 1;
  return true;
}

/**
 * アイテムを最大限購入
 * @param state ゲーム状態
 * @param itemId アイテムID
 * @returns 購入したアイテムの数
 */
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

/**
 * 全てのアイテムを最大限購入
 * @param state ゲーム状態
 * @returns 購入したアイテムの総数
 */
export function buyMaxAll(state: GameState): number {
  return buyMaxOrder.reduce((total, itemId) => total + buyMax(state, itemId), 0);
}

/**
 * 次のフロスト獲得量を取得
 * @param state ゲーム状態
 * @returns 次のフロスト獲得量
 */
export function getNextFrost(state: GameState): number {
  return Math.floor(
    Math.max(
      0,
      Math.pow(
        Math.log2(Math.max(1, state.bestFireSinceCool / 1e8)),
        2
      )
    )
  );
}

/**
 * フロストの獲得量を取得
 * @param state ゲーム状態
 * @returns フロストの獲得量
 */
export function getFrostGain(state: GameState): number {
  return getNextFrost(state) - state.resources.frost;
}

/**
 * 冷却を実行できるか
 * @param state ゲーム状態
 * @returns 冷却を実行できるかどうか
 */
export function canCoolDown(state: GameState): boolean {
  return getFrostGain(state) > 0;
}

/**
 * 冷却を実施 (プレステージ)
 * @param state ゲーム状態
 * @returns 冷却を実施できたかどうか
 */
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

/**
 * 現在のウィスプステージを取得
 * @param fire 火の量
 * @returns 現在のウィスプステージ
 */
export function getCurrentWispStage(fire: number): WispStage {
  return wispStages.reduce((current, stage) => (fire >= stage.minFire ? stage : current), wispStages[0]);
}
