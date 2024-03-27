// client.ts
import express, { ErrorRequestHandler } from 'express';
import { UpdateScheduleRequest, _Event } from '../types.schedule';
import readSchedule from './utils/readSchedule';
import writeSchedule from './utils/writeSchedule';
import readState from './utils/readState';

const app = express();

// app.post("/get-status", (req, res) => {
//     console.log(new Date(), "getting status")
//     if (csocket) {
//         csocket.emit("get-status", (data) => {
//             res.send(data)
//         })
//     } else {
//         console.log("Raspberry not connected")
//         res.send({ status: "unreachable" })
//     }
// });

app.get("/getState", async (req, res, next) => {
    console.log("requested state");
    try {
        const data = await readState();
        res.json(data);
    } catch (err) {
        next(err);
    }
});

app.post("/updateState", async (req, res, next) => {
    console.log("update state")
    try {
        const newState = req.body;
        await writeSchedule(newState);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

app.get("/getSchedule", async (req, res, next) => {
    console.log("requested schedule");
    try {
        const data = await readSchedule();
        res.json(data);
    } catch (err) {
        next(err);
    }
});

app.post('/updateSchedule', async (req, res, next) => {
    console.log("update schedule")
    try {
        const body: UpdateScheduleRequest = req.body;
        const schedule = await readSchedule();
        
        let updatedSchedule = schedule.filter(event => !body.removedEvents.includes(event._id));
        updatedSchedule.push(...body.newEvents)
        await writeSchedule(updatedSchedule);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const error = {
        message: err.message,
        status: err.status || 500,
    };
    res.status(error.status).json(error.message);
};

app.use(errorHandler);

export default app;
