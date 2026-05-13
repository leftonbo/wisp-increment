import { useCallback, useEffect, useRef, useState } from "react";
import { Controls } from "./components/Controls";
import { ItemCard } from "./components/ItemCard";
import { ResourceHeader } from "./components/ResourceHeader";
import { WispView } from "./components/WispView";
import { itemOrder } from "./game/constants";
import { formatNumber } from "./game/format";
import {
  buyMax,
  buyMaxAll,
  buyOne,
  cloneGameState,
  coolDown,
  createInitialGameState,
  getCurrentWispStage,
  handleClickGain,
  tick,
} from "./game/logic";
import { clearSave, loadGame, saveGame } from "./game/storage";
import type { BuyMode, GameState, ItemId, WispMood } from "./game/types";

type FloatingText = {
  id: number;
  text: string;
};

function App() {
  const stateRef = useRef<GameState>(loadGame());
  const [viewState, setViewState] = useState<GameState>(() => cloneGameState(stateRef.current));
  const [buyMode, setBuyMode] = useState<BuyMode>("one");
  const [mood, setMood] = useState<WispMood>("sleepy");
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [coolFlash, setCoolFlash] = useState(false);
  const floatingIdRef = useRef(0);
  const moodTimerRef = useRef<number | null>(null);

  const syncView = useCallback(() => {
    setViewState(cloneGameState(stateRef.current));
  }, []);

  const setTemporaryMood = useCallback((nextMood: WispMood) => {
    setMood(nextMood);
    if (moodTimerRef.current !== null) {
      window.clearTimeout(moodTimerRef.current);
    }
    moodTimerRef.current = window.setTimeout(() => setMood("normal"), 650);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let lastTime = performance.now();
    let lastViewSync = lastTime;

    const loop = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      tick(stateRef.current, deltaTime);

      if (time - lastViewSync > 80) {
        syncView();
        lastViewSync = time;
      }

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [syncView]);

  useEffect(() => {
    const saveTimer = window.setInterval(() => {
      saveGame(stateRef.current);
      syncView();
    }, 3000);
    return () => window.clearInterval(saveTimer);
  }, [syncView]);

  useEffect(() => {
    return () => {
      if (moodTimerRef.current !== null) {
        window.clearTimeout(moodTimerRef.current);
      }
    };
  }, []);

  const handleWispClick = () => {
    const gain = handleClickGain(stateRef.current);
    const id = floatingIdRef.current + 1;
    floatingIdRef.current = id;
    setFloatingTexts((current) => [...current, { id, text: `+${formatNumber(gain)}🔥` }]);
    window.setTimeout(() => {
      setFloatingTexts((current) => current.filter((item) => item.id !== id));
    }, 850);
    setTemporaryMood("click");
    syncView();
  };

  const handleBuy = (itemId: ItemId) => {
    const bought = buyMode === "max" ? buyMax(stateRef.current, itemId) : buyOne(stateRef.current, itemId) ? 1 : 0;
    setTemporaryMood(bought > 0 ? "purchase" : "blocked");
    syncView();
  };

  const handleBuyMaxAll = () => {
    const bought = buyMaxAll(stateRef.current);
    setTemporaryMood(bought > 0 ? "purchase" : "blocked");
    syncView();
  };

  const handleCoolDown = () => {
    if (!coolDown(stateRef.current)) {
      setTemporaryMood("blocked");
      return;
    }
    setMood("sleepy");
    setCoolFlash(true);
    window.setTimeout(() => setCoolFlash(false), 520);
    saveGame(stateRef.current);
    syncView();
  };

  const handleReset = () => {
    clearSave();
    stateRef.current = createInitialGameState();
    setBuyMode("one");
    setMood("sleepy");
    setFloatingTexts([]);
    syncView();
  };

  const stage = getCurrentWispStage(viewState.resources.fire);

  return (
    <main className={`app-shell stage-bg-${stage.label} ${coolFlash ? "cool-flash" : ""}`}>
      <div className="game-layout">
        <ResourceHeader state={viewState} />
        <WispView
          fire={viewState.resources.fire}
          stage={stage}
          mood={mood}
          floatingTexts={floatingTexts}
          gameClear={viewState.gameClear}
          onClick={handleWispClick}
        />
        <Controls
          buyMode={buyMode}
          state={viewState}
          onBuyModeChange={setBuyMode}
          onBuyMaxAll={handleBuyMaxAll}
          onCoolDown={handleCoolDown}
          onReset={handleReset}
        />
        <section className="item-list" aria-label="アイテム一覧">
          {itemOrder.map((itemId) => (
            <ItemCard key={itemId} itemId={itemId} state={viewState} buyMode={buyMode} onBuy={handleBuy} />
          ))}
        </section>
      </div>
    </main>
  );
}

export default App;
