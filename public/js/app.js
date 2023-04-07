//Declare the API key.
const openWeatherApiKeyAndUnit = '3707f41526796de7af0aaa60fd04ed2c&units=imperial';

//Select all the necessary DOM Elements.
const countrySelectEl = document.getElementById('country');
const zipCodeInputEl = document.getElementById('zip');
const userFeelingTextAreaEl = document.getElementById('feelings');
const generateBtnEl = document.getElementById('generate');
const entriesContainer = document.querySelector('.entries');
const progressDialog = document.querySelector('.progress');
const alertDialogCloseBtn = document.querySelector('.alert-modal-toggler');
const alertDialog = document.querySelector('.alert');

const firstApiUri = '/cors?url=https://api.first.org/data/v1/countries?limit=200'

/**
 * 
 * @param {string} zipCode zipcode of the target region.
 * @param {string} countryCode country code of the target country.
 * @returns Returns the openweather api uri with prefixed query parameters.
 */
const generateOpenWeatherApiUri = (zipCode, countryCode) => `/cors?url=https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${openWeatherApiKeyAndUnit}`;

/**
 * @description Function that resets UI input fields.
 */
const clearInput = () => {
    countrySelectEl.value = 'empty';
    zipCodeInputEl.value = '';
    userFeelingTextAreaEl.value = '';
}

/**
 * @description Function that toggles the visibility of the progress dialog.
 * @returns Same as the classList.toggle() method.
 */
const toggleProgressDialog = () => progressDialog.classList.toggle('d-none');

/**
 * @description Function that closes the alert dialog box.
 */
const closeAlertDialog = () => {
    alertDialogCloseBtn.removeEventListener('click', closeAlertDialog);
    alertDialog.classList.remove('alert--show');
}

/**
 * @description Function that opens the alert dialog box.
 * @param {string} header Header of the alert dialog.
 * @param {string} title Title of the alert dialog.
 * @param {string} msg Message of the alert dialog.
 */
const openAlertDialog = (header, title, msg) => {
    alertDialog.querySelector('.alert-modal-header>h1').textContent = header;
    alertDialog.querySelector('.alert-modal-content>h1').textContent = title;
    alertDialog.querySelector('.alert-modal-content>p').textContent = msg;
    alertDialog.classList.add('alert--show');
    alertDialogCloseBtn.addEventListener('click', closeAlertDialog);
}

/**
 * @description Function that generates the HTML template for a single weather data entry.
 * @param {object} entryObj Object containing the data for a single weather data entry.
 * @returns HTML template string for the single weather data entry.
 */
