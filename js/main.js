const langToggle = document.getElementById('lang-toggle');
const elements = document.querySelectorAll('[data-key]');

let currentLang = localStorage.getItem('lang') || detectLanguage();

// Определяем язык браузера
function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  if (userLang.startsWith('kk')) return 'kz';
  if (userLang.startsWith('en')) return 'en';
  return 'ru';
}

// Загружаем JSON с переводом
async function loadLanguage(lang) {
  try {
    const res = await fetch(`locales/${lang}.json`);
    const translations = await res.json();

    elements.forEach(el => {
      const key = el.getAttribute('data-key');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Обновляем кнопку и сохраняем выбор
    updateButton(lang);
    localStorage.setItem('lang', lang);
    currentLang = lang;
  } catch (err) {
    console.error(`Ошибка загрузки языка: ${lang}`, err);
  }
}

// Переключаем язык по клику
langToggle.addEventListener('click', () => {
  if (currentLang === 'ru') loadLanguage('en');
  else if (currentLang === 'en') loadLanguage('kz');
  else loadLanguage('ru');
});

// Меняем текст кнопки
function updateButton(lang) {
  const nextLang = lang === 'ru' ? 'EN' : lang === 'en' ? 'KZ' : 'RU';
  langToggle.textContent = nextLang;
}

// Загружаем язык при открытии страницы
loadLanguage(currentLang);
