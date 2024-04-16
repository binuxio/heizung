import { _socket } from "@/dotenv";
import register_events from "./utils/events/register_events";
import get_next_event_id from "./utils/events/get_next_event_id";
import set_program_state from "@/utils/db/functions/set_program_state";

export async function start_schedule_server() {
    await register_events()
    const id = get_next_event_id()
    if (id)
        set_program_state({ id, state: "pending" })
}