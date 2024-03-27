import React, { useEffect, useState } from 'react'
import theme from '../../../theme'
import { useAppDispatch, } from '../../../../redux/hooks'
import { StatusBar } from 'expo-status-bar'
import { triggerCalenderRerender } from '../../../../redux/slice'
import { ScheduleStackScreenProps } from './types'
import { useNetInfo } from "@react-native-community/netinfo"
import fetchSchedule from '../../api/fetchSchedule'
import errorHandlerUI from '../../../components/UI/errorHandlerUI'
import WeeklyCalendar from '../utils/weekly-calendar'
import EventDayView from '../utils/weekly-calendar/EventDayView'
import { Alert, View } from 'react-native'


const EventsCalendar = ({ navigation, route }: ScheduleStackScreenProps<"EventsCalendar">) => {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            (async () => {
                try {
                    const res = await fetchSchedule(dispatch)
                    errorHandlerUI(res, useNetInfo())
                } catch (error) { } // getting error when not wrapping it with catch block
                dispatch(triggerCalenderRerender(true))
            })()
        }, 100);
    }, [])


    return (
        <View style={{ backgroundColor: theme.colors.background, paddingTop: 25 }}>
            <StatusBar translucent />
            {!loading &&
                <WeeklyCalendar
                    themeColor={theme.colors.primary}
                    renderEvent={(event, prevEvent, weekDayDate, k) => <EventDayView event={event} prevEvent={prevEvent} weekDayDateMoment={weekDayDate} key={k} />}
                    stackprops={{ navigation, route }}
                />
            }
        </View>
    );
}

export default EventsCalendar
