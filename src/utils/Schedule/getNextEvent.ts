import { Schedule, _Event } from "@/types/schedule.types";

export default function (schedule: Schedule, today: number = new Date().getDay()): _Event | null {
    for (let day = today; day < 7; day++) {
        const events = schedule[day]

        if (events && events.length > 0) {
            const now = new Date();
            const currentTime = `${now.getHours()}:${now.getMinutes()}`;

            

            for (const event of events) {
                
                if (event.start.time > currentTime) {
                    return event; 
                }
            }
        }
    }

    for (let day = 0; day < today; day++) {
        const events = schedule[day.toString()];

        if (events && events.length > 0) {
            return events[0]; // Return the first event for tomorrow
        }
    }

    // No events found in the schedule
    return null;
}

