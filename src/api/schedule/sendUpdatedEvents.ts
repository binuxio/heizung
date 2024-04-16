import axios from "axios"
import errorHandler from "../errorHandler";
import { serverURL } from "../dotenv";
import { _Response } from "../types";
import { _Event } from "@/types/schedule.types";

export default async function (events: _Event[], deletedEventsId: string[], day: number): Promise<_Response> {
    try {
        return { status: 200 }
        const res = await axios.post(serverURL + "/update-schedule", {
            day,
            newEvents: events,
            deletedEventsId
        }, { timeout: 10000 })
    } catch (error: any) {
        return errorHandler(error)
    }
}