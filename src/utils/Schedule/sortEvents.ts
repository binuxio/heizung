import { _Event } from "@/types/schedule.types";

export default function (events: _Event[]): _Event[] {
    return events.sort((a, b) => {
        const timeA = parseInt(a.start.time.replace(":", ""))
        const timeB = parseInt(b.start.time.replace(":", ""))
        return timeA - timeB;
    });
}