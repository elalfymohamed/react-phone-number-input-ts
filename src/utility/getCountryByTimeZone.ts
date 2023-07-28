import data from "../data/latest.json";

// the get country by Time Zone
// It may not be accurate, and depend on the timezone selected by the user on their system, which can be changed
type JSONValue = string;

interface JSONObject {
  [key: string]: JSONValue;
}

export const getCountryByTimeZone = (): string => {
  let userCity = "";
  let userCountry = "";
  const countryData = data as JSONObject;

  if (Intl) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeZoneParts = userTimeZone.split("/");
    userCity = timeZoneParts.at(-1) ?? "";
    userCountry = countryData[userCity];
  }

  return userCountry;
};
