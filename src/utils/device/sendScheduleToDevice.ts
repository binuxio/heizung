import { Schedule } from "@/types/schedule.types"
import readJsonFile from "../db/readJsonFile"
import { _socket, scheduleJsonPath, stateJsonPath } from "@/dotenv"
import { getScheduleVersionId } from "../scheduleVersionId"

export default async function () {
    if (_socket) {
        const schedule = await readJsonFile<Schedule>(scheduleJsonPath)
        const schedule_version_id = await getScheduleVersionId()
        const data = {
            schedule: schedule,
            id: schedule_version_id
        }
        _socket.emitWithAck("update-schedule", data).then((res) => console.log(res))
    }
}