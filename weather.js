const cityText = document.getElementById("city");
const temperatureText = document.getElementById("temperature");
const windText = document.getElementById("wind");
const output = document.getElementById("output");
const mainElement = document.getElementById("main");

// City search elements
const cityInput = document.getElementById("cityInput");
const cityList = document.getElementById("cityList");
const btnValidate = document.getElementById("btnValidate");

// Store cities data for lookup
let citiesData = [];

function log(message) {
    if (output) {
        output.textContent += message + "\n";
    }
}

function clearOutput() {
    if (output) {
        output.textContent = "";
    }
}

// Kuopio button handler
const btnKuopio = document.getElementById("btnKuopio");
if (btnKuopio) {
    btnKuopio.addEventListener("click", () => {
        loadWeatherByCity("Kuopio", 62.8924, 27.6770);
    });
}

// Fetch weather data
async function loadWeatherByCity(cityName, latitude, longitude) {
    clearOutput();

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status);
        }

        const data = await response.json();

        const temperature = data.current.temperature_2m;
        const wind = data.current.wind_speed_10m;

        if (cityText) cityText.textContent = cityName;
        if (temperatureText) temperatureText.textContent = temperature + " °C";
        if (windText) windText.textContent = wind + " km/h";

        console.log("City: " + cityName);
        console.log("Temperature: " + temperature + " °C");
        console.log("Wind Speed: " + wind + " km/h");

    } catch (error) {
        log("Error: " + error.message);
    }
}

// Search for cities using Open-Meteo Geocoding API
async function searchCities(query) {
    if (query.length < 3) {
        if (cityList) cityList.innerHTML = "";
        citiesData = [];
        return;
    }

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Geocoding Error: " + response.status);
        }

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            displaySuggestions(data.results);
        } else {
            if (cityList) cityList.innerHTML = "";
            citiesData = [];
        }

    } catch (error) {
        log("Search Error: " + error.message);
    }
}

// Display city suggestions in datalist (max 10, deduplicated)
function displaySuggestions(cities) {
    if (!cityList) return;
    cityList.innerHTML = "";
    
    const seen = new Set();
    const uniqueCities = cities.filter(city => {
        const key = `${city.name}-${city.country}-${city.admin1 || ""}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
    
    citiesData = uniqueCities.slice(0, 10);
    
    citiesData.forEach(city => {
        const option = document.createElement("option");
        const displayName = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
        option.value = displayName;
        cityList.appendChild(option);
    });
}

// Find city from input value
function findSelectedCity(value) {
    return citiesData.find(city => {
        const displayName = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
        return displayName === value;
    });
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedSearch = debounce(searchCities, 300);

// Event: Input changes
if (cityInput) {
    cityInput.addEventListener("input", function(e) {
        const query = e.target.value.trim();
        const selectedCity = findSelectedCity(query);
        
        if (selectedCity) {
            if (btnValidate) btnValidate.disabled = false;
        } else {
            if (btnValidate) btnValidate.disabled = true;
            debouncedSearch(query);
        }
    });
}

// Event: Click validation button
if (btnValidate) {
    btnValidate.addEventListener("click", () => {
        if (!cityInput) return;
        const selectedCity = findSelectedCity(cityInput.value.trim());
        if (selectedCity) {
            loadWeatherByCity(selectedCity.name, selectedCity.latitude, selectedCity.longitude);
        }
    });
}

// --- THEME TOGGLE (Dark Mode) ---
function initTheme() {
    const themeButton = document.getElementById("theme-toggle");
    let isDarkMode = localStorage.getItem("portfolio_theme") === "dark";

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
    }

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle("dark-mode", isDarkMode);
            localStorage.setItem("portfolio_theme", isDarkMode ? "dark" : "light");
        });
    }
}

// --- QUICK CONTACT ALERT ---
function initContactAlert() {
    const contactButton = document.getElementById('contact-btn');
    if (contactButton) {
        contactButton.addEventListener('click', () => {
            alert(
                "Contact Hélène Quernet\n\n" +
                "ESTIA: helene.quernet@etu.estia.fr\n" +
                "Personal: helene.quernet@orange.fr\n" +
                "GitHub: github.com/HeleneQ"
            );
        });
    }
}

// --- LAST UPDATED FOOTER ---
function initFooterDate() {
    if (!mainElement) return;
    const lastUpdated = document.createElement("p");
    lastUpdated.id = "last-updated";
    lastUpdated.style.fontSize = "0.8rem";
    lastUpdated.style.marginTop = "1rem";
    lastUpdated.style.textAlign = "center";
    const formattedDate = new Date().toISOString().split("T")[0];
    lastUpdated.textContent = "Last updated: " + formattedDate;
    mainElement.appendChild(lastUpdated);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initContactAlert();
    initFooterDate();
});