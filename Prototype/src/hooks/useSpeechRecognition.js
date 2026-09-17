import { useCallback, useEffect, useRef, useState } from "react";

// Thin wrapper around the browser's built-in SpeechRecognition API —
// this is real speech-to-text, done entirely client-side by the browser
// (Chrome/Edge on desktop and Android ship this; Safari/Firefox support
// is partial or absent, which is why `isSupported` exists and every
// caller must have a manual-entry fallback, matching Section 10.1's UX
// principle).
//
// Usage:
//   const { isSupported, isListening, transcript, start, stop, error, reset }
//     = useSpeechRecognition(lang); // lang e.g. "hi-IN"
export function useSpeechRecognition(lang) {
  const RecognitionCtor =
    typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const isSupported = Boolean(RecognitionCtor);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Recreate the recognizer whenever the target language changes, since
  // SpeechRecognition's `lang` must be set before `.start()` is called —
  // it can't be swapped mid-session.
  useEffect(() => {
    if (!isSupported) return;
    const recognition = new RecognitionCtor();
    recognition.lang = lang;
    recognition.interimResults = true; // fires onresult while still speaking, not just at the end
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      // Concatenate every result segment recognized so far this session —
      // interim (still-being-refined) results included, so the on-screen
      // transcript updates live as the person speaks.
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript;
      }
      setTranscript(combined.trim());
    };

    recognition.onerror = (event) => {
      setError(event.error || "unknown_error");
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
    };
  }, [lang, isSupported, RecognitionCtor]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setTranscript("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // start() throws if called while already listening — safe to ignore.
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => setTranscript(""), []);

  return { isSupported, isListening, transcript, start, stop, error, reset };
}
