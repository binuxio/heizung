import theme from '@/theme';
import moment from 'moment';
import React, { FC, memo, useEffect, useLayoutEffect, useState } from 'react'
import { View } from 'react-native';
import WheelPicker from 'react-native-wheely';

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

/**
 * valueFormat: HH:mm (string)
*/
const TimePicker: FC<{ onChange: (hours: string, minutes: string) => void, value?: string }> = ({ onChange, value }) => {
    const [selectedHour, setSelectedHour] = useState<string | undefined>(undefined);
    const [selectedMinute, setSelectedMinute] = useState<string | undefined>(undefined);

    console.log("rerender time")
    useEffect(() => {
        console.log(value)
        if (!value) return
        const [hour, minute] = value.split(":");
        setSelectedHour(hour || "00");
        setSelectedMinute(minute || "00");
    }, [value]);



    return (
        <View style={{ flexDirection: "row", gap: 5 }}>
            {
                selectedHour && selectedMinute
                    ? <>
                        <WheelPicker
                            key={"value-1"}
                            selectedIndex={parseInt(selectedHour) || 0}
                            options={hours}
                            itemTextStyle={{ fontSize: 25, color: theme.colors.primary }}
                            onChange={(index) => {
                                const hour = hours[index]
                                if (hour === selectedHour) return
                                setSelectedHour(hour);
                                onChange(hour, selectedMinute)
                            }}
                        />
                        <Dots />
                        <WheelPicker
                            key={"value-2"}
                            selectedIndex={parseInt(selectedMinute) || 0}
                            options={minutes}
                            itemTextStyle={{ fontSize: 25, color: theme.colors.primary }}
                            onChange={(index) => {
                                const minute = minutes[index]
                                if (minute === selectedMinute) return
                                setSelectedMinute(minute);
                                onChange(selectedHour, minute)
                            }}
                        />
                    </>
                    : <>
                        <WheelPicker
                            key={"undefined-1"}
                            selectedIndex={0}
                            options={["--"]}
                            itemTextStyle={{ fontSize: 25, color: theme.colors.primary }}
                            onChange={() => null}
                        />
                        <Dots />
                        <WheelPicker
                            key={"undefined-2"}
                            selectedIndex={0}
                            options={["--"]}
                            itemTextStyle={{ fontSize: 25, color: theme.colors.primary }}
                            onChange={() => null}
                        />
                    </>
            }
        </View>
    );
}

export default memo(TimePicker)


const dotSize = 4
const Dots = () => <View style={{ gap: dotSize, justifyContent: "center" }}>
    <View style={{ height: dotSize, aspectRatio: 1, borderRadius: dotSize / 2, backgroundColor: theme.colors.primary, opacity: .6 }} />
    <View style={{ height: dotSize, aspectRatio: 1, borderRadius: dotSize / 2, backgroundColor: theme.colors.primary, opacity: .6 }} />
</View>