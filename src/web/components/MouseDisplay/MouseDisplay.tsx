import React, { useEffect, useState, useRef } from "react";
import { DesiredKey } from "../../types";

import mouseLeftImage from "../../assets/mouse-left.png";
import mouseRightImage from "../../assets/mouse-right.png";

interface MouseDisplayProps {
  desiredKey: DesiredKey;
}

const MouseDisplay: React.FC<MouseDisplayProps> = ({ desiredKey }) => {
  const [currentImage, setCurrentImage] = useState(
    desiredKey === "left" ? mouseLeftImage : mouseRightImage
  );
  const [fadeState, setFadeState] = useState<"fade-in" | "fade-out">("fade-in");
  
  const isInitialRender = useRef(true); 

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setFadeState("fade-out");

    const timeout = setTimeout(() => {
      setCurrentImage(desiredKey === "left" ? mouseLeftImage : mouseRightImage);
      setFadeState("fade-in");
    }, 150);

    return () => clearTimeout(timeout);
  }, [desiredKey]); 

  return (
    <div className="flex-shrink-0 flex justify-center items-center relative">
      {/* Subtle glow behind mouse */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-32 h-48 rounded-full opacity-[0.06] blur-3xl" style={{ background: desiredKey === 'left' ? 'var(--accent-hex)' : 'var(--accent-secondary-hex)' }} />
      </div>
      <img
        src={currentImage}
        alt={`Mouse ${desiredKey}`}
        className={`h-[320px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 ${
          fadeState === "fade-in" ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      />
    </div>
  );
};

export default MouseDisplay;
