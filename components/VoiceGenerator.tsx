
import React, { useState, useRef, useCallback } from 'react';
import { generateSpeech } from '../services/geminiService';
import { AVAILABLE_VOICES } from '../constants';
import { Voice } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { UploadIcon, SparklesIcon } from './icons/Icons';

export const VoiceGenerator: React.FC = () => {
  const [script, setScript] = useState<string>('Today we’re making spicy noodles in 5 minutes! It\'s a simple recipe that you\'ll absolutely love.');
  const [selectedVoice, setSelectedVoice] = useState<string>(AVAILABLE_VOICES[0].id);
  const [style, setStyle] = useState<string>('warm and friendly');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!script.trim()) {
      setError('Please enter a script to generate audio.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAudioData(null);
    try {
      const data = await generateSpeech(script, selectedVoice, style);
      setAudioData(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [script, selectedVoice, style]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setScript(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
      <div className="space-y-6">
        {/* Script Input Area */}
        <div className="relative">
          <label htmlFor="script" className="block text-sm font-medium text-gray-300 mb-2">
            Your Script
          </label>
          <textarea
            id="script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Type or paste your cooking script here..."
            className="w-full h-40 p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
            rows={6}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 right-3 flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md transition-colors"
          >
            <UploadIcon />
            Upload Script
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt"
          />
        </div>

        {/* Voice and Style Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="voice" className="block text-sm font-medium text-gray-300 mb-2">
              Choose Voice
            </label>
            <select
              id="voice"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            >
              {AVAILABLE_VOICES.map((voice: Voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">
              Adjust Style / Emotion
            </label>
            <input
              type="text"
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., calm, excited, tutorial style"
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon />
                Generate Audio
              </>
            )}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-center text-red-400">{error}</p>}

      {audioData && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          <AudioPlayer audioData={audioData} />
        </div>
      )}
    </div>
  );
};
