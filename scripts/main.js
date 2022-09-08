const apiKey = 'efb3951bf73e82a7d36e65dca67ca856';

const loupe = document.querySelector("#loupe");
const inputCity = document.querySelector("#city");
const city = document.querySelector("#cityName");
const cloudness = document.querySelector("#cloudness");
const humidity = document.querySelector("#humidity");
const temp = document.querySelector("#temp");
const description = document.querySelector("#description");
const weatherItem = document.querySelector("#weather-item");
const wind = document.querySelector("#wind");
const celsius = document.querySelector("#celsius");
const fahrenheit = document.querySelector("#fahrenheit");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");

let tempUnits = false;

let options = {
    weekday: "long",
    month: "short",
    day: "numeric"
}

function showCity(cityName) {
    const locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;

    fetch(locationUrl)
        .then(response => response.json())
        .then(dataLocal => {
            // console.log(dataLocal[0]);

            const lat = dataLocal[0].lat;
            const lon = dataLocal[0].lon;
            getWeatherInfo(lat, lon);
        })
        .catch(error => console.log(error.message));

    inputCity.value = '';
}

function getWeatherInfo(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            city.innerHTML = `${data.name} | ${data.sys.country}`;
            cloudness.innerHTML = `${data.clouds.all}%`;
            humidity.innerHTML = `${data.main.humidity}%`;
            temp.innerHTML = `${Math.round(data.main.temp - 273)}°`;
            description.innerHTML = `${data.weather[0].description}`;
            weatherItem.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
            wind.innerHTML = `${(data.wind.speed / 1000 * 60 * 60).toFixed(2)} km/h`;
            sunrise.innerHTML = `${(new Date(data.sys.sunrise * 1000)).getHours()}:${(new Date(data.sys.sunrise * 1000)).getMinutes()}`;
            sunset.innerHTML = `${(new Date(data.sys.sunset * 1000)).getHours()}:${(new Date(data.sys.sunset * 1000)).getMinutes()}`;
        })
        .catch(error => console.log(error.message));
}


function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherInfo(latitude, longitude);
    console.log('Местоположение найдено!');
}

function error() {
    console.log('Невозможно получить ваше местоположение');
}

window.addEventListener("load", () => {
    if (!navigator.geolocation) {
        console.log('Geolocation не поддерживается вашим браузером');
    } else {
        console.log('Определение местоположения…');
        navigator.geolocation.getCurrentPosition(success, error);
    }
})






loupe.addEventListener("click", () => {
    showCity(inputCity.value);
})

inputCity.addEventListener("keydown", function (e) {
    if (e.key == "Enter") showCity(inputCity.value);
})


celsius.addEventListener("click", () => {
    if (tempUnits) {
        celsius.style.fontWeight = "900";
        fahrenheit.style.fontWeight = "100";

        const tempValues = document.querySelectorAll(".tempValue");
        tempValues.forEach(element => {
            element.innerHTML = parseInt(element.innerHTML) - 273 + "°";
        });
        tempUnits = !tempUnits;
    }
})

fahrenheit.addEventListener("click", () => {
    if (!tempUnits) {
        fahrenheit.style.fontWeight = "900";
        celsius.style.fontWeight = "100";

        const tempValues = document.querySelectorAll(".tempValue");
        tempValues.forEach(element => {
            element.innerHTML = parseInt(element.innerHTML) + 273 + "°";
        });
        tempUnits = !tempUnits;
    }
})


setInterval(() => {
    let today = new Date();
    document.querySelector("#date").innerHTML = today.toLocaleDateString("en-US", options);
}, 1000);