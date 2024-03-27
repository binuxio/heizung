import { EventMoment, _Event } from "@/types/schedule.types"

type EventAction =
    | { type: "CREATE"; payload: _Event }
    | { type: "INIT"; payload: _Event[] }
    | { type: "UPDATE"; payload: _Event }
    | { type: "DELETE"; payload: string };

export default function eventReducer(state: { events: _Event[] }, action: EventAction): { events: _Event[] } {
    const { type, payload } = action;
    switch (type) {
        case "UPDATE":
            const updatedEvents = state.events.map((event) => (event._id === payload._id ? payload : event));
            return { events: updatedEvents };
        case "CREATE":
            return { events: [...state.events, payload] };
        case "INIT":
            return { events: payload };
        case "DELETE":
            const updatedEventss = [...state.events]
            return { events: updatedEventss.splice(1, 1) };

        // const filteredEvents = state.events.filter(e => e._id === payload)
        // return { events: filteredEvents };
        default:
            return state;
    }
}