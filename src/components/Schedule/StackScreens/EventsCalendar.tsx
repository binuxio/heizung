import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import WeeklyCalendar from '../../../utils/weekly-calendar'
import { Schedule } from '../../types'
import EventDayView from '../EventDayView'
import theme from '../../../theme'
import { RootState } from '../../../../redux/store'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { StatusBar } from 'expo-status-bar'
import { triggerCalenderRerender } from '../../../../redux/slice'
import syncSchedule from '../utils/syncSchedule'
import { ScheduleStackScreenProps } from './types'

function fetchEvents() {

}

const EventsCalendar = ({ navigation, route }: ScheduleStackScreenProps<"EventsCalendar">) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        (async () => {
            const res = await syncSchedule()
            if (!res || typeof res.status !== 'number') {
                Alert.alert("Fehler", "Ungültige Antwort vom Server");
            } else if (res.status !== 200) {
                if (res.status === 404) {
                    Alert.alert("Fehler", res.error);
                } else if (res.status === 500) {
                    Alert.alert("Interner Serverfehler", res.error || "Unbekannter Fehler");
                } else {
                    Alert.alert("Netzwerkfehler", "Daten konnten nicht geladen werden. Bitte überprüfe deine Internetverbindung");
                }
            }
            // TODO: error handling
            dispatch(triggerCalenderRerender(true))
        })()
    }, [])

    return (
        <View>
            <StatusBar translucent={false} backgroundColor={theme.colors.background} animated />
            <WeeklyCalendar
                themeColor={theme.colors.primary}
                renderEvent={(event, prevEvent, weekDayDate, k) => <EventDayView event={event} prevEvent={prevEvent} weekDayDateMoment={weekDayDate} key={k} />}
                stackprops={{ navigation, route }}
            />
        </View>
    );
}

export default EventsCalendar
