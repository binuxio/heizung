import axios from "axios"
import errorHandler from '../errorHandler';
import { serverURL } from '../dotenv';
import { _Response } from '../types';
import { AppDispatch } from "@/redux/store";
import { setIsFetchingSchedule } from "@/redux/slice.appState";
import { setSchedule } from "@/redux/slice.appData";

export default async function (dispatch: AppDispatch): Promise<_Response> {
    console.log("fetching schedule")
    try {
        dispatch(setIsFetchingSchedule(true));
        const res = await axios(serverURL + "/schedule", { timeout: 10000 })
        const schedule = res.data
        dispatch(setSchedule(schedule))
        dispatch(setIsFetchingSchedule(false));
        return { status: 200 }
    } catch (error: any) {
        dispatch(setIsFetchingSchedule(false));
        return errorHandler(error)
    }
}