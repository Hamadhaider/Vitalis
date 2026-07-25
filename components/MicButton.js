'use client';

import { useEffect, useRef, useState } from 'react';

// Lets the user speak instead of type, using the browser's built-in speech
// recognition (Chrome/Edge). No API key, no cost. Silently hides itself on
// browsers that don't support it (e.g. Firefox, some Safari versions).
export default function MicButton({ onResult, className = '' }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, [onResult]);

  function toggleListening() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      aria-label={listening ? 'Stop recording' : 'Speak instead of typing'}
      title={listening ? 'Listening… tap to stop' : 'Speak instead of typing'}
      className={`focus-ring inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-full border transition-colors ${
        listening
          ? 'bg-brick text-paper border-brick animate-pulse'
          : 'border-line text-pine hover:bg-pine-50'
      } ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="5.5" y="1" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M3 7.5a5 5 0 0 0 10 0M8 14.5v-2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
