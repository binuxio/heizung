import { AxiosError } from "axios";
import { RequestReturn } from "./types";

export default function (error: any): RequestReturn {
    if (error instanceof AxiosError) {
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            return { status: error.response.status, error: error.response.data };
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            return { status: error.code, error: error.message };
        } else {
            // Something happened in setting up the request and triggered an Error
            return { status: error.status || 500, error: error.code }
        }
    } else {
        return { status: "CLIENT_ERROR", error: error.toString() };
    }
}