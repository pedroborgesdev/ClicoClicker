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
        <div className="titlebar w-screen flex justify-between items-center px-3 h-12 bg-black-900 rounded-t-2xl z-50">
            
            <div className="flex-1 pl-2">
                <img src={logoIcon} alt="Clico Logo" className="w-6 h-6" />
            </div>

            <div className="flex-shrink-0 text-gray-400">
                <span>ClicoClicker - Auto Clicker Client</span>
            </div>

            <div className="flex-1 flex justify-end pr-2">
                <div className="flex flex-row items-center">
                    <a onClick={minimizeApp} className="no-drag flex justify-center items-center h-8 w-8 rounded-[2rem] hover:bg-black-700 opacity-60 hover:opacity-100 transition-all">
                        <img src={minimizeIcon} className='w-3 no-drag' alt="Minimize"></img>
                    </a>
                    <div className='w-4'></div>
                    <a onClick={closeApp} className="no-drag flex justify-center items-center h-8 w-8 rounded-[2rem] hover:bg-red-800 opacity-60 hover:opacity-100 transition-all">
                        <img src={closeIcon} className='w-3 no-drag' alt="Close"></img>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Titlebar;