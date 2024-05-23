//fetch geographical data from the API
function getCoordinates(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8032a0c325a0d4bbcd92d205aa9b08d4`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            getWeather(lat, lon);
        })
        .catch(error => console.error('Error:', error));
        };

//fetch weather data from the API
function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=8032a0c325a0d4bbcd92d205aa9b08d4`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.list === undefined || data.list.length === 0) {
                console.error('Error: data.list is undefined or empty');
                return;
            }
            const currentForecast = data.list[0]; // to get the furst item in the list
            const temperature = currentForecast.main.temp;
            const description = currentForecast.weather[0].description;
            const humidity = currentForecast.main.humidity;
            const windSpeed = currentForecast.wind_speed;
            const icon = currentForecast.weather[0].icon;
            displayWeather(temperature, description, humidity, windSpeed, icon);
        })
        .catch(error => console.error('Error:', error));
}

//display the weather data on the webpage
function displayWeather(temperature, description, humidity, windSpeed, uvIndex, icon) {
    const currentWeather = document.getElementById('current-weather');
    currentWeather.innerHTML = `
        <h2>Current Weather</h2>
        <p>Temperature: ${temperature}°F</p>
        <p>Description: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        <p>UV Index: ${uvIndex}</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
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
    searchHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
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
       searchHistoryList.innerHTML += `<p>${searchHistory[i]}</p>`; 
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