console.log("Hello");
let countrySection = document.querySelector(".country-section");
let input = document.querySelector(".inputVal");
let searchIcon = document.querySelector(".searchIcon");

let downArrow = document.querySelector(".downArrow");
let dropdown = document.querySelector(".dropdown");
let menu = document.querySelector(".menu");
let filteredLi = document.querySelector(".filteredLi");

// fetch all country with given url
async function fetchCountry(url) {
  let fetchAllCountry = fetch(url);
  let response = await fetchAllCountry;
  let dataCollection = await response.json();
  return dataCollection;
}

// print all country or filtered country
function printAllCountry(value) {
  let dataCollection = value;
  for (let i = 0; i < dataCollection.length; i++) {
    let countryName = dataCollection[i].name.common || "";
    let countryFlag = dataCollection[i].flags.png || "";
    let countryPopulation = dataCollection[i].population || "";
    let countryRegion = dataCollection[i].region || "";
    let countryCapital = dataCollection[i]?.capital?.[0] || "";

    // console.log(countryName,countryFlag,countryPopulation,countryRegion,countryCapital)

    let countryDiv = document.createElement("div");
    countryDiv.classList.add("country");
    countryDiv.innerHTML = `
      <div class="flag">
        <img src="${countryFlag}" alt="">
      </div>
      <div class="details">
        <h3>${countryName}</h3>
        <p>Population : <span>${countryPopulation}</span></p>
        <p>Region : <span>${countryRegion}</span></p>
        <p>Capital : <span>${countryCapital}</span></p>
      </div>`;
    countrySection.append(countryDiv);
  }
}

// syncing all country on page load
async function loadedData() {
  let data = await fetchCountry("https://restcountries.com/v3.1/all");
  printAllCountry(data);
}
loadedData();

// filtering continent/region
async function filterContinent(value) {
  let url = `https://restcountries.com/v3.1/region/${value}`;

  let filteredRegion = await fetchCountry(url);
  // console.log(filteredRegion)
  printAllCountry(filteredRegion);
}

// handling dropdown menu
dropdown.addEventListener("click", (e) => {
  menu.classList.toggle("dropdown-js");

  if (e.target.classList.contains("optionsLi")) {
    filteredLi.innerText = e.target.innerText;
    countrySection.innerHTML = "";
    input.value = "";

    if (e.target.innerText !== "Filter by Region") {
      filterContinent(filteredLi.innerText);
    } else {
      loadedData();
    }
  }
});

// handling input value
input.addEventListener("input", async (e) => {
  let inputVal = e.target.value.toLowerCase();
  let filterRegionValue = filteredLi.innerText;
  let regionData;
  let countryData;

  if (filterRegionValue !== "Filter by Region") {
    regionData = await fetchCountry(
      `https://restcountries.com/v3.1/region/${filterRegionValue}`
    );

    countryData = regionData.filter((country) => {
      if (country.name.common.toLowerCase().startsWith(inputVal)) {
        return country;
      }
    });
    countrySection.innerHTML = "";
    printAllCountry(countryData);
  } else {
    regionData = await fetchCountry(`https://restcountries.com/v3.1/all`);

    countryData = regionData.filter((country) => {
      if (country.name.common.toLowerCase().startsWith(inputVal)) {
        return country;
      }
    });
    countrySection.innerHTML = "";
    printAllCountry(countryData);
  }
});

// detail page script
let mainPage = document.querySelector("main");
let borderCountryBtn = document.querySelector(".border-country-data");
let backBtn = document.querySelector(".back");

// fetching selected country details
async function fetchSelectedCountry(fetchCountryName) {
  let dataCollection = await fetchCountry(
    `https://restcountries.com/v3.1/name/${fetchCountryName}`
  );

  // if many of country fetched for same name then we can filter
  let filterCountry = dataCollection.filter((data) => {
    return fetchCountryName.toLowerCase() === data.name.common.toLowerCase();
  });

  let countryName = filterCountry[0].name.common || "";
  let countryFlag = filterCountry[0].flags.png || "";
  let countryPopulation = filterCountry[0].population || "";
  let countryRegion = filterCountry[0].region || "";
  let countryCapital = filterCountry[0]?.capital?.[0] || "";
  let subRegion = filterCountry[0].subregion || "";
  let topLevelDomain = filterCountry[0].tld[0] || "";

  let currencies = filterCountry[0].currencies;
  let currName = Object.values(currencies)[0].name;

  let languages = Object.values(filterCountry[0].languages);
  let languagesStr = languages.join(",");

  let borders;
  try {
    borders = filterCountry[0].borders || "";
    console.log(borders);

    // fetching all country for border
    let countryDataCollection = await fetchCountry("https://restcountries.com/v3.1/all");
    let filterBorderCountry;

    borderCountryBtn.innerHTML = "";

    // filter border country and insert
    borders.forEach((borderName) => {
      filterBorderCountry = countryDataCollection.filter((country) => {
        if (borderName === country.cca3) {
          return borderName;
        }
        console.log(borderName);
      });

      let btn = document.createElement("button");
      btn.innerText = filterBorderCountry[0].name.common;
      borderCountryBtn.append(btn);
    });
  } catch (err) {
    borderCountryBtn.append("Null");
  }

  let countryCommonName = document.querySelector(".country-name h2");
  countryCommonName.innerText = countryName;

  let flagImg = document.querySelector(".flag-img img");
  flagImg.src = countryFlag;

  let countryDetails = document.querySelector(".country-details");
  let countryDetailsHTML = `
  <div class="first-details">
    <p>Native Name: <span>${countryName}</span></p>
    <p>Population: <span>${countryPopulation}</span></p>
    <p>Region: <span>${countryRegion}</span></p>
    <p>Sub Region: <span>${subRegion}</span></p>
    <p>Capital: <span>${countryCapital}</span></p>
  </div>
  <div class="second-details">
    <p>Top Level Domain: <span>${topLevelDomain}</span></p>
    <p>Currencies: <span>${currName}</span></p>
    <p>Languages: <span>${languagesStr}</span></p>
  </div>`;

  countryDetails.innerHTML = countryDetailsHTML;
}

// handling each individual country card
countrySection.addEventListener("click", (e) => {
  let card = e.target.closest(".country");
  if (card) {
    mainPage.classList.add("main-js");
    let countryName = card.querySelector("h3").innerText.toLowerCase();
    console.log(countryName);
    fetchSelectedCountry(countryName);
  }
});

// handling back btn
backBtn.addEventListener("click", (e) => {
  mainPage.classList.remove("main-js");
});

// handling border country btns
borderCountryBtn.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    fetchSelectedCountry(e.target.innerText);
  }
});

// handling theme
let body = document.querySelector("body");
let theme = document.querySelector(".theme");
theme.addEventListener("click", (e) => {
  body.classList.toggle("theme-js");
});
