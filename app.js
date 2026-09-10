(() => {
  const WHATSAPP = '5532984773877';
  const modal = document.getElementById('quoteModal');
  const closeButton = document.getElementById('modalClose');
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const stepCounter = document.getElementById('stepCounter');
  const progressBar = document.getElementById('progressBar');
  const backButton = document.getElementById('backButton');
  const continueButton = document.getElementById('continueButton');
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const cityInput = document.getElementById('cityInput');

  const data = {
    ambient: '',
    stage: '',
    deadline: '',
    name: '',
    phone: '',
    city: 'Juiz de Fora'
  };

  let step = 1;
  const ambientOptions = ['Cozinha', 'Quarto', 'Closet', 'Sala', 'Banheiro', 'Escritório', 'Outro'];
  const stageOptions = ['Já tenho projeto ou planta', 'Tenho medidas e referências', 'Quero ajuda para começar'];
  const deadlineOptions = ['O quanto antes', 'Em até 3 meses', 'De 3 a 6 meses', 'Ainda estou pesquisando'];

  function buildOptions(containerId, options, key) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    options.forEach((label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      if (data[key] === label) button.classList.add('selected');
      button.addEventListener('click', () => {
        data[key] = label;
        [...container.children].forEach((item) => item.classList.remove('selected'));
        button.classList.add('selected');
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

  function validate() {
    let valid = false;
    if (step === 1) valid = !!data.ambient;
    if (step === 2) valid = !!data.stage;
    if (step === 3) valid = !!data.deadline;
    if (step === 4) {
      data.name = nameInput.value.trim();
      data.phone = phoneInput.value.trim();
      data.city = cityInput.value.trim();
      valid = !!(data.name && data.phone && data.city);
    }
    continueButton.disabled = !valid;
  }

  function setStep(nextStep) {
    step = Math.max(1, Math.min(4, nextStep));
    document.querySelectorAll('.quote-step').forEach((item) => item.classList.toggle('active', Number(item.dataset.step) === step));
    stepCounter.textContent = `Etapa ${step} de 4`;
    progressBar.style.width = `${step * 25}%`;
    backButton.style.visibility = step === 1 ? 'hidden' : 'visible';
    continueButton.innerHTML = step === 4 ? 'Continuar no WhatsApp <span>↗</span>' : 'Continuar <span>→</span>';
    validate();
  }

  function openQuote(ambient = '') {
    if (ambient) data.ambient = ambient;
    renderOptions();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setStep(ambient ? 2 : 1);
    mobileMenu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }

  function closeQuote() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function sendWhatsApp() {
    validate();
    if (continueButton.disabled) return;
    const message = [
      'Olá! Gostaria de conversar sobre um projeto de móveis planejados.',
      '',
      `Ambiente: ${data.ambient}`,
      `Etapa atual: ${data.stage}`,
      `Prazo: ${data.deadline}`,
      `Nome: ${data.name}`,
      `WhatsApp: ${data.phone}`,
      `Cidade: ${data.city}`
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  document.querySelectorAll('[data-open-quote]').forEach((button) => button.addEventListener('click', () => openQuote()));
  document.querySelectorAll('[data-ambient]').forEach((button) => button.addEventListener('click', () => openQuote(button.dataset.ambient)));
  document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => {
    const id = button.dataset.scroll;
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    mobileMenu.classList.remove('open');
  }));

  menuButton?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  closeButton.addEventListener('click', closeQuote);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeQuote(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeQuote(); });

  backButton.addEventListener('click', () => setStep(step - 1));
  continueButton.addEventListener('click', () => {
    if (step < 4) setStep(step + 1);
    else sendWhatsApp();
  });

  [nameInput, phoneInput, cityInput].forEach((input) => input.addEventListener('input', validate));
  renderOptions();
  setStep(1);
})();
