import { stateJsonPath } from "@/dotenv"
import readJsonFile from "./readJsonFile"
import writeJsonFile from "./writeJsonFile"

export default async function (relais_state: Relais_State) {
    const stateObj = await readJsonFile<_State>(stateJsonPath)
    stateObj.relais_state = relais_state
    writeJsonFile(stateJsonPath, stateObj)
}