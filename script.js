const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('Wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const forecastDays = document.querySelectorAll('.day-forecast');

const API_KEY = "a3b4f8c7b6eae0938d9cfb145dce9028";
const repoName = "Weather-App";  // apna repo name
const basePath = `${window.location.origin}/${repoName}/images`;

searchBtn.addEventListener('click', () => {
    const city = inputBox.value.trim();
    if (city) {
        getWeatherAndForecast(city);
    }
});

async function getWeatherAndForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "404") {
            location_not_found.style.display = "flex";
            return;
        }

        location_not_found.style.display = "none";

        // Current weather from first forecast item
        const current = data.list[0];
        temperature.innerHTML = `${Math.round(current.main.temp)}°C`;
        description.innerHTML = current.weather[0].description;
        humidity.innerHTML = `${current.main.humidity}%`;
        wind_speed.innerHTML = `${current.wind.speed} Km/h`;

        // Sunrise & Sunset from city object
        const sunrise = data.city.sunrise * 1000; 
        const sunset = data.city.sunset * 1000;

        document.getElementById("sunriseTime").textContent = formatTime(sunrise);
        document.getElementById("sunsetTime").textContent = formatTime(sunset);

        // Weather icon update
        const mainWeather = current.weather[0].main;
        switch (mainWeather) {
            case 'Clouds':
                weather_img.src = `${basePath}/cloudy.png`;
                break;
            case 'Clear':
                weather_img.src = `${basePath}/clear.png`;
                break;
            case 'Rain':
                weather_img.src = `${basePath}/rain.png`;
                break;
            case 'Mist':
                weather_img.src = `${basePath}/mist.png`;
                break;
            case 'Snow':
                weather_img.src = `${basePath}/snow.png`;
                break;
            default:
                weather_img.src = `${basePath}/cloudy.png`;
        }

        // Next 3 days forecast (24 hrs intervals)
        for (let i = 1; i <= 3; i++) {
            const forecast = data.list[i * 8];
            const forecastBlock = forecastDays[i - 1];
            forecastBlock.querySelector('.forecast-icon').src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
            forecastBlock.querySelector('.forecast-temp').innerText = `${Math.round(forecast.main.temp)}°C`;
        }

        // Update background as per current weather
        updateBackground(mainWeather);

    } catch (error) {
        console.error("Something went wrong:", error);
        alert("Weather data fetch failed.");
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateBackground(weatherCondition) {
    const container = document.querySelector('.container');
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            container.style.backgroundImage = `url(${basePath}/clear.jpg)`;
            break;
        case 'rain':
            container.style.backgroundImage = `url(${basePath}/rain.jpg)`;
            break;
        case 'clouds':
            container.style.backgroundImage = `url(${basePath}/cloudy.jpg)`;
            break;
        default:
            container.style.backgroundImage = `url(${basePath}/default.jpg)`;
    }
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";
}
function updateDateTime() {
    const now = new Date();

    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    const formatted = now.toLocaleString('en-GB', options).replace(',', ' |');
    document.getElementById("dateTime").textContent = formatted;
}

// Har second mein date/time update karo
setInterval(updateDateTime, 1000);
updateDateTime();


