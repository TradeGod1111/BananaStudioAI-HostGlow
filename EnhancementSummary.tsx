import React, { useState } from 'react';

interface EnhancementSummaryProps {
    promptLog: string;
}

export const EnhancementSummary: React.FC<EnhancementSummaryProps> = ({ promptLog }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(promptLog).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="mt-4 p-4 bg-surface/60 rounded-lg text-xs">
            <div className="flex justify-between items-center mb-1">
                <p className="font-bold">Enhancement Summary</p>
                <button 
                    onClick={handleCopy}
                    className="px-2 py-1 text-xs font-semibold bg-border-dark rounded-md hover:bg-brand-charcoal transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy steps'}
                </button>
            </div>
            <p className="italic font-mono text-gray-300 text-xs leading-relaxed">{promptLog}</p>
        </div>
    );
};
