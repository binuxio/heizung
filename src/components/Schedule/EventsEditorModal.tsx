import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import getStartTimeMoment from './utils/getStartTimeMoment';
import moment from 'moment';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, useTheme } from 'react-native-paper';
import { EventDetails } from '../types';
import theme from '../../theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

interface ev {
    events: EventDetails[]
    weekDayDate: moment.Moment
}

interface EventsEditorModalProps {
    control: { modalOpen: boolean; closeModal: () => void };
}

const EventsEditorModal: React.FC<EventsEditorModalProps & ev> = ({ control, events, weekDayDate }) => {
    const { closeModal, modalOpen } = control;
    const theme = useTheme()

    useEffect(() => {
        console.log(modalOpen)
    }, [modalOpen])

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'transparent' },
                cardOverlayEnabled: true,
            }}
        >
            <Stack.Screen
                name="EditEventScreen"
                component={EditEvent}
                initialParams={{}}
            // initialParams={{ openSecondScreen: () => setModal(false) }}
            />
        </Stack.Navigator>

        // <Modal
        //     isVisible={modalOpen}
        //     animationIn="fadeInRight"
        //     animationOut="fadeOutLeft"
        //     backdropTransitionInTiming={100}
        //     backdropTransitionOutTiming={0}
        //     onBackButtonPress={() => {
        //         closeModal();
        //     }}
        //     backdropOpacity={.15}
        //     // hideModalContentWhileAnimating={true}
        //     style={[styles.modalContainer]}
        // >
        //     <View style={styles.modalContent}>
        //         <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.primary, padding: 10 }}>
        //             <View style={{}}>
        //                 <Text style={{ color: theme.colors.background, fontSize: 16, fontWeight: "700" }}>
        //                     {weekDayDate && weekDayDate.format("dddd, DD.MM.YYYY").toString()}
        //                 </Text>
        //             </View>
        //         </View>
        //         <EventsToEdit events={events} />
        //     </View>
        // </Modal>
    );
};

export default EventsEditorModal




const EventsToEdit: React.FC<{ events: EventDetails[] }> = ({ events }) => {
    const [eventToEdit, setEventsToEdit] = useState<EventDetails | undefined>(undefined)
    const [modalOpen, setModal] = useState(false)

    function closeModal() {
        setModal(false)
    }

    return <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        <View style={{ padding: 7 }}>
            {events && events.length != 0 ? events.map((event, i) => {
                const { startMoment, endMoment, isWeekly, weekDayDate, prevEvent } = event
                const crossesDay = startMoment.day() < endMoment.day()
                let prevEndTimeConflicting = false
                if (prevEvent) {
                    const prevEventDurationMoment = moment.duration(prevEvent.duration)
                    const prevEventEndTimeMoment = getStartTimeMoment(weekDayDate, prevEvent.start.time).clone().add(prevEventDurationMoment)
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
                    <TouchableOpacity onPress={() => setModal(true)}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        <AntDesign name='pluscircleo' size={90} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>}
        </View>
        {/* <Modal
            isVisible={modalOpen}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            backdropTransitionInTiming={100}
            backdropTransitionOutTiming={0}
            backdropOpacity={0}
            onBackButtonPress={() => {
                closeModal()
            }}
            style={[styles.modalContainer, { backgroundColor: "red", position: "relative" }]}
            <EditEvent event={events} control={{ modalOpen, closeModal }} />
        >
    </Modal> */}
    </View>
}
const Stack = createStackNavigator();


const EditEvent: React.FC<{ event: EventDetails, weekDayDate: moment.Moment } & EventsEditorModalProps> = ({ event, weekDayDate, control }) => {
    // const { modalOpen, closeModal } = control

    return <View style={{ backgroundColor: theme.colors.primaryLight, flex: 1 }}>
        <Button>
            <Text>Speichern</Text>
        </Button>
    </View>
}

const styles = StyleSheet.create({
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