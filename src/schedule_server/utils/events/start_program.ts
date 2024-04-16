import set_program_state from "@/utils/db/functions/set_program_state"
import end_program from "./end_program"
import readJsonFile from "@/utils/db/readJsonFile"
import { Schedule } from "@/types/schedule.types"
import { scheduleJsonPath } from "@/dotenv"
import nodeScheduler from "@/schedule_server/nodeScheduler"
import { getScheduledDate } from "../nodeScheduler_utils"
import { startProgram } from "@/device/emits"

export default async function (id: string, day: number) {
    console.log("start Program")

    try {
        const schedule = await readJsonFile<Schedule>(scheduleJsonPath)
        const event = schedule[day].find(ev => ev.id = id)
        if (event) {
            const res = await startProgram({ id, endDate: event.end })
            if (res.ok) {
                set_program_state({ id, state: "running" })
                const endJobID = `end:${id}`
                nodeScheduler.scheduleJob(endJobID, getScheduledDate(event.end), end_program)
            }
            else {
                throw new Error(res.message)
            }
        } else {
            throw new Error("Event for endtime not found") // make the message better
        }
    } catch (error: unknown) {
        if (typeof error == "string")
            set_program_state({ id, state: "failed", message: error })
        console.error(error)
    }
}

// TODO: Idee!
// When sending the turn on Signal, i should send the end program time. So that if the end signal 
// failed reaching the rasperry, the program will reach its scheduled end.
// TODO:2
// Each event will trigger the program to run and set the state to "running", wether the raspberry is connected or not.
// Once the raspberry is connected, it will check if there is a running programm it has missed, so that it can start it
