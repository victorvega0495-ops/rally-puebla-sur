export const fireConfetti = async () => {
  try {
    if ((window as any).confetti) {
      (window as any).confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.onload = () => {
      (window as any).confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    };
    document.head.appendChild(script);
  } catch {
    // confetti unavailable
  }
};
