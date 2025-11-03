import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { OptionsPanel } from './components/OptionsPanel';
import { CompareSlider } from './components/CompareSlider';
import { Header } from './components/Header';
import { EnhancementSummary } from './components/EnhancementSummary';
import { applyEnhancements } from './services/geminiService';
import type { EnhancementOptions } from './types';
import { PRESETS } from './presets';
import { LIGHTING_LOOKS } from './lightingLooks';

const Footer: React.FC = () => {
  return (
    <footer className="bg-header-nav text-white py-8 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-sans text-sm text-gray-400">Trusted by creators and hosts • Powered by Banana Studio AI</p>
      </div>
    </footer>
  );
};

const presetLabels: Record<string, string> = {
    airbnb: "Airbnb",
    booking: "Booking.com",
    realtor_zillow: "Realtor/Zillow",
    hotels_hospitality: "Hotels",
    restaurants: "Restaurants",
    product_listings: "Products",
    social_media: "Social Media",
    fashion_portraits: "Portraits",
    architecture_interiors: "Architecture",
};

const presetTooltips: Record<string, string> = {
    airbnb: "Bright, warm, welcoming.",
    booking: "Cool, clean, professional.",
    realtor_zillow: "Accurate color and straight lines.",
    hotels_hospitality: "Warm premium ambiance.",
    restaurants: "Natural color, appetizing highlights.",
    product_listings: "Retail-ready on neutral background.",
    social_media: "Natural pop; Golden Hour/Night Neon options.",
    fashion_portraits: "Editorial polish; natural skin.",
    architecture_interiors: "Precise geometry; material clarity.",
}

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [promptLog, setPromptLog] = useState<string>('');
  const [activePreset, setActivePreset] = useState<string>('airbnb');
  const [userDescription, setUserDescription] = useState('');
  const [lightingLook, setLightingLook] = useState('none');
  const [options, setOptions] = useState<EnhancementOptions>({
    cleanup: false,
    removeObject: false,
    objectToRemove: '',
  });

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setEnhancedImage(null);
    setError(null);
    setPromptLog('');
  };

  const handleEnhance = useCallback(async (instructions: string[]) => {
    if (!originalImage) return;
    if (instructions.length === 0) {
      setError("Please select an enhancement option.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      const { enhancedImage: newImage, prompt } = await applyEnhancements(originalImage, instructions, userDescription, lightingLook);
      setEnhancedImage(`data:image/png;base64,${newImage}`);
      setPromptLog(prompt);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, userDescription, lightingLook]);
  
  const handlePresetEnhance = useCallback((presetKey: string) => {
    setActivePreset(presetKey);
    handleEnhance(PRESETS[presetKey as keyof typeof PRESETS]);
  }, [handleEnhance]);
  
  const handleAdvancedEnhance = useCallback(() => {
    const baseInstructions = PRESETS[activePreset as keyof typeof PRESETS] || [];

    let advancedInstructions = [];
    if (options.cleanup) {
      advancedInstructions.push('Additionally, perform background cleanup: remove minor clutter and distracting reflections, filling areas naturally.');
    }
    if (options.removeObject && options.objectToRemove) {
      advancedInstructions.push(`Additionally, remove this specific object: "${options.objectToRemove}". Fill the resulting gap seamlessly, preserving surrounding textures and lines.`);
    }
    
    if (advancedInstructions.length > 0 || userDescription || lightingLook !== 'none') {
      const combinedInstructions = [...baseInstructions, ...advancedInstructions];
      handleEnhance(combinedInstructions);
    } else {
       setError("Please describe an enhancement, select a lighting look, or choose an advanced option to apply.");
    }
  }, [options, activePreset, userDescription, lightingLook, handleEnhance]);

  const reset = useCallback(() => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
    setIsLoading(false);
    setPromptLog('');
    setActivePreset('airbnb');
    setUserDescription('');
    setLightingLook('none');
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-text-on-dark font-sans flex flex-col">
      <Header originalImage={originalImage} onReset={reset} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-brand">
                <h2 className="text-xl font-bold font-heading mb-1">Enhance Your Photo</h2>
                <p className="text-sm text-gray-400 mb-4">Instant AI enhancement tailored for your platform.</p>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-96 bg-background-dark/50 rounded-lg">
                    <svg className="animate-spin h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg font-medium">Enhancing your image...</p>
                    <p className="text-sm text-gray-400">This may take a moment.</p>
                  </div>
                )}
                {error && (
                  <div className="p-4 mb-4 text-sm text-red-200 bg-red-800/50 border border-red-600 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error}
                  </div>
                )}
                {enhancedImage && !isLoading && (
                  <CompareSlider
                    original={URL.createObjectURL(originalImage)}
                    enhanced={enhancedImage}
                  />
                )}
                 {!enhancedImage && !isLoading && (
                   <div className="relative">
                      <img src={URL.createObjectURL(originalImage)} alt="Original" className="w-full h-auto rounded-lg" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                         <p className="text-white text-3xl font-bold font-heading">Ready to Enhance!</p>
                      </div>
                   </div>
                 )}
              </div>
              {promptLog && <EnhancementSummary promptLog={promptLog} />}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-surface p-6 rounded-xl shadow-brand space-y-6">
                <div>
                  <label htmlFor="user-description" className="block text-sm font-medium mb-1">Describe the enhancement (optional)</label>
                  <textarea
                    id="user-description"
                    rows={3}
                    maxLength={200}
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    placeholder="e.g., warmer, brighter, keep wood textures natural."
                    className="w-full px-3 py-2 text-sm rounded-md focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                    <label htmlFor="lighting-look" className="block text-sm font-medium mb-1">Lighting Look</label>
                    <select
                        id="lighting-look"
                        value={lightingLook}
                        onChange={(e) => setLightingLook(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="none">None</option>
                        {Object.keys(LIGHTING_LOOKS).map(key => (
                            <option key={key} value={key}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-heading mb-4">Or, start with a One-Click Preset</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(PRESETS).map(([key]) => (
                      <button
                        key={key}
                        onClick={() => handlePresetEnhance(key)}
                        disabled={isLoading}
                        title={presetTooltips[key]}
                        className={`px-3 py-2 text-xs sm:text-sm font-heading font-bold text-brand-charcoal bg-brand-primary rounded-lg hover:bg-brand-accent hover:shadow-brand-glow-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand-primary ${
                            activePreset === key ? 'active-preset-glow' : ''
                        }`}
                      >
                       {presetLabels[key] || key}
                      </button>
                    ))}
                  </div>
                </div>
                 <button
                    onClick={handleAdvancedEnhance}
                    disabled={isLoading}
                    className="w-full px-4 py-3 font-bold text-sm text-brand-charcoal bg-brand-primary rounded-md hover:bg-brand-accent hover:shadow-brand-glow-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Enhance Now
                </button>
                <OptionsPanel options={options} setOptions={setOptions} />
              </div>

              {enhancedImage && (
                 <div className="mt-8 bg-surface p-6 rounded-xl shadow-brand">
                    <h3 className="text-lg font-bold font-heading mb-4">Download</h3>
                    <a
                      href={enhancedImage}
                      download="hostglow_enhanced.png"
                      className="w-full text-center block px-4 py-3 font-heading font-bold text-brand-charcoal bg-brand-primary rounded-lg hover:bg-brand-accent hover:shadow-brand-glow-hover transition-colors"
                    >
                      Save & Use This Image
                    </a>
                    <p className="text-xs text-center mt-2 text-gray-400">Optimized for platform upload dimensions.</p>
                 </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;