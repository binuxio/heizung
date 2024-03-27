import { _Event } from '@/types/schedule.types'
import React, { memo, useEffect, useLayoutEffect, useReducer, useState } from 'react'
import { Alert, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { RootStackScreenProps } from '../types'
import theme, { _colors } from '@/theme'
import { Ionicons, } from '@expo/vector-icons'
import moment from 'moment'
import "moment/locale/de"
import TimePicker from './components/TimePicker'
import eventReducer from './components/eventReducer'
import EventItem from './components/EventItem'
import sortEvents from '@/utils/Schedule/sortEvents'
import { useAlert } from '@/components/UI/_AlertPaperProvider'
import sendUpdatedEvents from '@/api/sendUpdatedEvents'
import errorHandlerUI from '@/components/UI/errorHandlerUI'

export default function EventEditorScreen({ navigation, route }: RootStackScreenProps<"EventEditorScreen">) {
  const { events: _events, selectedEventID: _selectedEventID, day } = route.params
  const [eventToDeleteID, setEventToDeleteID] = useState<undefined | string>(undefined)
  const [selectedEventID, setSelectedEventID] = useState<undefined | string>(_selectedEventID)
  const [loading, setLoading] = useState(true)
  const [{ events }, dispatch] = useReducer<typeof eventReducer>(eventReducer, { events: [..._events] })
  const selectedEvent = events.find(event => event.id === selectedEventID)
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
              text: "Verwerfen",
              // buttonStyle: { fontSize: 13, textDecorationLine: "underline" },
              onPress() {
                // if (eventsUpdateSuccess) updateCalendar()
                navigation.dispatch(ev.data.action);
              },
            },
            {
              text: "Abbrechen"
            }
          ]
        })
      } /* else if (eventsUpdateSuccess) updateCalendar() */
    };

    const updateCalendar = async () => {
      try {
        // const res = await fetchSchedule(dispatch)
        // errorHandlerUI(res)
      } catch (error) { }
      setTimeout(() => {
        // dispatch(triggerCalenderRerender(true))
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
            backgroundColor: changesMade ? theme.colors.eventBackground : "rgba(0,0,0, .15)",
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

  console.log("render editor screen")
  useLayoutEffect(() => {
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
            {moment().set("day", day + 1).locale("de").format("dddd")}
          </Text>
        </View>
      },
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      // setEvents([...state.events])
      setLoading(false)
    }, 80)
  }, [])

  const updateOnServer = async () => {
    if (true) {
      Alert.alert("Der Zeitplan enthält Fehler", "Achte darauf dass keine Zeiten sich überlappen")
      return
    }
    return
    const res = await sendUpdatedEvents(events, day)
    if (res.status != 200) {
      errorHandlerUI(res)
      return
    }
    setChangesMade(false)
  }

  const updateEvent = (newTime: string, updatedTime: "start" | "end") => {
    const updatedEvent = { ...selectedEvent } as _Event

    if (updatedTime === "start")
      updatedEvent.start = { time: newTime, day }
    else if (updatedTime === "end")
      updatedEvent.end = { time: newTime };

    dispatch({ type: "UPDATE", payload: updatedEvent });
    setChangesMade(true)
  };

  const createEvent = () => {
    const id = new Date().getTime().toString()
    dispatch({ type: "CREATE", payload: { id: id, start: { time: "00:00", day }, end: { time: "00:00" } } })
    setSelectedEventID(id)
    setChangesMade(true)
  }

  const deleteEvent = () => {
    console.log("requested deletion")
    dispatch({ type: "DELETE", payload: eventToDeleteID! })

    setEventToDeleteID(undefined)
    setChangesMade(true)
  }

  useEffect(() => { if (eventToDeleteID !== undefined) deleteEvent() }, [eventToDeleteID]);

  return (
    <>
      {!loading &&
        <View style={{ flex: 1 }}>
          <TouchableHighlight onPress={() => createEvent()} underlayColor={_colors.secondary} activeOpacity={.2}
            style={{ backgroundColor: _colors.primary, position: "absolute", height: 55, aspectRatio: 1, borderRadius: 55 / 2, right: 16, bottom: 16, zIndex: 10, justifyContent: "center", alignItems: "center" }}>
            <Ionicons name='add' style={{ fontSize: 35, color: "white" }} />
          </TouchableHighlight>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: _colors.background, padding: 16 }}>
            <View style={{}}>
              <TimePicker onChange={(h, m) => updateEvent(`${h}:${m}`, "start")} value={selectedEvent && selectedEvent.start.time} />
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ backgroundColor: "green", color: "white", fontSize: 14, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 }}>Einschalten</Text>
              </View>
            </View>
            <View style={{}}>
              <TimePicker onChange={(h, m) => updateEvent(`${h}:${m}`, "end")} value={selectedEvent && selectedEvent.end.time} />
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ backgroundColor: "orange", color: "white", fontSize: 14, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 }}>Auschalten</Text>
              </View>
            </View>
          </View>
          <ScrollView>
            <View style={{ padding: 16 }}>
              {events.map((event, i) => {

                return <EventItem key={i} eventsLength={events.length} event={event} i={i}
                  setEventToDeleteID={setEventToDeleteID}
                  setSelectedEventID={setSelectedEventID}
                  eventToDeleteID={eventToDeleteID}
                  selectedEventID={selectedEventID} />
              })}
            </View>
          </ScrollView>
        </View >
      }
    </>
  )
}

