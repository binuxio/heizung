import { _Event } from "@/types/schedule.types"
import sortEvents from "@/utils/Schedule/sortEvents";
import { produce } from "immer";

type EventAction =
    | { type: "CREATE"; payload: _Event }
    | { type: "UPDATE"; payload: _Event }
    | { type: "DELETE"; payload: string }
    | { type: "SORT"; payload: _Event[] };

export default function eventReducer(state: { events: _Event[] }, action: EventAction): { events: _Event[] } {
    const { type, payload } = action;
    switch (type) {
        case "UPDATE":
            const updatedEvents = produce(state.events, draft => {
                const { id } = payload
                const index = draft.findIndex(event => event.id === id)
                if (index !== -1) draft[index] = payload
                return sortEvents(draft)
            })
            return { events: updatedEvents }
        case "CREATE":
            return {
                events: produce(state.events, draft => {
                    draft.push(payload)
                    sortEvents(draft)
                })
            };
        case "DELETE":
            return {
                events: produce(state.events, draft => {
                    const index = draft.findIndex(event => event.id === payload)
                    if (index !== -1) draft.splice(index, 1)
                })
            }
        default:
            return state;
    }
}