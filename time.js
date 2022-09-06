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
    let today = new Date(0)
    let todayFormatted = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
    return todayFormatted 
}

export function getTomorrowsDate()
{
    let tomorrow = new Date(Date.now() + DAY)
    let tomorrowFormatted = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`
    return tomorrowFormatted
}
