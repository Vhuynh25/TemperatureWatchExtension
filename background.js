import * as time_help from "./time.js"

const BASEURL = "https://api.open-metro.com/v1/forecast?"

async function fetchFromLocation(latitude, longitude) 
{
    chrome.storage.sync.get({
        unit: "fahrenheit"
    }, function (items) {
        const response = await fetch(`${BASEURL} + latitude=${latitude}&longitude=${longitude}&temperature_unit=${items.unit}&daily=temperature_2m_max,temperature_2m_min`)

        const temperatures = parseWeatherJson(response.json())

        await checkMax(temperatures.max)
        await checkMin(temperatures.min)

        chrome.storage.sync.get({
            message: "",
            shouldAlert: false
        }, function (items) {
            if (items.shouldAlert)
            {
                alert(items.message)
            }
        })

    })
}

async function checkMax(temp)
{
    chrome.storage.sync.set({message: ""})
    chrome.storage.sync.get({
        maxCheck: false,
        maxThres: 100,
        message: "",
        shouldAlert: false
    }, function (items) {
        if (maxCheck && greaterThanMax(items.maxThres, maxTemp))
        {
            chrome.storage.sync.set({
                message: `${items.message} Warning: Temperature will likely reach higher threshold within 24 hours\n`,
                shouldAlert: true
            })
        }
    })
}

async function checkMin(temp)
{
    chrome.storage.sync.get({
        minCheck: false,
        minThres: 0,
        message: "",
        shouldAlert: false
    }, function (items) {
        if (minCheck && lessThanMin(items.maxThres, minTemp))
        {

            chrome.storage.sync.set({
                message: `${items.message} Warning: Temperature will likely reach lower threshold within 24 hours\n`,
                shouldAlert: true
            })
        }
    })
}

function parseWeatherJson(json)
{
    dailyData = json.daily
    maxTemp = Math.max(dailyData.temperature_2m_max)
    minTemp = Math.min(dailyData.temperature_2m_min)

    return {max: maxTemp, min: minTemp}
}

function greaterThanMax(max, temp)
{
    return temp > max
}

function lessThanMin(min, temp)
{
    return temp < min
}

chrome.runtime.onStartup.addListener
( 
    function tempAlert() 
    {
        if (time_help.checkForNewDay())
        {    
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const {latitude , longitude } = position.coords

                    
                    fetchFromLocation(latitude, longitude)
                })

            time_help.calculateNewDay()
        }
    }
)