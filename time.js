const DAY = 24 * 60 * 60 * 1000

export function calculateTomorrowsDate()
{
    let nextDay = new Date(Date.now() + DAY)
    nextDay.setHours(7)
    nextDay.setMinutes(0)

    return next.getTime()
}

export function getTodaysDate()
{
    let today = Date.now()
    return today.toISOString()
}

export function getTomorrowsDate()
{
    let today = new Date(Date.now() + DAY)
    return today.toISOString()
}
