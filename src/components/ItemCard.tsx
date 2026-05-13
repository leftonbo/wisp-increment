import { itemDefinitions } from "../game/constants";
import { canBuy, getItemCost, getItemProduction, isUnlocked } from "../game/logic";
import { formatNumber } from "../game/format";
import type { BuyMode, GameState, ItemId } from "../game/types";

type ItemCardProps = {
  itemId: ItemId;
  state: GameState;
  buyMode: BuyMode;
  onBuy: (itemId: ItemId) => void;
};

export function ItemCard({ itemId, state, buyMode, onBuy }: ItemCardProps) {
  const definition = itemDefinitions[itemId];
  const item = state.items[itemId];
  const unlocked = isUnlocked(state, itemId);
  const cost = getItemCost(state, itemId);
  const production = getItemProduction(state, itemId);

  if (!unlocked) {
    return (
      <article className="item-card item-card-locked">
        <div className="item-title">
          <span className="item-emoji">？？？</span>
          <div>
            <h3>未発見</h3>
            <p>なにか甘い匂いがする……</p>
          </div>
        </div>
        <span className="unlock-text">アンロック: 累計{formatNumber(definition.unlockFire)}🔥</span>
      </article>
    );
  }

  return (
    <article className="item-card">
      <div className="item-title">
        <span className="item-emoji">{definition.emoji}</span>
        <div>
          <h3>{definition.name}</h3>
          <p>
            Lv {item.level} / 個数 {formatNumber(item.count)}
          </p>
        </div>
      </div>
      <p className="item-description">{definition.description}</p>
      <div className="item-meta">
        <span>
          生産: {formatNumber(production)}
          {definition.produces === "fire" ? "🔥" : definition.produces === "coal" ? "🪨" : definition.produces === "marshmallow" ? "🍬" : "👻"}
          /sec
        </span>
        <span>コスト: {formatNumber(cost)}🔥</span>
      </div>
      <button type="button" onClick={() => onBuy(itemId)} disabled={!canBuy(state, itemId)}>
        購入 {buyMode === "max" ? "MAX" : "x1"}
      </button>
    </article>
  );
}
