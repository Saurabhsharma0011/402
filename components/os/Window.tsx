'use client';

import { useState, useRef, useEffect } from 'react';

interface WindowProps {
  title: string;
  icon: string;
  onClose: () => void;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export default function Window({ 
  title, 
  icon, 
  onClose, 
  children,
  defaultWidth = 800,
  defaultHeight = 600 
}: WindowProps) {
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Center window on mount
  useEffect(() => {
    const centerX = (window.innerWidth - defaultWidth) / 2;
    const centerY = (window.innerHeight - defaultHeight) / 2;
    setPosition({ x: centerX, y: centerY });
  }, [defaultWidth, defaultHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isMaximized) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const windowStyle = isMaximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 64px)' }
    : { 
        left: `${position.x}px`, 
        top: `${position.y}px`, 
        width: `${size.width}px`, 
        height: `${size.height}px` 
      };

  return (
    <div
      ref={windowRef}
      className="fixed bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl 
                 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-50 
                 transition-all duration-200"
      style={windowStyle}
    >
      {/* macOS-style Title Bar */}
      <div
        className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl 
                   border-b border-gray-700/30 px-4 py-3 flex items-center justify-between
                   cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        {/* macOS Window Controls - Left Side */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors
                     shadow-sm flex items-center justify-center group"
            title="Close"
          >
            <span className="opacity-0 group-hover:opacity-100 text-red-900 text-[8px] font-bold">✕</span>
          </button>
          <button
            onClick={() => {}} // Minimize functionality (optional)
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors
                     shadow-sm flex items-center justify-center group"
            title="Minimize"
          >
            <span className="opacity-0 group-hover:opacity-100 text-yellow-900 text-[8px] font-bold">−</span>
          </button>
          <button
            onClick={toggleMaximize}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors
                     shadow-sm flex items-center justify-center group"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <span className="opacity-0 group-hover:opacity-100 text-green-900 text-[8px] font-bold">+</span>
          </button>
        </div>

        {/* Window Title - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-gray-300 font-semibold text-sm tracking-tight">{title}</span>
        </div>

        {/* Empty space for symmetry */}
        <div className="w-16"></div>
      </div>

      {/* Window Content with macOS-style background */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {children}
      </div>
    </div>
  );
}
