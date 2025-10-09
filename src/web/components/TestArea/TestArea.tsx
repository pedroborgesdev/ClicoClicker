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
        className="bg-black-dark-700 rounded-xl p-6 flex flex-col justify-between items-center h-48 cursor-pointer select-none shadow-xl"
        style={{ userSelect: "none" }}
      >
        <p className="text-gray-400">Click test area</p>
        <div className="flex items-baseline gap-4">
          <span className="text-lg text-slate-300">CPS:</span>
          <span className="w-36 text-right text-6xl font-bold text-white">
            {displayCps.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-4 items-center mt-2">
          <span className="text-gray-800 text-sm">Clicks (1s): {windowClicks}</span>
          <span className="text-gray-800 text-sm">Total: {totalClicksRef.current}</span>
          <button
            onClick={(e) => { e.stopPropagation(); resetAll(); }}
            className="ml-4 text-xs px-4 py-2 rounded text-gray-400 bg-black-dark-500 hover:bg-black-dark-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="flex flex-row justify-center items-center gap-2 text-center text-sm text-gray-800 mt-3">
        <FontAwesomeIcon icon={faExclamationTriangle} className="w-3"/>
        <p className="text-center text-sm text-gray-800 mt-3 pb-3">
          In 'hold-to-click' mode, the side mouse buttons may not work correctly in THIS test area.
        </p>
      </div>
    </div>
  );
};

export default TestArea;