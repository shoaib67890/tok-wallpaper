
import React, { useState, useEffect } from 'react';
import { decode, createWavBlob } from '../utils/audioUtils';
import { DownloadIcon } from './icons/Icons';

interface AudioPlayerProps {
  audioData: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioData }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    if (audioData) {
      try {
        const pcmData = decode(audioData);
        const wavBlob = createWavBlob(pcmData);
        objectUrl = URL.createObjectURL(wavBlob);
        setAudioUrl(objectUrl);
      } catch (error) {
        console.error("Failed to process audio data:", error);
        setAudioUrl(null);
      }
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [audioData]);

  if (!audioUrl) {
    return <div className="text-center text-gray-400">Preparing audio...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl font-semibold text-gray-200">Your Voiceover is Ready!</h3>
      <audio controls src={audioUrl} className="w-full max-w-md">
        Your browser does not support the audio element.
      </audio>
      <a
        href={audioUrl}
        download="voiceover.wav"
        className="inline-flex items-center justify-center gap-2 text-md font-medium bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
      >
        <DownloadIcon />
        Download Voice (WAV)
      </a>
    </div>
  );
};
