// Simple i18n using i18next and JSON files in /lang/
// Loads resources then translates DOM elements with data-i18n attributes
(async function(){
  // helper to fetch JSON
  async function loadJSON(url){
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load ' + url);
    return res.json();
  }

  // load all languages
  const langs = ['ru','en','kz'];
  const resources = {};
  for (const l of langs){
    try{
      resources[l] = { translation: await loadJSON(`lang/${l}.json`) };
    } catch(e){
      console.warn('Could not load lang', l, e);
      resources[l] = { translation: {} };
    }
  }

  // init i18next
  i18next.init({
    lng: detectInitialLang(),
    debug: false,
    resources
  }, function(err, t){
    if (err) console.error(err);
    updateContent();
  });

  // translate all elements with data-i18n
  function updateContent(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      el.textContent = i18next.t(key);
    });
  }

  // language selector
  const langSelect = document.getElementById('langSelect');
  if (langSelect){
    langSelect.value = i18next.language || 'ru';
    langSelect.addEventListener('change', e=>{
      const lng = e.target.value;
      i18next.changeLanguage(lng, updateContent);
      localStorage.setItem('site_lang', lng);
    });
  }

  // detect initial language: from localStorage or navigator
  function detectInitialLang(){
    const saved = localStorage.getItem('site_lang');
    if (saved && langs.includes(saved)) return saved;
    const nav = (navigator.language || navigator.userLanguage || 'ru').slice(0,2);
    if (langs.includes(nav)) return nav;
    return 'ru';
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Intersection observer for reveal animations (simple)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        entry.target.classList.add('reveal');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});

  document.querySelectorAll('.section, .hero-text, .project-card, .cert, .edu-card, .contact-card').forEach(el=>{
    el.style.opacity = 0;
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });

  // when reveal class added, set final style
  const obs = new MutationObserver(()=>{});
  document.body.addEventListener('animationend', ()=>{});
  // small loop to set style when reveal added
  setInterval(()=>{
    document.querySelectorAll('.reveal').forEach(el=>{
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }, 200);

})();
