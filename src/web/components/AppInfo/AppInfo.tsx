import React from 'react';
import packageJson from '../../../../package.json';

const AppInfo: React.FC = () => {
  return (
    <div className="bg-black-900 h-8 flex justify-center items-center rounded-b-2xl">
      <div className="text-center text-xs text-gray-400 flex flex-row justify-center items-center gap-x-4">
        <p>ClicoClicker v{packageJson.version} BETA</p>
        <p>Creator: Pedro Borges (@pedroborgesdev)</p>
      </div>
    </div>
  );
};

export default AppInfo;
