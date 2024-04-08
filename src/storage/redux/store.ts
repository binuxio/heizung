import { configureStore } from '@reduxjs/toolkit'
import { appData } from './slice.appData'
import appState from './slice.appState'

export const store = configureStore({
    reducer: {
        appData: appData.reducer,
        appState: appState.reducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch