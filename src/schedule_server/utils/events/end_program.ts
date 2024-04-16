import set_program_state from "@/utils/db/functions/set_program_state"
import get_next_event_id from "./get_next_event_id"

export default async function () {
    console.log("ending Program")
    const nextId = get_next_event_id()
    if (nextId)
        set_program_state({ id: get_next_event_id(), state: "pending" })
    else
        set_program_state({ id: undefined, state: "undefined" })
}