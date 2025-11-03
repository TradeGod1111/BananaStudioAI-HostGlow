import React from 'react';

interface HeaderProps {
    originalImage: File | null;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ originalImage, onReset }) => {
    return (
      <header className="bg-header-nav shadow-md border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-primary">
            🍌 HostGlow
          </h1>
          {originalImage && (
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-bold bg-surface rounded-md hover:bg-border-dark transition-colors"
            >
              Upload New Photo
            </button>
          )}
        </div>
      </header>
    );
};
