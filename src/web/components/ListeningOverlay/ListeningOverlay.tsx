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
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full animate-ping absolute inset-0" style={{ borderWidth: 2, borderStyle: 'solid', borderColor: `rgba(var(--accent), 0.3)` }} />
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ borderWidth: 2, borderStyle: 'solid', borderColor: `rgba(var(--accent), 0.5)` }}>
                    <div className="w-3 h-3 rounded-full animate-subtle-pulse" style={{ background: `rgb(var(--accent))` }} />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
                Listening...
            </h2>
            <p className="text-white/40 mt-2 text-sm">Press any key or mouse button</p>
        </div>
    );
};

export default ListeningOverlay;