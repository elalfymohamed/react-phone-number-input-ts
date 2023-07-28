import { getCountryByTimeZone } from "./getCountryByTimeZone";

/**
 * Handles the logic for getting the country and key based on the provided parameters.
 *
 * @param {boolean} autoCountry - Whether to automatically get the country or not.
 * @param {string} defaultCountry - The default country to use if autoCountry is false.
 * @return {{ country: string; objKey: ObjKey }} - An object containing the country and key.
 */

type ObjKey = {
  en: string;
  code: string;
};

export const handleGetCountry = (
  autoCountry = false,
  defaultCountry: string
): { country: string; objKey: keyof ObjKey } => {
  let country = defaultCountry;
  let objKey = "code" as keyof ObjKey;

  if (autoCountry) {
    country = getCountryByTimeZone();
    objKey = "en";

    if (!country) {
      country = defaultCountry;
      objKey = "code";
    }
  }

  return { country, objKey };
};
