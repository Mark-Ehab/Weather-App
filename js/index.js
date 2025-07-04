/*--------------------------------------
# External Script File for Weather App #
---------------------------------------*/

/*-------------------------------------------------
# Apply strict mode on the script 
--------------------------------------------------*/
"use strict";

/*-------------------------------------------------- 
# Global Scope Variables declarations and definition
---------------------------------------------------*/
/************************DOM Elements************************/
const locationSearchInputField = document.querySelector("#location-seacrh");
const findBtn = document.querySelector("#hero .btn-find ");
const forcastTableInfoRow = document.querySelector(
  "#weather-forecast-table .container > .row"
);
/************************General Variables************************/
const ipAPIBaseURL = "https://api.ipgeolocation.io/v2/ipgeo";
const ipAPIKeyQueryParam = "336d9bcc163e4f87ae9ca39326cf4596";
const weatherApiBaseURL = "https://api.weatherapi.com/v1";
const weatherApiKeyQueryParam = "4b5bf409715d418f8e0182853252906";

/*========================================================================================*/
/*--------------------------------------- 
# Functions Definition and Implementation
----------------------------------------*/
/*-----------------------------------------------------------------------------
# Description: A function to user's current geolocation
#------------------------------------------------------------------------------
# @params: void
#------------------------------------------------------------------------------
# return type: Promise (Object)
-----------------------------------------------------------------------------*/
async function getUserCurrentGeoLocation() {
  try {
    /* Start Fetching Data */
    const response = await fetch(
      `${ipAPIBaseURL}?apiKey=${ipAPIKeyQueryParam}`
    );
    /* Check status of returned response */
    if (response.ok) {
      /* Get Response Data */
      const data = await response.json();
      const { city } = data.location;
      return new Promise((resolve) => {
        resolve();
      }).then(() => city);
    }
  } catch (e) {
    console.log(e);
  }
}
/*-----------------------------------------------------------------------------
# Description: A function to get weather forecast data for a specific loaction
# for current day and up to 14 days
#------------------------------------------------------------------------------
# @params: 
# @param 1: numberOfDays (number) --> Number of days for which forcast data 
# will be get (Range: 1 -> 14)
# @param 2: location (string) --> location for which forcast data will be get
#------------------------------------------------------------------------------
# return type: Promise (Object)
-----------------------------------------------------------------------------*/
async function getWeatherForecastData(numberOfDays, location) {
  try {
    /* Check if passed number of days is within range */
    if (numberOfDays > 0 && numberOfDays < 15) {
      /* Start Fetching Data */
      const response = await fetch(
        `${weatherApiBaseURL}/forecast.json?key=${weatherApiKeyQueryParam}&q=${location}&days=${numberOfDays}`
      );
      /* Check status of returned response */
      if (response.ok) {
        /* Get Respoonse Data */
        const { forecast, current, location } = await response.json();
        const { forecastday } = forecast;
        forecastday.splice(0, 1, current);
        return new Promise((resolve) => {
          resolve();
        }).then(() => {
          return {
            forecastday,
            location,
          };
        });
      } else {
        if (!location) {
          /* Throw Location must be provided error*/
          throw new Error("Location must be provided.");
        }
        /* Get Respoonse Data */
        const data = await response.json();
        /* Throw returned error from response */
        throw new Error(`${data?.error.message || "Unknown Error Occured."}`);
      }
    } else {
      /* Throw Invalid Number of Days Error */
      throw new Error(
        "Invalid number of days, Range must be from 1 day and up to 14 days"
      );
    }
  } catch (e) {
    console.log(e);
  }
}
/*-----------------------------------------------------------------------------
# Description: A function to display weather forecast data for a specific 
# loaction for three days including current day
#------------------------------------------------------------------------------
# @params: 
# @param 1: forecastList (Array) --> Array of forecast data for three days
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function displayForecastData(forecastData) {
  /* Local Scope Variables Declarations and Definitions */
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const { forecastday, location } = forecastData;
  const { name } = location;
  const { 0: today, 1: tomorrow, 2: dayAfterTomorrow } = forecastday;
  const {
    temp_c: todayTemp,
    condition: todayCondition,
    humidity: todayHumidity,
    wind_kph: todayWind,
    wind_dir: todayWindDir,
    last_updated: todayDate,
  } = today;
  const { date: tomorrowDate } = tomorrow;
  const {
    maxtemp_c: tomorrowMaxTemp,
    mintemp_c: tomorrowMinTemp,
    condition: tomorrowCondition,
  } = tomorrow.day;
  const { date: dayAfterTomorrowDate } = dayAfterTomorrow;
  const {
    maxtemp_c: dayAfterTomorrowMaxTemp,
    mintemp_c: dayAfterTomorrowMinTemp,
    condition: dayAfterTomorrowCondition,
  } = dayAfterTomorrow.day;
  const date1 = new Date(`${todayDate}`);
  const date2 = new Date(`${tomorrowDate}`);
  const date3 = new Date(`${dayAfterTomorrowDate}`);
  forcastTableInfoRow.innerHTML = `         
            <div class="col-12 col-lg-4">
              <div class="inner" id="today-weather">
                <header class="d-flex justify-content-between">
                  <span id="first-day-name">${days[date1.getDay()]}</span>
                  <span id="first-day-date">${date1.getDate()}${
    months[date1.getMonth()]
  }</span>
                </header>
                <article>
                  <span id="location" class="d-block">${name}</span>
                  <div class="row align-items-center">
                    <div class="col-sm-6 col-lg-12">
                      <div class="inner">
                        <span id="first-day-temp" class="d-block text-white"
                          >${todayTemp}&deg;C</span
                        >
                      </div>
                    </div>
                    <div class="col-sm-6 col-lg-12">
                      <div class="inner">
                        <figure
                          class="mb-0 d-flex justify-content-sm-center justify-content-lg-start"
                        >
                          <img
                            src="${todayCondition.icon}"
                            alt=""
                            class="first-day-condition-img"
                          />
                        </figure>
                      </div>
                    </div>
                  </div>
                  <span class="condition">${todayCondition.text}</span>
                  <div id="humidity-wind-compass" class="d-flex">
                    <figure class="mb-0">
                      <img src="./image/icon-umberella@2x.png" alt="" />
                      <span>${todayHumidity}%</span>
                    </figure>

                    <figure class="mb-0">
                      <img src="./image/icon-wind@2x.png" alt="" />
                      <span>${todayWind}km/h</span>
                    </figure>

                    <figure class="mb-0">
                      <img src="./image/icon-compass@2x.png" alt="" />
                      <span>${todayWindDir}</span>
                    </figure>
                  </div>
                </article>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="inner" id="tomorrow-weather">
                <header class="d-flex justify-content-center">
                  <span id="second-day-name">${days[date2.getDay()]}</span>
                </header>
                <article class="text-center">
                  <figure>
                    <img
                      src="${tomorrowCondition.icon}"
                      alt=""
                      class="second-day-condition-img"
                    />
                  </figure>
                  <span id="second-day-ht" class="d-block text-white"
                    >${tomorrowMaxTemp}&deg;C</span
                  >
                  <span id="second-day-lt" class="d-block">${tomorrowMinTemp}&deg;</span>
                  <span class="condition">${tomorrowCondition.text}</span>
                </article>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="inner" id="day-after-tomorrow-weather">
                <header class="d-flex justify-content-center">
                  <span id="third-day-name">${days[date3.getDay()]}</span>
                </header>
                <article class="text-center">
                  <figure>
                    <img
                      src="${dayAfterTomorrowCondition.icon}"
                      alt=""
                      class="third-day-condition-img"
                    />
                  </figure>
                  <span id="third-day-ht" class="d-block text-white"
                    >${dayAfterTomorrowMaxTemp}&deg;C</span
                  >
                  <span id="third-day-lt" class="d-block">${dayAfterTomorrowMinTemp}&deg;</span>
                  <span class="condition">${
                    dayAfterTomorrowCondition.text
                  }</span>
                </article>
              </div>
            </div>`;
}
/*========================================================================================*/
/*--------------------------------------------- 
# Event Listeners Definition and Implementation
----------------------------------------------*/
/* Apply click event on find button */
findBtn.addEventListener("click", async () => {
  /* Get forecast weather data for three days including current day */
  let forecastForNextThreeDays = await getWeatherForecastData(
    3,
    locationSearchInputField.value
  );
  if (!forecastForNextThreeDays) {
    /* Get forecast date up to three days for user's current geolocation by default */
    forecastForNextThreeDays = await getWeatherForecastData(
      3,
      await getUserCurrentGeoLocation()
    );
  }
  /* Display forecast data on forecast table */
  displayForecastData(forecastForNextThreeDays);
});
/* Apply keydown event on location search input field */
locationSearchInputField.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    /* Get forecast weather data for three days including current day */
    let forecastForNextThreeDays = await getWeatherForecastData(
      3,
      locationSearchInputField.value
    );
    if (!forecastForNextThreeDays) {
      /* Get forecast date up to three days for user's current geolocation by default */
      forecastForNextThreeDays = await getWeatherForecastData(
        3,
        await getUserCurrentGeoLocation()
      );
    }
    /* Display forecast data on forecast table */
    displayForecastData(forecastForNextThreeDays);
  }
});
/*========================================================================================*/
/*--------------------------------------- 
# App Entry Point
----------------------------------------*/

(async () => {
  /* Get user current geolocation */
  const userCurrentGeoLocation = await getUserCurrentGeoLocation();

  /* Get forecast weather data for three days including current day */
  const forecastForNextThreeDays = await getWeatherForecastData(
    3,
    userCurrentGeoLocation
  );

  /* Display forecast data on forecast table */
  displayForecastData(forecastForNextThreeDays);
})();
