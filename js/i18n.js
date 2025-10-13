const translations = {
  ru: {},
  en: {}
};

// Загружаем JSON-файлы с переводами
async function loadTranslations(lang) {
  const response = await fetch(`../locales/${lang}.json`);
  const data = await response.json();
  translations[lang] = data;
}

// Применяем переводы к элементам на странице
function applyTranslations(lang) {
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

export { loadTranslations, applyTranslations };
