export const registerHighlightWorklet = async () => {
  // Check if the browser supports CSS Paint API
  if (!('paintWorklet' in CSS)) {
    console.warn('CSS Paint API is not supported. Falling back to standard highlighting.');
    return false;
  }

  try {
    // @ts-ignore - TypeScript doesn't have proper types for CSS Paint Worklet
    await CSS.paintWorklet.addModule('/src/worklets/highlight.worklet.js');
    console.log('Paint worklet registered successfully');
    return true;
  } catch (error) {
    console.warn('Failed to register paint worklet. Falling back to standard highlighting:', error);
    return false;
  }
};