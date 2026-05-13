import { getFrostGain, getNextFrost } from "../game/logic";
import { formatNumber } from "../game/format";
import type { BuyMode, GameState } from "../game/types";

type ControlsProps = {
  buyMode: BuyMode;
  state: GameState;
  onBuyModeChange: (mode: BuyMode) => void;
  onBuyMaxAll: () => void;
  onCoolDown: () => void;
  onReset: () => void;
};

export function Controls({
  buyMode,
  state,
  onBuyModeChange,
  onBuyMaxAll,
  onCoolDown,
  onReset,
}: ControlsProps) {
  const frostGain = getFrostGain(state);
  const nextFrost = getNextFrost(state);

  return (
    <section className="controls">
      <div className="buy-mode">
        <span>購入数:</span>
        <button
          className={buyMode === "one" ? "is-active" : ""}
          type="button"
          onClick={() => onBuyModeChange("one")}
        >
          x1
        </button>
        <button
          className={buyMode === "max" ? "is-active" : ""}
          type="button"
          onClick={() => onBuyModeChange("max")}
        >
          MAX
        </button>
      </div>
      <div className="control-actions">
        <button type="button" onClick={onBuyMaxAll}>
          買えるだけ買う
        </button>
        <button type="button" onClick={onCoolDown} disabled={frostGain <= 0}>
          ❄️ 冷却する: +{formatNumber(Math.max(0, frostGain))} ❄️
        </button>
        <button className="reset-button" type="button" onClick={onReset}>
          リセット
        </button>
      </div>
      <p className="cooldown-note">冷却後の❄️: {formatNumber(nextFrost)}</p>
    </section>
  );
}
