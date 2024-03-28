import { EventMoment, _Event } from "@/types/schedule.types"
import sortEvents from "@/utils/Schedule/sortEvents";

type EventAction =
    | { type: "CREATE"; payload: _Event }
    | { type: "UPDATE"; payload: _Event }
    | { type: "DELETE"; payload: string }
    | { type: "SORT"; payload: _Event[] };

export default function eventReducer(state: { events: _Event[] }, action: EventAction): { events: _Event[] } {
    const { type, payload } = action;
    switch (type) {
        case "UPDATE":
            const updatedEvents = sortEvents(state.events.map((event) => (event.id === payload.id ? payload : event)));
            return { events: updatedEvents };
        case "CREATE":
            const newEventList = [...state.events]
            newEventList.unshift(payload)
            return { events: newEventList };
        case "DELETE":
            console.log(payload)
            const filteredEvents = [...state.events]
            return { events: filteredEvents.filter(e => e.id !== payload) };
        case "SORT":
            return { events: sortEvents([...payload]) }
        default:
            return state;
    }
}