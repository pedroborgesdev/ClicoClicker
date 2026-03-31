import React from 'react';
import packageJson from '../../../../package.json';

const AppInfo: React.FC = () => {
  return (
    <div className="h-9 flex justify-center items-center rounded-b-2xl border-t border-white/[0.03]" style={{ background: 'rgba(10,10,16,0.7)' }}>
      <div className="text-center text-[11px] text-white/20 flex flex-row justify-center items-center gap-x-1.5 font-medium tracking-wide">
        <p>ClicoClicker v{packageJson.version}</p>
        <span className="text-white/10">·</span>
        <p>BETA</p>
        <span className="text-white/10">·</span>
        <p>@pedroborgesdev</p>
      </div>
    </div>
  );
};

export default AppInfo;
