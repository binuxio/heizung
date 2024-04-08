export default function (startTime: string, endTime: string) {
    const startHour = parseInt(startTime.split(":")[0])
    const startMinute = parseInt(startTime.split(":")[1])
    const endHour = parseInt(endTime.split(":")[0])
    const endMinute = parseInt(endTime.split(":")[1])
    if (startHour > endHour)
        return true
    else if (startHour === endHour && startMinute >= endMinute)
        return true
    else
        return false
}