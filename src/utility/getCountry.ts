import data from "../data/latest.json";

// the get country by Time Zone
// It may not be accurate, and depend on the timezone selected by the user on their system, which can be changed
export const handelToGetCountry = (defaultCountry: string): string => {
  let userCity = "";
  let userCountry = "";
  const dataCountry = data as any;

  if (Intl) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzArr = userTimeZone.split("/");
    userCity = tzArr.at(-1) ?? "";
    userCountry = dataCountry[userCity];
  }

  return userCountry === "" ? defaultCountry : userCountry;
};
