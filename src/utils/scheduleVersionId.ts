import { stateJsonPath } from "@/dotenv";
import readJsonFile from "./db/readJsonFile";
import writeJsonFile from "./db/writeJsonFile";

export async function updateScheduleVersionId(): Promise<boolean> {
    const stateObj = await readJsonFile<_State>(stateJsonPath)
    const { schedule_version_id } = stateObj
    let newV = 1
    if (typeof schedule_version_id === "number") {
        newV = schedule_version_id + 1
    }
    stateObj.schedule_version_id = newV
    await writeJsonFile(stateJsonPath, stateObj)
    return true
}

export async function getScheduleVersionId(): Promise<number> {
    const stateObj = await readJsonFile<_State>(stateJsonPath)
    return stateObj.schedule_version_id
}