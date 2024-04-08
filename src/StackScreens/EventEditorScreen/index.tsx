import { _Event } from '@/types/schedule.types'
import React, { memo, useCallback, useEffect, useLayoutEffect, useReducer, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { RootStackScreenProps } from '../types'
import theme, { _colors } from '@/theme'
import { Ionicons, } from '@expo/vector-icons'
import moment from 'moment'
import "moment/locale/de"
import TimePicker from './components/TimePicker'
import eventReducer from './utils/eventReducer'
import EventItem, { eventsTimeConflicts } from './components/EventItem'
import { useAlert } from '@/components/UI/_AlertPaperProvider'
import sendUpdatedEvents from '@/api/schedule/sendUpdatedEvents'
import errorHandlerUI from '@/components/UI/errorHandlerUI'
import { produce } from 'immer'
import { useAppDispatch } from '@/storage/redux/hooks'
import { updateSchedule } from '@/storage/redux/slice.appData'
import crossesDay_native from '@/utils/Schedule/corssesDay_native'

let finalEvents: _Event[] = []
let deletedEventsId: string[] = []
export default function EventEditorScreen({ navigation, route }: RootStackScreenProps<"EventEditorScreen">) {
  const { events: _events, selectedEventID: _selectedEventID, day } = route.params
  const [eventToDeleteID, setEventToDeleteID] = useState<undefined | string>(undefined)
  const [selectedEventID, setSelectedEventID] = useState<undefined | string>(_selectedEventID)
  const [loading, setLoading] = useState(true)
  const [{ events }, dispatch] = useReducer<typeof eventReducer>(eventReducer, { events: [..._events] })
  const selectedEvent = events.find(event => event.id === selectedEventID)
  const reduxDispatch = useAppDispatch()
  const [changesMade, setChangesMade] = useState(false)
  const { showAlert } = useAlert()

  useEffect(() => {
    const onPageLeave = (ev: any) => {
      if (changesMade) {
        ev.preventDefault();
        showAlert({
          title: 'Änderungen verwerfen?',
          actions: [
            {
              buttonStyle: { fontSize: 13, color: "black", backgroundColor: "transparent" },
              text: "Abbrechen"
            },
            {
              text: "Verwerfen",
              buttonStyle: { fontSize: 13, backgroundColor: "red", color: "white" },
              onPress() {
                navigation.dispatch(ev.data.action);
              },
            }
          ]
        })
      }
    };

    const unsubscribe = navigation.addListener('beforeRemove', onPageLeave);

    navigation.setOptions({
      headerRight(props) {
        return <TouchableOpacity
          onPress={updateOnServer}
          disabled={!changesMade}
          activeOpacity={.4}
          style={{
            marginRight: 10,
            backgroundColor: changesMade ? theme.colors.primary : "rgba(0,0,0, .15)",
            paddingVertical: 4, paddingHorizontal: 10, borderRadius: 5
          }}>
          <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>Speichern</Text>
        </TouchableOpacity>
      },
    })

    return () => {
      unsubscribe();
    };
  }, [changesMade, navigation]);

  // console.log("render editor screen")
  useLayoutEffect(() => {
    deletedEventsId = []
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
          <Text style={{ fontSize: 16, fontWeight: "600", color: theme.colors.primary }}>
            {moment().isoWeekday(day).format("dddd")}
          </Text>
        </View>
      },
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 80)
  }, [])

  useEffect(() => {
    finalEvents = events
  }, [events])

  const updateOnServer = async () => {
    if (eventsTimeConflicts) {
      Alert.alert("Fehler im Plan", "Achte darauf dass keine Zeiten sich schneiden")
      return
    }
    const res = await sendUpdatedEvents(finalEvents, deletedEventsId, day)
    if (res.status !== 200) errorHandlerUI(res)
    else {
      setChangesMade(false)
      reduxDispatch(updateSchedule({ day, events: finalEvents }))
    }
  }

  const updateEventsTime = (newTime: string, updatedTime: "start" | "end") => {
    const updatedEvent = { ...selectedEvent } as _Event

    if (updatedTime === "start") {
      updatedEvent.start = { time: newTime, day }
    }
    else if (updatedTime === "end") {
      updatedEvent.end = { time: newTime, day };
    }

    const crossesDay = crossesDay_native(updatedEvent.start.time, updatedEvent.end.time)
    if (crossesDay) updatedEvent.end = { time: updatedEvent.end.time, day: day + 1 }
    else updatedEvent.end = { time: updatedEvent.end.time, day }

    dispatch({ type: "UPDATE", payload: updatedEvent })
    setChangesMade(true)
  };

  const createEvent = () => {
    const id = new Date().getTime().toString()
    dispatch({ type: "CREATE", payload: { id, start: { time: "00:00", day }, end: { time: "01:00", day } } })
    setSelectedEventID(id)
    setChangesMade(true)
  }

  const deleteEvent = () => {
    dispatch({ type: "DELETE", payload: eventToDeleteID! })
    if (eventToDeleteID)
      deletedEventsId.push(eventToDeleteID)
    setChangesMade(true)
  }

  useEffect(() => { if (eventToDeleteID !== undefined) deleteEvent() }, [eventToDeleteID]);

  return (
    <>
      {!loading &&
        <View style={{ flex: 1 }}>
          <TouchableHighlight onPress={() => createEvent()} underlayColor={_colors.primary}
            style={{ backgroundColor: _colors.secondary, position: "absolute", height: 55, aspectRatio: 1, borderRadius: 55 / 2, right: 16, bottom: 16, zIndex: 10, justifyContent: "center", alignItems: "center" }}>
            <Ionicons name='add' style={{ fontSize: 35, color: "white" }} />
          </TouchableHighlight>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: _colors.backgroundEventItem, padding: 16 }}>
            <View style={{}}>
              <TimePicker onChange={(h, m) => updateEventsTime(`${h}:${m}`, "start")} value={selectedEvent && selectedEvent.start.time} />
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={[styles.timerPickerLabel, { backgroundColor: _colors.powerOn }]}>
                  <Ionicons name='power' style={{ color: "white", fontSize: 14 }} />
                  <Text style={{ color: "white", fontSize: 14 }}>Einschalten</Text>
                </View>
              </View>
            </View>
            <View style={{}}>
              <TimePicker onChange={(h, m) => updateEventsTime(`${h}:${m}`, "end")} value={selectedEvent && selectedEvent.end.time} />
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={[styles.timerPickerLabel, { backgroundColor: _colors.powerOff }]}>
                  <Ionicons name='power' style={{ color: "white", fontSize: 14 }} />
                  <Text style={{ color: "white", fontSize: 14 }}>Auschalten</Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView >
            <View style={{ padding: 16 }}>
              {events.map((event, i) => {

                return <EventItem key={event.id} eventsLength={events.length} event={event} i={i}
                  setEventToDeleteID={setEventToDeleteID}
                  setSelectedEventID={setSelectedEventID}
                  selectedEventID={selectedEventID} />
              })}
            </View>
          </ScrollView>
        </View >
      }
    </>
  )
}

const styles = StyleSheet.create({
  timerPickerLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5
  }
})