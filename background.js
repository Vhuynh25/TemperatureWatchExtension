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
            
        }
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

chrome.runtime.onStartup.addListener
( 
    tempAlert()
)