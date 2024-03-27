import axios from "axios";
import { serverURL } from "./dotenv";

export default async function () {
    const res = axios(serverURL + "/getState")
}