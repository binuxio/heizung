import { Schedule } from "@/types.schedule";
import fs from "fs"

const statePath = "@/data/state.json";

export default async function (): Promise<Schedule> {
    try {
        const data = await fs.promises.readFile(statePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw error
    }
}