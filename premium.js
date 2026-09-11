(() => {
  // V5.2 — identidade cromática Designer Sá.
  // Carregado por último para sobrescrever a base visual sem alterar a estrutura das páginas.
  if (!document.querySelector('link[data-sa-theme="v5.2"]')) {
    document.querySelectorAll('link[data-sa-theme]').forEach((node) => node.remove());
    const theme = document.createElement('link');
    theme.rel = 'stylesheet';
    theme.href = '/theme.css?v=5.2';
    theme.dataset.saTheme = 'v5.2';
    document.head.appendChild(theme);
  }
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', '#DDE1DA');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const hero = document.querySelector('.hero-art');
  const frame = document.getElementById('premiumRoomFrame');

  // Reading progress
  const progress = document.createElement('div');
  progress.className = 'v4-reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);

  const updateProgress = () => {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    progress.style.setProperty('--read', `${pct}%`);
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  // Architectural hero depth + moving light
  if (hero && frame && finePointer && !reduceMotion) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      frame.style.setProperty('--mx', x.toFixed(3));
      frame.style.setProperty('--my', y.toFixed(3));
      frame.style.transform = `rotateY(${x * 3.8}deg) rotateX(${y * -3.8}deg) translateZ(0)`;
    });
    hero.addEventListener('pointerleave', () => {
      frame.style.setProperty('--mx', 0);
      frame.style.setProperty('--my', 0);
      frame.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  // Magnetic motion only on desktop/fine pointer; tiny enough not to hurt usability
  const magnets = document.querySelectorAll('.button-primary, .header-cta, .offer-button, .button-light');
  magnets.forEach((element) => {
    element.setAttribute('data-v4-magnetic', '');
    if (!finePointer || reduceMotion) return;
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.055}px, ${y * 0.09}px) translateY(-1px)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });

  // FAQ remains exclusive for a cleaner flow
  const faqItems = [...document.querySelectorAll('.faq-list details')];
  faqItems.forEach((item) => item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  }));

  // Add a subtle page-ready state after first paint
  requestAnimationFrame(() => document.body.classList.add('v4-ready'));
})();
