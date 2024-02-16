import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import DateTimePicker from '@react-native-community/datetimepicker';
import { applyLocale, displayTitleByLocale } from './src/Locale';
import styles from './src/Style';
import { AnyEvent, EventDetails, Schedule, SpecialEvent, WeeklyEvent, _Event } from '../../components/types';
import { TouchableRipple } from 'react-native-paper';
import theme from '../../theme';
import { StackScreenProps } from '../../Screen/types';
import { useAppDispatch } from '../../../redux/hooks';
import { setSelectedEvents } from '../../../redux/slice';


interface Props {
    selectedDate: string;
    dateFormat: string;
    startWeekday: number;
    titleFormat: string;
    weekdayFormat: string;
    locale: string;
    schedule: Schedule;
    renderEvent: (event: AnyEvent, index: number) => React.ReactNode;
    onDayPress?: (day: any, index: number) => void;
    themeColor: string;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    dayLabelStyle?: React.CSSProperties;
    stackprops: StackScreenProps<"EventsCalendar">
}

const WeeklyCalendar = (props: Props) => {
    const [currDate, setCurrDate] = useState(moment(props.selectedDate).locale(props.locale))
    const [weekdays, setWeekdays] = useState<moment.Moment[]>([])
    const [weekdayLabels, setWeekdayLabels] = useState<string[]>([])
    const [selectedDate, setSelectedDate] = useState(currDate.clone())
    const [isCalendarReady, setCalendarReady] = useState(false)
    const [pickerDate, setPickerDate] = useState(currDate.clone())
    const [isPickerVisible, setPickerVisible] = useState(false)
    const [cancelText, setCancelText] = useState('')
    const [confirmText, setConfirmText] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [scheduleView, setScheduleView] = useState<React.ReactNode[] | undefined>(undefined)
    const [dayViewOffsets, setDayViewOffsets] = useState<any[] | undefined>(undefined)
    const [today] = useState(moment().format(props.dateFormat))
    const scrollViewRef = useRef<ScrollView>(null)
    const [eventsToEdit, setEventsToEdit] = useState<EventDetails[] | undefined>(undefined)
    const [weekDayToEdit, setWeekDayToEdit] = useState<moment.Moment | undefined>(undefined)
    const dispatch = useAppDispatch()

    useEffect(() => {
        applyLocale(props.locale, (cancelText: string) => setCancelText(cancelText), (confirmText: string) => setConfirmText(confirmText))
        updateCalendar()
    }, [])

    function updateCalendar() {
        setCalendarReady(false)
        createWeekdays(currDate, props.schedule)
        setCalendarReady(true)
    }

    const createWeekdays = (date: moment.Moment, schedule: Schedule) => {
        const dayViews = []
        const offsets: any[] = []
        setWeekdays([])
        for (let i = 0; i < 7; i++) {
            const weekdayToAddMoment = date.clone().isoWeekday(props.startWeekday + i)

            setWeekdays(weekdays => [...weekdays, weekdayToAddMoment])
            setWeekdayLabels(weekdayLabels => [...weekdayLabels, weekdayToAddMoment.format(props.weekdayFormat)])

            // render schedule view
            const weekDay = weekdayToAddMoment.isoWeekday()
            const weekdayToAdd_date = weekdayToAddMoment.format(props.dateFormat)
            const events: Array<_Event> = schedule.filter(weeklyEvent => weeklyEvent.start.day == weekDay && !weeklyEvent.excludedDays?.includes(weekdayToAdd_date))
            schedule.specialDays && schedule.specialDays.forEach(specialEvent => moment(specialEvent.start.date, props.dateFormat).format(props.dateFormat) == weekdayToAdd_date && events.push(specialEvent))
            let eventViews: React.ReactNode[] = []

            events.sort((a, b) => {
                const timeA = parseInt(a.start.time.replace(":", ""));
                const timeB = parseInt(b.start.time.replace(":", ""));
                return timeA - timeB;
            });

            if (props.renderEvent !== undefined) {
                eventViews = events.map((event, ii) => {
                    // @ts-ignore
                    event["prevEvent"] = event[ii - 1]
                    return props.renderEvent(event, ii)
                })
            } else throw "Please create an Event Element for renderEvent prop"
            let dayView = <TouchableRipple rippleColor={theme.colors.primary}
                key={i.toString()}
                onPress={onEventPress.bind(this, events, weekdayToAddMoment.format().toString())}>
                <View style={[styles.dayContainer, { borderBottomWidth: StyleSheet.hairlineWidth }]} onLayout={event => { offsets[i] = event.nativeEvent.layout.y }}>
                    <View style={styles.dayLabel}>
                        <Text style={[styles.dayText, { color: props.themeColor }]}> {weekdayToAddMoment.format(props.weekdayFormat).toString()} </Text>
                    </View>
                    <View style={[styles.allEvents, { margin: .4, }]}>
                        {eventViews}
                    </View>
                </View>
            </TouchableRipple>
            dayViews.push(dayView)
        }
        setScheduleView(dayViews)
        setDayViewOffsets(offsets)
    }

    const onEventPress = (eventDetails: any[], weekDayDate: string) => {
        dispatch(setSelectedEvents({ events: eventDetails, weekDayDate }));
        props.stackprops.navigation.navigate("ScheduleEditor", {});
    }

    console.log(moment().)
    const clickLastWeekHandler = () => {
        setCalendarReady(false)
        const lastWeekCurrDate = currDate.subtract(7, 'days')
        setCurrDate(lastWeekCurrDate.clone())
        setSelectedDate(lastWeekCurrDate.clone().weekday(props.startWeekday - 7))
        createWeekdays(lastWeekCurrDate.clone(), props.schedule)
        setCalendarReady(true)
    }

    const clickNextWeekHandler = () => {
        setCalendarReady(false)
        const nextWeekCurrDate = currDate.add(7, 'days')
        setCurrDate(nextWeekCurrDate.clone())
        setSelectedDate(nextWeekCurrDate.clone().weekday(props.startWeekday - 7))
        createWeekdays(nextWeekCurrDate.clone(), props.schedule)
        setCalendarReady(true)
    }

    const isSelectedDate = (date: moment.Moment) => {
        return (selectedDate.year() === date.year() && selectedDate.month() === date.month() && selectedDate.date() === date.date())
    }

    const pickerOnChange = (_event, pickedDate) => {
        if (Platform.OS === 'android') {
            setPickerVisible(false)
            if (pickedDate !== undefined) {
                const pickedDateMoment = moment(pickedDate).locale(props.locale)
                if (currDate.clone().format("DD-MM-YYYY") !== pickedDateMoment.clone().format("DD-MM-YYYY")) {
                    setLoading(true)
                    setTimeout(() => {
                        setPickerDate(pickedDateMoment)
                        confirmPickerHandler(pickedDateMoment)
                        setLoading(false)
                    }, 0);
                }
            }
        }
        else setPickerDate(moment(pickedDate).locale(props.locale))
    }

    const confirmPickerHandler = pickedDate => {
        setCurrDate(pickedDate)
        setSelectedDate(pickedDate)

        setCalendarReady(false)
        createWeekdays(pickedDate, props.schedule)

        setCalendarReady(true)
        setPickerVisible(false)
    }

    const onDayPress = (weekday: moment.Moment, i: number) => {
        scrollViewRef.current!.scrollTo({ y: dayViewOffsets![i], animated: true })
        setSelectedDate(weekday.clone())
        if (props.onDayPress !== undefined) props.onDayPress(weekday.clone(), i)
    }

    return (
        <View style={[styles.component, { backgroundColor: theme.colors.background }]} >
            <View style={styles.header}>
                <TouchableOpacity style={styles.arrowButton} onPress={clickLastWeekHandler} >
                    <Text style={{ color: props.themeColor, fontSize: 20 }}> {'\u25C0'} </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPickerVisible(true)} style={[styles.titleContainer, { backgroundColor: props.themeColor }]}>
                    <Text style={[styles.title]}>{isCalendarReady && displayTitleByLocale(props.locale, selectedDate, props.titleFormat)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.arrowButton} onPress={clickNextWeekHandler} >
                    <Text style={{ color: props.themeColor, fontSize: 20 }}> {'\u25B6'} </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.week}>
                <View style={styles.weekdayLabelContainer}>
                    {weekdays.map((weekday, i) => <View style={styles.weekdayLabel} key={i}>
                        <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}> {weekdays.length > 0 ? weekdayLabels[i] : ''} </Text>
                    </View>)}
                </View>
                <View style={styles.weekdayNumberContainer} >
                    {weekdays.map((weekday, i) => <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekday, i)} key={i}>
                        <View style={isCalendarReady && isSelectedDate(weekday) ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : {}}>
                            <Text style={isCalendarReady && isSelectedDate(weekday) ? styles.weekDayNumberTextToday : { color: props.themeColor }}>
                                {isCalendarReady ? weekday.date() : ''}
                            </Text>
                        </View>
                        {isCalendarReady && today == moment(weekday).format(props.dateFormat) &&
                            <View style={isSelectedDate(weekday) ? [styles.dot, { backgroundColor: 'white' }] : [styles.dot, { backgroundColor: props.themeColor }]} />}
                    </TouchableOpacity>)}
                </View>
            </View>
            <ScrollView ref={scrollViewRef} style={styles.schedule}>
                {scheduleView}
            </ScrollView>
            {
                Platform.OS === 'ios' && <Modal
                    transparent={true}
                    animationType='fade'
                    visible={isPickerVisible}
                    onRequestClose={() => setPickerVisible(false)
                    } // for android only
                    style={styles.modal}
                >
                    <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
                        <View style={styles.blurredArea} />
                    </TouchableWithoutFeedback>
                    <View style={styles.pickerButtons} >
                        <TouchableOpacity style={styles.modalButton} onPress={() => setPickerVisible(false)}>
                            <Text style={styles.modalButtonText}> {cancelText} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={confirmPickerHandler.bind(this, pickerDate)} >
                            <Text style={styles.modalButtonText}> {confirmText} </Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        value={pickerDate.toDate()}
                        onChange={pickerOnChange}
                        style={styles.picker}
                    />
                </Modal>}
            {
                Platform.OS === 'android' && isPickerVisible && <DateTimePicker
                    value={pickerDate.toDate()}
                    display='compact'
                    onChange={pickerOnChange}
                    style={styles.picker}
                />}
            {/* <EventsEditorModal control={{ modalOpen: modalOpen, closeModal: () => setModal(false) }} events={eventsToEdit!} weekDayDate={weekDayToEdit!} /> */}
            {(!isCalendarReady || isLoading) && <ActivityIndicator size='large' color='grey' style={styles.indicator} />}
        </View>
    )

};

WeeklyCalendar.defaultProps = { // All props are optional
    selectedDate: moment(),
    dateFormat: "DD-MM-YYYY",
    startWeekday: 1,
    titleFormat: undefined,
    weekdayFormat: 'dd',
    locale: 'de',
    schedule: undefined,
    renderEvent: undefined,
    onDayPress: undefined,
    themeColor: '#46c3ad',
    style: {},
    titleStyle: {},
    dayLabelStyle: {},
};

export default WeeklyCalendar;