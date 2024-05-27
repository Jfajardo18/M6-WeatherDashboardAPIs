//fetch geographical data from the API
function getCoordinates(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8032a0c325a0d4bbcd92d205aa9b08d4`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            getCurrentWeather(lat, lon);
            getForecast(lat, lon);
        })
        .catch(error => console.error('Error:', error));
}

//fetch current weather data from the API
function getCurrentWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8032a0c325a0d4bbcd92d205aa9b08d4`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const icon = data.weather[0].icon;
            const date = new Date(data.dt * 1000).toLocaleDateString();
            displayWeather(temperature, description, humidity, windSpeed, icon, 'current', date);
        })
        .catch(error => console.error('Error:', error));
}

//fetch 5-day forecast data from the API
function getForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=8032a0c325a0d4bbcd92d205aa9b08d4`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.list === undefined || data.list.length === 0) {
                console.error('Error: data.list is undefined or empty');
                return;
            }
            const forecasts = data.list.filter((forecast, index) => index % 8 === 0);
            forecasts.forEach((forecast, index) => {
                const temperature = forecast.main.temp;
                const description = forecast.weather[0].description;
                const humidity = forecast.main.humidity;
                const windSpeed = forecast.wind.speed;
                const icon = forecast.weather[0].icon;
                const date = new Date(forecast.dt * 1000).toLocaleDateString();
                displayWeather(temperature, description, humidity, windSpeed, icon, index, date);
            });
        })
        .catch(error => console.error('Error:', error));
}

//display the weather data on the webpage
function displayWeather(temperature, description, humidity, windSpeed, icon, day, date) {
    const forecastElement = document.getElementById(`forecast-day-${day}`);
    forecastElement.innerHTML = `
        <div class="date">${date}</div>
        <div class="temperature">${temperature}°C</div>
        <div class="description">${description}</div>
        <div class="humidity">${humidity}% humidity</div>
        <div class="wind-speed">${windSpeed} m/s wind speed</div>
        <div class="icon"><img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}"></div>
    `;
}

// store search history in local storage
function storeSearchHistory(cityName) {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory === null) {
        searchHistory = [];
    } else {
        searchHistory = JSON.parse(searchHistory);
    }
    if (!searchHistory.map(city => city.toLowerCase()).includes(cityName.toLowerCase())) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// display search history on the webpage
function displaySearchHistory() {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory === null) {
        searchHistory = [];
    } else {
        searchHistory = JSON.parse(searchHistory);
    }
    const searchHistoryList = document.getElementById('searchHistory');
    searchHistoryList.innerHTML = '';
    for (let i = 0; i < searchHistory.length; i++) {
        const button = document.createElement('button');
        button.textContent = searchHistory[i];
        button.addEventListener('click', () => {
            getCoordinates(searchHistory[i]);
        });
        searchHistoryList.appendChild(button);
    }
}

//form submission
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = document.getElementById('cityName').value;
    getCoordinates(cityName);
    storeSearchHistory(cityName);
    displaySearchHistory();
});