import React, { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const WINDOW_MS = 1000;
const SMOOTHING = 0.12;

const TestArea: React.FC = () => {
  const [displayCps, setDisplayCps] = useState<number>(0);
  const [windowClicks, setWindowClicks] = useState<number>(0);
  const totalClicksRef = useRef<number>(0);
  const timestampsRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const prevWindowCountRef = useRef<number | null>(null);

  const pushClick = (t: number) => {
    timestampsRef.current.push(t);
    totalClicksRef.current += 1;
    const cutoff = t - WINDOW_MS;
    while (timestampsRef.current.length && timestampsRef.current[0] < cutoff) {
      timestampsRef.current.shift();
    }
    const len = timestampsRef.current.length;
    if (prevWindowCountRef.current !== len) {
      prevWindowCountRef.current = len;
      setWindowClicks(len);
    }
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    pushClick(performance.now());
  };

  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const cutoff = now - WINDOW_MS;
      const arr = timestampsRef.current;

      while (arr.length && arr[0] < cutoff) arr.shift();

      const rawCps = arr.length * (1000 / WINDOW_MS);
      setDisplayCps(prev => prev + (rawCps - prev) * SMOOTHING);

      if (prevWindowCountRef.current !== arr.length) {
        prevWindowCountRef.current = arr.length;
        setWindowClicks(arr.length);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const resetAll = () => {
    timestampsRef.current = [];
    totalClicksRef.current = 0;
    prevWindowCountRef.current = null;
    setWindowClicks(0);
    setDisplayCps(0);
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            pushClick(performance.now());
          }
        }}
        className="rounded-2xl p-3 flex flex-col justify-between items-center h-32 cursor-pointer select-none border border-white/[0.05] transition-all duration-200 hover:border-white/[0.08] active:scale-[0.995]"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)', userSelect: "none" }}
      >
        <p className="text-white/25 text-xs font-medium tracking-wider uppercase">Click test area</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-white/30 font-medium">CPS</span>
          <span className="w-24 text-right text-3xl font-bold text-white tabular-nums">
            {displayCps.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-white/15 text-xs font-medium">Clicks (1s): <span className="text-white/30">{windowClicks}</span></span>
          <span className="text-white/15 text-xs font-medium">Total: <span className="text-white/30">{totalClicksRef.current}</span></span>
          <button
            onClick={(e) => { e.stopPropagation(); resetAll(); }}
            className="ml-2 text-[10px] px-3 py-1.5 rounded-lg text-white/30 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/50 transition-all duration-200 font-medium tracking-wide uppercase"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="flex flex-row justify-center items-center gap-2 mt-1.5 mb-0.5">
        <FontAwesomeIcon icon={faExclamationTriangle} className="w-2.5 text-white/15"/>
        <p className="text-[10px] text-white/15 font-medium">
          In 'hold-to-click' mode, side mouse buttons may not work in this test area.
        </p>
      </div>
    </div>
  );
};

export default TestArea;