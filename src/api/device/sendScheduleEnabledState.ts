import axios from "axios"
import errorHandler from "../errorHandler";
import { serverURL } from "../dotenv";
import { _Response } from "../types";

export default async function (schedule_enabled: boolean): Promise<_Response> {
    try {
        const res = await axios.post(serverURL + "/toggle-schedule", {
            schedule_enabled
        }, { timeout: 10000 })
        return { status: 200 }
    } catch (error: any) {
        return errorHandler(error)
    }
}