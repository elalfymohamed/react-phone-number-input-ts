import React, { useRef, useEffect, useCallback, useReducer } from "react";

// import Countries Data
import { Countries } from "../data/Countries";

// import Types
import { Counter, ResultNumber, StateReducer } from "../libs/types";

interface Props {
  defaultCountry: string;
  onResultNumberPhone: (prev: ResultNumber) => void;
  inputError?: boolean;
  msgError?: string | boolean;
  lang?: "ar" | "en" | "ru" | "lt" | "tr" | "ko";
  label?: string;
}

export const PhoneNumberInput: React.FC<Props> = ({
  defaultCountry,
  onResultNumberPhone,
  inputError,
  msgError,
  label,
}) => {
  const isDefaultCountry = Countries.find(
    (item) => item.code === defaultCountry?.toUpperCase()
  ) as Counter;

  const [state, updateState] = useReducer(
    (prev: StateReducer, next: Partial<StateReducer>) => ({ ...prev, ...next }),
    {
      openCountry: false,
      phoneNumber: "",
      isCountries: Countries,
      query: [],
      country: {
        flag: isDefaultCountry.flag,
        code: isDefaultCountry.code,
        dialCode: isDefaultCountry.dialCode,
        mask: isDefaultCountry.mask,
        en: isDefaultCountry.en,
      },
    }
  );

  const elemCountriesRef = useRef(null) as React.RefObject<HTMLDivElement>;
  const eleBtnRef = useRef(null) as React.RefObject<HTMLButtonElement>;

  const handelOnSelected = (item: Counter): void => {
    updateState({
      openCountry: false,
      phoneNumber: "",
      isCountries: Countries,
      query: [],
      country: {
        flag: item.flag,
        code: item.code,
        dialCode: item.dialCode,
        mask: item.mask,
        en: item.en,
      },
    });
  };

  const handelToggleButton = () => {
    updateState({
      openCountry: !state.openCountry,
    });
  };

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let unmaskedPhoneNumber = (e.target.value.match(/\d+/g) || []).join("");
    const countOfNumber = state.country.mask.match(/9/g)?.length;
    const isVerified = countOfNumber === unmaskedPhoneNumber.length;

    if (!isVerified) {
      updateState({
        phoneNumber: unmaskedPhoneNumber,
      });
    }

    onResultNumberPhone({
      isVerified: isVerified,
      phoneNumber: `${state.country.dialCode}${state.phoneNumber}`,
    });
  };

  const handelAutoCloseCountry = useCallback(
    (e: MouseEvent | React.BaseSyntheticEvent) => {
      if (
        !elemCountriesRef.current?.contains(e.target) &&
        !eleBtnRef.current?.contains(e.target)
      ) {
        updateState({
          openCountry: false,
          isCountries: Countries,
          query: [],
        });
      }
    },
    []
  );

  const handelQueryCountry = useCallback(
    (e: KeyboardEvent) => {
      let arrQuery = [] as string[];

      if (e.code.match("Key")) {
        arrQuery = [...state.query, e.key];
        updateState({
          query: [...state.query, e.key],
        });
      }
      if (e.key === "Backspace") {
        state.query.pop();
        arrQuery = state.query;
        updateState({
          query: arrQuery,
        });
      }

      const isQuery = arrQuery.join("").toLowerCase() as string;
      if (arrQuery.length > 0) {
        updateState({
          isCountries: Countries.filter((item) =>
            item.code.toLowerCase().includes(isQuery)
          ),
        });
        return;
      }
      updateState({
        isCountries: Countries,
      });
    },
    [state]
  );

  useEffect(() => {
    if (!state.openCountry) return;
    window.addEventListener("click", handelAutoCloseCountry, true);
    return () =>
      window.removeEventListener("click", handelAutoCloseCountry, true);
  }, [handelAutoCloseCountry, state.openCountry]);

  useEffect(() => {
    if (!state.openCountry) return;
    window.addEventListener("keyup", handelQueryCountry);
    return () => window.removeEventListener("keyup", handelQueryCountry);
  }, [handelQueryCountry, state.openCountry]);

  return (
    <div className="control-input">
      <div className="content-input">
        <label className="label">{label ?? "Enter Phone Number:"}</label>
        <div className="control-phone">
          <div className={`input-phone ${inputError ? "input-error" : ""} `}>
            <input
              type="number"
              className="input-number"
              name="phone-number"
              value={state.phoneNumber}
              autoComplete="tel"
              onChange={handelOnChange}
              placeholder={state.country?.mask.replace(/9/g, "-")}
              inputMode="tel"
            />
            <div className="country-dialCode">
              <span className="dialCode">{state.country?.dialCode}</span>
            </div>
          </div>

          <div className="content-country">
            <button
              type="button"
              onClick={handelToggleButton}
              ref={eleBtnRef}
              className={`country ${
                state.openCountry ? "active-countries" : ""
              }`}
              aria-label="choose country code"
              data-country={state.country?.en}
            >
              <span className="down">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 1024 1024"
                  color="#000"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
                </svg>
              </span>
              <span className="flag">{state.country?.flag}</span>
            </button>
          </div>
          {state.openCountry && (
            <div className="countries-content" ref={elemCountriesRef}>
              <div className="countries-content__card">
                <div className="countries-content__body">
                  {!state.isCountries.length ? (
                    <p className="no-country">لا يوجد بلد</p>
                  ) : (
                    state.isCountries.map((item: Counter, index: number) => (
                      <div
                        className="country"
                        role="button"
                        key={index}
                        aria-label={`country ${item.en}`}
                        data-flag={item.flag}
                        data-code={item.code}
                        tabIndex={0}
                        onClick={() => handelOnSelected(item)}
                      >
                        <div className="country-dialCode">{item.dialCode}</div>
                        <div className="country-flag">
                          <span className="flag"> {item.flag}</span>
                          <span className="code">{item.code}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {msgError && (
          <div className="input-error-msg">
            <p className="input-error-msg__text">
              {msgError ?? "Phone Number is required"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
