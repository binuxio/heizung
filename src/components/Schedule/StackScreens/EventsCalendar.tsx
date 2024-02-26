import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import WeeklyCalendar from '../../../utils/weekly-calendar'
import { Schedule } from '../../types.schedule'
import EventDayView from '../../../utils/weekly-calendar/EventDayView'
import theme from '../../../theme'
import { RootState } from '../../../../redux/store'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { StatusBar, setStatusBarStyle, setStatusBarTranslucent } from 'expo-status-bar'
import { triggerCalenderRerender } from '../../../../redux/slice'
import fetchSchedule from '../utils/api/fetchSchedule'
import { ScheduleStackScreenProps } from './types'

import { useNetInfo } from "@react-native-community/netinfo"
import errorHandlerUI from '../utils/api/errorHandlerUI'


const EventsCalendar = ({ navigation, route }: ScheduleStackScreenProps<"EventsCalendar">) => {
    const dispatch = useAppDispatch()

    const netInfo = useNetInfo();

    console.log(netInfo.isInternetReachable)

    useEffect(() => {
        (async () => {
            const res = await fetchSchedule(dispatch)
            errorHandlerUI(res)
            dispatch(triggerCalenderRerender(true))
        })()
    }, [])

    return (
        <View style={{ backgroundColor: theme.colors.background, paddingTop: 25 }}>
            <StatusBar translucent />
            <WeeklyCalendar
                themeColor={theme.colors.primary}
                renderEvent={(event, prevEvent, weekDayDate, k) => <EventDayView event={event} prevEvent={prevEvent} weekDayDateMoment={weekDayDate} key={k} />}
                stackprops={{ navigation, route }}
            />
        </View>
    );
}

export default EventsCalendar
