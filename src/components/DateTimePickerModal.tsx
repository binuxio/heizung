import React, { Dispatch, SetStateAction, useState } from 'react'
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
// import { DatePickeMultipleProps, DatePickerRangeProps, DatePickerSingleProps } from 'react-native-ui-datepicker/lib/typescript/src/DateTimePicker';
import { StatusBar } from 'expo-status-bar';
import theme from '../theme';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimePickerModal: React.FC<{ isVisible: boolean, onClose: Dispatch<SetStateAction<boolean>> } & { props: any }>
    = ({ isVisible, props, onClose }) => {
        if (!isVisible) return

        const [date, setDate] = useState(dayjs());
        const [time, setTime] = useState()
        const [showDatePicker, setShowDatePicker] = useState(false)

        const onChangeDatePicker = () => {
            onClose(false)
        }

        return <View style={{ flex: 1, position: "absolute", height: "100%", width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
                <View>
                    <Text>12:09</Text>
                </View>
                <View>
                    <Text>Februar</Text>
                </View>
            </View>
            <DateTimePicker
                onTouchCancel={(props) => console.log(props)}
                value={new Date()}
                disabled={true}
                is24Hour
                mode={showDatePicker ? "date" : "time"}
                onChange={onChangeDatePicker}
            />
        </View>


        return (
            <Modal transparent visible={isVisible} animationType="fade">
                <TouchableWithoutFeedback onPress={() => onClose(false)}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 40, width: "100%" }}>
                        <View style={{ backgroundColor: "white", borderRadius: 10, padding: 15, width: "100%" }}>
                            <DateTimePicker
                                firstDayOfWeek={1}
                                locale={"de"}
                                displayFullDays
                                date={date}
                                timePicker
                                mode='single'

                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

export default DateTimePickerModal

const styles = StyleSheet.create({
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
})