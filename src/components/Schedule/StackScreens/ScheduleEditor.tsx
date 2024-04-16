import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView,
    Platform, Alert, TouchableHighlight, Animated, Dimensions
} from 'react-native';
import moment from 'moment';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import theme from '../../../theme';
import getEventMoments from '../utils/getEventMoments';
import getEventsFromMap from '../utils/getEventsFromMap';
import { EventMoments, _Event } from '../../../types/schedule.types';
// import { StatusBar } from 'expo-status-bar';
import "moment/locale/de"
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ScheduleStackScreenProps } from './types';
import { Switch } from 'react-native-paper';
import crossesDays from '../utils/crossesDays';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { ListItem } from '@rneui/base';
import { useAlert } from '../../UI/_AlertPaperProvider';
import updateSchedule from '../../api/updateSchedule';
import fetchSchedule from '../../api/fetchSchedule';
import { useAppDispatch } from '../../../storage/redux/hooks';
import { triggerCalenderRerender } from '../../../storage/redux/slice.appData';
import errorHandlerUI from '../../UI/errorHandlerUI';
import calculateNextState from '../../Home/utils/calculateNextState';
import { Path, Svg } from 'react-native-svg';
import { useDialog } from '../../UI/PaperDialogProvider';

let removedEvents_ids: string[] = []
let newEvents_id: string[] = []
let thisevents: EventMoments[] = [] // as workaround to get the events when calling them in updateOnServer the current event is kinda not uptodate
let eventsTimeConflicts = false
type EventToEdit = { startMoment: moment.Moment | undefined, endMoment: moment.Moment | undefined, isWeekly: boolean, _id: string | undefined, excludedDays: string[] }
const ScheduleEditor = ({ navigation, route }: ScheduleStackScreenProps<"ScheduleEditor">) => {
    const { weekDayDate } = route.params
    const weekDayDateMoment = moment(weekDayDate)
    const weekDayDateFormatted = weekDayDateMoment.format("DD-MM-YYYY")
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<EventMoments[]>([])
    const [eventToEdit, setEventToEdit] = useState<EventToEdit>({ startMoment: undefined, endMoment: undefined, isWeekly: true, _id: undefined, excludedDays: [] })
    const [eventToEditIndex, setEventToEditIndex] = useState<undefined | number>(undefined)
    const [eventToDeleteIndex, setEventToDeleteIndex] = useState<undefined | number>(undefined)
    const [eventIsWeekly, setEventIsWeekly] = useState(true)
    const [timeBeingSet, setTimeBeingSet] = useState<"start" | "end" | undefined>(undefined)
    const [isPickerVisible, setPickerVisible] = useState(false)
    const [changesMade, setChangesMade] = useState(false)
    const [eventsUpdateSuccess, setEventsUpdateSuccess] = useState(false)
    const [isSaving, setIsUpadatingOnServer] = useState(false)
    const [editingMode, setEditingMode] = useState<"modify" | "create" | undefined>(undefined)
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { showAlert } = useAlert()
    const { showDialog, hideDialog } = useDialog()
    const dispatch = useAppDispatch()

    useEffect(() => {
        const onPageLeave = (ev: any) => {
            if (changesMade) {
                ev.preventDefault();
                showAlert({
                    title: 'Änderungen verwerfen?',
                    actions: [
                        {
                            text: "Verwerfen",
                            buttonStyle: { fontSize: 13, textDecorationLine: "underline" },
                            onPress() {
                                if (eventsUpdateSuccess) updateCalendar()
                                navigation.dispatch(ev.data.action);
                            },
                        },
                        {
                            text: "Abbrechen"
                        }
                    ]
                })
            } else if (eventsUpdateSuccess) updateCalendar()
        };

        const updateCalendar = async () => {
            try {
                const res = await fetchSchedule(dispatch)
                errorHandlerUI(res)
            } catch (error) { }
            setTimeout(() => {
                dispatch(triggerCalenderRerender(true))
            }, 100);
        }

        const unsubscribe = navigation.addListener('beforeRemove', onPageLeave);

        navigation.setOptions({
            headerRight(props) {
                return <TouchableOpacity
                    onPress={updateOnServer}
                    disabled={!changesMade}
                    activeOpacity={.4}
                    style={{
                        marginRight: 10,
                        backgroundColor: changesMade ? theme.colors.eventBackground : "rgba(0,0,0, .1)",
                        paddingVertical: 4, paddingHorizontal: 10, borderRadius: 5
                    }}>
                    <Text style={{ fontSize: 14, color: changesMade ? theme.colors.primary : "white", fontWeight: "600" }}>Speichern</Text>
                </TouchableOpacity>
            },
        })

        return () => {
            unsubscribe();
        };
    }, [changesMade, navigation]);

    useLayoutEffect(() => { // on mount
        removedEvents_ids = new Array()
        newEvents_id = new Array()
        setTimeout(() => {
            const _events = getEventsFromMap(weekDayDateMoment)
            const ev = _events.map(ev => getEventMoments(ev, weekDayDateMoment)!).sort((a, b) => {
                const timeA = parseInt(a.startMoment.format("HH:mm").replace(":", ""));
                const timeB = parseInt(b.startMoment.format("HH:mm").replace(":", ""));
                return timeA - timeB;
            });
            setEvents(ev)
            setLoading(false)
        }, 10);
        navigation.setOptions({
            headerTitleAlign: "center",
            headerLeft() {
                return <TouchableOpacity
                    activeOpacity={.4} onPress={() => navigation.goBack()} style={{ marginLeft: 10, flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name='chevron-back' size={20} color={theme.colors.primary} />
                    <Text style={{ fontSize: 14, color: theme.colors.primary, fontWeight: "600" }}>Zurück</Text>
                </TouchableOpacity>
            },
            headerTitle(props) {
                return <View style={{}}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "grey" }}>
                        {weekDayDateMoment.clone().format("dddd").toString()}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: "400", color: "grey", textAlign: "center" }}>
                        {weekDayDateMoment.clone().format("DD.MM.YY").toString()}
                    </Text>
                </View>
            },
        })
    }, [])

    useEffect(() => { thisevents = [...events]; calculateNextState() }, [events])

    const updateOnServer = async () => {
        if (eventsTimeConflicts) {
            showAlert({
                title: "Bitte überprüfe den Plan",
                actions: [{ text: "OK" }]
            })
            return
        }
        setIsUpadatingOnServer(true)
        const newEvents = thisevents.filter(event => newEvents_id.includes(event._id!))
        console.log(newEvents)
        const res = await updateSchedule(removedEvents_ids, newEvents, weekDayDate!)
        setIsUpadatingOnServer(false)
        errorHandlerUI(res)
        if (res.status != 200) return
        setEventsUpdateSuccess(true)
        removedEvents_ids = new Array()
        newEvents_id = new Array()
        setChangesMade(false)
    }

    const editEvent = (index: number) => {
        const ev = { ...events[index] }
        setEditingMode("modify")
        setEventToEdit(ev)
        setEventToEditIndex(index)
        setEventIsWeekly(ev.isWeekly || false)
        openBottomSheet()
    }

    const createEvent = () => {
        const newEvent = { startMoment: undefined, endMoment: undefined, isWeekly: true, _id: new Date().getTime().toString() }
        setEditingMode("create")
        setEventToEditIndex(undefined)
        setEventToEdit(newEvent)
        setEventIsWeekly(true)
        openBottomSheet()
    }

    const saveNewEvent = () => {
        if (eventToEdit.startMoment === undefined || eventToEdit.endMoment === undefined)
            return

        const newEvent = {
            startMoment: eventToEdit.startMoment,
            endMoment: eventToEdit.endMoment,
            _id: eventToEdit._id!,
            isWeekly: eventToEdit.isWeekly,
            excludedDays: eventToEdit.excludedDays
        };

        const updatedEvents = [...events];
        switch (editingMode) {
            case "modify":
                if (eventToEditIndex == undefined) return
                removedEvents_ids.push(newEvent._id) // delete old event on server
                newEvent._id = new Date().getTime().toString() // give it a new ID
                newEvents_id.push(newEvent._id) // add new event on server
                updatedEvents[eventToEditIndex] = newEvent; // overwrite the event
                setEditingMode(undefined)
                break;
            case "create":
                updatedEvents.push(newEvent);
                newEvents_id.push(newEvent._id)
                setEditingMode(undefined)
                break;
        }

        updatedEvents.sort((a, b) => {
            const timeA = parseInt(a.startMoment.format("HH:mm").replace(":", ""));
            const timeB = parseInt(b.startMoment.format("HH:mm").replace(":", ""));
            return timeA - timeB;
        });

        setEvents(updatedEvents);
        setChangesMade(true);
        closeBottomSheet();
    };

    const discardEventChanges = () => {
        switch (editingMode) {
            case "modify":
                if (eventToEditIndex !== undefined) {
                    if (eventToEdit.startMoment != (events[eventToEditIndex].startMoment)
                        || eventToEdit.endMoment != (events[eventToEditIndex].endMoment)) { // check for changes
                        showAlert()
                    } else closeBottomSheet()
                }
                break
            case "create":
                if (eventToEdit.startMoment !== undefined || eventToEdit.endMoment !== undefined) // check for changes
                    showAlert()
                else closeBottomSheet();
                break
        }

        function showAlert() {
            Alert.alert(
                'Änderungen verwerfen?',
                undefined,
                [
                    { text: 'Abbrechen' },
                    {
                        text: 'Verwerfen',
                        onPress: () => {
                            closeBottomSheet();
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const deleteEvent = () => {
        const index = eventToDeleteIndex!
        if (events[index]) { // check if eventToDeleteIndex still exists. Because user can delete event that is being edit
            removedEvents_ids.push(events[index]._id!) // add to deletion list
            const id = events[index]._id
            newEvents_id = newEvents_id.filter(event_id => event_id != id) // remove also from newEvents list if this event was created before
        }

        const updatedEvents = [...events]
        updatedEvents.splice(index, 1); // remove event from list
        setEvents(updatedEvents);

        if (index == eventToEditIndex) { // check if selected event being deleted while editing
            createEvent() // set currently editing event to null
            console.log("event was deleted while editing")
        }
        setEventToDeleteIndex(undefined)
    }

    const isExcludedToday = (event: EventMoments) => { return event.excludedDays && event.excludedDays.includes(weekDayDateFormatted) || false }

    const removeEventExcludedToday = (index: number) => {
        const updatedEvents = [...events]
        updatedEvents[index].excludedDays = updatedEvents[index].excludedDays.filter(date => date != weekDayDateFormatted)
        setEvents(updatedEvents)
        setChangesMade(true)
    }

    const setEventExcludedToday = (index: number) => {
        const updatedEvents = [...events]
        if (!isExcludedToday(updatedEvents[index])) {
            updatedEvents[index].excludedDays.push(weekDayDateFormatted)
            setEvents(updatedEvents)
            setEditingMode("modify")
            setEventToEdit(updatedEvents[index])
            setEventToEditIndex(index)
            setChangesMade(true)
        }
    }

    const pickerOnChange = (_event: DateTimePickerEvent, pickedDate: Date | undefined) => {
        if (Platform.OS === 'android') {
            setPickerVisible(false)
            if (_event.type == "dismissed") return
            if (pickedDate !== undefined) {
                if (timeBeingSet == "start") {
                    const updatedStartMoment = weekDayDateMoment
                        .clone()
                        .set("hours", pickedDate.getHours())
                        .set("minutes", pickedDate.getMinutes());

                    if (eventToEdit.endMoment) {
                        const endMoment = eventToEdit.endMoment
                        endMoment.set("day", weekDayDateMoment.day())
                        if (updatedStartMoment.isSameOrAfter(endMoment))
                            eventToEdit.endMoment.set("day", weekDayDateMoment.day() + 1)
                        else
                            eventToEdit.endMoment.set("day", weekDayDateMoment.day())
                    }

                    // @ts-ignore
                    setEventToEdit({
                        ...eventToEdit,
                        startMoment: updatedStartMoment,
                    });
                } else if (timeBeingSet === "end") {
                    const updatedEndMoment = weekDayDateMoment
                        .clone()
                        .set("hours", pickedDate.getHours())
                        .set("minutes", pickedDate.getMinutes());

                    if (eventToEdit.startMoment) {
                        const startMoment = eventToEdit.startMoment
                        if (updatedEndMoment.isSameOrBefore(startMoment))
                            updatedEndMoment.set("day", weekDayDateMoment.day() + 1)
                        else
                            updatedEndMoment.set("day", weekDayDateMoment.day())
                    }

                    //@ts-ignore
                    setEventToEdit({
                        ...eventToEdit,
                        endMoment: updatedEndMoment,
                    });
                }
            }
        }
        else {

        }
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

    const animateDeletion = useRef(new Animated.Value(1)).current;
    const animateDelete = () => {
        setChangesMade(true)
        Animated.timing(animateDeletion, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            deleteEvent()
            animateDeletion.setValue(1);
        });
    };

    useEffect(() => {
        if (eventToDeleteIndex !== undefined)
            animateDelete()
    }, [eventToDeleteIndex]);

    const setEventsSettings = (index: number) => {
        showDialog({
            contentWrapperStyle: { backgroundColor: "white" },
            dialogContent: <View style={{ gap: 10 }}>
                {isExcludedToday(events[index]) ?
                    <View style={{ flexDirection: "row" }}>
                        {/* TODO: Find better titles */}
                        <Text style={{ alignSelf: "center", fontSize: 16, fontWeight: "500", color: theme.colors.secondary }}>Wieder einschalten</Text>
                        <TouchableOpacity
                            onPress={() => {
                                hideDialog()
                                removeEventExcludedToday(index)
                            }}
                            activeOpacity={.7}
                            style={{ backgroundColor: theme.colors.eventBackground, width: 40, height: 40, alignSelf: "center", marginLeft: "auto", justifyContent: "center", alignItems: "center" }}
                        >
                            <MaterialCommunityIcons name='repeat' color={"black"} size={22} />
                        </TouchableOpacity>
                    </View> :
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ alignSelf: "center", fontSize: 16, fontWeight: "500", color: theme.colors.secondary }}>Für diese Woche auschalten</Text>
                        <TouchableOpacity
                            onPress={() => {
                                hideDialog()
                                setEventExcludedToday(index)
                            }}
                            activeOpacity={.7}
                            style={{ backgroundColor: "lightgray", width: 40, height: 40, alignSelf: "center", marginLeft: "auto", justifyContent: "center", alignItems: "center" }}
                        >
                            <MaterialCommunityIcons name='repeat-off' color={"black"} size={22} />
                        </TouchableOpacity>
                    </View>
                }
                < View style={{ backgroundColor: "lightgray", height: 1 }}></View >
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ alignSelf: "center", fontSize: 16, fontWeight: "500", color: theme.colors.secondary }}>Löschen</Text>
                    <TouchableOpacity
                        onPress={() => {
                            hideDialog()
                            setEventToDeleteIndex(index)
                        }}
                        activeOpacity={.7}
                        style={{ backgroundColor: "red", width: 40, height: 40, alignSelf: "center", marginLeft: "auto", justifyContent: "center", alignItems: "center" }}
                    >
                        <MaterialCommunityIcons name='delete' color={"white"} size={22} />
                    </TouchableOpacity>
                </View>
            </View >
            // contentWrapperStyle: {}
        })
    }

    const BottomSheetHandler = () => {
        return <View style={{ backgroundColor: "lightgrey", flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 7 }}>
            <TouchableOpacity activeOpacity={.7} style={{ backgroundColor: "rgba(255, 255, 255, .6)", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 }} onPress={discardEventChanges}>
                <Text style={{ color: "grey" }}>Abbrechen</Text>
            </TouchableOpacity>
            <View style={bStyles.handle}></View>
            <TouchableOpacity activeOpacity={.7} style={{ backgroundColor: theme.colors.eventBackground, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7, marginLeft: "auto" }} onPress={saveNewEvent}>
                <Text style={{ color: theme.colors.primary }}>Fertig</Text>
            </TouchableOpacity>
        </View>
    }

    const openBottomSheet = () => {
        bottomSheetModalRef.current!.present();
    };

    const closeBottomSheet = () => {
        setEventToEditIndex(undefined)
        bottomSheetModalRef.current!.close();
    };

    return (
        <>
            <View>
                <StatusBar translucent animated />
                {!loading &&
                    <ScrollView style={styles.screenContainer}>
                        <View style={{ padding: 10 }}>
                            <View>
                                {events && events.map((event, i) => {
                                    const { startMoment, endMoment, isWeekly } = event
                                    console.log(startMoment, endMoment)
                                    const crossesDay = endMoment.day() > startMoment.day()
                                    const excludedToday = isExcludedToday(event)
                                    console.log(excludedToday)
                                    if (i == 0) eventsTimeConflicts = false
                                    let prevEndTimeConflicting = false
                                    const prevEvent = events[i - 1]
                                    if (prevEvent) prevEndTimeConflicting = prevEvent.endMoment.isSameOrAfter(event.startMoment)
                                    eventsTimeConflicts = prevEndTimeConflicting
                                    return <Animated.View key={i} style={{
                                        overflow: "hidden", borderRadius: 7,
                                        marginBottom: animateDeletion.interpolate({ inputRange: [0, 1], outputRange: [eventToDeleteIndex === i ? 0 : 10, 10] }),
                                        opacity: eventToDeleteIndex !== i ? 1 : 0,
                                        height: animateDeletion.interpolate({ inputRange: [0, 1], outputRange: [eventToDeleteIndex === i ? 0 : 45, 45] })
                                    }}>
                                        <ListItem.Swipeable
                                            leftWidth={0}
                                            rightStyle={{ height: "100%" }}
                                            containerStyle={{ padding: 0, height: "100%" }}
                                            rightWidth={80}
                                            rightContent={(reset) => (
                                                <View style={{ height: "100%", width: "100%", flexDirection: "row" }}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            reset();
                                                            setEventsSettings(i)
                                                        }}
                                                        activeOpacity={.7}
                                                        style={{ backgroundColor: theme.colors.primary, flex: 1, justifyContent: "center", alignItems: "center" }}
                                                    >
                                                        <MaterialIcons name='settings' color={"white"} size={22} />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        >
                                            <TouchableHighlight underlayColor={excludedToday ? "lightgray" : "rgba(141, 199, 217, .7)"} onPress={() => editEvent(i)}
                                                style={{ flex: 1, backgroundColor: excludedToday ? "lightgray" : eventToEditIndex == i ? "rgb(141, 199, 217)" : theme.colors.eventBackground }}>
                                                <View style={[styles.eventContainer, { opacity: excludedToday ? .4 : 1 }]}>
                                                    <View style={{ flexDirection: "row", gap: 20 }}>
                                                        <View style={styles.timeContainer}>
                                                            <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "green" }]} />
                                                            <Text style={[styles.durationText, prevEndTimeConflicting ? { color: "red" } : {}]}>{startMoment.format("HH:mm")}</Text>
                                                        </View>
                                                        <View style={styles.timeContainer}>
                                                            <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "orange" }]} />
                                                            <Text style={styles.durationText}>{crossesDay ? endMoment.clone().add(1, "days").format("HH:mm, dd") : endMoment.format("HH:mm")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                                        {!isWeekly && <MaterialCommunityIcons name='repeat-once' style={[{ fontSize: 30, color: "grey" }]} />}
                                                        {prevEndTimeConflicting && <MaterialCommunityIcons name='exclamation' style={[{ fontSize: 20, color: "red" }]} />}
                                                    </View>
                                                </View>
                                            </TouchableHighlight>
                                        </ListItem.Swipeable>
                                    </Animated.View>
                                })}
                            </View>
                            <TouchableHighlight underlayColor="rgb(141, 199, 217)" onPress={createEvent}
                                style={{ backgroundColor: theme.colors.eventBackground, justifyContent: "center", alignItems: "center", height: 45, overflow: "hidden", borderRadius: 7, }}>
                                <AntDesign name='pluscircleo' size={22} color={theme.colors.primary} />
                            </TouchableHighlight>
                        </View>
                    </ScrollView> || <></>
                }
                <BottomSheetModalProvider>
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        snapPoints={['40%', '80%']}
                        enablePanDownToClose={false}
                        handleComponent={() => <BottomSheetHandler />}
                        style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15, overflow: "hidden" }}
                    >
                        <View style={bStyles.bottomSheetContent}>
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
                                            {(eventToEdit?.startMoment && eventToEdit.endMoment)
                                                ? eventToEdit.startMoment.clone().day() < eventToEdit.endMoment.clone().day()
                                                && <MaterialCommunityIcons name='arrow-right' size={16} color={theme.colors.primary} /> : <></>}
                                            <Text style={editorModalStyles.weekDay}>
                                                {eventToEdit?.endMoment && eventToEdit.endMoment.format("dddd") || weekDayDateMoment.format("dddd")}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            }
                            <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 35 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, .5)", borderRadius: 10, paddingHorizontal: 10, height: 30 }}>
                                    <Text style={{ fontSize: 12, color: "grey" }}>Wöchentlich</Text>
                                    <Switch value={eventIsWeekly} color={theme.colors.primary} style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} onValueChange={(v) => {
                                        setEventIsWeekly(v)
                                        setEventToEdit({
                                            ...eventToEdit,
                                            isWeekly: v
                                        });
                                    }} />
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
            </View>
            {isSaving && <ActivityIndicator size='large' color='grey' style={styles.indicator} />}
        </>
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
        backgroundColor: 'white',
        borderRadius: 4,
        position: "absolute",
        left: (Dimensions.get('window').width / 2) - 25,
    },
    bottomSheetContent: {
        flex: 1,
        backgroundColor: "#eee",
        padding: 18,
    },
});

const styles = StyleSheet.create({
    screenContainer: {
        height: "100%"
    },
    event: {
        marginBottom: 7
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        paddingHorizontal: 10,
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        position: 'absolute'
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