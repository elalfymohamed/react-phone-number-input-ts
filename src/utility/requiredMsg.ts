export const handleRequiredMsg = (lang: string): string => {
  switch (lang) {
    case "ar":
      return "رقم الهاتف مطلوب";
    case "en":
      return "Phone Number is required";
    case "ru":
      return "Требуется номер телефона";
    case "lt":
      return "Reikalingas telefono numeris";
    case "tr":
      return "Telefon numarası gerekli";
    case "ko":
      return "전화번호 필요";
    default:
      return "Phone Number is required";
  }
};
