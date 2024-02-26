import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal, Platform, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import DateTimePicker from '@react-native-community/datetimepicker';
import { applyLocale, displayTitleByLocale } from './src/Locale';
import styles from './src/Style';
import { _Event } from '../../components/types.schedule';
import { ProgressBar, TouchableRipple } from 'react-native-paper';
import theme from '../../theme';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setIsRefreshingCalendar, triggerCalenderRerender } from '../../../redux/slice';
import getEventsFromMap from '../../components/Schedule/utils/getEventsFromMap';
import Progress from 'react-native-progress';
import { ScheduleStackScreenProps } from '../../components/Schedule/StackScreens/types';
import fetchSchedule from '../../components/Schedule/utils/api/fetchSchedule';

interface Props {
    selectedDate: string;
    dateFormat: string;
    startWeekday: number;
    titleFormat: string;
    weekdayFormat: string;
    locale: string;
    renderEvent: (event: _Event, prevEvent: _Event | undefined, weekDayDateMoment: moment.Moment, index: number) => React.ReactNode;
    onDayPress?: (day: any, index: number) => void;
    themeColor: string;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    dayLabelStyle?: React.CSSProperties;
    stackprops: ScheduleStackScreenProps<"EventsCalendar">
}

const WeeklyCalendar = (props: Props) => {
    const [currDate, setCurrDate] = useState(moment(props.selectedDate).locale(props.locale))
    const [selectedDate, setSelectedDate] = useState(currDate.clone())
    const [weekdays, setWeekdays] = useState<moment.Moment[]>([])
    const [weekdayLabels, setWeekdayLabels] = useState<string[]>([])
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
    const dispatch = useAppDispatch()
    const triggerRerender = useAppSelector(state => state.appState.triggerCalenderRerender)
    const isRefreshing = useAppSelector(state => state.appState.isRefreshingCalendar)

    useEffect(() => {
        applyLocale(props.locale, (cancelText: string) => setCancelText(cancelText), (confirmText: string) => setConfirmText(confirmText))
        updateCalendar()
    }, [])
    console.log("hot calender rerender")
    useEffect(() => {
        if (triggerRerender) {
            console.log("rerender calendar")
            updateCalendar()
            dispatch(triggerCalenderRerender(false))
        }
    }, [triggerRerender])

    function updateCalendar() {
        setCalendarReady(false)
        createWeekdays(currDate)
        setCalendarReady(true)
    }

    const createWeekdays = (date: moment.Moment) => {
        const dayViews = []
        const offsets: any[] = []
        setWeekdays([])
        for (let i = 0; i < 7; i++) {
            const weekdayMoment = date.clone().isoWeekday(props.startWeekday + i)

            setWeekdays(weekdays => [...weekdays, weekdayMoment])
            setWeekdayLabels(weekdayLabels => [...weekdayLabels, weekdayMoment.format(props.weekdayFormat)])

            const events: _Event[] = getEventsFromMap(weekdayMoment)
            events.sort((a, b) => {
                const timeA = parseInt(a.start.time.replace(":", ""));
                const timeB = parseInt(b.start.time.replace(":", ""));
                return timeA - timeB;
            });

            let eventViews: React.ReactNode[] = []
            if (props.renderEvent !== undefined) {
                eventViews = events.map((event, ii) => props.renderEvent(event, events[ii - 1], weekdayMoment.clone(), ii))
            } else throw "Please create a Component for renderEvent prop"

            let dayView = <TouchableRipple rippleColor={theme.colors.eventBackground}
                key={i.toString()}
                onPress={onEventPress.bind(this, weekdayMoment.clone().format().toString())}>
                <View style={[styles.dayContainer, { borderBottomWidth: StyleSheet.hairlineWidth }]} onLayout={event => { offsets[i] = event.nativeEvent.layout.y }}>
                    <View style={styles.dayLabel}>
                        <Text style={[styles.dayText, { color: props.themeColor }]}> {weekdayMoment.format(props.weekdayFormat).toString()} </Text>
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

    const onEventPress = (weekDayDate: string) => {
        props.stackprops.navigation.navigate("ScheduleEditor", { weekDayDate });
    }

    const clickLastWeekHandler = () => {
        setCalendarReady(false)
        setTimeout(() => {
            const lastWeekCurrDate = currDate.subtract(7, 'days')
            setSelectedDate(lastWeekCurrDate.clone())
            setCurrDate(lastWeekCurrDate.clone())
            createWeekdays(lastWeekCurrDate.clone())
            setCalendarReady(true)
        }, 0);
    }

    const clickNextWeekHandler = () => {
        setCalendarReady(false)
        const nextWeekCurrDate = currDate.add(7, 'days')
        setTimeout(() => {
            setCurrDate(nextWeekCurrDate.clone())
            setSelectedDate(nextWeekCurrDate.clone())
            createWeekdays(nextWeekCurrDate.clone())
            setCalendarReady(true)
        }, 0);
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
        createWeekdays(pickedDate)

        setCalendarReady(true)
        setPickerVisible(false)
    }

    const onDayPress = (weekday: moment.Moment, i: number) => {
        scrollViewRef.current!.scrollTo({ y: dayViewOffsets![i], animated: true })
        setSelectedDate(weekday.clone())
        if (props.onDayPress !== undefined) props.onDayPress(weekday.clone(), i)
    }

    const isToday = (weekday: moment.Moment) => today == moment(weekday).format(props.dateFormat)

    const onRefresh = async () => {
        const res = await fetchSchedule(dispatch)
        if (res.error) {
            //TODO: handle error
            return
        }
        dispatch(triggerCalenderRerender(true))
    }

    return (
        <View style={[styles.component, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.arrowButton} onPress={clickLastWeekHandler} >
                    <Text style={{ color: props.themeColor, fontSize: 20 }}> {'\u25C0'} </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPickerVisible(true)} style={[styles.titleContainer, { backgroundColor: props.themeColor }]}>
                    <Text style={[styles.title]}>{displayTitleByLocale(props.locale, selectedDate, props.titleFormat)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.arrowButton} onPress={clickNextWeekHandler} >
                    <Text style={{ color: props.themeColor, fontSize: 20 }}> {'\u25B6'} </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.week}>
                <View style={styles.weekdayLabelContainer}>
                    {weekdays.map((weekday, i) => <View style={styles.weekdayLabel} key={i}>
                        <Text style={[styles.weekdayLabelText, isToday(weekday) ? { color: props.themeColor } : {}]}> {weekdays.length > 0 ? weekdayLabels[i] : ''} </Text>
                    </View>)}
                </View>
                <View style={styles.weekdayNumberContainer} >
                    {weekdays.map((weekday, i) => {
                        const isselectedDate = isSelectedDate(weekday)
                        return <TouchableOpacity style={styles.weekDayNumber} onPress={onDayPress.bind(this, weekday, i)} key={i}>
                            <View style={isCalendarReady && isselectedDate ? [styles.weekDayNumberCircle, { backgroundColor: props.themeColor }] : {}}>
                                <Text style={isselectedDate
                                    ? styles.weekDayNumberTextToday : { color: props.themeColor }}>
                                    {isCalendarReady ? weekday.date() : ''}
                                </Text>
                            </View>
                            {isCalendarReady && today == moment(weekday).format(props.dateFormat) &&
                                <View style={isselectedDate ? [styles.dot, { backgroundColor: 'white' }] : [styles.dot, { backgroundColor: props.themeColor }]} />}
                        </TouchableOpacity>
                    })}
                </View>
            </View>
            {/* <View style={{ width: "100%", justifyContent: "center" }}>
                <ProgressBar
                    style={{ height: 1 }}
                    fillStyle={{
                        backgroundColor: theme.colors.primary, height: 1
                    }}
                    indeterminate
                    color={theme.colors.primary}
                />
            </View> */}
            <ScrollView ref={scrollViewRef} style={styles.schedule}
                refreshControl={<RefreshControl
                    refreshing={isRefreshing}
                    colors={[theme.colors.primary, theme.colors.primaryLight]}
                    progressViewOffset={45}
                    onRefresh={onRefresh}
                />}>
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
                </Modal>
            }
            {
                Platform.OS === 'android' && isPickerVisible && <DateTimePicker
                    value={pickerDate.toDate()}
                    display='compact'
                    onChange={pickerOnChange}
                    style={styles.picker}
                />
            }
            {(!isCalendarReady || isLoading) && <ActivityIndicator size='large' color='grey' style={styles.indicator} />}
        </View >
    )

};

WeeklyCalendar.defaultProps = { // All props are optional
    selectedDate: moment(),
    dateFormat: "DD-MM-YYYY",
    startWeekday: 1,
    titleFormat: undefined,
    weekdayFormat: 'dd',
    locale: 'de',
    renderEvent: undefined,
    onDayPress: undefined,
    themeColor: '#46c3ad',
    style: {},
    titleStyle: {},
    dayLabelStyle: {},
};

export default WeeklyCalendar;