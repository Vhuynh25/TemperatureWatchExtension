window.onload = function ()
{
    chrome.storage.sync.get({
        message: ""
    }, function (items) {
        document.getElementById("message").innerHTML = items.message
    })
}