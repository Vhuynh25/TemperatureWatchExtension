function saveOptions()
{
    var max_check = document.getElementById("max_check").checked
    var min_check = document.getElementById("min_check").checked

    var max_threshold = document.getElementById("max_num").value
    var min_threshold = document.getElementById("min_num").value

    var unit = document.getElementById("unit").value

    chrome.storage.sync.set({
        maxCheck: max_check,
        minCheck: min_check,
        maxThres: max_threshold,
        minThres: min_threshold,
        unit: unit,
    })
}

function restoreOptions()
{
    chrome.storage.sync.get({
        maxCheck: false,
        minCheck: false,
        maxThres: 100,
        minThres: -50,
        unit: "fahrenheit"
    }, function (items) {
        document.getElementById("max_check").checked = items.maxCheck
        document.getElementById("min_check").checked = items.minCheck

        document.getElementById("max_num").value = items.maxThres
        document.getElementById("min_num").value = items.minThres

        document.getElementById("unit").value = items.unit
    })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById("save").addEventListener('click', saveOptions)