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
  const producedIcon =
    definition.produces === "fire" ? "🔥" : definition.produces === "coal" ? "🪨" : definition.produces === "marshmallow" ? "🍬" : "👻";
  const tooltipId = `${itemId}-description`;

  if (!unlocked) {
    return (
      <article className="item-card item-card-locked">
        <div className="item-title">
          <span className="item-emoji">？？？</span>
          <div className="item-summary">
            <h3>未発見</h3>
            <p>アンロック: 累計{formatNumber(definition.unlockFire)}🔥</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="item-card">
      <div className="item-title">
        <span className="item-emoji">{definition.emoji}</span>
        <div className="item-summary">
          <h3>
            Lv.{formatNumber(item.level)} {definition.name} ({formatNumber(item.count)})
          </h3>
          <p>
            +{formatNumber(production)}
            {producedIcon}/sec
          </p>
        </div>
        <span className="item-info">
          <button className="item-info-trigger" type="button" aria-label={`${definition.name}の説明`} aria-describedby={tooltipId}>
            i
          </button>
          <span className="item-description" id={tooltipId} role="tooltip">
            {definition.description}
          </span>
        </span>
      </div>
      <button type="button" onClick={() => onBuy(itemId)} disabled={!canBuy(state, itemId)}>
        購入 {buyMode === "max" ? "MAX" : "x1"} · {formatNumber(cost)}🔥
      </button>
    </article>
  );
}
