import { Schedule } from "@/types/schedule.types"
import readJsonFile from "../db/readJsonFile"
import { _socket, stateJsonPath } from "@/dotenv"

export default async function () {
    if (_socket) {
        const stateObj = await readJsonFile<Partial<_State>>(stateJsonPath)
        delete stateObj.device_connected;
        _socket.emit("res:state", stateObj)
    }
}