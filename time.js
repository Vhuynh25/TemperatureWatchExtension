const DAY = 24 * 60 * 60 * 1000

export function checkForNewDay() 
{
    if (localStorage.savedTimestamp) 
    {
        let timestamp = parseInt(localStorage.savedTimestamp)

        if (Date.now() >= timestamp)
            return true
        else 
            return false
    }
    return true
}

export function calculateNewDay()
{
    let nextDay = new Date(Date.now() + DAY)
    next.setHours(7)
    next.setMinutes(0)

    localStorage.savedTimestamp = next.getTime()
}
