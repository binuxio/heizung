import { Socket } from "socket.io";
import readJsonFile from "@/utils/db/readJsonFile";
import { stateJsonPath } from "@/dotenv";
import sendScheduleToDevice from "@/utils/device/sendScheduleToDevice";
import sendStateToDevice from "@/utils/device/sendStateToDevice";

export function initEvents(socket: Socket) {
    // socket.on("get:state", sendStateToDevice)
    // socket.on("update-schedule", sendScheduleToDevice)
    socket.on("program-end-status", () => null)
}