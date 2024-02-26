import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Slice {
    isSyncSchedule: boolean
    triggerCalenderRerender: boolean
    scheduleEditorStackScreenOpen: boolean
    isRefreshingCalendar: boolean
}

const initialState: Slice = {
    isSyncSchedule: false,
    triggerCalenderRerender: false,
    scheduleEditorStackScreenOpen: false,
    isRefreshingCalendar: false
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
        },
        setIsRefreshingCalendar(state, actions: PayloadAction<boolean>) {
            state.isRefreshingCalendar = actions.payload
        }
    }
})

export const { triggerCalenderRerender, setIsSyncSchedule, setScheduleStackScreenOpen, setIsRefreshingCalendar } = appState.actions
export default appState
