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
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ScheduleStackScreenProps } from './types';
import { Switch } from 'react-native-paper';
import crossesDays from '../utils/crossesDays';
import DateTimePicker from '@react-native-community/datetimepicker';
import endTimeisSmaller from '../utils/endTimeisSmaller';

const oldEvents = []
const newEvents = []
let currentlyEditingEvent: EventDetails | undefined = undefined
const ScheduleEditor = ({ navigation, route }: ScheduleStackScreenProps<"ScheduleEditor">) => {
    const { weekDayDate } = route.params
    const weekDayDateMoment = moment(weekDayDate)
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<EventDetails[]>([])
    const [eventToEdit, setEventToEdit] = useState<EventDetails | undefined>(undefined)
    const [eventToEditIndex, setEventToEditIndex] = useState<undefined | number>(undefined)
    const [newEvent, setNewEvent] = useState<_Event | undefined>(undefined)
    const [eventIsWeekly, setEventIsWeekly] = useState(true)
    const [timeBeingSet, setTimeBeingSet] = useState<"start" | "end" | undefined>(undefined)
    const [isPickerVisible, setPickerVisible] = useState(false)

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

    const openEventEditor = (index: number) => {
        const ev = events[index]
        setEventToEdit(ev)
        setEventIsWeekly(ev.isWeekly)
        openBottomSheet()
    }

    const createEvent = () => {
        setEventToEdit({ startMoment: undefined, endMoment: undefined, isWeekly: true })
        setEventIsWeekly(true)
        openBottomSheet()
    }

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const openBottomSheet = () => {
        bottomSheetModalRef.current!.present();
    };

    const closeBottomSheet = () => {
        bottomSheetModalRef.current!.close();
    };

    const pickerOnChange = (_event: DateTimePickerEvent, pickedDate: Date | undefined) => {
        if (Platform.OS === 'android') {
            setPickerVisible(false)
            if (_event.type == "dismissed") return
            if (pickedDate !== undefined) {
                if (timeBeingSet == "start") {
                    const updatedMoment = weekDayDateMoment
                        .clone()
                        .set("hours", pickedDate.getHours())
                        .set("minutes", pickedDate.getMinutes());

                    if (eventToEdit?.endMoment) {
                        if (endTimeisSmaller(updatedMoment, eventToEdit?.endMoment))
                            eventToEdit?.endMoment.set("day", weekDayDateMoment.day() + 1)
                        else
                            eventToEdit?.endMoment.set("day", weekDayDateMoment.day())
                    }

                    // @ts-ignore
                    setEventToEdit({
                        ...eventToEdit,
                        startMoment: updatedMoment,
                    });
                } else if (timeBeingSet === "end") {
                    const updatedMoment = weekDayDateMoment
                        .clone()
                        .set("hours", pickedDate.getHours())
                        .set("minutes", pickedDate.getMinutes());

                    if (eventToEdit?.startMoment) {
                        if (endTimeisSmaller(eventToEdit!.startMoment, updatedMoment))
                            updatedMoment.set("day", weekDayDateMoment.day() + 1)
                    }

                    //@ts-ignore
                    setEventToEdit({
                        ...eventToEdit,
                        endMoment: updatedMoment,
                    });
                }
            }
        }
        else {

        }
    }

    const confirmPickerHandler = (pickedDate: Date) => { // ios
        setPickerVisible(false)
    }

    const calculateDuration = () => {
        if (eventToEdit && eventToEdit.startMoment && eventToEdit.endMoment) {
            const duration = moment.duration(eventToEdit.endMoment.diff(eventToEdit.startMoment));
            const hours = duration.hours();
            const minutes = duration.minutes();
            if (hours == 0 && minutes == 0) return "24:00"
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        }
        return "--:--";
    };

    const datepickerStartTime = () => {
        if (!eventToEdit) return moment().startOf('day').toDate()
        if (timeBeingSet == "start") {
            if (eventToEdit?.startMoment) return eventToEdit.startMoment.toDate()
        } else {
            if (eventToEdit?.endMoment) return eventToEdit.endMoment.toDate()
        }
        return moment().startOf('day').toDate()
    }

    return (
        <View>
            <StatusBar translucent={false} backgroundColor={"white"} />
            {!loading &&
                <ScrollView style={styles.screenContainer}>
                    <View style={{ padding: 10 }}>
                        <View>
                            {events && events.map((event, i) => {
                                const { startMoment, endMoment, isWeekly } = event

                                let prevEndTimeConflicting = false
                                const prevEvent = events[i - 1]
                                if (prevEvent) prevEndTimeConflicting = prevEvent.endMoment >= prevEvent.startMoment

                                return <TouchableOpacity activeOpacity={.4} style={[styles.eventContainer, { marginBottom: 10 }]} onPress={() => openEventEditor(i)} key={i}>
                                    <View style={styles.timeContainer}>
                                        <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "green" }]} />
                                        <Text style={[styles.durationText, prevEndTimeConflicting ? { color: "red" } : {}]}>{startMoment.format("HH:mm")}</Text>
                                    </View>
                                    <View style={styles.timeContainer}>
                                        <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "orange" }]} />
                                        <Text style={styles.durationText}>{!crossesDays(startMoment, endMoment) ? endMoment.format("HH:mm") : endMoment.format("dd, HH:mm")}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                                        {!isWeekly && <MaterialCommunityIcons name='repeat-once' style={[{ fontSize: 30, color: "grey" }]} />}
                                        {prevEndTimeConflicting && <MaterialCommunityIcons name='exclamation' style={[{ fontSize: 20, color: "red" }]} />}
                                    </View>
                                </TouchableOpacity>

                            })}
                        </View>
                        <TouchableOpacity onPress={createEvent} activeOpacity={.4} style={{ backgroundColor: theme.colors.eventBackground, justifyContent: "center", alignItems: "center", height: 40 }}>
                            <AntDesign name='pluscircleo' size={25} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </ScrollView> || <ActivityIndicator size='large' color={theme.colors.primary} style={styles.indicator} />
            }
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={['30%', '80%']}
                    enablePanDownToClose={false}
                    // backdropComponent={useCallback(
                    //     (props: BottomSheetBackdropProps) => (
                    //         <BottomSheetBackdrop
                    //             {...props}
                    //             disappearsOnIndex={-1}
                    //             appearsOnIndex={1}
                    //         // pressBehavior={"none"}
                    //         />
                    //     ), [])}
                    handleComponent={() => <View style={bStyles.handle} />}
                >
                    <View style={bStyles.bottomSheetContent}>
                        {/* time setter */}
                        {<View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                    <Ionicons name='power' style={{ fontSize: 20, color: "green" }} />
                                    <Text style={{ fontSize: 20, }}>Einschalten</Text>
                                </View>
                                <TouchableOpacity activeOpacity={.4} onPress={() => { setTimeBeingSet("start"); setPickerVisible(true) }}
                                    style={editorModalStyles.timeBox}>
                                    <Text style={{ fontSize: 25, textAlign: "center", color: theme.colors.primary }}>
                                        {eventToEdit?.startMoment && eventToEdit.startMoment.clone().format("HH:mm") || "--:--"}
                                    </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <Text style={editorModalStyles.weekDay}>
                                            {weekDayDateMoment.format("dddd")}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: "rgba(255, 255, 255, .5)", marginTop: "auto", marginBottom: 15, borderRadius: 20, width: 65, height: 40, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "grey" }}>{calculateDuration()} h</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                    <Ionicons name='power' style={{ fontSize: 20, color: "orange" }} />
                                    <Text style={{ fontSize: 20, }}>Ausschalten</Text>
                                </View>
                                <TouchableOpacity activeOpacity={.4} onPress={() => { setTimeBeingSet("end"); setPickerVisible(true) }}
                                    style={editorModalStyles.timeBox}>
                                    <Text style={{ fontSize: 25, textAlign: "center", color: theme.colors.primary }}>
                                        {eventToEdit?.endMoment && eventToEdit.endMoment.clone().format("HH:mm") || "--:--"}
                                    </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        {(eventToEdit?.startMoment && eventToEdit.endMoment) ? endTimeisSmaller(eventToEdit.startMoment, eventToEdit.endMoment) &&
                                            <MaterialCommunityIcons name='arrow-right' size={16} color={theme.colors.primary} /> : <></>}
                                        <Text style={editorModalStyles.weekDay}>
                                            {eventToEdit?.endMoment && eventToEdit.endMoment.format("dddd") || weekDayDateMoment.format("dddd")}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        }
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 15 }}>Wöchentlich</Text>
                                <Switch value={eventIsWeekly} color={theme.colors.primary} style={{ width: "auto" }} onValueChange={(v) => {
                                    setEventIsWeekly(v)
                                    console.log(v)
                                }} />
                            </View>
                            <View>
                                <Text></Text>
                            </View>
                        </View>
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
            {
                Platform.OS === 'android' && isPickerVisible && <DateTimePicker
                    value={datepickerStartTime()}
                    mode='time'
                    is24Hour
                    onChange={pickerOnChange}
                />

            }
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

const editorModalStyles = StyleSheet.create({
    timeBox: {
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 8,
        marginTop: 8
    },
    weekDay: {
        textAlign: "center",
        fontSize: 14,
        color: "grey"
    }
})