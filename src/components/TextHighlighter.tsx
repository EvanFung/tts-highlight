import React from 'react';

interface TextHighlighterProps {
  text: string;
  currentWordIndex: number;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  text,
  currentWordIndex,
}) => {
  const words = text.split(' ');

  return (
    <div className="text-lg leading-relaxed text-gray-800">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span
            className={`relative inline-block transition-all duration-200 ${
              index === currentWordIndex
                ? 'text-indigo-700 font-semibold transform scale-105'
                : ''
            }`}
          >
            {word}
            {index === currentWordIndex && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-400 rounded animate-pulse" />
            )}
          </span>
          {index < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </div>
  );
};