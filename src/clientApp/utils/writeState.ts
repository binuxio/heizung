import { Schedule } from "@/types.schedule";
import fs from "fs"

const statePath = "@/data/state.json";

export default async function (schedule: Schedule) {
    const tempPath = `${statePath}.tmp`;
    try {
        const stateJson = JSON.stringify(schedule, null, 2);
        await fs.promises.writeFile(tempPath, stateJson, 'utf8');
        await fs.promises.rename(tempPath, statePath);
    } catch (err) {
        console.error("Error writing state file:", err);
        throw err;
    }
}