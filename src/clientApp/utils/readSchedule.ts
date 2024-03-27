import { Schedule } from "@/types.schedule";
import fs from "fs"

const schedulePath = "@/data/schedule.json";

export default async function (): Promise<Schedule> {
    try {
        const data = await fs.promises.readFile(schedulePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw error
    }
}