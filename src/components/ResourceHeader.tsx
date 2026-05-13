import { getFirePerSecond, getPrestigeMultiplier } from "../game/logic";
import { formatNumber, formatRate } from "../game/format";
import type { GameState } from "../game/types";

type ResourceHeaderProps = {
  state: GameState;
};

export function ResourceHeader({ state }: ResourceHeaderProps) {
  const firePerSecond = getFirePerSecond(state);
  const multiplier = getPrestigeMultiplier(state);

  return (
    <header className="resource-header">
      <div className="resource-main">
        <span className="resource-value">🔥 {formatNumber(state.resources.fire)}</span>
        <span className="resource-rate">{formatRate(firePerSecond)}</span>
      </div>
      <div className="resource-grid">
        <span>❄️ {formatNumber(state.resources.frost)}</span>
        <span>生産 x{multiplier.toFixed(1)}</span>
        <span>🪨 {formatNumber(state.resources.coal)}</span>
        <span>🍬 {formatNumber(state.resources.marshmallow)}</span>
        <span>👻 {formatNumber(state.resources.ghost)}</span>
        <span>累計🔥 {formatNumber(state.totalEarnedFire)}</span>
      </div>
    </header>
  );
}
