import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, ScrollView, Platform, Alert } from 'react-native';
import moment from 'moment';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../../theme';
import getEventDetails from '../utils/getEventDetails';
import getEventsFromMap from '../utils/getEventsFromMap';
import { EventDetails, _Event } from '../../types';
// import { StatusBar } from 'expo-status-bar';
import "moment/locale/de"
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScheduleStackScreenProps } from './types';
import { Switch } from 'react-native-paper';


const ScheduleEditor = ({ navigation, route }: ScheduleStackScreenProps<"ScheduleEditor">) => {
    const { weekDayDate } = route.params
    const weekDayDateMoment = moment(weekDayDate)
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<EventDetails[]>([])
    const [eventToEdit, setEventToEdit] = useState<number | undefined>(undefined)
    const [newEvent, setNewEvent] = useState()

    useEffect(() => {
        setTimeout(() => {
            const _events = getEventsFromMap(weekDayDateMoment)
            setEvents(_events.map(ev => getEventDetails(ev, weekDayDateMoment)!))
            setLoading(false)
        }, 0);
    }, [])

    useLayoutEffect(() => {


        navigation.setOptions({
            headerTitleAlign: "center",
            headerLeft() {
                return <TouchableOpacity
                    activeOpacity={.4} onPress={() => navigation.goBack()} style={{ marginLeft: 10, flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name='chevron-back' size={20} color={theme.colors.primary} />
                    <Text style={{ fontSize: 14, color: theme.colors.primary, fontWeight: "600" }}>Abbrechen</Text>
                </TouchableOpacity>
            },
            headerRight(props) {
                return <TouchableOpacity
                    activeOpacity={.4}
                    style={{
                        marginRight: 10,
                        backgroundColor: theme.colors.eventBackground,
                        paddingVertical: 4, paddingHorizontal: 10, borderRadius: 5
                    }}>
                    <Text style={{ fontSize: 14, color: theme.colors.primary, fontWeight: "600" }}>Speichern</Text>
                </TouchableOpacity>
            },
            headerTitle(props) {
                return <View style={{}}>
                    <Text style={{ fontSize: 11.5, fontWeight: "600", color: "grey" }}>
                        {weekDayDateMoment.clone().format("dddd, DD.MM.YY").toString()}
                    </Text>
                </View>
            },
        })
    }, [])

    const onEventPress = (index: number) => {
        openBottomSheet()
        setEventToEdit(index)
    }

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const openBottomSheet = () => {
        bottomSheetModalRef.current!.present();
    };

    const closeBottomSheet = () => {
        bottomSheetModalRef.current!.close();

    };

    return (
        <View>
            <StatusBar translucent={false} backgroundColor={"white"} />
            {!loading &&
                <ScrollView style={styles.screenContainer}>
                    <View style={{ padding: 10 }}>
                        <View>
                            {events && events.map((event, i) => {
                                const { startMoment, endMoment, isWeekly } = event
                                const crossesDay = startMoment.format('YYYY-MM-DD') !== endMoment.format('YYYY-MM-DD')

                                let prevEndTimeConflicting = false
                                const prevEvent = events[i - 1]
                                if (prevEvent) prevEndTimeConflicting = prevEvent.endMoment >= prevEvent.startMoment

                                return <TouchableOpacity activeOpacity={.4} style={[styles.eventContainer, { marginBottom: 10 }]} onPress={() => onEventPress(i)} key={i}>
                                    <View style={styles.timeContainer}>
                                        <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "green" }]} />
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
                                </TouchableOpacity>

                            })}
                        </View>
                        <View style={{ backgroundColor: theme.colors.eventBackground, justifyContent: "center", alignItems: "center" }}>
                            <View>
                                <TouchableOpacity style={{ alignSelf: 'flex-start' }}>
                                    <AntDesign name='pluscircleo' size={30} color={theme.colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView> || <ActivityIndicator size='large' color={theme.colors.primary} style={styles.indicator} />
            }
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0} // Initial snap point
                    snapPoints={['45%', '100%']}

                    backdropComponent={useCallback(
                        (props: BottomSheetBackdropProps) => (
                            <BottomSheetBackdrop
                                {...props}
                                onPress={() => {
                                    bottomSheetModalRef.current!.present();
                                }}
                                disappearsOnIndex={-1}
                                appearsOnIndex={1}
                            />
                        ), [])}

                    handleComponent={() => <View style={bStyles.handle} />}
                >
                    <View style={bStyles.bottomSheetContent}>
                        {/* time setter */}
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                    <Ionicons name='power' style={{ fontSize: 20, color: "green" }} />
                                    <Text style={{ fontSize: 20, }}>Einschalten</Text>
                                </View>
                                <TouchableOpacity activeOpacity={.4} style={{ alignSelf: "center", flexDirection: "row", backgroundColor: "white", borderRadius: 10, padding: 5, marginTop: 5 }}>
                                    <Text style={{ fontSize: 25 }}>{moment().format("HH:mm")}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                    <Ionicons name='power' style={{ fontSize: 20, color: "orange" }} />
                                    <Text style={{ fontSize: 20, }}>Ausschalten</Text>
                                </View>
                                <TouchableOpacity activeOpacity={.4} style={{ alignSelf: "center", flexDirection: "row", backgroundColor: "white", borderRadius: 10, padding: 5, marginTop: 5 }}>
                                    <Text style={{ fontSize: 25 }}>{moment().format("HH:mm")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 15 }}>Wöchentlich</Text>
                                <Switch value={true} color={theme.colors.primary} style={{ width: "auto" }} />
                            </View>
                            <View>
                                <Text></Text>
                            </View>
                        </View>
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
            {/* {
                Platform.OS === 'android' && <DateTimePicker
                    value={events[eventToEdit] && events[eventToEdit].startMoment.clone().toDate() || moment().toDate()}
                    display='clock'
                    mode='time'

                // onChange={pickerOnChange}
                // style={styles.picker}
                />
            } */}
        </View >
    )
}

export default ScheduleEditor

const bStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    handle: {
        height: 6,
        width: 40,
        backgroundColor: 'lightgrey',
        alignSelf: 'center',
        marginVertical: 8,
        borderRadius: 4,
    },
    bottomSheetContent: {
        flex: 1,
        backgroundColor: "#eee",
        padding: 18,
    },
});

const styles = StyleSheet.create({
    screenContainer: {
        // backgroundColor: theme.colors.background,
        height: "100%"
    },
    event: {
        marginBottom: 7
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        height: 45,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: theme.colors.eventBackground,
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
    loadingContainer: {

    },
    indicator: {
        width: '100%',
        height: '100%',
    },
});