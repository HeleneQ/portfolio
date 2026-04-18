const cityText = document.getElementById("city")
const temperatureText = document.getElementById("temperature")
const windText = document.getElementById("wind")
const output = document.getElementById("output")
const mainElement = document.getElementById("main");

// City search elements
const cityInput = document.getElementById("cityInput")
const cityList = document.getElementById("cityList")
const btnValidate = document.getElementById("btnValidate")

// Store cities data for lookup
let citiesData = []

function log(message) {
    output.textContent += message + "\n"
}

function clearOutput() {
    output.textContent = ""
}

// Kuopio button - original functionality
document.getElementById("btnKuopio").onclick = function () {
    loadWeatherByCity("Kuopio", 62.8924, 27.6770)
}

// Fetch weather data
async function loadWeatherByCity(cityName, latitude, longitude) {
    clearOutput()

    try {
        const url =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&current=temperature_2m,wind_speed_10m"

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status)
        }

        const data = await response.json()

        const temperature = data.current.temperature_2m
        const wind = data.current.wind_speed_10m

        cityText.textContent = cityName
        temperatureText.textContent = temperature + " °C"
        windText.textContent = wind + " km/h"

        console.log("City: " + cityName)
        console.log("Temperature: " + temperature + " °C")
        console.log("Wind Speed: " + wind + " km/h")

    } catch (error) {
        log("Error: " + error.message)
    }
}

// ==========================================
// City Search Functionality
// ==========================================

// Search for cities using Open-Meteo Geocoding API
async function searchCities(query) {
    if (query.length < 3) {
        cityList.innerHTML = ""
        citiesData = []
        return
    }

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
        
        const response = await fetch(url)
        
        if (!response.ok) {
            throw new Error("Geocoding Error: " + response.status)
        }

        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
            displaySuggestions(data.results)
        } else {
            cityList.innerHTML = ""
            citiesData = []
        }

    } catch (error) {
        log("Search Error: " + error.message)
    }
}

// Display city suggestions in datalist (max 10, deduplicated)
function displaySuggestions(cities) {
    cityList.innerHTML = ""
    
    // Deduplicate cities based on name + country + admin1
    const seen = new Set()
    const uniqueCities = cities.filter(city => {
        const key = `${city.name}-${city.country}-${city.admin1 || ""}`
        if (seen.has(key)) {
            return false
        }
        seen.add(key)
        return true
    })
    
    citiesData = uniqueCities.slice(0, 10)
    
    citiesData.forEach(city => {
        const option = document.createElement("option")
        const displayName = [city.name, city.admin1, city.country].filter(Boolean).join(", ")
        option.value = displayName
        cityList.appendChild(option)
    })
}

// Find city from input value
function findSelectedCity(value) {
    return citiesData.find(city => {
        const displayName = [city.name, city.admin1, city.country].filter(Boolean).join(", ")
        return displayName === value
    })
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout
    return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

// Debounced search (300ms delay)
const debouncedSearch = debounce(searchCities, 300)

// Event: Input changes
cityInput.addEventListener("input", function(e) {
    const query = e.target.value.trim()
    
    // Check if user selected a city from the list
    const selectedCity = findSelectedCity(query)
    if (selectedCity) {
        btnValidate.disabled = false
        log("Selected: " + query)
        log("Coordinates: " + selectedCity.latitude + ", " + selectedCity.longitude)
    } else {
        btnValidate.disabled = true
        debouncedSearch(query)
    }
})

// Event: Click validation button
btnValidate.onclick = function() {
    const selectedCity = findSelectedCity(cityInput.value.trim())
    if (selectedCity) {
        loadWeatherByCity(selectedCity.name, selectedCity.latitude, selectedCity.longitude)
    }
}


// --- THEME TOGGLE (Dark Mode) ---
const themeButton = document.getElementById("theme-toggle");
let isDarkMode = localStorage.getItem("portfolio_theme") === "dark";

// Apply saved theme immediately
if (isDarkMode) {
    document.body.classList.add("dark-mode");
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("portfolio_theme", isDarkMode ? "dark" : "light");
    console.log("Theme: " + (isDarkMode ? "Dark" : "Light"));
}

if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
}

// ===================================================
// Contact Button (already existed)
// ===================================================
//Button to access quick contact information

const contactEmail = "helene.quernet@edu.savonia.fi";

function showContactInfo() {
    // Console log #3: Log when contact info is requested
    console.log("Contact quick action triggered - Email: " + contactEmail);
    
    // Show alert with contact information
    alert(
        "Contact Hélène Quernet\n\n" +
        "Finnish email: helene.quernet@edu.savonia.fi\n" +
        "French email: helene.quernet@etu.estia.fr\n" +
        "GitHub: github.com/HeleneQ"
    );
}

const contactButton = document.getElementById('contact-btn');
if (contactButton) {
    contactButton.addEventListener('click', showContactInfo);
}

// --- LAST UPDATED FOOTER ---
const lastUpdated = document.createElement("p");
lastUpdated.id = "last-updated";
lastUpdated.style.fontSize = "0.8rem";
lastUpdated.style.marginTop = "1rem";
const formattedDate = new Date().toISOString().split("T")[0];
lastUpdated.textContent = "Last updated: " + formattedDate;
mainElement.appendChild(lastUpdated);