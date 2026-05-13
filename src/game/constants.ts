import type { GameState, ItemDefinition, ItemId, WispStage } from "./types";

/**
 * セーブデータに用いる localStorage キー
 */
export const SAVE_KEY = "wisp-increment-save-v1";

/**
 * アイテムの表示順
 */
export const itemOrder: ItemId[] = ["coal", "marshmallow", "ghost", "medal"];

/**
 * 「最大購入」ボタンで、どの順番でアイテムを買うか
 */
export const buyMaxOrder: ItemId[] = ["medal", "ghost", "marshmallow", "coal"];

/**
 * アイテムの定義
 */
export const itemDefinitions: Record<ItemId, ItemDefinition> = {
  coal: {
    id: "coal",
    name: "石炭",
    emoji: "🪨",
    description: "ウィスプの基本燃料。少しずつ🔥を生む。",
    produces: "fire",
    baseCost: 10,
    costMultiplier: 10,
    unlockFire: 0,
  },
  marshmallow: {
    id: "marshmallow",
    name: "マシュマロ",
    emoji: "🍬",
    description: "ウィスプの大好物。石炭になるまでよく焼く。",
    produces: "coal",
    baseCost: 100,
    costMultiplier: 100,
    unlockFire: 100,
  },
  ghost: {
    id: "ghost",
    name: "おばけ",
    emoji: "👻",
    description: "ウィスプのお友達。夜な夜なマシュマロを運んでくる。",
    produces: "marshmallow",
    baseCost: 10_000,
    costMultiplier: 1000,
    unlockFire: 10_000,
  },
  medal: {
    id: "medal",
    name: "メダル",
    emoji: "💰",
    description: "プッシャーゲームの景品。集めると、おばけたちが妙に元気になる。",
    produces: "ghost",
    baseCost: 1_000_000,
    costMultiplier: 10000,
    unlockFire: 1_000_000,
  },
};

/**
 * ウィスプの段階の定義
 */
export const wispStages: WispStage[] = [
  { minFire: 0, label: "火の粉", description: "眠そうな小さな光" },
  { minFire: 10, label: "小さな炎", description: "ぷるぷる揺れる青白い炎" },
  { minFire: 1e3, label: "ウィスプ", description: "表情がはっきりしてきた" },
  { minFire: 1e6, label: "大炎", description: "周囲に火の粉が舞う" },
  { minFire: 1e9, label: "鬼火の王", description: "画面が少し遠ざかる" },
  { minFire: 1e13, label: "小さな星", description: "背景が夜空になる" },
  { minFire: 1e21, label: "恒星ウィスプ", description: "周囲に惑星のような光が浮かぶ" },
  { minFire: 1e51, label: "星雲", description: "背景が宇宙になる" },
  { minFire: 1e101, label: "銀河灯", description: "銀河サイズの青白い灯火" },
  { minFire: 1e201, label: "数式の外側", description: "表示が少し不穏に揺らぐ" },
];

/**
 * ゲームの初期状態
 */
export const initialGameState: GameState = {
  resources: {
    fire: 0,
    coal: 0,
    marshmallow: 0,
    ghost: 0,
    frost: 0,
  },
  totalEarnedFire: 0,
  items: {
    coal: { level: 0, count: 0 },
    marshmallow: { level: 0, count: 0 },
    ghost: { level: 0, count: 0 },
    medal: { level: 0, count: 0 },
  },
  bestFireSinceCool: 0,
  lastSavedAt: null,
  gameClear: false,
};
