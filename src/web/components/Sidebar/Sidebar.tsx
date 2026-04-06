import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface SessionInfo {
  id: number;
  isClicking: boolean;
}

interface SidebarProps {
  sessions: SessionInfo[];
  activeSessionId: number;
  onSelectSession: (id: number) => void;
  onAddSession: () => void;
  onDeleteSession: (id: number) => void;
  canAddSession: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onAddSession,
  onDeleteSession,
  canAddSession,
}) => {
  const [contextMenu, setContextMenu] = useState<{ sessionId: number; x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [contextMenu]);

  return (
    <div className="relative flex flex-col items-center gap-2 py-3 px-2 border-r border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.01)' }}>
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onSelectSession(session.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            if (sessions.length > 1) {
              setContextMenu({ sessionId: session.id, x: e.clientX, y: e.clientY });
            }
          }}
          className={`relative w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border ${
            session.id === activeSessionId
              ? ''
              : 'border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
          }`}
          style={
            session.id === activeSessionId
              ? {
                  background: `rgba(var(--accent), 0.15)`,
                  color: `rgb(var(--accent))`,
                  borderColor: `rgba(var(--accent), 0.3)`,
                  boxShadow: `0 0 12px rgba(var(--accent), 0.12)`,
                }
              : { background: 'rgba(255,255,255,0.03)' }
          }
        >
          {session.id}
          {session.isClicking && (
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: `rgb(var(--accent))`, boxShadow: `0 0 6px rgba(var(--accent), 0.4)` }}
            />
          )}
        </button>
      ))}
      {canAddSession && (
        <button
          onClick={onAddSession}
          className="w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border border-dashed border-white/[0.1] text-white/30 hover:text-white/50 hover:border-white/[0.2]"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          +
        </button>
      )}

      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-[100] rounded-lg border py-1 px-1 shadow-xl"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            background: 'linear-gradient(180deg, var(--dropdown-from), var(--dropdown-to))',
            borderColor: 'var(--dropdown-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            onClick={() => {
              onDeleteSession(contextMenu.sessionId);
              setContextMenu(null);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 w-full"
            style={{ color: 'rgb(var(--accent))' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(var(--accent), 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
