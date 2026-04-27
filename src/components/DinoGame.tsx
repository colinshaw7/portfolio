"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Phase = "idle" | "playing" | "dead" | "submitted";

const W = 600;
const H = 140;
const GROUND = H - 18;
const DX = 60;
const DW = 22;
const DH = 28;
const GRAVITY = 0.55;
const JUMP_V = -10.5;

const C_BG = "#0a0a0a";
const C_GREEN = "#00ff41";
const C_DIM = "#00cc33";
const C_DARK = "#003300";
const C_RED = "#ff3333";

interface Obstacle {
  x: number;
  w: number;
  h: number;
}

interface GameState {
  phase: Phase;
  dy: number;
  dvy: number;
  obs: Obstacle[];
  score: number;
  speed: number;
  frame: number;
  nextSpawn: number;
}

function makeState(): GameState {
  return {
    phase: "idle",
    dy: GROUND - DH,
    dvy: 0,
    obs: [],
    score: 0,
    speed: 4,
    frame: 0,
    nextSpawn: 90,
  };
}

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gs = useRef<GameState>(makeState());
  const rafRef = useRef<number>(0);

  const [uiPhase, setUiPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = gs.current;

    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // Ground line
    ctx.strokeStyle = C_DARK;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, GROUND);
    ctx.lineTo(W, GROUND);
    ctx.stroke();

    // Dino body
    ctx.fillStyle = C_GREEN;
    ctx.fillRect(DX, s.dy, DW, DH);
    // Eye
    ctx.fillStyle = C_BG;
    ctx.fillRect(DX + DW - 7, s.dy + 5, 3, 3);
    // Legs (animated when running)
    if (s.phase === "playing" && s.dy >= GROUND - DH - 2) {
      const leg = Math.floor(s.frame / 6) % 2;
      ctx.fillStyle = C_GREEN;
      ctx.fillRect(DX + 4, s.dy + DH, 5, leg === 0 ? 6 : 3);
      ctx.fillRect(DX + 12, s.dy + DH, 5, leg === 0 ? 3 : 6);
    }

    // Obstacles (cacti)
    for (const o of s.obs) {
      ctx.fillStyle = C_GREEN;
      ctx.fillRect(o.x, GROUND - o.h, o.w, o.h);
      // Arms
      if (o.h > 30) {
        ctx.fillRect(o.x - 6, GROUND - o.h + 12, 6, 7);
        ctx.fillRect(o.x - 6, GROUND - o.h + 12, 3, 14);
        ctx.fillRect(o.x + o.w, GROUND - o.h + 16, 6, 7);
        ctx.fillRect(o.x + o.w + 3, GROUND - o.h + 16, 3, 14);
      }
    }

    // Score
    ctx.fillStyle = C_DIM;
    ctx.font = "11px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`SCORE: ${s.score}`, W - 8, 16);
    ctx.textAlign = "left";

    if (s.phase === "idle") {
      ctx.fillStyle = C_GREEN;
      ctx.font = "13px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PRESS SPACE / TAP TO START", W / 2, H / 2 - 10);
      ctx.fillStyle = C_DIM;
      ctx.font = "10px monospace";
      ctx.fillText("space or ↑ to jump", W / 2, H / 2 + 8);
      ctx.textAlign = "left";
    }

    if (s.phase === "dead") {
      ctx.fillStyle = C_RED;
      ctx.font = "13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`GAME OVER — ${s.score} pts`, W / 2, H / 2 - 4);
      ctx.textAlign = "left";
    }
  }, []);

  const doJump = useCallback(() => {
    const s = gs.current;
    if (s.phase === "idle") {
      s.phase = "playing";
      setUiPhase("playing");
    }
    if (s.phase === "playing" && s.dy >= GROUND - DH - 4) {
      s.dvy = JUMP_V;
    }
  }, []);

  // Game loop
  useEffect(() => {
    function loop() {
      const s = gs.current;

      if (s.phase === "playing") {
        s.frame++;
        s.score = Math.floor(s.frame / 6);
        s.speed = 4 + s.score * 0.004;

        s.dvy += GRAVITY;
        s.dy += s.dvy;
        if (s.dy >= GROUND - DH) {
          s.dy = GROUND - DH;
          s.dvy = 0;
        }

        s.nextSpawn--;
        if (s.nextSpawn <= 0) {
          const h = 28 + Math.floor(Math.random() * 26);
          const w = 12 + Math.floor(Math.random() * 10);
          s.obs.push({ x: W + 10, w, h });
          s.nextSpawn = Math.floor(
            Math.max(55, 120 - s.score * 0.07) + Math.random() * 55
          );
        }

        s.obs = s.obs
          .map((o) => ({ ...o, x: o.x - s.speed }))
          .filter((o) => o.x + o.w > 0);

        // Collision with slight forgiveness margin
        const dl = DX + 5, dr = DX + DW - 5;
        const dt = s.dy + 5, db = s.dy + DH - 2;
        for (const o of s.obs) {
          const ol = o.x + 3, or_ = o.x + o.w - 3;
          const ot = GROUND - o.h;
          if (dr > ol && dl < or_ && db > ot) {
            s.phase = "dead";
            setFinalScore(s.score);
            setUiPhase("dead");
            draw();
            return;
          }
        }
      }

      draw();

      if (s.phase !== "dead" && s.phase !== "submitted") {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // Keyboard handler — only active while game is running
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const s = gs.current;
      if (
        (e.code === "Space" || e.key === "ArrowUp") &&
        (s.phase === "idle" || s.phase === "playing")
      ) {
        e.preventDefault();
        doJump();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doJump]);

  const handleSubmit = async () => {
    const name = (playerName.trim() || "anonymous").slice(0, 12);
    setSubmitState("loading");
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score: finalScore }),
      });
      if (!res.ok) throw new Error("bad response");
      setSubmitState("done");
      setUiPhase("submitted");
      gs.current.phase = "submitted";
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-green text-glow font-bold">{">"} DINO RUNNER</p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={doJump}
        className="w-full max-w-[600px] border border-green-dark cursor-pointer block"
      />
      {uiPhase === "dead" && (
        <div className="pl-1 space-y-2">
          <p className="text-red font-bold">
            GAME OVER — {finalScore} pts
          </p>
          {submitState === "idle" && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-amber text-sm">enter name:</span>
              <input
                autoFocus
                type="text"
                maxLength={12}
                placeholder="anonymous"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") handleSubmit();
                }}
                className="bg-transparent border-b border-green text-foreground focus:outline-none text-sm w-28"
              />
              <button
                onClick={handleSubmit}
                className="text-cyan border border-cyan px-2 py-0.5 text-sm hover:bg-cyan hover:text-background transition-colors"
              >
                submit
              </button>
            </div>
          )}
          {submitState === "loading" && (
            <p className="text-gray-light text-sm">Submitting score...</p>
          )}
          {submitState === "error" && (
            <p className="text-red text-sm">
              Failed to submit. Check your connection.
            </p>
          )}
        </div>
      )}
      {uiPhase === "submitted" && (
        <p className="text-green text-sm pl-1">
          Score submitted! Type{" "}
          <span className="text-amber">leaderboard</span> to see the rankings.
        </p>
      )}
    </div>
  );
}
