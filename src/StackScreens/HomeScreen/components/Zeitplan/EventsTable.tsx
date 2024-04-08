import React, { FC, memo, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import theme, { _colors } from "@/theme";
import { _Event } from '@_types/schedule.types';
import { TouchableHighlight } from '@gorhom/bottom-sheet';
import { RootStackScreenProps } from '@/StackScreens/types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import getEventMoment from '@/utils/Schedule/getEventMoment';
import { useAppSelector } from '@/storage/redux/hooks';
import { eventItemStyles } from '@/global.styles';
import moment from 'moment';

const WeekDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const WeekDaysShort = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
let t: any = null
const EventsTable: React.FC<{ stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = ({ stackProps: { navigation } }) => {
    const [visibleWeekIndex, setVisibleWeekIndex] = useState(0)
    const [weekCardLayoutData, setWeekCardLayoutData] = useState<{ y: number, height: number }[]>([])
    const [scrollingManually, setScrollingManually] = useState(false)
    const weekContainerRef = useRef<ScrollView>(null)

    const schedule = useAppSelector(state => state.appData.schedule)

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 16 }}>
                <View style={{ backgroundColor: _colors.backgroundEventItemHighlighted, flexDirection: "row", marginBottom: 10, height: 35, overflow: "hidden", borderRadius: 5 }}>
                    {WeekDaysShort.map((day, i) =>
                        <View style={{ flex: 1 }} key={i}>
                            <TouchableHighlight underlayColor={_colors.primary}
                                style={{ height: "100%", width: "100%", backgroundColor: visibleWeekIndex == i ? _colors.primary : "transparent", padding: 4, justifyContent: "center", alignItems: "center" }}
                                onPress={() => {
                                    setVisibleWeekIndex(i);
                                    setScrollingManually(true)
                                    weekContainerRef.current!.scrollTo({ y: weekCardLayoutData[i].y })
                                    if (t) clearTimeout(t)
                                    t = setTimeout(() => {
                                        setScrollingManually(false)
                                    }, 400);
                                }}>
                                <Text style={{ fontSize: 16, color: visibleWeekIndex == i ? "white" : "black" }}>{day}</Text>
                            </TouchableHighlight>
                        </View>
                    )}
                </View>
            </View>
            <ScrollView onScroll={(e) => {
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
                <View style={{ gap: 10, padding: 16, }}>
                    {Array.from({ length: 7 }, (_, i) => i).map(day => {
                        let isoWeekDay = day + 1
                        if (isoWeekDay === 7) isoWeekDay = 0
                        return <View onLayout={ev => {
                            const { height, y } = ev.nativeEvent.layout
                            setWeekCardLayoutData(e => [...e, { y, height }])
                        }} key={isoWeekDay}>
                            <Week isoWeekDay={isoWeekDay} stackProps={{ navigation }} events={schedule[isoWeekDay] || []} />
                        </View>
                    })}
                </View>
            </ScrollView >
        </View >
    )
}

export default EventsTable

const Week: FC<{ isoWeekDay: number, events: _Event[], stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = ({ isoWeekDay: day, stackProps: { navigation }, events }) => {

    const TimeCard: React.FC<{ event: _Event, i: number, eventsLength: number }> = ({ event, i, eventsLength }) => {
        const eventMoment = getEventMoment(event)
        const { startMoment, endMoment, id } = eventMoment;
        const crossesDay = endMoment.day() > startMoment.day();

        return <TouchableHighlight underlayColor={_colors.backgroundEventItemHighlighted}
            style={{ flex: 1, backgroundColor: _colors.backgroundEventItem, height: 45, marginBottom: 10, borderRadius: 7, overflow: "hidden" }}
            onPress={() => navigation?.navigate('EventEditorScreen', { events: events, day: day, selectedEventID: event.id })}
        >
            <View style={[eventItemStyles.eventContainer, {}]}>
                <View style={eventItemStyles.timeContainer}>
                    <View style={eventItemStyles.timeBox}>
                        <Ionicons name='power' style={[eventItemStyles.powerIcon, { marginRight: 5, color: _colors.powerOn }]} />
                        <Text style={[eventItemStyles.durationText, { color: _colors.powerOn }]}>{startMoment.format("HH:mm")}</Text>
                    </View>
                    <View style={eventItemStyles.timeBox}>
                        <Ionicons name='power' style={[eventItemStyles.powerIcon, { marginRight: 5, color: _colors.powerOff }]} />
                        <Text style={[eventItemStyles.durationText, { color: _colors.powerOff }]}>{crossesDay ? endMoment.clone().format("HH:mm, dd") : endMoment.format("HH:mm")}</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    }

    const TimeLine: React.FC<{ events: _Event[] }> = ({ events }) => {
        return <View style={{ padding: 5, borderRadius: 7, gap: 5 }}>
            {events.map((event, i) => <TimeCard event={event} eventsLength={events.length} key={i} i={i} />)}
        </View>
    }

    // console.log("render week", new Date().getTime(), day)
    return <View style={{ borderRadius: 7, borderColor: _colors.primary, borderWidth: 1, overflow: "hidden" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: _colors.primary, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ color: "white", fontSize: 18 }}>{moment().isoWeekday(day).format("dddd")}</Text>
            <TouchableHighlight onPress={() => navigation?.navigate("EventEditorScreen", { events: events, day, selectedEventID: undefined })} underlayColor={"darkgray"} style={{ backgroundColor: "white", borderRadius: 7 }}>
                <MaterialCommunityIcons name='playlist-edit' size={28} color={"black"} />
            </TouchableHighlight>
        </View>
        <View style={{ paddingTop: 10, paddingHorizontal: 5 }}>
            <TimeLine events={events} />
        </View>
    </View>
}