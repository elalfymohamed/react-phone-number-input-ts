/**
 * Generates the translated message for a not found country in the specified language.
 *
 * @param {string} lang - The language code for the translation.
 * @return {string} The translated message for a not found country in the specified language. If the translation is not available, the default message is returned.
 */

export const handleNotFoundDataSearch = (lang: string): string => {
  const translations: { [key: string]: string } = {
    ar: "لم يتم العثور على البلد",
    en: "Not found country",
    ru: "не найдена страна",
    lt: "nerasta šalis",
    tr: "ülke bulunamadı",
    ko: "찾을 수 없는 국가",
  };

  return translations[lang] || "Not found country";
};
