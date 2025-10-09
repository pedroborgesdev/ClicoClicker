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
    <div className="flex-shrink-0 flex pl-2 justify-center items-center md:w-auto">
      <img
        src={currentImage}
        alt={`Mouse ${desiredKey}`}
        className={`h-[350px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${
          fadeState === "fade-in" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default MouseDisplay;
