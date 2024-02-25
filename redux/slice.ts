import { createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import { EventDetails, Schedule, SpecialEvent, WeeklyEvent } from '../src/components/types.schedule'



interface Slice {
    isSyncSchedule: boolean
    triggerCalenderRerender: boolean
    scheduleEditorStackScreenOpen: boolean
}

const initialState: Slice = {
    isSyncSchedule: false,
    triggerCalenderRerender: false,
    scheduleEditorStackScreenOpen: false
}

export const appState = createSlice({
    name: 'appState',
    initialState,
    reducers: {
        setScheduleStackScreenOpen(state, actions: PayloadAction<boolean>) {
            state.scheduleEditorStackScreenOpen = actions.payload
        },
        setIsSyncSchedule(state, actions: PayloadAction<boolean>) {
            state.isSyncSchedule = actions.payload
        },
        triggerCalenderRerender(state, actions: PayloadAction<boolean>) {
            state.triggerCalenderRerender = actions.payload
        }
    }
})

export const { triggerCalenderRerender, setIsSyncSchedule, setScheduleStackScreenOpen } = appState.actions
export default appState
