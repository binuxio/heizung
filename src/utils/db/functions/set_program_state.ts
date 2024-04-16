import readJsonFile from "../readJsonFile";
import { programStateJsonPath } from "@/dotenv";
import writeJsonFile from "../writeJsonFile";
import { ProgramStatus } from "@/types/program.state.types";

export default async function (programState: ProgramStatus) {
    writeJsonFile(programStateJsonPath, programState)
}
