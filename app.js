(() => {
  const WHATSAPP = '5532984773877';
  const analytics = () => window.DesignerSaAnalytics;
  const track = (event, params = {}) => analytics()?.track?.(event, params);

  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const roomPreview = document.getElementById('roomPreview');
  const roomScene = document.getElementById('roomScene');
  const roomLabel = document.getElementById('roomLabel');
  const roomNumber = document.getElementById('roomNumber');
  const roomHeadline = document.getElementById('roomHeadline');
  const roomDescription = document.getElementById('roomDescription');
  const roomBenefits = document.getElementById('roomBenefits');
  const sceneCaption = document.getElementById('sceneCaption');

  const rooms = {
    cozinha: {
      label:'COZINHA', number:'01', ambient:'Cozinha', scene:'COZINHA · SOB MEDIDA',
      headline:'Tudo no lugar, sem desperdiçar espaço.',
      description:'Planejamento de armazenamento, circulação e bancadas para deixar o uso mais simples e o ambiente visualmente leve.',
      benefits:['Melhor aproveitamento de cantos e alturas','Organização pensada para a rotina','Acabamento integrado ao ambiente']
    },
    closet: {
      label:'QUARTO & CLOSET', number:'02', ambient:'Closet', scene:'CLOSET · ORGANIZAÇÃO',
      headline:'Organização que deixa a rotina mais leve.',
      description:'Divisões, nichos e volumes são pensados para o que você realmente precisa guardar, acessar e visualizar no dia a dia.',
      benefits:['Divisões de acordo com o uso','Aproveitamento vertical','Visual limpo e personalizado']
    },
    sala: {
      label:'SALA & PAINEL', number:'03', ambient:'Sala', scene:'SALA · INTEGRAÇÃO',
      headline:'Integração sem pesar no ambiente.',
      description:'Painéis e apoios ajudam a organizar equipamentos, objetos e circulação sem transformar a sala em um conjunto de módulos soltos.',
      benefits:['Fios e equipamentos mais organizados','Volumes integrados à arquitetura','Mais unidade visual']
    },
    escritorio: {
      label:'ESCRITÓRIO', number:'04', ambient:'Escritório', scene:'ESCRITÓRIO · FOCO',
      headline:'Um espaço que ajuda você a produzir melhor.',
      description:'Bancada, armazenamento e ergonomia são organizados para reduzir improvisos e manter o ambiente funcional ao longo do dia.',
      benefits:['Superfície de trabalho adequada','Armazenamento acessível','Organização visual e funcional']
    }
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold:.12, rootMargin:'0px 0px -4% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
  }

  function handleScroll(){ header?.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', handleScroll, { passive:true });
  handleScroll();

  menuToggle?.addEventListener('click', () => {
    const open = mobileMenu?.classList.toggle('open') || false;
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded','false');
  }));

  document.querySelectorAll('.room-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const roomKey = tab.dataset.room;
      const room = rooms[roomKey];
      if (!room) return;
      document.querySelectorAll('.room-tab').forEach((t) => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });
      roomPreview?.classList.add('is-changing');
      roomScene?.classList.add('scene-changing');
      setTimeout(() => {
        if (roomLabel) roomLabel.textContent = room.label;
        if (roomNumber) roomNumber.textContent = room.number;
        if (roomHeadline) roomHeadline.textContent = room.headline;
        if (roomDescription) roomDescription.textContent = room.description;
        if (roomBenefits) roomBenefits.innerHTML = room.benefits.map((item) => `<li>${item}</li>`).join('');
        if (roomScene) roomScene.dataset.room = roomKey;
        if (sceneCaption) sceneCaption.textContent = room.scene;
        roomPreview?.classList.remove('is-changing');
        roomScene?.classList.remove('scene-changing');
      }, 170);
      track('room_select', { room: roomKey, room_label: room.label });
    });
  });

  /* Quote funnel — only initialized on pages that contain it */
  const overlay = document.getElementById('quoteOverlay');
  const progressBar = document.getElementById('progressBar');
  const stepCounter = document.getElementById('stepCounter');
  const backButton = document.getElementById('backButton');
  const continueButton = document.getElementById('continueButton');
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const cityInput = document.getElementById('cityInput');
  const ambientOptionsContainer = document.getElementById('ambientOptions');
  const stageOptionsContainer = document.getElementById('stageOptions');
  const deadlineOptionsContainer = document.getElementById('deadlineOptions');

  if (overlay && progressBar && stepCounter && backButton && continueButton && nameInput && phoneInput && cityInput && ambientOptionsContainer && stageOptionsContainer && deadlineOptionsContainer) {
    const quote = { ambient:'', stage:'', deadline:'', name:'', phone:'', city:'Juiz de Fora' };
    let step = 1;
    let lastFocused = null;
    let quoteOpened = false;
    let quoteCompleted = false;
    const ambientOptions = ['Cozinha','Quarto','Closet','Sala','Banheiro','Escritório','Outro'];
    const stageOptions = ['Já tenho projeto ou planta','Tenho medidas e referências','Quero ajuda para começar'];
    const deadlineOptions = ['O quanto antes','Em até 3 meses','De 3 a 6 meses','Ainda estou pesquisando'];

    function buildOptions(container, options, key){
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
            item.setAttribute('aria-pressed','false');
          });
          button.classList.add('selected');
          button.setAttribute('aria-pressed','true');
          validate();
        });
        container.appendChild(button);
      });
    }

    function renderOptions(){
      buildOptions(ambientOptionsContainer, ambientOptions, 'ambient');
      buildOptions(stageOptionsContainer, stageOptions, 'stage');
      buildOptions(deadlineOptionsContainer, deadlineOptions, 'deadline');
    }

    function digitsOnly(value){ return value.replace(/\D/g,''); }
    function maskPhone(value){
      const d = digitsOnly(value).slice(0,11);
      if (d.length <= 2) return d ? `(${d}` : '';
      if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
      if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
      return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    }

    function validate(){
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

    function setStep(next, shouldTrack = true){
      step = Math.max(1, Math.min(4, next));
      document.querySelectorAll('.quote-step').forEach((section) => section.classList.toggle('active', Number(section.dataset.step) === step));
      stepCounter.textContent = `${step} de 4`;
      progressBar.style.width = `${step * 25}%`;
      backButton.style.visibility = step === 1 ? 'hidden' : 'visible';
      continueButton.innerHTML = step === 4 ? 'Ir para o WhatsApp <span>↗</span>' : 'Continuar <span>→</span>';
      validate();
      if (shouldTrack && quoteOpened) track('quote_step_view', { step, ambient: quote.ambient || undefined });
    }

    function openQuote(ambient=''){
      lastFocused = document.activeElement;
      if (ambient) quote.ambient = ambient;
      renderOptions();
      overlay.hidden = false;
      document.body.classList.add('panel-open');
      quoteOpened = true;
      quoteCompleted = false;
      setStep(ambient ? 2 : 1, false);
      track('quote_open', { preselected_ambient: ambient || undefined, starting_step: ambient ? 2 : 1 });
      requestAnimationFrame(() => overlay.querySelector('.quote-close')?.focus());
    }

    function closeQuote(reason='close_button'){
      if (quoteOpened && !quoteCompleted) track('quote_abandon', { step, ambient: quote.ambient || undefined, reason });
      quoteOpened = false;
      overlay.hidden = true;
      document.body.classList.remove('panel-open');
      lastFocused?.focus?.();
    }

    function sendWhatsApp(){
      validate();
      if (continueButton.disabled) return;
      const attribution = analytics()?.attribution?.session || {};
      const sourceLabel = [attribution.source, attribution.medium].filter(Boolean).join(' / ');
      const campaign = attribution.campaign ? `Campanha: ${attribution.campaign}` : '';
      const message = [
        'Olá! Gostaria de solicitar um orçamento de móveis planejados.','',
        `Ambiente: ${quote.ambient}`,
        `Etapa atual: ${quote.stage}`,
        `Prazo: ${quote.deadline}`,
        `Nome: ${quote.name}`,
        `WhatsApp: ${quote.phone}`,
        `Cidade: ${quote.city}`,
        sourceLabel ? `Origem: ${sourceLabel}` : '',
        campaign
      ].filter(Boolean).join('\n');
      quoteCompleted = true;
      track('quote_complete', { ambient: quote.ambient, stage: quote.stage, deadline: quote.deadline, funnel_steps:4 });
      track('whatsapp_click', { placement:'quote_complete', ambient: quote.ambient });
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    }

    document.querySelectorAll('[data-open-quote]').forEach((button) => button.addEventListener('click', () => openQuote(button.dataset.ambient || '')));
    document.querySelectorAll('[data-close-quote]').forEach((button) => button.addEventListener('click', () => closeQuote('close_button')));
    backButton.addEventListener('click', () => setStep(step - 1));
    continueButton.addEventListener('click', () => step < 4 ? setStep(step + 1) : sendWhatsApp());
    phoneInput.addEventListener('input', () => { phoneInput.value = maskPhone(phoneInput.value); validate(); });
    [nameInput, cityInput].forEach((input) => input.addEventListener('input', validate));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) closeQuote('escape'); });
    window.addEventListener('pagehide', () => {
      if (quoteOpened && !quoteCompleted) track('quote_abandon', { step, ambient: quote.ambient || undefined, reason:'page_exit' });
      quoteOpened = false;
    });

    renderOptions();
    setStep(1, false);
  }
})();
