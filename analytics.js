(() => {
  const GA_META = document.querySelector('meta[name="ga4-id"]');
  const GA_ID = GA_META?.content?.trim() || '';
  const FIRST_TOUCH_KEY = 'designer_sa_first_touch_v1';

  function safeParse(value){ try { return JSON.parse(value); } catch { return null; } }
  function nowIso(){ return new Date().toISOString(); }

  function getSource(){
    const params = new URLSearchParams(location.search);
    const referrer = document.referrer || '';
    let refHost = '';
    try { refHost = referrer ? new URL(referrer).hostname : ''; } catch {}

    let source = params.get('utm_source') || '';
    let medium = params.get('utm_medium') || '';
    const campaign = params.get('utm_campaign') || '';
    const content = params.get('utm_content') || '';
    const term = params.get('utm_term') || '';

    if (!source) {
      if (!refHost) { source = 'direct'; medium = 'none'; }
      else if (/google\./i.test(refHost)) { source = 'google'; medium = 'organic'; }
      else if (/instagram\.com|l\.instagram\.com/i.test(refHost)) { source = 'instagram'; medium = 'social'; }
      else if (/facebook\.com|l\.facebook\.com/i.test(refHost)) { source = 'facebook'; medium = 'social'; }
      else { source = refHost.replace(/^www\./,''); medium = 'referral'; }
    }

    return {
      source,
      medium: medium || 'unknown',
      campaign: campaign || undefined,
      content: content || undefined,
      term: term || undefined,
      referrer_host: refHost || undefined,
      landing_path: location.pathname
    };
  }

  function getAttribution(){
    const current = getSource();
    const stored = safeParse(localStorage.getItem(FIRST_TOUCH_KEY));
    if (!stored) {
      const first = { ...current, captured_at: nowIso() };
      try { localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(first)); } catch {}
      return { first_touch: first, session: current };
    }
    return { first_touch: stored, session: current };
  }

  function loadGA4(){
    if (!GA_ID || !/^G-[A-Z0-9]+$/i.test(GA_ID)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true, send_page_view: true });
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(s);
  }

  const attribution = getAttribution();

  function cleanParams(params = {}){
    const blocked = ['name','phone','email','whatsapp','message','address'];
    return Object.fromEntries(Object.entries(params).filter(([key,value]) => {
      if (blocked.some((item) => key.toLowerCase().includes(item))) return false;
      return value !== undefined && value !== null && value !== '';
    }));
  }

  function track(eventName, params = {}){
    if (!eventName) return;
    const payload = cleanParams({
      ...params,
      page_path: location.pathname,
      traffic_source: attribution.session.source,
      traffic_medium: attribution.session.medium,
      traffic_campaign: attribution.session.campaign,
      first_touch_source: attribution.first_touch.source,
      first_touch_medium: attribution.first_touch.medium
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload });
    if (typeof window.gtag === 'function') window.gtag('event', eventName, payload);
    window.dispatchEvent(new CustomEvent('designer-sa:analytics', { detail:{ event:eventName, params:payload } }));
  }

  window.DesignerSaAnalytics = { track, attribution };
  loadGA4();

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('wa.me/')) track('whatsapp_click', { placement: link.dataset.analyticsPlacement || 'link' });
    if (href.includes('instagram.com/')) track('instagram_click', { placement: link.dataset.analyticsPlacement || 'link' });
  });

  track('landing_view', {
    source: attribution.session.source,
    medium: attribution.session.medium,
    campaign: attribution.session.campaign
  });
})();
