import React, { useState, useRef, useCallback, MouseEvent, TouchEvent, KeyboardEvent } from 'react';

interface CompareSliderProps {
  original: string;
  enhanced: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({ original, enhanced }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };
  
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };
  
  const handleTouchEnd = () => {
    isDragging.current = false;
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition(pos => Math.max(0, pos - 2));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition(pos => Math.min(100, pos + 2));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video select-none overflow-hidden rounded-lg group"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <img src={original} alt="Original" className="absolute inset-0 w-full h-full object-contain" draggable={false} />
      <div className="absolute inset-0 w-full h-full" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <img src={enhanced} alt="Enhanced" className="absolute inset-0 w-full h-full object-contain" draggable={false} />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize opacity-50 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={sliderPosition}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Image comparison slider"
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-2xl">
          <svg className="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
      </div>
       <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded-md">Original</div>
       <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded-md" style={{ opacity: sliderPosition > 50 ? 1 : 0}}>Enhanced</div>
    </div>
  );
};
