import axios from "axios"
import errorHandler from '../errorHandler';
import { serverURL } from '../dotenv';
import { _Response } from '../types';
import { AppDispatch } from "@/storage/redux/store";
import { setIsFetchingSchedule } from "@/storage/redux/slice.appState";
import { setSchedule } from "@/storage/redux/slice.appData";

const demoschedule = {
    "1": [
        {
            "id": "1712007804518",
            "start": {
                "time": "14:00",
                "day": 1
            },
            "end": {
                "time": "16:00",
                "day": 1
            }
        },
        {
            "id": "17007804518",
            "start": {
                "time": "20:50",
                "day": 1
            },
            "end": {
                "time": "22:00",
                "day": 1
            }
        }
    ],
    "2": [
        {
            "id": "1712007804518",
            "start": {
                "time": "14:00",
                "day": 1
            },
            "end": {
                "time": "16:00",
                "day": 1
            }
        },
        {
            "id": "17243007804518",
            "start": {
                "time": "20:50",
                "day": 1
            },
            "end": {
                "time": "22:00",
                "day": 1
            }
        },
        {
            "id": "170078518",
            "start": {
                "time": "23:50",
                "day": 1
            },
            "end": {
                "time": "00:00",
                "day": 1
            }
        }
    ],
    "4": [
        {
            "id": "171200780242",
            "start": {
                "time": "14:55",
                "day": 4
            },
            "end": {
                "time": "14:56",
                "day": 4
            }
        },
        {
            "id": "171200780241",
            "start": {
                "time": "15:55",
                "day": 4
            },
            "end": {
                "time": "19:56",
                "day": 4
            }
        }
    ]
}

export default async function (dispatch: AppDispatch): Promise<_Response> {
    console.log("fetching schedule")
    try {
        dispatch(setIsFetchingSchedule(true));
        // const res = await axios(serverURL + "/schedule", { timeout: 10000 })
        const schedule = demoschedule
        dispatch(setSchedule(schedule))
        dispatch(setIsFetchingSchedule(false));
        return { status: 200 }
    } catch (error: any) {
        dispatch(setIsFetchingSchedule(false));
        return errorHandler(error)
    }
}