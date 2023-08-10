const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather");
const userContainer = document.querySelector(".weather-Container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//Initiallly we required variables
let oldTab = userTab; //by default current tab userTab hoga
const API_KEY = "6fb6edc9deb13bb029ed5728daccec0d";
getfromSessionStorage();
oldTab.classList.add("current-tab");

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  console.log(coordinates.lat);
  console.log(coordinates.lon);
  //make grant container invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6fb6edc9deb13bb029ed5728daccec0d&units=metric
      `
    );

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    //Not found page
  }
}

function getLocation() {
  //system supports geo location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPostition);
  } else {
    //if system not supports geo location
    //* Show an alert for no geo location support available
    console.log("No Geolocation Support avilable");
  }
}

function showPostition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

function switchTab(newTab) {
  //checking if the newTab or oldTab is same or not
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    //if we are on searchTab make it visible
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
      searchInput.value = "";
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //if we have locations on our local storage then procedd with it
      getfromSessionStorage();
      searchInput.value = "";
    }
  }
}

//IF USER CLICKED ON USER TAB
userTab.addEventListener("click", function () {
  //pass clicked tab as input parameter
  switchTab(userTab);
});

//IF USER CLICKED ON SEARCH TAB
searchTab.addEventListener("click", function () {
  //pass clicked tab as input parameter
  switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("userCoordinates");
  if (!localCoordinates) {
    //if we dont have coordinates on our localstorage then make grantAccessContainer visible
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

function renderWeatherInfo(data) {
  // firstly we have to fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloud]");

  //fetch values from api and show on ui
  cityName.innerHTML = `${data?.name}`;
  countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  desc.innerHTML = `${data?.weather?.[0]?.description}`;
  weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  temp.innerHTML = `${data?.main?.temp}°C`;
  windspeed.innerHTML = `${data?.wind?.speed}m/s`;
  humidity.innerHTML = `${data?.main?.humidity}%`;
  cloudiness.innerHTML = `${data?.clouds?.all}%`;
}

const searchInput = document.querySelector("[data-searchInput]");
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

searchForm.addEventListener("submit", function (e) {
  // removes the default behaviour
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName == "") return;
  else {
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessButton.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6fb6edc9deb13bb029ed5728daccec0d&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    //have to include error
    alert("Enter another City");
  }
}
