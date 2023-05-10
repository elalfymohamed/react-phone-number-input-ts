import React from "react";
import { PhoneNumberInput } from "./phoneNumberInput";

function App() {
  return (
    <>
      <div>
        <PhoneNumberInput
          defaultCountry="EG"
          onResultNumberPhone={(prev) => console.log(prev)}
          errorInput={""}
        />
      </div>
      <div></div>
    </>
  );
}

export default App;
