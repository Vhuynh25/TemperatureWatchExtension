import * as time_help from "./time.js"

const BASEURL = "https://api.open-metro.com/v1/forecast?"

function tempAlert() 
{
    console.log("checking for new day\n")
    chrome.storage.sync.get({
        timestamp: Date.now() - 500000
    }, async function (items) {
        var timestamp = items.timestamp

        console.log(`comparing timestamps ${timestamp}\n`)
        if (Date.now() > timestamp){
            console.log("getting location\n")

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const {latitude , longitude } = position.coords

                        try {
                            fetchFromLocation(latitude, longitude)
                        }
                        catch(error){alert("Error: Unable fetch weather data. Extension will attempt to try again when Chrome is restarted")}
                    }, function() {
                        console.log("Error: Unable get location data. Extension will attempt to try again when Chrome is restarted")
                        return
                    }, 
                    {timeout: 1000}
                )
                chrome.storage.sync.get({timestamp: time_help.calculateTomorrowsDate()})
            }
            else 
                console.log("Error: navigator.geolocation undefined")
        }
    })
}

function fetchFromLocation(latitude, longitude) 
{
    console.log("fetching weather data\n")
    chrome.storage.sync.get({
        unit: "fahrenheit"
    }, async function (items) {
        const response = await fetch(`${BASEURL} + latitude=${latitude}&longitude=${longitude}&temperature_unit=${items.unit}&daily=temperature_2m_max,temperature_2m_min&start_date=${time_help.getTodaysDate}&end_date=${time_help.getTomorrowsDate}`)

        const temperatures = parseWeatherJson(response.json())

        console.log("checking thresholds\n")
        await checkMax(temperatures.max)
        await checkMin(temperatures.min)

        chrome.storage.sync.get({
            message: "",
            shouldAlert: false
        }, function (items) {
            if (items.shouldAlert)
            {
                console.log("alerting\n")
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
    tempAlert()
)