import React from 'react';
import ClicoIcon from '../../assets/icon.svg';

interface IntroOverlayProps {
  isExiting: boolean;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ isExiting }) => {
  return (
    <div
      className={`
        absolute inset-0 z-40 
        bg-black-dark-800
        flex flex-col items-center justify-center 
        transition-all duration-[2s] ease-in-out
        ${isExiting ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-8 pb-12">
        <img
          src={ClicoIcon}
          alt="ClicoClicker logo"
          className="w-40 drop-shadow-lg"
        />

        <div>
          <h1 className="text-3xl font-semibold text-white tracking-wide">
            ClicoClicker
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            v1.0.0 BETA
          </p>
        </div>

        <p className="text-xs text-gray-500 font-light tracking-wide">
          Coded by <span className="text-gray-300">@pedroborgezs</span>
        </p>
      </div>
    </div>
  );
};

export default IntroOverlay;
