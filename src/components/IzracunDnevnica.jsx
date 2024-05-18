import { useState } from "react";
import "./IzracunDnevnica.css";

function IzracunDnevnica() {
  //Business logic

  const [datumPolaska, setDatumPolaska] = useState("");
  const [datumPovratka, setDatumPovratka] = useState("");
  const [valuta, setValuta] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dnevnicaTotal, setDnevnicaTotal] = useState(undefined);

  //onchange handlers
  function polazakHandler(e) {
    const noviDatumPolaska = new Date(e.target.value);
    setDatumPolaska(noviDatumPolaska);
    // console.log("polazak", noviDatumPolaska);
  }

  function povratakHandler(e) {
    const noviDatumPovratka = new Date(e.target.value);
    setDatumPovratka(noviDatumPovratka);
    // console.log("povratak", noviDatumPovratka);
  }

  function valutaHandler(e) {
    const novaValuta = e.target.value;
    setValuta(novaValuta);
    // console.log("valuta", novaValuta);
  }

  //izračunavanje dnevnice
  function izracunajDnevnicu(e) {
    e.preventDefault();

    if (!datumPolaska || !datumPovratka) {
      setErrorMessage("Molim unesite oba datuma.");
    } else if (datumPolaska >= datumPovratka) {
      setErrorMessage("Molim unesite pravilne datume.");
    } else if (valuta.length == 0) {
      setErrorMessage("Molim unesite valutu.");
    } else {
      setErrorMessage("");
    }

    const razlikaMilisek = datumPovratka - datumPolaska;
    const razlikaSati = razlikaMilisek / (1000 * 60 * 60); // prebacivanje iz milisekundi u sate
    // console.log("razlika", razlikaSati);

    const brojDana = Math.floor(razlikaSati / 24); //okrugli broj dana na putu
    const brojExtraSati = razlikaSati % 24; // ostatak sati

    let extraDnevnica = 0;
    if (brojExtraSati >= 8 && brojExtraSati < 12) {
      extraDnevnica = 15;
    } else if (brojExtraSati >= 12) {
      extraDnevnica = 30;
    }

    const dnevnica = brojDana * 30 + extraDnevnica;
    setDnevnicaTotal(dnevnica);
  }

  //finalni izračun uz konverzije u druge valute
  function dnevnicaFinal() {
    if (typeof dnevnicaTotal === "undefined") return "";

    let dnevnicaValuta;

    switch (valuta) {
      case "euro":
        dnevnicaValuta = `${dnevnicaTotal} EUR`;
        break;
      case "funta":
        const dnevnicaGBP = dnevnicaTotal * 0.87;
        dnevnicaValuta = `${dnevnicaGBP.toFixed(2)} GBP`;
        break;
      case "dolar":
        const dnevnicaUSD = dnevnicaTotal * 1.21;
        dnevnicaValuta = `${dnevnicaUSD.toFixed(2)} USD`;
        break;
      default:
        dnevnicaValuta = "";
    }

    return `Vaša dnevnica iznosi ${dnevnicaValuta}.`;
  }

  //End of business logic

  return (
    <div className="wrapper p-5">
      <h2>
        Izračun dnevnice <br /> za službeni put
      </h2>
      <p className="fst-italic">(1 dnevnica = 30 €)</p>
      <form onSubmit={(e) => izracunajDnevnicu(e)}>
        {/* <div className="mb-3">
          <label htmlFor="imeiprezime" className="form-label">
            Ime i prezime
          </label>
          <input
            type="text"
            className="form-control"
            id="imeiprezime"
            aria-describedby="imeHelp"
          />
        </div> */}
        <div className="mb-3">
          <label htmlFor="datumpolaska" className="form-label">
            Datum polaska
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="datumpolaska"
            onChange={(e) => polazakHandler(e)}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="datumpovratka" className="form-label">
            Datum povratka
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="datumpovratka"
            onChange={(e) => povratakHandler(e)}
          />
        </div>
        <div className="mb-3 input-group">
          <label className="input-group-text" htmlFor="valuta">
            Valuta
          </label>
          <select
            className="form-select"
            id="valuta"
            value={valuta}
            onChange={(e) => valutaHandler(e)}
          >
            <option value="">Izračunaj dnevnicu u...</option>
            <option value="euro">EUR</option>
            <option value="funta">GBP</option>
            <option value="dolar">USD</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Izračunaj!
        </button>
        <div style={{ color: "red" }}>{errorMessage}</div>
      </form>
      <div className="fw-bolder h4 pt-3">
        {dnevnicaTotal !== null &&
          !errorMessage &&
          valuta.length > 0 &&
          dnevnicaFinal()}
      </div>
    </div>
  );
}

export { IzracunDnevnica };
