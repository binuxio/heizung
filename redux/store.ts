import { configureStore } from '@reduxjs/toolkit'
import { appState } from './slice'

export const store = configureStore({
    reducer: {
        appState: appState.reducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch