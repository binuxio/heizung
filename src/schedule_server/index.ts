import { _socket } from "@/dotenv";
import register_events from "./utils/events/register_events";
import moment from "moment";
import nodeScheduler from "./nodeScheduler";
import { getScheduledDate } from "./utils/nodeScheduler_utils";

export function start_schedule_server() {
    register_events()
}