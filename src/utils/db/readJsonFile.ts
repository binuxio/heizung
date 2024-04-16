import fs from "fs"

export default async function <T>(filePath: string): Promise<T> {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data) ;
    } catch (error) {
        throw error
    }
}