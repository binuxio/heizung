import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    component: {
        width: Dimensions.get('window').width,
        height: "100%",
        alignItems: 'center',
        borderColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    arrowButton: {
        paddingHorizontal: 10,
    },
    titleContainer: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 2
    },
    title: {
        color: 'white',
        fontWeight: 'bold'
    },
    week: {
        width: '100%',
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 5
    },
    weekdayLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    weekdayLabel: {
        flex: 1,
        alignItems: 'center'
    },
    weekdayLabelText: {
        color: 'grey'
    },
    weekdayNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },
    weekDayNumber: {
        flex: 1,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    weekDayNumberCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
    },
    weekDayNumberTextToday: {
        color: 'white'
    },
    schedule: {
        width: '100%'
    },
    pickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    picker: {
        backgroundColor: 'white',
        paddingBottom: 20
    },
    modal: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    blurredArea: {
        flex: 1,
        opacity: 0.7,
        backgroundColor: 'black'
    },
    modalButton: {
        padding: 15
    },
    modalButtonText: {
        fontSize: 20
    },
    indicator: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        position: 'absolute'
    },
    dayContainer: {
        flexDirection: 'row',
        borderColor: 'grey',
    },
    dayLabel: {
        width: '15%',
        display: "flex",
        alignItems: 'center',
        justifyContent: "center",
        padding: 10,
        borderRightColor: 'grey',
        borderRightWidth: StyleSheet.hairlineWidth,
    },
    monthDateText: {
        fontSize: 11
    },
    dayText: {
        fontSize: 18
    },
    allEvents: {
        width: '85%',
    },
    event: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    eventDuration: {
        width: '30%',
        justifyContent: 'center'
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    durationDot: {
        width: 4,
        height: 4,
        backgroundColor: 'grey',
        marginRight: 5,
        alignSelf: 'center',
        borderRadius: 4 / 2,
    },
    durationDotConnector: {
        height: 20,
        borderLeftColor: 'grey',
        borderLeftWidth: StyleSheet.hairlineWidth,
        position: 'absolute',
        left: 2
    },
    durationText: {
        color: 'grey',
        fontSize: 12
    },
    eventNote: {
    },
    lineSeparator: {
        width: '100%',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    dot: {
        width: 4,
        height: 4,
        marginTop: 1,
        alignSelf: 'center',
        borderRadius: 4 / 2,
        position: 'absolute',
        bottom: 2
    }
});

export default styles;