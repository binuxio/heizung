import { stateJsonPath } from "@/dotenv"
import readJsonFile from "../readJsonFile"
import writeJsonFile from "../writeJsonFile"

export default async function (device_connected: boolean) {
    const stateObj = await readJsonFile<_State>(stateJsonPath)
    stateObj.device_connected = device_connected
    writeJsonFile(stateJsonPath, stateObj)
}