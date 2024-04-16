import { _socket } from "@/dotenv";

type DeviceResponse = { ok: boolean, message?: string }

export async function turnOnRelais(): Promise<DeviceResponse> {
    console.log("emit turn-on-relais")
    if (_socket) {
        const success = await _socket.emitWithAck("turn-on-relais")
        if (success) return { ok: true }
    }
    return { ok: false, message: "Device not connected" }
}

export async function turnOffRelais() {
    console.log("emit turn-off-relais")
    if (_socket) {
        const success = await _socket.emitWithAck("turn-off-relais")
        if (success) return { ok: true }
    }
    return { ok: false, message: "Device not connected" }
}

export async function startProgram(program: { id: string, endDate: { day: number, time: string } }) {
    console.log("emit start-program")
    if (_socket) {
        const success = await _socket.emitWithAck("start-program", program)
        if (success) return { ok: true }
    }
    return { ok: false, message: "Device not connected" }
}

export async function updateProgram(program: { id: string, endDate: { day: number, time: string } }) {
    console.log("emit end-program")
    if (_socket) {
        const success = await _socket.emitWithAck("end-program", program)
        if (success) return { ok: true }
    }
    return { ok: false, message: "Device not connected" }
}