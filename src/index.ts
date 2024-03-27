import express from "express"
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import clientApp from "./clientApp"
import fs from "fs"

const app = express()
app.use(express.json());
const httpServer = createServer(app);
const PORT = process.env.PORT || 6500;

const io = new Server(httpServer, {
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
let csocket: Socket | undefined = undefined

io.on('connection', (socket: Socket) => {
    if (!csocket) csocket = socket
    console.log(new Date(), 'Raspberry connected');

    socket.on('disconnect', () => {
        csocket = undefined
        console.log(new Date(), 'Raspberry disconnected');
    });
});

app.use("/", clientApp)

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







