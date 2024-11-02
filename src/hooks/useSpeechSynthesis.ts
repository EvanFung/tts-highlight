import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechOptions {
  onBoundary?: (event: SpeechSynthesisEvent) => void;
  onEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
}

export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    cleanup();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utteranceRef.current = utterance;

    // Handle events
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      options.onEnd?.();
    };
    utterance.onerror = (event) => {
      if (event.error !== 'interrupted') {
        console.error('Speech synthesis error:', event);
      }
      setIsPlaying(false);
      options.onError?.(event);
    };
    utterance.onboundary = options.onBoundary;

    // Chrome bug workaround: periodically refresh speech synthesis
    const refreshSpeech = () => {
      if (isPlaying && utteranceRef.current) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
        timeoutRef.current = setTimeout(refreshSpeech, 5000);
      }
    };
    timeoutRef.current = setTimeout(refreshSpeech, 5000);

    // Start speaking
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  }, [speed, isPlaying, cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setIsPlaying(false);
  }, [cleanup]);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    if (utteranceRef.current && isPlaying) {
      const currentText = utteranceRef.current.text;
      cleanup();
      // Small delay to ensure proper cleanup
      setTimeout(() => speak(currentText), 50);
    }
  }, [cleanup, speak, isPlaying]);

  return {
    speak,
    stop,
    updateSpeed,
    isPlaying,
    speed
  };
}