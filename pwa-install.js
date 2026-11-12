/* Install controls for Understand Quran. No changes to learning engine. */
(() => {
  'use strict';
  let deferredPrompt = null;
  const $ = id => document.getElementById(id);
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function showHelp() {
    const title = $('pwaHelpTitle');
    const instructions = $('pwaHelpText');
    if (!title || !instructions) return;
    if (isStandalone()) {
      title.textContent = 'Already installed';
      instructions.textContent = 'You are using the installed Understand Quran app. May your learning be blessed!';
    } else if (isIOS()) {
      title.textContent = 'Install on iPhone or iPad';
      instructions.textContent = 'In Safari, tap Share, choose Add to Home Screen, then tap Add. If that option is missing, open this site in Safari first.';
    } else {
      title.textContent = 'Install Understand Quran';
      instructions.textContent = 'In Chrome or Edge, open the browser menu (⋮) and choose Install app or Add to Home screen. If installation is unavailable, you can still enjoy the website normally.';
    }
    const dialog = $('pwaHelpDialog');
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    else window.alert(title.textContent + '\n\n' + instructions.textContent);
  }
  document.addEventListener('DOMContentLoaded', () => {
    const button = $('pwaInstallButton');
    if (!button) return;
    const close = $('pwaHelpClose');
    close?.addEventListener('click', () => $('pwaHelpDialog')?.close());
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      deferredPrompt = event;
      button.textContent = '↓ Install App';
    });
    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      button.textContent = '✓ App Installed';
    });
    button.addEventListener('click', async () => {
      if (isStandalone()) { showHelp(); return; }
      if (!deferredPrompt) { showHelp(); return; }
      const prompt = deferredPrompt;
      deferredPrompt = null;
      try { await prompt.prompt(); await prompt.userChoice; }
      catch { showHelp(); }
    });
    if (isStandalone()) button.textContent = '✓ App Installed';
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
    }
  });
})();
