export const handleNotFoundDataSearch = (lang: string): string => {
  switch (lang) {
    case "ar":
      return "لم يتم العثور على البلد";
    case "en":
      return "Not found country";
    case "ru":
      return "не найдена страна";
    case "lt":
      return "nerasta šalis";
    case "tr":
      return "ülke bulunamadı";
    case "ko":
      return "찾을 수 없는 국가";
    default:
      return "Not found country";
  }
};
