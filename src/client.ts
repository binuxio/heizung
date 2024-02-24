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


app.get("/getSchedule", (req, res) => {
    console.log("request schedule");
    const schedule = readSchedule();
    if ('error' in schedule) {
        res.status(500).json({ error: schedule.error });
    } else {
        res.json(schedule);
    }
});

app.post("/updateSchedule", (req, res) => {
    const body: UpdateScheduleReq = req.body
    console.log(body)
    updateSchedule(body.removedEvents, body.newEvents, res)
})

async function updateSchedule(removedEvents: string[], newEvents: _Event[], res: express.Response) {
    const schedule = readSchedule()
    if ('error' in schedule) {
        console.log("here")
        res.status(500).json({ error: schedule.error });
        return
    } else {
        // console.log(schedule); res.send(200); return;
        let updatedSchedule = schedule.filter(event => !removedEvents.includes(event._id))
        updatedSchedule = { ...updatedSchedule, ...newEvents }
        const result = writeSchedule(updatedSchedule)
        if (result) { res.status(500).json({ error: result.error }); return }
        res.sendStatus(200)
    }
}

function writeSchedule(schedule: Schedule): void | { error: string } {
    try {
        const scheduleJson = JSON.stringify(schedule, null, 2);
        fs.writeFileSync(schedulePath, scheduleJson.toString(), 'utf8');
    } catch (err) {
        console.log("Error writing schedule file:", err)
        return { error: "Error writing schedule file" };
    }
}

function readSchedule(): Schedule | { error: string } {
    try {
        const data = fs.readFileSync(schedulePath, "utf8");
        const schedule = JSON.parse(data);
        return schedule;
    } catch (err) {
        console.error("Error reading or parsing schedule file:", err);
        return { error: "Error reading or parsing schedule file" };
    }
}

export default app;
