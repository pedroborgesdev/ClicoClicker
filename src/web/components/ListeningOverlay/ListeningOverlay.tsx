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
        <div className="absolute inset-0 bg-black-dark-900/90 flex flex-col justify-center items-center z-50 animate-fade-in">
            <h2 className="text-3xl font-bold text-white animate-pulse">
                Listening...
            </h2>
            <p className="text-gray-300 mt-2">Press any key or click to record</p>
        </div>
    );
};

export default ListeningOverlay;