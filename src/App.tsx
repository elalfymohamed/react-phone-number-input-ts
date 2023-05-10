import { PhoneNumberInput } from "./phoneNumber";

function App() {
  return (
    <main className="app-main">
      <div className="container">
        <div className="card">
          <PhoneNumberInput
            defaultCountry="EG"
            onResultNumberPhone={(prev) => console.log(prev)}
            // inputError={}
            // msgError="Phone Number is required"
          />
        </div>
      </div>
    </main>
  );
}

export default App;
