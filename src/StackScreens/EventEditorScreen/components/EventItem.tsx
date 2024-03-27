import { Animated, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { ListItem } from '@rneui/base'
import getEventMoment from '@/utils/Schedule/getEventMoment'
import { EventItemProps } from '../types'
import React from 'react'
import { EventMoment } from '@/types/schedule.types'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { _colors } from '@/theme'

let prevEventMoment: undefined | EventMoment = undefined
export let eventsTimeConflicts = false
export default class EventItem extends React.Component<EventItemProps, { animatedValue: Animated.Value }> {
    // shouldComponentUpdate(nextProps: EventItemProps) {
    //     const { event, selectedEventID } = this.props

    //     function updateEventSelection() {
    //         return nextProps.selectedEventID !== event.id
    //              // check if the event was the previous selected one to rerender
    //     }

    //     function updateModifiedEvent() {
    //         console.log(event.start.time, Object.is(event, nextProps.event))
    //         return Object.is(event, nextProps.event)
    //     }

    //     return updateEventSelection() || updateModifiedEvent()
    //     return true
    // }

    constructor(props: any) {
        super(props);
        this.state = {
            animatedValue: new Animated.Value(1)
        }
    }

    startAnimation = () => {
        Animated.timing(this.state.animatedValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            this.props.setEventToDeleteID(this.props.event.id);
        });
    };

    render() {
        const { event, i, eventToDeleteID, selectedEventID, setSelectedEventID, setEventToDeleteID, eventsLength } = this.props;
        const { animatedValue } = this.state;
        const eventMoment = getEventMoment(event)
        const { startMoment, endMoment, id } = eventMoment;
        const crossesDay = endMoment.day() > startMoment.day();

        let prevEndTimeConflicting = false;
        if (prevEventMoment) {
            prevEndTimeConflicting = prevEventMoment.endMoment.isSameOrAfter(startMoment);
        }
        prevEventMoment = (i !== eventsLength) ? eventMoment : undefined;
        console.log("rerender Eventitem", event.start.time)


        return (
            <Animated.View key={i} style={{
                overflow: "hidden", borderRadius: 7,
                opacity: eventToDeleteID !== id ? 1 : 0,
                marginBottom: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }),
                height: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 45] })
                // marginBottom: 10,
                // height: 45
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
                                    setEventToDeleteID(event.id)
                                    // this.startAnimation()
                                }}
                                activeOpacity={.6}
                                style={{ backgroundColor: "red", flex: 1, justifyContent: "center", alignItems: "center" }}
                            >
                                <MaterialIcons name='delete' color={"white"} size={22} />
                            </TouchableOpacity>
                        </View>
                    )}
                >
                    <TouchableHighlight underlayColor={"rgba(141, 199, 217, .7)"} onPress={() => setSelectedEventID(id)}
                        style={{ flex: 1, backgroundColor: selectedEventID == event.id ? _colors.lightBackground : _colors.background }}>
                        <View style={[styles.eventContainer, {}]}>
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
                                {prevEndTimeConflicting && <MaterialCommunityIcons name='exclamation' style={[{ fontSize: 20, color: "red" }]} />}
                            </View>
                        </View>
                    </TouchableHighlight>
                </ListItem.Swipeable>
            </Animated.View>
        );
    }
}

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