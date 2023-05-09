import { useRef, useEffect, useCallback, useReducer } from "react";
// import propTypes
import PropTypes from "prop-types";
// import react icons
import { AiFillCaretDown } from "react-icons/ai";
// data
import { Countries } from "./data/Countries";

export default function PhoneNumberInput({
  defaultCountry = "EG",
  onResultNumberPhone = () => {},
  errorInput,
}) {
  const isDefaultCountry = Countries.find(
    (item) => item.code === defaultCountry?.toUpperCase()
  );

  const [state, updateState] = useReducer(
    (prev, next) => ({ ...prev, ...next }),
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

  const elemRef = useRef(null);
  const elemBtnRef = useRef(null);

  const handelOnSelected = (item) => {
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

  const handelOnChange = (e) => {
    let unmaskedPhoneNumber = (e.target.value.match(/\d+/g) || []).join("");
    const countOfNumber = state.country.mask.match(/9/g).length;
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

  const handelAutoCloseCountry = useCallback((e) => {
    if (
      !elemRef.current?.contains(e.target) &&
      !elemBtnRef.current?.contains(e.target)
    ) {
      updateState({
        openCountry: false,
        isCountries: Countries,
        query: [],
      });
    }
  }, []);

  const handelQueryCountry = useCallback(
    (e) => {
      let arrQuery = [];

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

      const isQuery = arrQuery.join("").toLowerCase();
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
        <label className="label">رقم الموبايل</label>
        <div className="control-phone">
          <div className={`input-phone ${errorInput ? "error-input" : ""} `}>
            <input
              type="number"
              className="input-number"
              name="phone-number"
              value={state.phoneNumber}
              onChange={handelOnChange}
              placeholder={state.country?.mask.replace(/9/g, "-")}
            />
            <div className="country-dialCode">
              <span className="dialCode">{state.country?.dialCode}</span>
            </div>
          </div>

          <div className="content-country">
            <button
              type="button"
              onClick={handelToggleButton}
              ref={elemBtnRef}
              className={`country ${
                state.openCountry ? "active-countries" : ""
              }`}
              aria-label="choose country code"
              data-country={state.country?.en}
            >
              <span className="down">
                <AiFillCaretDown color="#000" size={18} />
              </span>
              <span className="flag">{state.country?.flag}</span>
            </button>
          </div>
          {state.openCountry && (
            <div className="countries-content" ref={elemRef}>
              <div className="countries-content__card">
                <div className="countries-content__body">
                  {!state.isCountries.length ? (
                    <p className="no-country">لا يوجد بلد</p>
                  ) : (
                    state.isCountries.map((item, index) => (
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
        {errorInput && (
          <div className="error-input-msg">
            <p className="error-input-msg__text">رقم الموبايل مطلوب</p>
          </div>
        )}
      </div>
    </div>
  );
}

PhoneNumberInput.propTypes = {
  defaultCountry: PropTypes.string.isRequired,
  onResultNumberPhone: PropTypes.func.isRequired,
  errorInput: PropTypes.bool,
};
