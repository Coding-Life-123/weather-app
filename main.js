let KEY = "e7cb0a3b193d4dd73fb325a5e190a939";

console.log(document.documentElement.lang);

function switchLang() {
  if (document.documentElement.lang == "es") {
    document.documentElement.setAttribute("lang", "en");
  } else {
    document.documentElement.setAttribute("lang", "es");
  }

  document.getElementById("searchInput").placeholder = (document.documentElement.lang == 'en') ? "Ex: City, Country" : "Ej: Ciudad, País"
  console.log(document.documentElement.lang);

  let storedCityName = localStorage.getItem("lastCity");
  let storedCountryName = localStorage.getItem("lastCountry");

  main(storedCityName, storedCountryName);
}

async function fetching(city = "", country = "", language) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}, ${country}&appid=${KEY}&units=metric&lang=${language}`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error: " + err);
  }
}

async function getCountries(code) {
  let data = await fetch(
    document.documentElement.lang === "es" ? "paises.json" : "countries.json"
  );
  let countryName = data[code];
  return countryName;
}

async function getCountryCode(name) {
  try {
    const nameLowerCase = name.toLowerCase().trim();
    console.log(nameLowerCase);

    const data = await $.getJSON(
      document.documentElement.lang === "es" ? "paises.json" : "countries.json"
    );


    for (const code in data) {
      if (Object.prototype.hasOwnProperty.call(data, code)) {
        const countryNameJSON = data[code].toLowerCase();

        if (countryNameJSON.includes(nameLowerCase)) {
          console.log(code);
          return code;
        }
      }
    }

    console.log("no se ha encontrado un código de país para: ", name);
    return null;
  } catch (error) {
    console.log("Error al buscar el código del país", error);
    return null;
  }
}

function weatherDesign(weather) {
  switch (weather) {
    case "Clouds":
      document.documentElement.style.setProperty("--textColor", "#ffffff");
      document.documentElement.style.setProperty(
        "--fromGradientColor",
        "#a9a9a9"
      );
      document.documentElement.style.setProperty(
        "--toGradientColor",
        "#696969"
      );
      break;

    case "Clear":
      document.documentElement.style.setProperty("--textColor", "#000000");
      document.documentElement.style.setProperty(
        "--fromGradientColor",
        "#ffcc00"
      );
      document.documentElement.style.setProperty(
        "--toGradientColor",
        "#ff9900"
      );
      break;

    case "Drizzle":
      document.documentElement.style.setProperty("--textColor", "#ffffff");
      document.documentElement.style.setProperty(
        "--fromGradientColor",
        "#b0e0e6"
      );
      document.documentElement.style.setProperty(
        "--toGradientColor",
        "#4682b4"
      );
      break;

    case "Rain":
      document.documentElement.style.setProperty("--textColor", "#ffffff");
      document.documentElement.style.setProperty(
        "--fromGradientColor",
        "#87ceeb"
      );
      document.documentElement.style.setProperty(
        "--toGradientColor",
        "#4682b4"
      );
      break;

    case "Snow":
      document.documentElement.style.setProperty("--textColor", "#000000");
      document.documentElement.style.setProperty(
        "--fromGradientColor",
        "#d3d3d3"
      );
      document.documentElement.style.setProperty(
        "--toGradientColor",
        "#ffffff"
      );
      break;

    case "Thunderstorm":
      document.documentElement.style.setProperty("--textColor", "#ffffff");
      document.documentElement.style.setProperty(
        "--fromGradientColor",
        "#7d7d7d"
      );
      document.documentElement.style.setProperty(
        "--toGradientColor",
        "#333333"
      );
      break;

    default:
      document.documentElement.style.setProperty("--textColor", "#ffffff");
      document.documentElement.style.setProperty(
        "--fromGradientColor",
        "#bebebe"
      );
      document.documentElement.style.setProperty(
        "--toGradientColor",
        "#8b8b8b"
      );
      break;
  }
}

async function main(city, country) {
  let iconName;
  let lang = document.documentElement.lang;

  let fetchedData = await fetching(city, country, lang);
  console.log(fetchedData);

  $("#cityName").html(fetchedData.name)
  //document.getElementById("cityName").innerHTML = fetchedData.name

  rawIconName = fetchedData.weather[0].icon;
  iconName = JSON.stringify(rawIconName).slice(1, 3);
  document
    .getElementById("weatherIcon")
    .setAttribute("src", `weather-icons/${iconName}d.png`);

  //$("#countryName").html(await getCountries(
  document.getElementById("countryName").innerHTML = await getCountries(
    fetchedData.sys.country
  )

  // $("#tempNumber").html(
  //   fetchedData.main.temp + " ºC"
  // );
  document.getElementById("tempNumber").innerHTML = fetchedData.main.temp + " ºC";

  // $("#weatherDesc").html(
  //   fetchedData.weather[0].description
  // );
  document.getElementById("weatherDesc").innerHTML = fetchedData.weather[0].description;

  // $("#maxMinTemp").html(
  //  fetchedData.main.temp_min + "º / " + fetchedData.main.temp_max + "º"
  // );
  document.getElementById("maxMinTemp").textContent = fetchedData.main.temp_min + "º / " + fetchedData.main.temp_max + "º"

  let arrowDeg = -45 + fetchedData.wind.deg;

  // $("#windArrow").css("rotate", `${arrowDeg}deg`);
  document.getElementById("windArrow").style.rotate = `${arrowDeg}deg`;

  // $("#windSpeed").html(fetchedData.wind.speed + "m/s");
  document.getElementById("windSpeed").innerHTML = `${fetchedData.wind.speed} m/s`;

  let weatherMain = fetchedData.weather[0].main;
  weatherDesign(weatherMain);
}

async function log(data) {
  let inputValue = data;

  let values = inputValue.split(",");

  let city = values[0];
  let countryCode = values[1];

  console.log(countryCode);

  const codigoISO = await getCountryCode(countryCode);

  localStorage.setItem("lastCity", city);
  localStorage.setItem("lastCountry", codigoISO);

  main(city, codigoISO);
}

main();
