import logoIcon from '../../assets/icon.svg'; 
import minimizeIcon from './icons/minimize-icon.svg';
import closeIcon from './icons/close-icon.svg'

import './styles.css'

function Titlebar() {
    const minimizeApp = () => {
        window.electron.minimizeApp();
    }
    const closeApp = () => {
        window.electron.closeApp();
    }

    return (
        <div className="titlebar w-screen flex justify-between items-center px-4 h-9 rounded-t-2xl z-50 border-b border-white/[0.04]" style={{ background: 'linear-gradient(180deg, var(--titlebar-from) 0%, var(--titlebar-to) 100%)' }}>
            
            <div className="flex-1 pl-1 flex items-center gap-2.5">
                <img src={logoIcon} alt="Clico Logo" className="w-5 h-5 drop-shadow-sm" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-white/30">Clico</span>
            </div>

            <div className="flex-shrink-0">
                <span className="text-[13px] text-white/25 font-medium tracking-wide">Auto Clicker Client</span>
            </div>

            <div className="flex-1 flex justify-end pr-1">
                <div className="flex flex-row items-center gap-1">
                    <a onClick={minimizeApp} className="no-drag flex justify-center items-center h-7 w-7 rounded-lg hover:bg-white/[0.08] opacity-50 hover:opacity-90 transition-all duration-200">
                        <img src={minimizeIcon} className='w-2.5 no-drag' alt="Minimize"></img>
                    </a>
                    <a onClick={closeApp} className="no-drag flex justify-center items-center h-7 w-7 rounded-lg hover:bg-red-500/20 opacity-50 hover:opacity-90 transition-all duration-200">
                        <img src={closeIcon} className='w-2.5 no-drag' alt="Close"></img>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Titlebar;