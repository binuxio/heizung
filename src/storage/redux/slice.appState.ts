import { Schedule, _Event } from '@/types/schedule.types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Slice {
    isFetchingSchedule: boolean
}

const initialState: Slice = {
    isFetchingSchedule: false
}

export const appState = createSlice({
    name: 'appState',
    initialState,
    reducers: {
        setIsFetchingSchedule: (state, actions: PayloadAction<boolean>) => {
            state.isFetchingSchedule = actions.payload
        },
    }
})

export const { setIsFetchingSchedule } = appState.actions
export default appState
