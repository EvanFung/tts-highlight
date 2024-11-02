import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { SpeedControl } from './components/SpeedControl';
import { useTextHighlight } from './hooks/useTextHighlight';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

const sampleText = `In the heart of Silicon Valley, innovation flows like electricity through circuits. Engineers and designers work tirelessly to create the next breakthrough that will change how we interact with technology. Every line of code written today could be tomorrow's revolutionary feature.`;

function App() {
  const [showSettings, setShowSettings] = React.useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const wordIndexRef = useRef<number>(0);

  const { initializeHighlight, updateHighlight, resetHighlight } = useTextHighlight(textRef);
  const { speak, stop, updateSpeed, isPlaying, speed } = useSpeechSynthesis();

  useEffect(() => {
    initializeHighlight();
  }, [initializeHighlight]);

  const startReading = () => {
    if (!textRef.current) return;

    // Reset state
    resetHighlight();
    wordIndexRef.current = 0;

    // Pre-calculate word positions
    const wordPositions: { start: number; end: number }[] = [];
    let position = 0;
    const words = sampleText.split(/\s+/);
    
    for (const word of words) {
      wordPositions.push({
        start: position,
        end: position + word.length
      });
      // Add 1 for the space after the word
      position += word.length + 1;
    }

    // Start speaking with word boundary tracking
    speak(sampleText, {
      onBoundary: (event) => {
        if (event.name === 'word' && event.charIndex !== undefined) {
          // Find the closest word position
          const currentPosition = wordPositions[wordIndexRef.current];
          if (currentPosition) {
            console.log(`Highlighting word: ${sampleText.slice(currentPosition.start, currentPosition.end)}`);
            updateHighlight(currentPosition.start, currentPosition.end);
            
            // Check if we're at the second-to-last word
            if (wordIndexRef.current === wordPositions.length - 2) {
              // Schedule the last word highlight
              const lastWordPosition = wordPositions[wordPositions.length - 1];
              const estimatedWordDuration = 50; // milliseconds
              setTimeout(() => {
                updateHighlight(lastWordPosition.start, lastWordPosition.end);
              }, estimatedWordDuration);
            }
            
            wordIndexRef.current++;
          }
        }
      },
      onEnd: () => {
        // Small delay before resetting to ensure the last word is visible
        setTimeout(() => {
          resetHighlight();
          wordIndexRef.current = 0;
        }, 200);
      },
      onError: () => {
        resetHighlight();
        wordIndexRef.current = 0;
      }
    });
  };

  const stopReading = () => {
    stop();
    resetHighlight();
    wordIndexRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-indigo-900">Text-to-Speech Demo</h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {showSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <SpeedControl speed={speed} onSpeedChange={updateSpeed} />
            </div>
          )}

          <div 
            ref={textRef}
            className="mb-8 relative text-lg leading-relaxed text-gray-800 highlight-text p-4"
          >
            {sampleText}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={isPlaying ? stopReading : startReading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Start Reading
                </>
              )}
            </button>
            <button
              onClick={stopReading}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;