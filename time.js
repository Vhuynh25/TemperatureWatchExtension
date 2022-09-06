const DAY = 24 * 60 * 60 * 1000

export function calculateTomorrowsDate()
{
    let nextDay = new Date(Date.now() + DAY)
    nextDay.setHours(7)
    nextDay.setMinutes(0)

    return nextDay.getTime()
}

export function getTodaysDate()
{
    const today = new Date()
    var day = ""
    var month = ""

    if (today.getDate() < 10)
        day = `0${today.getDate()}`
    else
        day = `${today.getDate()}`

    if (today.getMonth() < 10)
        month = `0${today.getMonth()}`
    else
        month = `${today.getMonth()}`

    let todayFormatted = `${today.getFullYear()}-${month}-${day}`
    return todayFormatted 
}

export function getTomorrowsDate()
{
    const tomorrow = new Date(Date.now() + DAY)
    var day = ""
    var month = ""

    if (tomorrow.getDate() < 10)
        day = `0${tomorrow.getDate()}`
    else
        day = `${tomorrow.getDate()}`

    if (tomorrow.getMonth() < 10)
        month = `0${tomorrow.getMonth()}`
    else
        month = `${tomorrow.getMonth()}`

    let tomorrowFormatted = `${tomorrow.getFullYear()}-${month}-${day}`
    return tomorrowFormatted
}
