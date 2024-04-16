import { resolve } from "path";
import { Socket } from "socket.io";
const dataFolder = resolve(__dirname, "..", "db")
export const scheduleJsonPath = resolve(dataFolder, "schedule.json")
export const stateJsonPath = resolve(dataFolder, "state.json")
export const programStateJsonPath = resolve(dataFolder, "program.state.json")
export const logdateFormat = "HH:mm:ss DD-MM-YYYY"
export let _socket: Socket | undefined = undefined
export const setSocket = (socket: Socket | undefined) => _socket = socket