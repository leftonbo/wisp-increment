/**
 * リソースIDの型定義
 */
export type ResourceId = "fire" | "coal" | "marshmallow" | "ghost" | "frost";

/**
 * アイテムIDの型定義
 */
export type ItemId = "coal" | "marshmallow" | "ghost" | "medal";

/**
 * 購入モードの型定義
 */
export type BuyMode = "one" | "max";

/**
 * ウィスプの表情の型定義
 */
export type WispMood = "normal" | "sleepy" | "click" | "purchase" | "blocked" | "victory";

/**
 * リソースの型定義
 */
export type Resources = Record<ResourceId, number>;

/**
 * アイテムの状態の型定義
 */
export type ItemState = {
  level: number;
  count: number;
};

/**
 * アイテムのゲーム設定の型定義
 */
export type ItemDefinition = {
  id: ItemId;
  name: string;
  emoji: string;
  description: string;
  produces: ResourceId;
  baseProduction: number;
  baseCost: number;
  costMultiplier: number;
  unlockFire: number;
};

/**
 * ゲーム状態の型定義
 */
export type GameState = {
  resources: Resources;
  totalEarnedFire: number;
  items: Record<ItemId, ItemState>;
  bestFireSinceCool: number;
  lastSavedAt: string | null;
  gameClear: boolean;
};

/**
 * ウィスプの段階の型定義
 */
export type WispStage = {
  minFire: number;
  label: string;
  description: string;
};
