// Speech Utility File - Bilingual capability (English + Hindi) with anti-repetition features
let lastSpokenTime = 0;

export function speak(message, lang = "en-US") {
  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = lang;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

export function speakWithDelay(message, lang = "en-US", delayMs = 3000) {
  const now = Date.now();

  if (now - lastSpokenTime > delayMs) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = lang;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
    lastSpokenTime = now;
  }
}

export function speakBilingual(eng, hindi, delayMs = 5000) {
  const now = Date.now();

  if (now - lastSpokenTime > delayMs) {
    const speech1 = new SpeechSynthesisUtterance(eng);
    speech1.lang = "en-US";
    speech1.rate = 1;
    speech1.pitch = 1;

    const speech2 = new SpeechSynthesisUtterance(hindi);
    speech2.lang = "hi-IN";
    speech2.rate = 1;
    speech2.pitch = 1;

    window.speechSynthesis.speak(speech1);

    setTimeout(() => {
      window.speechSynthesis.speak(speech2);
    }, 1500);

    lastSpokenTime = now + 1500; // Account for the delay
  }
}

// Global click event to initialize web speech (Browser Requirement)
export function initSpeechSynthesis() {
  document.body.addEventListener("click", () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, { once: true });
}
