import express from "express"
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import clientApp from "./clientApp"
import fs from "fs"
import moment from "moment";
import { _socket, logdateFormat, setSocket } from "./dotenv";
import setDeviceConnected from "./utils/db/setDeviceConnected";
import { initEvents } from "./device/events";
import { start_schedule_server } from "./schedule_server";

const app = express()
app.use(express.json());
const httpServer = createServer(app);
const PORT = process.env.PORT || 6500;

export const io = new Server(httpServer, {
    cors: {
        methods: "*",
        origin: "*",
        // credentials: true,
    },
    // connectionStateRecovery: { maxDisconnectionDuration: 0 },
    // pingTimeout: 20000,
    pingInterval: 200
    // maxHttpBufferSize: 1024,
    // path: "/"
})


setDeviceConnected(false)
start_schedule_server()

io.on('connection', async (socket: Socket) => {
    console.log(moment().format(logdateFormat), 'Device connected');
    socket.on('disconnect', () => {
        setSocket(undefined)
        setDeviceConnected(false)
        console.log(moment().format(logdateFormat), 'Device disconnected');
    });
    setSocket(socket)
    setDeviceConnected(true)

    initEvents(socket)
});

app.use("/", clientApp)

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







