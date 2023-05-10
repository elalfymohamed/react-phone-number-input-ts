export type Counter = {
  ru?: string;
  lt?: string;
  tr?: string;
  en: string;
  ar: string;
  ko?: string;
  flag: string;
  code: string;
  dialCode: string;
  mask: string;
};

export type ResultNumber = {
  isVerified: boolean;
  phoneNumber: string;
};

export type StateReducer = {
  openCountry: boolean;
  phoneNumber: string;
  isCountries: Counter[];
  query: string[];
  country: {
    flag: string;
    code: string;
    dialCode: string;
    mask: string;
    en: string;
  };
};