const generateUIEntryHTML = entryObj => {
    return `<div class="card mb-3 slide-in-right">
                <div class="card-body">
                    <div class="entry" id=${entryObj.date}>
                        <h1 class="user-feeling">${entryObj.userFeeling}</h1>
                        <h2 class="entry-date">${new Date(entryObj.date).toLocaleString()}</h2>
                        <div class="entry-weather">
                            <div class="entry-group">
                                <img src="img/anemometer.png" alt="wind-icon">
                                <p>Wind: ${entryObj.weatherData.wind.speed} Km/h</p>
                            </div>
                            <div class="entry-group">
                                <img src="img/atmospheric.png" alt="pressure-icon">
                                <p>Pressure: ${entryObj.weatherData.main.pressure} atm</p>
                            </div>
                            <div class="entry-group">
                                <img src="img/humidity.png" alt="humidity-icon">
                                <p>Humidity: ${entryObj.weatherData.main.humidity}%</p>
                            </div>
                            <div class="entry-group">
                                <img src="img/thermometer.png" alt="thermometer-icon">
                                <p>Temperature: ${entryObj.weatherData.main.temp} &deg;F</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

/**
 * @description Function that generates the HTML template for empty weather data.
 * @returns HTML template string for empty weather data.
 */
const generateUIEmptyHTML = () => {
    return `<div class="entries-empty">
                <attr title="Ui icons created by kerismaker - Flaticon">
                    <img src="img/trash.png" alt="empty-trash">
                </attr>
                <h3>Looks Empty!</h2>
            </div>`;
}

/**
 * @description Function that performs http requests for a given URL using fetch API.
 * @param {string} apiUri Target URL where the request has to be initiated. 
 * @param {string} method HTTP request method like GET, POST etc.
 * @param {object} body HTTP request body object.
 * @param {object} headers Object containing the headers for the HTTP request. 
 * @returns Promise that resolves into the data fetched from the given URL.
 */
const httpRequest = async (apiUri, method='GET', body=null, headers) => {
    if(!apiUri) return;
    toggleProgressDialog();
    try {
        const res = await fetch(apiUri, {
            method,
            body,
            headers
        });
        const resData = await res.json();
        toggleProgressDialog();
        return resData;
    } catch(err) {
        toggleProgressDialog();
        console.log(err.message);
    }
}

/**
 * @description Function that initializes the UI by fetching the list of countries from
 * api.first.org, fetching the existing weather data from the app server, inserting the
 * fetched data into the UI and adding the required event listeners.
 */
const initUI = () => {
    httpRequest(firstApiUri)
        .then(res => {
            if(!res || !res["status"] || res["status"] != 200) {
                console.log("error occurred while fetching the list of countries from api.first.org!");
                return;
            }
            const resData = res.data.data;
            const docFrag = new DocumentFragment();
            for(key in resData) {
                const optionEl = new Option(resData[key].country, key);
                docFrag.appendChild(optionEl);
            }
            countrySelectEl.appendChild(docFrag);
            return httpRequest('/entries');
        })
        .then(entries => {
            if(!entries) return;
            const keys = Object.keys(entries);
            let entriesHTML = ''
            if(keys.length === 0) {
                entriesHTML = generateUIEmptyHTML();
                entriesContainer.setAttribute('data-size', '0');
            } else {
                for(let key of keys) {
                    entriesHTML = entriesHTML.concat(generateUIEntryHTML(entries[key]));
                }
                entriesContainer.setAttribute('data-size', `${keys.length}`);
            }
            entriesContainer.innerHTML = entriesHTML;
        })
    generateBtnEl.addEventListener('click', generateWeatherEntry);
}

/**
 * @description Function that updates the UI whenever a new weather entry is generated.
 * @param {object} entryObj Object containing the newly generated weather entry data.
 */
const updateUI = entryObj => {
    const entriesContainerSize = entriesContainer.dataset.size;
    const entryHTML = generateUIEntryHTML(entryObj);
    if(entriesContainerSize == 0) {
        entriesContainer.innerHTML = entryHTML;   
    } else {
        entriesContainer.insertAdjacentHTML('beforeend', entryHTML);
    }
    entriesContainer.setAttribute('data-size', `${parseInt(entriesContainerSize) + 1}`)
}

/**
 * @description Callback function that is executed whenever the generate button is clicked,
 * which generates a new weather entry by taking the zip code, country code, API key and 
 * performing HTTP request to the openweather API. Once the data is fetched it also performs
 * a HTTP request to the app server to save the newly fetched data and also updates the UI.
 * @param {Event} e Click event object. 
 */
const generateWeatherEntry = e => {
    e.preventDefault();
    const zipCode = zipCodeInputEl.value;
    const countryCode = countrySelectEl.value;
    const userFeeling = userFeelingTextAreaEl.value;
    const entryObj = {
        zipCode,
        countryCode,
        userFeeling,
    };
    if(!zipCode || !userFeeling || countryCode === 'empty') {
        openAlertDialog(
            "Error",
            "Required fields empty!",
            "Please select the country, enter the zip code and some text to tell us how are you feeling today and then press generate button."
        )
        return;
    }
    httpRequest(generateOpenWeatherApiUri(zipCode, countryCode))
        .then(res => {
            if(!res || !res.data || !res.data.cod || res.data.cod != 200) {
                console.log('Some error occured while fetching data from openweather API!')
                return;
            }
            entryObj.weatherData = res.data;
            entryObj.date = new Date().toJSON();
            return httpRequest('/entries', 'POST', JSON.stringify(entryObj), {
                'Content-Type': 'application/json'
            })
        })
        .then(entryRes => {
            if(!entryRes || !entryRes.status || entryRes.status != 201) {
                console.log('error occured while creating weather data entry on the server!');
                return;
            }
            updateUI(entryObj);
            clearInput();
        })
}

//Start the app by initializing the UI.
initUI();

