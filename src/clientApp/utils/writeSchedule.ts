import { Schedule } from "@/types.schedule";
import fs from "fs"

const schedulePath = "@/data/schedule.json";

export default async function(schedule: Schedule) {
    const tempPath = `${schedulePath}.tmp`;
    try {
        const scheduleJson = JSON.stringify(schedule, null, 2);
        await fs.promises.writeFile(tempPath, scheduleJson, 'utf8');
        await fs.promises.rename(tempPath, schedulePath);
    } catch (err) {
        console.error("Error writing schedule file:", err);
        throw err;
    }
}