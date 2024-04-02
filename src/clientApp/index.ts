// client.ts
import express, { ErrorRequestHandler } from 'express';
import { Schedule, UpdateScheduleRequest, _Event } from '@/types/schedule.types';
import writeJsonFile from '@/utils/db/writeJsonFile';
import { scheduleJsonPath, stateJsonPath } from '@/dotenv';
import readJsonFile from '@/utils/db/readJsonFile';
import { updateScheduleVersionId } from '@/utils/scheduleVersionId';
import sendScheduleToDevice from '@/utils/device/sendScheduleToDevice';
import sendCommandToDevice from '@/utils/device/sendCommandToDevice';

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

app.use("*", (req, _, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next()
})

app.get("/state", async (req, res, next) => {
    try {
        const data = await readJsonFile<_State>(stateJsonPath);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

app.post("/update-state", async (req, res, next) => {
    try {
        const newState = req.body;
        await writeJsonFile(stateJsonPath, newState);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

app.post("/toggle-schedule", async (req, res, next) => {
    try {
        const { schedule_enabled } = req.body;
        const state = await readJsonFile<_State>(stateJsonPath);
        state.schedule_enabled = schedule_enabled
        await writeJsonFile(stateJsonPath, state);
        res.sendStatus(200);
        if (schedule_enabled === true)
            sendCommandToDevice("enable-schedule")
        else if (schedule_enabled === false)
            sendCommandToDevice("disable-schedule")
    } catch (err) {
        next(err);
    }
})

app.get("/schedule", async (req, res, next) => {
    try {
        const data = await readJsonFile<Schedule>(scheduleJsonPath)
        res.json(data);
    } catch (err) {
        next(err);
    }
});

app.post('/update-schedule', async (req, res, next) => {
    try {
        const { day, newEvents }: UpdateScheduleRequest = req.body;
        let schedule = await readJsonFile<Schedule>(scheduleJsonPath)
        schedule[day] = newEvents
        await writeJsonFile(scheduleJsonPath, schedule);
        res.sendStatus(200);
        await updateScheduleVersionId()
        sendScheduleToDevice()
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
