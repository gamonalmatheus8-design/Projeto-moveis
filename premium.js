(() => {
  const premiumHero = document.querySelector('.hero-art');
  const premiumFrame = document.getElementById('premiumRoomFrame');
  const canMove = window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (premiumHero && premiumFrame && canMove) {
    premiumHero.addEventListener('pointermove', (event) => {
      const rect = premiumHero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      premiumFrame.style.transform = `rotateY(${x * 4.5}deg) rotateX(${y * -4.5}deg) translateZ(0)`;
    });
    premiumHero.addEventListener('pointerleave', () => {
      premiumFrame.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  const faqItems = [...document.querySelectorAll('.faq-list details')];
  faqItems.forEach((item) => item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => { if (other !== item) other.open = false; });
  }));
})();
