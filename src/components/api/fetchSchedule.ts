import createEventsMap, { eventsMap } from '../Schedule/utils/createEventsMap';
import { AppDispatch } from '../../../redux/store';
import { setIsRefreshingCalendar } from '../../../redux/slice';
import axios from "axios"
import errorHandler from './errorHandler';
import { serverURL } from './env';
import { RequestReturn } from './types';

export default async function (dispatch: AppDispatch): Promise<RequestReturn> {
    console.log("fetching schedule")
    try {
        dispatch(setIsRefreshingCalendar(true));
        const res = await axios(serverURL + "/getSchedule", { timeout: 10000 })
        const schedule = res.data
        eventsMap.clear()
        createEventsMap(schedule)
        dispatch(setIsRefreshingCalendar(false));
        return { status: 200 }
    } catch (error: any) {
        console.log(axios.isAxiosError(error))
        dispatch(setIsRefreshingCalendar(false));
        return errorHandler(error)
    }
}