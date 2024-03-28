import { Schedule, _Event } from '@/types/schedule.types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Slice {
    schedule: Schedule
}

const initialState: Slice = {
    schedule: {}
}

export const appData = createSlice({
    name: 'appData',
    initialState,
    reducers: {
        setSchedule: (state, actions: PayloadAction<Schedule>) => {
            state.schedule = actions.payload
        },
        updateSchedule: (state, actions: PayloadAction<{ events: _Event[], day: number }>) => {
            const { day, events } = actions.payload
            const updateSchedule = { ...state.schedule }
            updateSchedule[day] = events
            state.schedule = updateSchedule
        }
    }
})

export const { setSchedule, updateSchedule } = appData.actions
export default appData
