import axios from "axios";
import { serverURL } from "./env";

export default async function () {
    const res = axios(serverURL + "/getState")
}