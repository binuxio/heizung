import express, { ErrorRequestHandler } from 'express';
import { Schedule, UpdateScheduleRequest, _Event } from '@/types/schedule.types';
import writeJsonFile from '@/utils/db/writeJsonFile';
import { scheduleJsonPath, stateJsonPath } from '@/dotenv';
import readJsonFile from '@/utils/db/readJsonFile';
import sendCommandToDevice from '@/utils/device/sendCommandToDevice';
import delete_event from '@/schedule_server/utils/events/delete_event';
import schedule_event from '@/schedule_server/utils/events/schedule_event';

const app = express();

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
        const { day, newEvents, deletedEventsId }: UpdateScheduleRequest = req.body;
        let schedule = await readJsonFile<Schedule>(scheduleJsonPath)
        schedule[day] = newEvents
        await writeJsonFile(scheduleJsonPath, schedule);
        // await updateScheduleVersionId()
        console.log("deleted Events:", deletedEventsId)
        delete_event(deletedEventsId)
        schedule_event(newEvents)
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

// TODO: create endpoints to take changes on the schedule
app.post


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const error = {
        message: err.message,
        status: err.status || 500,
    };
    res.status(error.status).json(error.message);
};

app.use(errorHandler);

export default app;
