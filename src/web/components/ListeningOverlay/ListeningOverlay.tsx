// src/components/ListeningOverlay/ListeningOverlay.tsx
import React from 'react';

interface ListeningOverlayProps {
    isListening: boolean;
}

const ListeningOverlay: React.FC<ListeningOverlayProps> = ({ isListening }) => {
    if (!isListening) {
        return null;
    }

    return (
        <div className="absolute inset-0 flex flex-col justify-center items-center z-50" style={{ background: 'rgba(6,6,12,0.92)', backdropFilter: 'blur(12px)' }}>
            {/* Pulsing ring */}
            <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full animate-ping absolute inset-0" style={{ borderWidth: 2, borderStyle: 'solid', borderColor: `rgba(var(--accent), 0.3)` }} />
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ borderWidth: 2, borderStyle: 'solid', borderColor: `rgba(var(--accent), 0.5)` }}>
                    <div className="w-2.5 h-2.5 rounded-full animate-subtle-pulse" style={{ background: `rgb(var(--accent))` }} />
                </div>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
                Listening...
            </h2>
            <p className="text-white/40 mt-1.5 text-xs">Press any key or mouse button</p>
        </div>
    );
};

export default ListeningOverlay;