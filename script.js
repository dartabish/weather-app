const apiKey = '5bb7ee7fcbbe1c2e724027b43c843164';
const inputField = document.getElementById('input');
const searchBtn = document.getElementById('searchBtn');
const clearInputBtn = document.getElementById('clearBtn');
const weather = document.querySelector('.weather');
const errorMessage = document.getElementById('error');

//typed.js
const typed = new Typed('#input', {
  strings: ['Enter city name'],
  attr: 'placeholder',
  bindInputFocusEvents: true,
  typeSpeed: 25,
});

//clear button functionality
clearInputBtn.addEventListener('click', () => {
  inputField.value = '';
  clearInputBtn.style.display = 'none';
});

//toggle behaviour for clear button
inputField.addEventListener('input', () => {
  if (inputField.value.trim() == '') {
    clearInputBtn.style.display = 'none';
  } else {
    clearInputBtn.style.display = 'block';
  }
});

//show loader function
function showLoader() {
  document.querySelector('.loader-container').style.display = 'flex';
}

//hide loader function
function hideLoader() {
  document.querySelector('.loader-container').style.display = 'none';
}

//enter to submit input functionality
inputField.addEventListener('keyup', e => {
  if (e.code === 'Enter') {
    getWeather();
  }
});

//changing background according to weather condition
/* function setBackground(main) {
  let canvas = document.querySelector('body');
  const conditions = [
    'Clear',
    'Clouds',
    'Rain',
    'Snow',
    'Mist',
    'Haze',
    'Fog',
    'Smoke',
  ];
  conditions.forEach(condition => {
    const conditionClass = condition.toLowerCase();
    if (main === condition) {
      canvas.classList.add(conditionClass);
    } else {
      canvas.classList.remove(conditionClass);
    }
  });
} */

//date function
function displayDate() {
  const currentDate = new Date();
  const options = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat('en-us', options);
  const formattedDate = formatter.format(currentDate);
  document.getElementById('date').innerText = formattedDate;
}

//fetching and displaying weather
searchBtn.addEventListener('click', getWeather);
async function getWeather() {
  const cityName = inputField.value.trim();

  //showing loader
  showLoader();
  weather.style.display = 'none';
  errorMessage.innerText = '';

  let res;
  try {
    res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    );
    if (!res.ok) {
      throw new Error();
    }
  } catch (err) {
    weather.style.display = 'none';
    errorMessage.style.display = 'block';

    if (cityName === '') {
      errorMessage.innerText = 'Please enter city name.';
    } else {
      errorMessage.innerText = 'Invalid city name.';
    }
    hideLoader();
    return;
  }

  //resetting previous error messages
  errorMessage.innerText = '';

  //converting response to useable data
  const data = await res.json();

  //destructuring values from response object
  const { name } = data;
  const { country } = data.sys;
  const { temp, humidity } = data.main;
  const { icon, main } = data.weather[0];
  const { speed } = data.wind;

  //changing bg
  /* setBackground(main); */

  //updating weather info in HTML
  document.getElementById('city').innerText = `${name}, ${country}`;
  document.getElementById('temp').innerText = `${Math.round(temp)}°C`;
  document.getElementById(
    'icon'
  ).src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById('main').innerText = main;
  document.getElementById('humidity').innerText = `Humidity : ${humidity}%`;
  document.getElementById('wind').innerText = `Wind Speed : ${speed}km/h`;

  weather.style.display = 'block';

  //displaying date
  displayDate();

  //hiding loader
  hideLoader();
}
