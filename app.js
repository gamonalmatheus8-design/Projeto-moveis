(() => {
  const WHATSAPP = '5532984773877';
  const header = document.getElementById('siteHeader');
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('quoteOverlay');
  const closeButton = document.getElementById('quoteClose');
  const stepCounter = document.getElementById('stepCounter');
  const progressBar = document.getElementById('progressBar');
  const backButton = document.getElementById('backButton');
  const continueButton = document.getElementById('continueButton');
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const cityInput = document.getElementById('cityInput');
  const heroImage = document.querySelector('.hero-image');
  const roomStage = document.getElementById('roomStage');
  const roomImage = document.getElementById('roomImage');
  const roomKicker = document.getElementById('roomKicker');
  const roomTitle = document.getElementById('roomTitle');
  const roomText = document.getElementById('roomText');
  const roomCount = document.getElementById('roomCount');
  const roomAction = document.getElementById('roomAction');

  const rooms = {
    cozinha: {
      label: 'COZINHA', ambient: 'Cozinha', count: '01 / 04',
      title: 'Mais fluxo. Menos excesso.',
      text: 'Bancadas, circulação, armazenamento e acabamento pensados como um único conjunto para a rotina funcionar com naturalidade.',
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1800&q=88',
      alt: 'Cozinha planejada de referência'
    },
    closet: {
      label: 'QUARTOS & CLOSETS', ambient: 'Closet', count: '02 / 04',
      title: 'Organização que desaparece no uso.',
      text: 'Cada divisão tem uma função clara para deixar o dia a dia mais leve, preservando uma estética limpa e coerente com o ambiente.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=88',
      alt: 'Closet e dormitório planejado de referência'
    },
    sala: {
      label: 'SALAS & PAINÉIS', ambient: 'Sala', count: '03 / 04',
      title: 'Integração sem perder identidade.',
      text: 'Painéis, apoios e volumes desenhados para conversar com a arquitetura e organizar o ambiente sem pesar no visual.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=88',
      alt: 'Sala planejada de referência'
    },
    corporativo: {
      label: 'CORPORATIVO', ambient: 'Escritório', count: '04 / 04',
      title: 'Funcionalidade com presença.',
      text: 'Soluções sob medida para organizar operação, circulação e apresentação do espaço com uma linguagem profissional e durável.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=88',
      alt: 'Ambiente corporativo planejado de referência'
    }
  };

  const quote = { ambient: '', stage: '', deadline: '', name: '', phone: '', city: 'Juiz de Fora' };
  let step = 1;
  let lastFocused = null;

  const ambientOptions = ['Cozinha', 'Quarto', 'Closet', 'Sala', 'Banheiro', 'Escritório', 'Outro'];
  const stageOptions = ['Já tenho projeto ou planta', 'Tenho medidas e referências', 'Quero ajuda para começar'];
  const deadlineOptions = ['O quanto antes', 'Em até 3 meses', 'De 3 a 6 meses', 'Ainda estou pesquisando'];

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 35);
    if (heroImage && window.matchMedia('(min-width: 901px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const y = Math.min(window.scrollY * 0.06, 34);
      heroImage.style.transform = `scale(1.035) translateY(${y}px)`;
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.scroll;
      if (target === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mobileMenu.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  menuButton?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  function setRoom(key) {
    const room = rooms[key];
    if (!room) return;
    document.querySelectorAll('.room-tab').forEach((tab) => {
      const active = tab.dataset.room === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    roomStage.classList.add('is-changing');
    setTimeout(() => {
      roomImage.src = room.image;
      roomImage.alt = room.alt;
      roomKicker.textContent = room.label;
      roomTitle.textContent = room.title;
      roomText.textContent = room.text;
      roomCount.textContent = room.count;
      roomAction.dataset.ambient = room.ambient;
      roomStage.classList.remove('is-changing');
    }, 210);
  }

  document.querySelectorAll('.room-tab').forEach((tab) => tab.addEventListener('click', () => setRoom(tab.dataset.room)));

  function buildOptions(containerId, options, key) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    options.forEach((label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.setAttribute('aria-pressed', String(quote[key] === label));
      if (quote[key] === label) button.classList.add('selected');
      button.addEventListener('click', () => {
        quote[key] = label;
        [...container.children].forEach((item) => {
          item.classList.remove('selected');
          item.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('selected');
        button.setAttribute('aria-pressed', 'true');
        validate();
      });
      container.appendChild(button);
    });
  }

  function renderOptions() {
    buildOptions('ambientOptions', ambientOptions, 'ambient');
    buildOptions('stageOptions', stageOptions, 'stage');
    buildOptions('deadlineOptions', deadlineOptions, 'deadline');
  }

  function digitsOnly(value) { return value.replace(/\D/g, ''); }
  function maskPhone(value) {
    const digits = digitsOnly(value).slice(0, 11);
    if (digits.length <= 2) return digits ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function validate() {
    let valid = false;
    if (step === 1) valid = Boolean(quote.ambient);
    if (step === 2) valid = Boolean(quote.stage);
    if (step === 3) valid = Boolean(quote.deadline);
    if (step === 4) {
      quote.name = nameInput.value.trim();
      quote.phone = phoneInput.value.trim();
      quote.city = cityInput.value.trim();
      valid = Boolean(quote.name && digitsOnly(quote.phone).length >= 10 && quote.city);
    }
    continueButton.disabled = !valid;
  }

  function setStep(next) {
    step = Math.max(1, Math.min(4, next));
    document.querySelectorAll('.quote-step').forEach((item) => item.classList.toggle('active', Number(item.dataset.step) === step));
    stepCounter.textContent = `0${step} — 04`;
    progressBar.style.width = `${step * 25}%`;
    backButton.style.visibility = step === 1 ? 'hidden' : 'visible';
    continueButton.innerHTML = step === 4 ? 'Ir para o WhatsApp <span>↗</span>' : 'Continuar <span>→</span>';
    validate();
  }

  function openQuote(ambient = '') {
    lastFocused = document.activeElement;
    if (ambient) quote.ambient = ambient;
    renderOptions();
    overlay.hidden = false;
    document.body.classList.add('panel-open');
    setStep(ambient ? 2 : 1);
    mobileMenu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    requestAnimationFrame(() => closeButton.focus());
  }

  function closeQuote() {
    overlay.hidden = true;
    document.body.classList.remove('panel-open');
    lastFocused?.focus?.();
  }

  function sendWhatsApp() {
    validate();
    if (continueButton.disabled) return;
    const message = [
      'Olá! Gostaria de conversar sobre um projeto de móveis planejados.',
      '',
      `Ambiente: ${quote.ambient}`,
      `Etapa atual: ${quote.stage}`,
      `Prazo: ${quote.deadline}`,
      `Nome: ${quote.name}`,
      `WhatsApp: ${quote.phone}`,
      `Cidade: ${quote.city}`
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  document.querySelectorAll('[data-open-quote]').forEach((button) => button.addEventListener('click', () => openQuote()));
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-ambient]');
    if (target) openQuote(target.dataset.ambient);
  });
  document.querySelectorAll('[data-close-quote]').forEach((button) => button.addEventListener('click', closeQuote));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) closeQuote(); });

  backButton.addEventListener('click', () => setStep(step - 1));
  continueButton.addEventListener('click', () => step < 4 ? setStep(step + 1) : sendWhatsApp());
  phoneInput.addEventListener('input', () => { phoneInput.value = maskPhone(phoneInput.value); validate(); });
  [nameInput, cityInput].forEach((input) => input.addEventListener('input', validate));

  renderOptions();
  setStep(1);
})();
