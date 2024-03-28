import React, { FC, memo, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { _colors } from "@/theme";
import { EventMoment, Schedule, _Event } from '@_types/schedule.types';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableHighlight } from '@gorhom/bottom-sheet';
import { RootStackScreenProps } from '@/StackScreens/types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import getEventMoment from '@/utils/Schedule/getEventMoment';
import { useSelector } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';

const WeekDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const WeekDaysShort = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
let t: any = null
const EventsTable: React.FC<{ stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = ({ stackProps: { navigation } }) => {
    const [visibleWeekIndex, setVisibleWeekIndex] = useState(0)
    const [weekCardLayoutData, setWeekCardLayoutData] = useState<{ y: number, height: number }[]>([])
    const [scrollingManually, setScrollingManually] = useState(false)
    const weekContainerRef = useRef<ScrollView>(null)

    const schedule = useAppSelector(state => state.appData.schedule)
    console.log("schedule", new Date().getTime(), schedule)
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: "lightgray", flexDirection: "row", marginBottom: 10, height: 35, overflow: "hidden", borderRadius: 5 }}>
                {WeekDaysShort.map((day, i) =>
                    <View style={{ flex: 1 }} key={i}>
                        <TouchableHighlight underlayColor={_colors.lightBackground}
                            style={{ height: "100%", width: "100%", backgroundColor: visibleWeekIndex == i ? _colors.lightBackground : "transparent", padding: 4, justifyContent: "center", alignItems: "center" }}
                            onPress={() => {
                                setVisibleWeekIndex(i);
                                setScrollingManually(true)
                                weekContainerRef.current!.scrollTo({ y: weekCardLayoutData[i].y })
                                if (t)
                                    clearTimeout(t)
                                t = setTimeout(() => {
                                    setScrollingManually(false)
                                }, 400);
                            }}>
                            <Text style={{ fontSize: 16 }}>{day}</Text>
                        </TouchableHighlight>
                    </View>
                )}
            </View>
            <ScrollView style={{}} onScroll={(e) => {
                if (scrollingManually) return
                const scrollY = e.nativeEvent.contentOffset.y
                const lastIntersectionPos = weekCardLayoutData[visibleWeekIndex].y + weekCardLayoutData[visibleWeekIndex].height
                if (scrollY < lastIntersectionPos && scrollY > weekCardLayoutData[visibleWeekIndex].y) return
                for (let i = 0; i < weekCardLayoutData.length; i++) {
                    if (weekCardLayoutData[i].y + weekCardLayoutData[i].height >= scrollY) {
                        setVisibleWeekIndex(i)
                        break;
                    }
                }
            }} ref={weekContainerRef}>
                <View style={{ gap: 10 }}>
                    {WeekDays.map((day, i) => {
                        return <View onLayout={ev => {
                            const { height, y } = ev.nativeEvent.layout
                            setWeekCardLayoutData(e => [...e, { y, height }])
                        }} key={i}>
                            <Week day={{ day, dayNumber: i }} stackProps={{ navigation }} events={schedule[i] || []} />
                        </View>
                    })}
                </View>
            </ScrollView >
        </View >
    )
}

export default EventsTable

let prevEventMoment: undefined | EventMoment = undefined
const Week: FC<{ day: { day: string, dayNumber: number }, events: _Event[], stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = memo(({ day: { day, dayNumber }, stackProps: { navigation }, events }) => {

    const TimeCard: React.FC<{ event: _Event, i: number, eventsLength: number }> = ({ event, i, eventsLength }) => {
        const { start, end } = event
        const eventMoment = getEventMoment(event)
        const { startMoment, endMoment, id } = eventMoment;
        const crossesDay = endMoment.day() > startMoment.day();
        let prevEndTimeConflicting = false;
        if (prevEventMoment) {
            prevEndTimeConflicting = prevEventMoment.endMoment.isSameOrAfter(startMoment);
        }
        prevEventMoment = (i !== eventsLength) ? eventMoment : undefined;

        return <TouchableHighlight underlayColor={"rgba(141, 199, 217, .7)"}
            style={{ flex: 1, backgroundColor: _colors.backgroundEventItem, height: 45, marginBottom: 10, borderRadius: 7, overflow: "hidden" }}
            onPress={() => navigation?.navigate('EventEditorScreen', { events: events, day: dayNumber, selectedEventID: event.id })}
        >
            <View style={[styles.eventContainer, {}]}>
                <View style={{ flexDirection: "row", gap: 20 }}>
                    <View style={styles.timeContainer}>
                        <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "green" }]} />
                        <Text style={[styles.durationText]}>{startMoment.format("HH:mm")}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Ionicons name='power' style={[styles.powerIcon, { marginRight: 5, color: "orange" }]} />
                        <Text style={styles.durationText}>{crossesDay ? endMoment.clone().add(1, "days").format("HH:mm, dd") : endMoment.format("HH:mm")}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                    {prevEndTimeConflicting && <MaterialCommunityIcons name='exclamation' style={[{ fontSize: 20, color: "red" }]} />}
                </View>
            </View>
        </TouchableHighlight>
    }

    const TimeLine: React.FC<{ events: _Event[] }> = ({ events }) => {
        return <View style={{ padding: 5, borderRadius: 7, gap: 5 }}>
            {events.map((event, i) => <TimeCard event={event} eventsLength={events.length} key={i} i={i} />)}
        </View>
    }

    console.log("render week", new Date().getTime(), day)
    return <View style={{ borderRadius: 7, borderColor: "black", borderWidth: 1, borderBlockStartColor: "red", borderTopWidth: 0, overflow: "hidden" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: _colors.primary, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ color: "white", fontSize: 18 }}>{day}</Text>
            <TouchableHighlight onPress={() => navigation?.navigate("EventEditorScreen", { events: events, day: dayNumber, selectedEventID: undefined })} underlayColor={"darkgray"} style={{ backgroundColor: "white", borderRadius: 7 }}>
                <MaterialCommunityIcons name='playlist-edit' size={28} color={"black"} />
            </TouchableHighlight>
        </View>
        <View style={{ paddingTop: 10, paddingHorizontal: 5 }}>
            <TimeLine events={events} />
        </View>
    </View>
}, (prevProps, nextProps) => true)


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
})