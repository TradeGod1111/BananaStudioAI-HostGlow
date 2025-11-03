import React, { useState } from 'react';
import type { EnhancementOptions } from '../types';

interface OptionsPanelProps {
  options: EnhancementOptions;
  setOptions: React.Dispatch<React.SetStateAction<EnhancementOptions>>;
}

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="block bg-gray-600 peer-checked:bg-brand-primary w-11 h-6 rounded-full transition"></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:transform peer-checked:translate-x-5 peer-checked:bg-brand-charcoal`}></div>
      </div>
    </label>
);


export const OptionsPanel: React.FC<OptionsPanelProps> = ({ options, setOptions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptionChange = <K extends keyof EnhancementOptions>(key: K, value: EnhancementOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="border-t border-border-dark pt-6">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex justify-between items-center text-left">
        <h3 className="text-lg font-bold font-heading">Fine-Tune</h3>
        <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <Toggle
            label="Background Cleanup"
            checked={options.cleanup}
            onChange={(checked) => handleOptionChange('cleanup', checked)}
          />
          <Toggle
            label="Remove Object"
            checked={options.removeObject}
            onChange={(checked) => handleOptionChange('removeObject', checked)}
          />
          {options.removeObject && (
            <input
              type="text"
              placeholder="e.g., 'the red cushion on the sofa'"
              value={options.objectToRemove}
              onChange={(e) => handleOptionChange('objectToRemove', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md focus:ring-brand-primary focus:border-brand-primary"
            />
          )}
        </div>
      )}
    </div>
  );
};