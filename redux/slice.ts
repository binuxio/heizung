import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import { EventDetails, Schedule, SpecialEvent, WeeklyEvent } from '../src/components/types'


interface SelectedEvents {
    weekDayDate: string,
    events: EventDetails[]
}

interface Slice {
    schedule: Schedule,
    selectedEvents: SelectedEvents
}

const initialState: Slice = {
    schedule: [],
    selectedEvents: {
        weekDayDate: "",
        events: []
    }
}

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setSchedule: (state, action: PayloadAction<number>) => {
            state
        },
        setSelectedEvents: (state, action: PayloadAction<SelectedEvents>) => {
            // const serializedEvents = action.payload.events.map(event => ({
            //     ...event,
            //     startMoment: moment(event.startMoment)
            // }));

            // state.selectedEvents = { ...action.payload };
        },

        fetchEvents: (state) => {
            console.log("fetching schedule")
            state.schedule = [
                { start: { day: 1, time: '04:10' }, duration: "03:00" },
                { start: { day: 7, time: '04:10' }, duration: "03:00" },
                { start: { day: 3, time: '04:10' }, duration: "03:00" },
                { start: { day: 1, time: '04:10' }, duration: "03:00" },
                { start: { day: 6, time: '04:10' }, duration: "03:00" },
                { start: { day: 4, time: '04:10' }, duration: "03:00" },
                { start: { day: 7, time: '04:10' }, duration: "03:00" },
                { start: { day: 5, time: '04:10' }, duration: "03:00" },
                { start: { day: 3, time: '10:10' }, duration: "03:00" },
                { start: { date: "10-02-2024", time: "09:00" }, duration: "03:00" },
                { start: { day: 4, time: '09:10' }, duration: "01:00" },
                { start: { date: "10-02-2024", time: "09:00" }, duration: "03:00" },
                { start: { day: 2, time: '04:10' }, duration: "03:00" },
                { start: { date: "10-02-2024", time: "09:00" }, duration: "03:00" }
            ]
        }
    }
})

export const { fetchEvents, setSchedule, setSelectedEvents } = scheduleSlice.actions
export default scheduleSlice
