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

searchBtn.addEventListener('click', () => {
    const city = inputBox.value;
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

        // ✅ Current weather from first forecast item
        const current = data.list[0];
        temperature.innerHTML = `${Math.round(current.main.temp)}°C`;
        description.innerHTML = current.weather[0].description;
        humidity.innerHTML = `${current.main.humidity}%`;
        wind_speed.innerHTML = `${current.wind.speed} Km/h`;
        // ✅ Sunrise & Sunset from city object
const sunrise = data.city.sunrise * 1000; // API gives seconds, convert to ms
const sunset = data.city.sunset * 1000;

document.getElementById("sunriseTime").textContent = formatTime(sunrise);
document.getElementById("sunsetTime").textContent = formatTime(sunset);


        const mainWeather = current.weather[0].main;
        switch (mainWeather) {
            case 'Clouds':
                weather_img.src = "/images/cloudy.png";
                break;
            case 'Clear':
                weather_img.src = "/images/clear.png";
                break;
            case 'Rain':
                weather_img.src = "/images/rain.png";
                break;
            case 'Mist':
                weather_img.src = "/images/mist.png";
                break;
            case 'Snow':
                weather_img.src = "/images/snow.png";
                break;
            default:
                weather_img.src = "/images/cloudy.png";
        }

        // ✅ Next 3 days forecast (8 * 1 = 24 hrs intervals)
        for (let i = 1; i <= 3; i++) {
            const forecast = data.list[i * 8];
            const forecastBlock = forecastDays[i - 1];
            forecastBlock.querySelector('.forecast-icon').src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
            forecastBlock.querySelector('.forecast-temp').innerText = `${Math.round(forecast.main.temp)}°C`;
        }

    } catch (error) {
        console.log("Something went wrong:", error);
        alert("Weather data fetch failed.");
    }

}
const modeToggle = document.getElementById('modeToggle');

modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Change button text/icon optionally
    if (document.body.classList.contains('dark-mode')) {
        modeToggle.textContent = '☀️';
    } else {
        modeToggle.textContent = '🌙';
    }
});
// JavaScript example:
searchBtn.addEventListener('click', () => {
    showLoading(true);
    const city = inputBox.value;
    if (city) {
        getWeatherAndForecast(city).finally(() => showLoading(false));
    }
});

function showLoading(isLoading) {
    if (isLoading) {
        // show spinner or disable input/button
    } else {
        // hide spinner or enable input/button
    }
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

setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call
// 1. API se data lete hain (ya jo bhi method se weather condition mile)
const weatherCondition = "Clear";  // example value, API se milegi

// 2. Background update karne ke liye function call karte hain
updateBackground(weatherCondition);

function updateBackground(weatherCondition) {
  const container = document.querySelector('.container');

  switch(weatherCondition.toLowerCase()) {
    case 'clear':
      container.style.backgroundImage = "url('images/clear.jpg')";
      break;
    case 'rain':
      container.style.backgroundImage = "url('images/rain.jpg')";
      break;
    case 'clouds':
      container.style.backgroundImage = "url('images/cloudy.jpg')";
      break;
    default:
      container.style.backgroundImage = "url('images/default.jpg')";
  }

  container.style.backgroundSize = "cover";
  container.style.backgroundPosition = "center";
}
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
// ---- existing code (search button, showWeatherData function, etc.) ----

// ✅ Location Detection (GPS)
document.getElementById("locationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});



// ✅ City se weather fetch
function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch weather data");
        });
}

// ✅ GPS se weather fetch
document.getElementById("locationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation not supported.");
    }
});

function success(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch weather data");
        });
}

function error() {
    alert("Unable to get your location.");
}

// ✅ UI update function
function showWeatherData(data) {
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = data.main.temp + "°C";
    document.getElementById("description").textContent = data.weather[0].description;

    // 🌅 Sunrise & Sunset
    const sunrise = data.sys.sunrise * 1000;
    const sunset = data.sys.sunset * 1000;
    document.getElementById("sunriseTime").textContent = formatTime(sunrise);
    document.getElementById("sunsetTime").textContent = formatTime(sunset);
}

// ✅ Time format helper
function formatTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    return hours + ":" + minutes.substr(-2);
}
