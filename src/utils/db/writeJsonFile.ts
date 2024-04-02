import fs from "fs"
import path from "path";

export default async function (filePath: string, data: Object) {
    const tempPath = `${path.parse(filePath).name}.tmp`;
    try {
        const dataJson = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(tempPath, dataJson, 'utf8');
        await fs.promises.rename(tempPath, filePath);
    } catch (err) {
        console.error("Error writing %d file: %d", filePath, err);
        throw err;
    }
}