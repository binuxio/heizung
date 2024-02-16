import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Modal from 'react-native-modal';
import getStartTimeMoment from './utils/getStartTimeMoment';
import moment from 'moment';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, useTheme } from 'react-native-paper';
import { EventDetails } from '../types';
import theme from '../../theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackScreenProps } from '../../Screen/types';
import { useAppSelector } from '../../../redux/hooks';
// import { StatusBar } from 'expo-status-bar';


const ScheduleEditor = ({ navigation, route }: StackScreenProps<"ScheduleEditor">) => {
    // const { events, weekDayDateMoment } = route.params

    const { events, weekDayDate } = useAppSelector(state => state.schedule.selectedEvents)
    console.log(weekDayDate)
    const weekDayDateMoment = moment(weekDayDate)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: "center",
            headerTitle(props) {
                return <View style={{
                    backgroundColor: theme.colors.primary,
                    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20
                }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>
                        {weekDayDateMoment.format("dddd, DD.MM.YYYY").toString()}
                    </Text>
                </View>
            },
        })
    }, [])

    return (
        <View >
            <StatusBar translucent={false} backgroundColor={"white"} />
            <View style={styles.screenContainer}>
                <View style={{ padding: 7 }}>
                    {events && events.length != 0 ? events.map((event, i) => {
                        const { startMoment, endMoment, isWeekly, weekDayDate, prevEvent } = event
                        const weekDayDateMoment = moment(weekDayDate)

                        const crossesDay = startMoment.day() < endMoment.day()
                        let prevEndTimeConflicting = false
                        if (prevEvent) {
                            const prevEventDurationMoment = moment.duration(prevEvent.duration)
                            const prevEventEndTimeMoment = getStartTimeMoment(weekDayDateMoment, prevEvent.start.time).clone().add(prevEventDurationMoment)
                            prevEndTimeConflicting = prevEventEndTimeMoment >= startMoment
                        }
                        return <View style={[styles.eventContainer]} key={i}>
                            <View style={styles.timeContainer}>
                                <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "lime" }]} />
                                <Text style={[styles.durationText, prevEndTimeConflicting ? { color: "red" } : {}]}>{startMoment.format("HH:mm")}</Text>
                            </View>
                            <View style={styles.timeContainer}>
                                <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "orange" }]} />
                                <Text style={styles.durationText}>{!crossesDay ? endMoment.format("HH:mm") : endMoment.format("dd, HH:mm")}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                                {!isWeekly && <MaterialCommunityIcons name='repeat-once' style={[{ fontSize: 30, color: "grey" }]} />}
                                {prevEndTimeConflicting && <MaterialCommunityIcons name='exclamation' style={[{ fontSize: 20, color: "red" }]} />}
                            </View>
                        </View>
                    }) : <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
                        <View>
                            <TouchableOpacity
                                style={{ alignSelf: 'flex-start' }}
                            >
                                <AntDesign name='pluscircleo' size={90} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>}
                </View>
            </View>
        </View>
    )
}

export default ScheduleEditor

const styles = StyleSheet.create({
    screenContainer: {
        // backgroundColor: theme.colors.background,
        height: "100%"
    },
    modalContainer: {
        borderRadius: 20,
        marginHorizontal: 35,
        marginVertical: 65,
        overflow: "hidden"
    },
    modalContent: {
        flex: 1,
    },
    eventContainer: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: theme.colors.eventBackground,
        marginBottom: 7
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
});