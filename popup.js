import * as time_help from "./time.js"

function runApp(){
    getLocation()

    chrome.storage.sync.get({
        message: ""
    }, function (items) {
        document.getElementById("message").innerHTML = items.message
        //alert(items.message)
    })
}

chrome.runtime.onMessage.addListener(function (data){ 
    if (data.message != "Weather") {return}
    runApp()
})

window.onload = runApp()

function getLocation(){
    console.log("getting location\n")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const {latitude , longitude } = position.coords
                fetchFromLocation(latitude, longitude)
                
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

function fetchFromLocation(latitude, longitude) 
{
    console.log("fetching weather data\n")
    chrome.storage.sync.get({
        unit: "fahrenheit"
    }, async function (items) {
        try {
            const BASEURL = "https://api.open-meteo.com/v1/forecast?"

            const end = time_help.getTomorrowsDate()
            const start = time_help.getTodaysDate()

            const response = await fetch(`${BASEURL}latitude=${latitude}&longitude=${longitude}&temperature_unit=${items.unit}&hourly=temperature_2m&timezone=auto&start_date=${start}&end_date=${end}`)
            await response.json().then(async function (data){
                const temperatures = parseWeatherJson(data)
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
                    }
                    else
                    {
                        chrome.storage.sync.set({
                            message: `Temperature is unlikely reach higher and lower thresholds within 24 hours\n`
                        })
                    }
                })
            })
        }
        catch(error){alert(error,message)}
        
    })
}

async function checkMax(temp)
{
    chrome.storage.sync.set({message: ""})
    chrome.storage.sync.get({
        maxCheck: false,
        maxThres: 100,
        message: "",
        shouldAlert: false,
        unit: "fahrenheit"
    }, function (items) {
        if (items.maxCheck && greaterThanMax(items.maxThres, temp))
        {
            chrome.storage.sync.set({
                message: `${items.message} Warning: Temperature will likely reach or exceed higher threshold of ${items.maxThres} ${items.unit} within 24 hours\n`,
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
        shouldAlert: false, 
        unit: "fahrenheit"
    }, function (items) {
        if (items.minCheck && lessThanMin(items.minThres, temp))
        {
            chrome.storage.sync.set({
                message: `${items.message} Warning: Temperature will likely reach or exceed lower threshold of ${items.minThres} ${items.unit} within 24 hours\n`,
                shouldAlert: true
            })
        }
    })
}

function parseWeatherJson(json)
{
    const dailyData = json["hourly"]
    const maxTemp = Math.max(...dailyData["temperature_2m"])
    const minTemp = Math.min(...dailyData["temperature_2m"])

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

document.getElementById("test").addEventListener('click', runApp)