import { Schedule, _Event } from '@/types/schedule.types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { produce } from 'immer'
import storage from '../storage'

interface Slice {
    schedule: Schedule,
    deviceState: Partial<_State>
}

const initialState: Slice = {
    schedule: {},
    deviceState: {}
}

export const appData = createSlice({
    name: 'appData',
    initialState,
    reducers: {
        setScheduleEnabled: (state, actions: PayloadAction<boolean>) => {
            const persitStorage = state.deviceState = produce(state.deviceState, draft => {
                draft["schedule_enabled"] = actions.payload
            })
            storage.save({ key: "deviceState", data: persitStorage })
        },
        setDeviceState: (state, actions: PayloadAction<_State>) => {
            const persitStorage = state.deviceState = actions.payload
            storage.save({ key: "deviceState", data: persitStorage })
        },
        setSchedule: (state, actions: PayloadAction<Schedule>) => {
            const persitStorage = state.schedule = actions.payload
            storage.save({ key: "schedule", data: persitStorage })
        },
        updateSchedule: (state, actions: PayloadAction<{ events: _Event[], day: number }>) => {
            const { day, events } = actions.payload
            const updateSchedule = { ...state.schedule }
            updateSchedule[day] = events
            const persitStorage = state.schedule = produce(state.schedule, draft => { draft[day] = events })
            storage.save({ key: "schedule", data: persitStorage })
        }
    }
})

export const { setSchedule, updateSchedule, setScheduleEnabled, setDeviceState } = appData.actions
export default appData
