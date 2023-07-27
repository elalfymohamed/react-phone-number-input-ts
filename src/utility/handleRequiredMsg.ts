/**
 * Returns the required message for a given language.
 *
 * @param {string} lang - The language for which the required message is needed.
 * @return {string} - The required message for the given language.
 */

export const handleRequiredMsg = (lang: string): string => {
  const messages: { [key: string]: string } = {
    ar: "رقم الهاتف مطلوب",
    en: "Phone Number is required",
    ru: "Требуется номер телефона",
    lt: "Reikalingas telefono numeris",
    tr: "Telefon numarası gerekli",
    ko: "전화번호 필요",
    default: "Phone Number is required",
  };

  return messages[lang] || messages.default;
};
