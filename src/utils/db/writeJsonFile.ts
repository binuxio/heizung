import { queue } from "async";
import fs from "fs"
import path from "path";

/* export default async function (filePath: string, data: Object) {
    const tempPath = `${path.parse(filePath).name}.tmp`;
    try {
        const dataJson = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(tempPath, dataJson, 'utf8');
        await fs.promises.rename(tempPath, filePath);
    } catch (err) {
        console.error("Error writing %d file: %d", filePath, err);
        throw err;
    }
} */

const writeQueue = queue((task: { filePath: string, data: Object }, callback) => {
    const { filePath, data } = task;

    const tempPath = `${path.parse(filePath).name}.tmp`;
    const dataJson = JSON.stringify(data, null, 2);
    fs.promises.writeFile(tempPath, dataJson, 'utf8')
        .then(() => fs.promises.rename(tempPath, filePath))
        .then(() => callback())
        .catch(err => {
            console.error("Error writing %d file: %d", filePath, err);
            callback(err);
        });
});

export default async function(filePath: string, data: Object) {
    return new Promise((resolve, reject) => {
        writeQueue.push({ filePath, data }, err => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}
