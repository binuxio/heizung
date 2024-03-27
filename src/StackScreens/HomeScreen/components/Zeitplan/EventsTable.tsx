import React, { FC, memo, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import theme, { _colors } from "@/theme";
import { Schedule, _Event } from '@_types/schedule.types';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableHighlight } from '@gorhom/bottom-sheet';
import { useDialog } from '@components/UI/PaperDialogProvider';
import { useAlert } from '@components/UI/_AlertPaperProvider';
import { RootStackScreenProps } from '@/StackScreens/types';
import createEventsMap, { ScheduleMap } from '@/utils/Schedule/createEventsMap';

const schedule: Schedule = {
    0: [
        { start: { day: 0, time: "02:13" }, end: { time: "05:00" }, id: "123" },
        { start: { day: 0, time: "06:13" }, end: { time: "09:00" }, id: "124" },
        { start: { day: 0, time: "14:10" }, end: { time: "15:00" }, id: "125" }
    ],
    1: [
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12ads7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12a7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12w327" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12asdc7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12lwe7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12tr7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12wre7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "1awe327" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12lcpa7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "1aclöl27" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12wes7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12sad7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12qecxy7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12qeqrf7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12pa7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "1qew27" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "12qfcy7" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "127adq" },
        { start: { day: 1, time: "16:13" }, end: { time: "22:00" }, id: "127" },
        { start: { day: 1, time: "02:13" }, end: { time: "05:00" }, id: "123" },
        { start: { day: 1, time: "14:10" }, end: { time: "15:00" }, id: "125" },
        { start: { day: 1, time: "06:13" }, end: { time: "09:00" }, id: "124" },
    ],
    2: [
        { start: { day: 6, time: "02:13" }, end: { time: "05:00" }, id: "123" },
        { start: { day: 6, time: "06:13" }, end: { time: "09:00" }, id: "124" },
        { start: { day: 6, time: "14:10" }, end: { time: "16:00" }, id: "125" }
    ],
    3: [
        { start: { day: 6, time: "02:13" }, end: { time: "05:00" }, id: "123" },
        { start: { day: 6, time: "06:13" }, end: { time: "09:00" }, id: "124" },
        { start: { day: 6, time: "14:10" }, end: { time: "16:00" }, id: "125" }
    ],
    4: [
        { start: { day: 6, time: "02:13" }, end: { time: "05:00" }, id: "123" },
        { start: { day: 6, time: "06:13" }, end: { time: "09:00" }, id: "124" },
        { start: { day: 6, time: "14:10" }, end: { time: "16:00" }, id: "125" }
    ],
    5: [
        { start: { day: 6, time: "02:13" }, end: { time: "05:00" }, id: "123" },
        { start: { day: 6, time: "06:13" }, end: { time: "09:00" }, id: "124" },
        { start: { day: 6, time: "14:10" }, end: { time: "16:00" }, id: "125" }
    ],
    6: [
        { start: { day: 6, time: "02:13" }, end: { time: "05:00" }, id: "123" },
        { start: { day: 6, time: "06:13" }, end: { time: "09:00" }, id: "124" },
        { start: { day: 6, time: "14:10" }, end: { time: "16:00" }, id: "125" }
    ]
}

createEventsMap(schedule)

const WeekDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const WeekDaysShort = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const tablePosY: number[] = []
const EventsTable: React.FC<{ stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = ({ stackProps: { navigation } }) => {
    const { showDialog } = useDialog()

    const [selectedWeek, setSlectedWeek] = useState(0)

    const weekContainerRef = useRef<ScrollView>(null)

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: "lightgray", flexDirection: "row", marginBottom: 10, height: 35, overflow: "hidden", borderRadius: 5 }}>
                {WeekDaysShort.map((day, i) =>
                    <View style={{ flex: 1 }} key={i}>
                        <TouchableHighlight underlayColor={_colors.lightBackground}
                            style={{ height: "100%", width: "100%", backgroundColor: selectedWeek == i ? _colors.lightBackground : "transparent", padding: 4, justifyContent: "center", alignItems: "center" }}
                            onPress={() => {
                                setSlectedWeek(i);
                                weekContainerRef.current!.scrollTo({ y: tablePosY[i] })
                            }}>
                            <Text style={{ fontSize: 16 }}>{day}</Text>
                        </TouchableHighlight>
                    </View>
                )}
            </View>
            <ScrollView style={{}} ref={weekContainerRef}>
                <View style={{ gap: 10 }}>
                    {WeekDays.map((day, i) => {
                        return <View onLayout={el => { tablePosY[i] = el.nativeEvent.layout.y }} key={i}>
                            <Week day={{ day, dayNumber: i }} stackProps={{ navigation }} />
                        </View>
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default React.memo(EventsTable)

const Week: FC<{ day: { day: string, dayNumber: number }, stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = memo(({ day: { day, dayNumber }, stackProps: { navigation } }) => {
    const TimeCard: React.FC<{ event: _Event, i: number }> = ({ event, i }) => {
        const { start, end } = event
        return <TouchableHighlight activeOpacity={0.6}
            underlayColor="#ffac0a"
            style={{ height: 50, width: 80, borderRadius: 5, overflow: "hidden" }}
            onPress={() => navigation?.navigate("EventEditorScreen", { events: ScheduleMap.get(dayNumber) || [], selectedEventID: event.id, day: dayNumber })}>

            <LinearGradient colors={["#ffdfa0", "#ffac0a"]} style={{ height: "100%" }} >
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4, marginTop: "auto", }}>
                    <Text style={{ fontSize: 13 }}>{start.time}</Text>
                    <Text style={{ fontSize: 13 }}>{end.time}</Text>
                </View>
            </LinearGradient>
        </TouchableHighlight>
    }

    const TimeLine: React.FC<{ events: _Event[] }> = ({ events }) => {
        return <View style={{ backgroundColor: theme.colors.secondary, padding: 5, borderRadius: 7, gap: 5, flexWrap: "wrap" }}>
            {events.map((event, i) => <TimeCard event={event} key={i} i={i} />)}
        </View>
    }

    console.log("render week", new Date().getTime(), day)
    return <View style={{ paddingTop: 20 }}>
        <View style={{ padding: 5, borderRadius: 7, borderColor: "black", borderWidth: 1.5, }}>
            <View style={{ flexDirection: "row", marginTop: -28 }}>
                <Text style={{ color: _colors.primary, fontSize: 18, lineHeight: 18, backgroundColor: "white", paddingHorizontal: 10, }}>{day}</Text>
            </View>
            <View style={{ paddingTop: 20 }}>
                <TimeLine events={ScheduleMap.get(dayNumber) || []} />
            </View>
        </View>
    </View>
}, (prevProps, nextProps) => true)
