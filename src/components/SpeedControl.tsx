import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function SpeedControl({ speed, onSpeedChange }: SpeedControlProps) {
  const decreaseSpeed = () => {
    const newSpeed = Math.max(0.5, speed - 0.25);
    onSpeedChange(newSpeed);
  };

  const increaseSpeed = () => {
    const newSpeed = Math.min(2, speed + 0.25);
    onSpeedChange(newSpeed);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">Reading Speed:</span>
      <div className="flex items-center gap-2">
        <button
          onClick={decreaseSpeed}
          disabled={speed <= 0.5}
          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="min-w-[3ch] text-center">{speed}x</span>
        <button
          onClick={increaseSpeed}
          disabled={speed >= 2}
          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}