import { formatNumber } from "../game/format";
import type { WispMood, WispStage } from "../game/types";

type FloatingText = {
  id: number;
  text: string;
};

type WispViewProps = {
  fire: number;
  stage: WispStage;
  mood: WispMood;
  floatingTexts: FloatingText[];
  gameClear: boolean;
  onClick: () => void;
};

const moodFaces: Record<WispMood, string> = {
  normal: "・ᴗ・",
  sleepy: "-ᴗ-",
  click: ">ᴗ<",
  purchase: "✧ᴗ✧",
  blocked: "・-・",
  victory: "★ᴗ★",
};

function getStageClass(fire: number): string {
  if (fire >= 1e201) return "stage-9";
  if (fire >= 1e101) return "stage-8";
  if (fire >= 1e51) return "stage-7";
  if (fire >= 1e21) return "stage-6";
  if (fire >= 1e13) return "stage-5";
  if (fire >= 1e9) return "stage-4";
  if (fire >= 1e6) return "stage-3";
  if (fire >= 1e3) return "stage-2";
  if (fire >= 10) return "stage-1";
  return "stage-0";
}

export function WispView({ fire, stage, mood, floatingTexts, gameClear, onClick }: WispViewProps) {
  const activeMood = gameClear ? "victory" : mood;

  return (
    <section className="wisp-section">
      {gameClear && (
        <div className="victory-banner">
          <strong>🔥 Infinity 到達！</strong>
          <span>ウィスプは数式の外側まで燃え広がった。</span>
        </div>
      )}
      <button
        className={`wisp ${getStageClass(fire)} mood-${activeMood}`}
        type="button"
        onClick={onClick}
        aria-label="ウィスプをクリックして火力を増やす"
      >
        <span className="wisp-core" />
        <span className="wisp-face">{moodFaces[activeMood]}</span>
        <span className="spark spark-a" />
        <span className="spark spark-b" />
        <span className="spark spark-c" />
        {floatingTexts.map((floating) => (
          <span className="floating-fire" key={floating.id}>
            {floating.text}
          </span>
        ))}
      </button>
      <div className="stage-panel">
        <span className="stage-label">{stage.label}</span>
        <span className="stage-description">{stage.description}</span>
        <span className="stage-fire">現在🔥 {formatNumber(fire)}</span>
      </div>
    </section>
  );
}
