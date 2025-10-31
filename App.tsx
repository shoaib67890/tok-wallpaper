
import React from 'react';
import { VoiceGenerator } from './components/VoiceGenerator';
import { Header } from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl">
        <Header />
        <main>
          <VoiceGenerator />
        </main>
      </div>
    </div>
  );
};

export default App;
