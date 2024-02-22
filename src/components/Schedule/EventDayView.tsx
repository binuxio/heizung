import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Ionicons from "@expo/vector-icons/Ionicons"
import Material from "@expo/vector-icons/MaterialCommunityIcons"
import { Text } from 'react-native'
import moment from 'moment/min/moment-with-locales';
import getStartTimeMoment from './utils/getStartTimeMoment'
import { _Event } from '../types'
import theme from '../../theme'
import getEventDetails from './utils/getEventDetails'

// structure2

const EventDayView: React.FC<{ event: _Event, prevEvent: _Event | undefined, weekDayDateMoment: moment.Moment }> = ({ event, prevEvent, weekDayDateMoment }) => {
    const { startMoment, endMoment, isWeekly } = getEventDetails(event, weekDayDateMoment)!
    const crossesDay = startMoment.format('YYYY-MM-DD') !== endMoment.format('YYYY-MM-DD')
    let prevEndTimeConflicting = false
    if (prevEvent) {
        const prevEndMoment = getEventDetails(prevEvent, weekDayDateMoment)!.endMoment
        prevEndTimeConflicting = prevEndMoment.isSameOrAfter(startMoment)
    }
    return <View style={{}}>
        <View style={[styles.eventContainer]}>
            <View style={styles.timeContainer}>
                <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "green" }]} />
                <Text style={[styles.durationText, prevEndTimeConflicting ? { color: "red" } : {}]}>{startMoment.format("HH:mm")}</Text>
            </View>
            <View style={styles.timeContainer}>
                <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "orange" }]} />
                <Text style={styles.durationText}>{crossesDay ? endMoment.format("HH:mm, dd") : endMoment.format("HH:mm")}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                {!isWeekly && <Material name='repeat-once' style={[{ fontSize: 30, color: "grey" }]} />}
                {prevEndTimeConflicting && <Material name='exclamation' style={[{ fontSize: 20, color: "red" }]} />}
            </View>
        </View>
    </View>
}

export default EventDayView

const styles = StyleSheet.create({
    eventContainer: {
        margin: .3,
        flex: 1,
        height: 45,
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    powerIcon: {
        color: "orange",
        fontSize: 18
    },
    durationText: {
        color: 'grey',
        fontSize: 18
    },
})