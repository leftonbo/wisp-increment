export type ResourceId = "fire" | "coal" | "marshmallow" | "ghost" | "frost";

export type ItemId = "coal" | "marshmallow" | "ghost" | "medal";

export type BuyMode = "one" | "max";

export type WispMood = "normal" | "sleepy" | "click" | "purchase" | "blocked" | "victory";

export type Resources = Record<ResourceId, number>;

export type ItemState = {
  level: number;
  count: number;
};

export type ItemDefinition = {
  id: ItemId;
  name: string;
  emoji: string;
  description: string;
  produces: ResourceId;
  baseCost: number;
  costMultiplier: number;
  unlockFire: number;
};

export type GameState = {
  resources: Resources;
  totalEarnedFire: number;
  items: Record<ItemId, ItemState>;
  bestFireSinceCool: number;
  lastSavedAt: string | null;
  gameClear: boolean;
};

export type WispStage = {
  minFire: number;
  label: string;
  description: string;
};
