import { RefObject, useCallback, useEffect, useState } from 'react';
import { registerHighlightWorklet } from '../worklets/highlightWorklet';

export function useTextHighlight(textRef: RefObject<HTMLDivElement>) {
  const [isPaintWorkletSupported, setIsPaintWorkletSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const initWorklet = async () => {
      const isSupported = await registerHighlightWorklet();
      setIsPaintWorkletSupported(isSupported);
    };
    initWorklet();
  }, []);

  const initializeHighlight = useCallback(() => {
    if (!textRef.current) return;
    
    if (isPaintWorkletSupported) {
      textRef.current.style.setProperty('--highlight-x', '0');
      textRef.current.style.setProperty('--highlight-y', '0');
      textRef.current.style.setProperty('--highlight-width', '0');
      textRef.current.style.setProperty('--highlight-height', '0');
    } else {
      textRef.current.style.backgroundColor = 'transparent';
    }
  }, [isPaintWorkletSupported]);

  const updateHighlight = useCallback((startOffset: number, endOffset: number) => {
    if (!textRef.current) return;

    const range = document.createRange();
    const textNode = textRef.current.firstChild;
    if (!textNode) return;

    try {
      range.setStart(textNode, startOffset);
      range.setEnd(textNode, endOffset);

      const rects = range.getClientRects();
      if (rects.length === 0) return;

      const containerRect = textRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(textRef.current);
      
      // Get all relevant padding and margin values
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const borderLeft = parseFloat(computedStyle.borderLeftWidth);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      
      // Use the first rect for single-line text or handle multiple lines
      const rect = rects[0];
      
      if (isPaintWorkletSupported) {
        // Calculate x position relative to the content box
        // const x = range.getBoundingClientRect().left - containerRect.left - paddingLeft;
        const x = rect.left - containerRect.left;
        // Calculate y position to align with text
        const y = rect.top - containerRect.top - paddingTop + (rect.height * 0.2);
        
        textRef.current.style.setProperty('--highlight-x', `${x}px`);
        textRef.current.style.setProperty('--highlight-y', `${y}px`);
        textRef.current.style.setProperty('--highlight-width', `${rect.width}px`);
        textRef.current.style.setProperty('--highlight-height', `${rect.height * 1.5}px`);
      } else {
        textRef.current.style.backgroundColor = '#818cf833';
      }
    } catch (error) {
      console.warn('Error updating highlight:', error);
    } finally {
      range.detach();
    }
  }, [isPaintWorkletSupported]);

  const resetHighlight = useCallback(() => {
    if (!textRef.current) return;
    
    if (isPaintWorkletSupported) {
      textRef.current.style.setProperty('--highlight-width', '0');
    } else {
      textRef.current.style.backgroundColor = 'transparent';
    }
  }, [isPaintWorkletSupported]);

  return {
    initializeHighlight,
    updateHighlight,
    resetHighlight,
    isPaintWorkletSupported
  };
}