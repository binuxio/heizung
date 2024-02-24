// client.ts
import express from 'express';
import fs from 'fs';
import { Schedule, UpdateScheduleReq, _Event } from './types';

const app = express();
const schedulePath = "./data/schedule.json";

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

app.post("/toggle", (req, res) => {
    // Add your toggle logic here
});

const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
};
app.use(errorHandler);

app.post('/updateSchedule', async (req, res, next) => {
    try {
        const body: UpdateScheduleReq = req.body;
        const schedule = await readSchedule();

        const updatedSchedule = schedule.filter(event => !body.removedEvents.includes(event._id));
        updatedSchedule.push(...body.newEvents);

        await writeScheduleAtomically(updatedSchedule);

        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

async function writeScheduleAtomically(schedule: Schedule) {
    const tempPath = `${schedulePath}.tmp`;
    try {
        const scheduleJson = JSON.stringify(schedule, null, 2);
        await fs.promises.writeFile(tempPath, scheduleJson, 'utf8');
        await fs.promises.rename(tempPath, schedulePath); // Rename atomically
    } catch (err) {
        console.error("Error writing schedule file:", err);
        throw err; // Re-throw for centralized handling
    }
}

async function readSchedule(): Promise<Schedule> {
    try {
        const data = await fs.promises.readFile(schedulePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading or parsing schedule file:", err);
        throw err;
    }
}

export default app;
