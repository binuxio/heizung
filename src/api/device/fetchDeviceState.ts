import axios from "axios"
import errorHandler from '../errorHandler';
import { serverURL } from '../dotenv';
import { _Response } from '../types';
import { AppDispatch } from "@/storage/redux/store";
import { setIsFetchingSchedule } from "@/storage/redux/slice.appState";
import { setDeviceState, setSchedule } from "@/storage/redux/slice.appData";

export default async function (dispatch: AppDispatch): Promise<_Response> {
    console.log("fetching state")
    try {
        // dispatch(setIsFetchingSchedule(true));
        return { status: 200 }
        const res = await axios(serverURL + "/state", { timeout: 10000 })
        dispatch(setDeviceState(res.data))
        // dispatch(setIsFetchingSchedule(false));
    } catch (error: any) {
        dispatch(setIsFetchingSchedule(false));
        return errorHandler(error)
    }
}