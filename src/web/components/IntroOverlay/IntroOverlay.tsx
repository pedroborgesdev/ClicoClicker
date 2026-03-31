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
        flex flex-col items-center justify-center 
        transition-all duration-[2s] ease-in-out
        ${isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
      `}
      style={{ background: 'var(--intro-bg)' }}
    >
      {/* Ambient glow */}
      <div className="absolute w-64 h-64 rounded-full opacity-[0.08] blur-[80px] pointer-events-none" style={{ background: 'var(--accent-hex)' }} />
      
      <div className="flex flex-col items-center text-center space-y-6 pb-12 relative z-10">
        <img
          src={ClicoIcon}
          alt="ClicoClicker logo"
          className="w-36"
          style={{ filter: `drop-shadow(0 0 40px rgba(var(--accent), 0.15))` }}
        />

        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            ClicoClicker
          </h1>
          <p className="text-xs text-white/25 mt-2 font-medium tracking-widest uppercase">
            v1.0.0 BETA
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-8 h-px bg-white/10" />
          <p className="text-xs text-white/20 font-medium tracking-wider">
            @pedroborgezs
          </p>
          <div className="w-8 h-px bg-white/10" />
        </div>
      </div>
    </div>
  );
};

export default IntroOverlay;
