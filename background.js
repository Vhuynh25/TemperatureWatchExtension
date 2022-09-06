

const APPID = chrome.runtime.id

function activatePopup() 
{
    console.log("checking for new day\n")
    chrome.storage.sync.get({
        timestamp: Date.now() - 500000
    }, async function (items) {
        var timestamp = items.timestamp

        console.log(`comparing timestamps ${timestamp}\n`)
        if (Date.now() > timestamp){
            //chrome.runtime.sendMessage({message: "Weather"})
        }
    })
}


chrome.runtime.onStartup.addListener
( 
    activatePopup()
)