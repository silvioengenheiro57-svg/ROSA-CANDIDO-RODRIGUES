/**
 * Helper to play native English text-to-speech using browser Web Speech API
 */
export function speakEnglish(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = text.replace(/<[^>]*>/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Try to find natural English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice =
    voices.find((v) => v.lang === 'en-GB' || v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null;

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.lang = 'en-US';
  utterance.rate = 0.95; // Slightly clearer pace for learners
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
