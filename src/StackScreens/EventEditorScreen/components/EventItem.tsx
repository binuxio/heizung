import { Animated, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { ListItem } from '@rneui/base'
import getEventMoment from '@/utils/Schedule/getEventMoment'
import { EventItemProps } from '../types'
import React from 'react'
import { EventMoment } from '@/types/schedule.types'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { _colors } from '@/theme'
import { eventItemStyles } from '@/global.styles'

let prevEventMoment: undefined | EventMoment = undefined
export let eventsTimeConflicts = false
export default class EventItem extends React.Component<EventItemProps, { animatedValue: Animated.Value }> {
    constructor(props: any) {
        super(props);
        this.state = {
            animatedValue: new Animated.Value(1)
        }
    }

    startDeleteAnimation = () => {
        Animated.timing(this.state.animatedValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            this.props.setEventToDeleteID(this.props.event.id);
        });
    };

    render() {
        const { event, i, selectedEventID, setSelectedEventID, eventsLength } = this.props;
        const { animatedValue } = this.state;
        const eventMoment = getEventMoment(event)
        const { startMoment, endMoment, id } = eventMoment;
        const crossesDay = endMoment.day() > startMoment.day();

        if (i == 0) eventsTimeConflicts = false
        let prevEndTimeConflicting = false;
        if (prevEventMoment) prevEndTimeConflicting = prevEventMoment.endMoment.isSameOrAfter(startMoment)
        prevEventMoment = (i !== eventsLength - 1) ? eventMoment : undefined;
        if (!eventsTimeConflicts)
            eventsTimeConflicts = prevEndTimeConflicting

        // console.log("rerender Eventitem", event.start.time)
        return (
            <Animated.View style={{
                overflow: "hidden", borderRadius: 7,
                marginBottom: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }),
                height: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 45] })
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
                                    this.startDeleteAnimation()
                                }}
                                activeOpacity={.6}
                                style={{ backgroundColor: "red", flex: 1, justifyContent: "center", alignItems: "center" }}
                            >
                                <MaterialIcons name='delete' color={"white"} size={22} />
                            </TouchableOpacity>
                        </View>
                    )}
                >
                    <TouchableHighlight underlayColor={_colors.backgroundEventItemHighlighted} onPress={() => {
                        setSelectedEventID(event.id)
                    }}
                        style={{ flex: 1, backgroundColor: selectedEventID == event.id ? _colors.backgroundEventItemHighlighted : _colors.backgroundEventItem }}>
                        <View style={[eventItemStyles.eventContainer, {}]}>
                            <View style={eventItemStyles.timeContainer}>
                                <View style={eventItemStyles.timeBox}>
                                    <Ionicons name='power' style={[eventItemStyles.powerIcon, { marginRight: 5, color: _colors.powerOn }]} />
                                    <Text style={[eventItemStyles.durationText, { color: _colors.powerOn }, prevEndTimeConflicting ? { color: "red" } : {}]}>{startMoment.format("HH:mm")}</Text>
                                </View>
                                <View style={eventItemStyles.timeBox}>
                                    <Ionicons name='power' style={[eventItemStyles.powerIcon, { marginRight: 5, color: _colors.powerOff }]} />
                                    <Text style={[eventItemStyles.durationText, { color: _colors.powerOff }]}>{crossesDay ? endMoment.clone().format("HH:mm, dd") : endMoment.format("HH:mm")}</Text>
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

