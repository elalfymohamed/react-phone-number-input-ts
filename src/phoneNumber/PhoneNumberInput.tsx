import React, { useRef, useEffect, useCallback, useReducer } from "react";

// import Countries Data
import { countries } from "../data/countries";

// import types
import { Counter, Props, StateReducer } from "../libs/types";

// import functions from utility
import {
  handleGetCountry,
  handleNotFoundDataSearch,
  handleRequiredMsg,
} from "../utility";

export const PhoneNumberInput: React.FC<Props> = ({
  defaultCountry,
  onResultNumberPhone,
  inputError,
  msgError,
  label,
  lang = "en",
  classLabel,
  autoCountry,
}) => {
  const { country, objKey } = handleGetCountry(autoCountry, defaultCountry);

  const isDefaultCountry = countries.find(
    (item) => item[objKey] === country
  ) as Counter;

  const [state, updateState] = useReducer(
    (prev: StateReducer, next: Partial<StateReducer>) => ({ ...prev, ...next }),
    {
      openCountry: false,
      phoneNumber: "",
      isCountries: countries,
      query: [],
      country: {
        flag: isDefaultCountry.flag,
        code: isDefaultCountry.code,
        dialCode: isDefaultCountry.dialCode,
        mask: isDefaultCountry.mask,
        [lang]: isDefaultCountry[lang],
      },
    }
  );

  const eleCountriesRef = useRef(null) as React.RefObject<HTMLDivElement>;
  const eleBtnRef = useRef(null) as React.RefObject<HTMLButtonElement>;

  /**
   * Updates the state based on the selected item.
   *
   * @param {Counter} item - The selected item.
   * @return {void} No return value.
   */
  const handleOnSelected = (item: Counter): void => {
    updateState({
      openCountry: false,
      phoneNumber: "",
      isCountries: countries,
      query: [],
      country: {
        flag: item.flag,
        code: item.code,
        dialCode: item.dialCode,
        mask: item.mask,
        [lang]: item[lang],
      },
    });
  };

  const handleToggleButton = () => {
    updateState({
      openCountry: !state.openCountry,
      isCountries: countries,
      query: [],
    });
  };

  /**
   * Handles the change event of the input element.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object.
   * @return {void} No return value.
   */
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const unmaskedPhoneNumber = (e.target.value.match(/\d+/g) || []).join("");
    let countOfNumber = state.country.mask.match(/9/g)?.length || 1;
    countOfNumber = countOfNumber - 1;
    const isVerified = countOfNumber === unmaskedPhoneNumber.length;

    if (!isVerified) {
      updateState({
        phoneNumber: unmaskedPhoneNumber,
      });
    }

    onResultNumberPhone({
      isVerified,
      phoneNumber: `${state.country.dialCode}${state.phoneNumber}`,
      phone: state.phoneNumber,
      dialCode: state.country.dialCode,
    });
  };

  /**
   * A function to handle the automatic closing of the model.
   *
   * @param {MouseEvent | React.BaseSyntheticEvent} e - The event that triggered the function.
   * @return {void} This function does not return a value.
   */
  const handleAutoCloseModel = useCallback(
    (e: MouseEvent | React.BaseSyntheticEvent) => {
      const isOutsideCountries = !eleCountriesRef.current?.contains(e.target);
      const isOutsideBtn = !eleBtnRef.current?.contains(e.target);
      if (isOutsideCountries && isOutsideBtn) {
        updateState({
          openCountry: false,
          isCountries: countries,
          query: [],
        });
      }
    },
    []
  );

  /**
   * Handles the query for the country.
   *
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  const handleQueryCountry = useCallback(
    (e: KeyboardEvent) => {
      const { code, key } = e;
      const { query } = state;

      let newQuery: string[] = [];
      let isQuery = "";

      if (code.match("Key")) {
        newQuery = [...query, key];
        updateState({
          query: [...query, key],
        });
      }
      if (key === "Backspace") {
        state.query.pop();
        newQuery = state.query;
        updateState({
          query: newQuery,
        });
      }

      isQuery = newQuery.join("").toLowerCase();
      updateState({
        isCountries:
          newQuery.length > 0
            ? countries.filter((item) =>
                item.code.toLowerCase().includes(isQuery)
              )
            : countries,
      });
    },
    [state]
  );

  /**
   * Handles the not found data search.
   * @param {string} lang - The language.
   * @return {string} The not found message.
   */
  const notFoundMsg = handleNotFoundDataSearch(lang);

  /**
   * Handles the required message.
   * @param {string} lang - The language.
   * @return {string} The required message.
   */
  const requiredMsg = handleRequiredMsg(lang);

  useEffect(() => {
    if (!state.openCountry) return;
    window.addEventListener("click", handleAutoCloseModel, true);
    return () =>
      window.removeEventListener("click", handleAutoCloseModel, true);
  }, [handleAutoCloseModel, state.openCountry]);

  useEffect(() => {
    if (!state.openCountry) return;
    window.addEventListener("keyup", handleQueryCountry);
    return () => window.removeEventListener("keyup", handleQueryCountry);
  }, [handleQueryCountry, state.openCountry]);

  return (
    <div className="control-input">
      <div className="content-input">
        <label className={classLabel ? classLabel : "label"}>
          {label ?? "Enter Phone Number:"}
        </label>
        <div className="control-phone">
          <div className={`input-phone ${inputError ? "input-error" : ""} `}>
            <input
              type="number"
              className="input-number"
              name="phone-number"
              value={state.phoneNumber}
              autoComplete="tel"
              onChange={handleOnChange}
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
              onClick={handleToggleButton}
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
            <div className="countries-content" ref={eleCountriesRef}>
              <div className="countries-content__card">
                <div className="countries-content__body">
                  {!state.isCountries.length ? (
                    <p className="no-country">{notFoundMsg}</p>
                  ) : (
                    state.isCountries.map((item: Counter, index: number) => (
                      <div
                        className={`country ${
                          state.country.code === item.code
                            ? "selected-country"
                            : ""
                        }`}
                        role="button"
                        key={index}
                        aria-label={`country ${item.en}`}
                        data-flag={item.flag}
                        data-code={item.code}
                        tabIndex={0}
                        onClick={() => handleOnSelected(item)}
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
            <p className="input-error-msg__text">{msgError ?? requiredMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
};
