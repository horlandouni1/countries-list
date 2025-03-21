document.addEventListener("DOMContentLoaded", async () => {
  const countriesGrid = document.getElementById("countriesGrid");
  const loader = document.getElementById("loader");
  const modal = document.getElementById("modal");
  const continentText = document.getElementById("continent");
  const countryDetails = document.getElementById("countryDetails");
  const closeModal = document.getElementById("closeModal");
  const searchInput = document.getElementById("searchInput");
  let allCountries = [];

  class CountryCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    set countryData(data) {
      this.shadowRoot.innerHTML = `
                <style>
                    .card {
                        width: 100%;
                        border: 1px solid #ddd;
                        padding: 10px;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                        cursor: pointer;
                        text-align: center;
                    }
                    .flag {
                        width: 100px;
                        height: 100px;
                        margin-bottom: 10px;
                    }
                </style>
                <div class="card">
                    <img class="flag" src="${data.flags.svg}" alt="Bandera de ${
        data.name.common
      }">
                    <h3>${data.name.common}</h3>
                    <p>Capital: ${data.capital ? data.capital[0] : "N/A"}</p>
                    <p>Población: ${data.population.toLocaleString()}</p>
                </div>
            `;
      this.shadowRoot.querySelector(".card").addEventListener("click", () => {
        continentText.textContent = `Continente: ${data.region}`;
        countryDetails.innerHTML = `
        <img class="modal-flag" src="${data.flags.svg}" alt="Bandera de ${
          data.name.common
        }">
        <p><strong>Subregión:</strong> ${data.subregion || "N/A"}</p>
        <p><strong>Idiomas:</strong> ${
          data.languages ? Object.values(data.languages).join(", ") : "N/A"
        }</p>
        <p><strong>Moneda:</strong> ${
          data.currencies
            ? Object.values(data.currencies)
                .map((c) => `${c.name} (${c.symbol})`)
                .join(", ")
            : "N/A"
        }</p>
        <p><strong>Población:</strong> ${data.population.toLocaleString()}</p>
        <p><strong>Área:</strong> ${data.area.toLocaleString()} km²</p>
        <p><strong>Más información:</strong> 
            <a href="https://es.wikipedia.org/wiki/${
              data.name.common
            }" target="_blank">Wikipedia</a>
        </p>
        <p><strong>Ubicación:</strong> 
            <a href="https://www.google.com/maps/search/?api=1&query=${
              data.latlng[0]
            },${data.latlng[1]}" target="_blank">Ver en Google Maps</a>
        </p>
    `;
        modal.style.display = "flex";
      });
    }
  }

  customElements.define("country-card", CountryCard);

  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    allCountries = await response.json();
    renderCountries(allCountries.slice(0, 12));
  } catch (error) {
    console.error("Error al obtener los datos de los países", error);
  } finally {
    loader.style.display = "none";
  }

  function renderCountries(countries) {
    countriesGrid.innerHTML = "";
    countries.forEach((country) => {
      const countryElement = document.createElement("country-card");
      countryElement.countryData = country;
      countriesGrid.appendChild(countryElement);
    });
  }

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCountries = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm)
    );
    renderCountries(filteredCountries.slice(0, 12));
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
