import { _socket } from "@/dotenv";

export function turnOnRelais() {
    console.log("turning on")
    if (_socket) {
        _socket.emit("turn-on-relais")
    }
}

export function turnOffRelais() {
    console.log("turning off")
    if (_socket) {
        _socket.emit("turn-off-relais")
    }
}