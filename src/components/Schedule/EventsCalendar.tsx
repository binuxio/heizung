import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import WeeklyCalendar from '../../utils/weekly-calendar'
import { Schedule } from '../types'
import EventDayView from './EventDayView'
import theme from '../../theme'
import { StackScreenProps } from '../../Screen/types'
import { RootState } from '../../../redux/store'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchEvents } from '../../../redux/slice'
import { StatusBar } from 'expo-status-bar'


const EventsCalendar = ({ navigation, route }: StackScreenProps<"EventsCalendar">) => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchEvents())
    }, [])
    const schedule: Schedule = useAppSelector((state) => state.schedule.schedule)

    return (
        <View>
            <StatusBar translucent={false} backgroundColor={theme.colors.background} />
            <WeeklyCalendar
                schedule={schedule}
                themeColor={theme.colors.primary}
                renderEvent={(event, k) => <EventDayView event={event} key={k} />}
                stackprops={{ navigation, route }}
            />
        </View>
    );
}

export default EventsCalendar