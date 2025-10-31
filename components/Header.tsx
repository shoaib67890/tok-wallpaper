
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text mb-2">
        AI Voiceover Studio
      </h1>
      <p className="text-lg text-gray-400">
        Transform your scripts into professional, human-like voiceovers instantly.
      </p>
    </header>
  );
};
