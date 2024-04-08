import * as React from 'react'
import { ActivityIndicator, Button, Pressable, Text, View } from 'react-native'
import { Switch } from 'react-native-paper';
import theme, { _colors } from '@/theme';
import EventsTable from './EventsTable';
import { RootStackScreenProps } from '@/StackScreens/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import fetchSchedule from '@/api/schedule/fetchSchedule';
import { useAppDispatch, useAppSelector } from '@/storage/redux/hooks';
import errorHandlerUI from '@/components/UI/errorHandlerUI';
import { setScheduleEnabled } from '@/storage/redux/slice.appData';
import sendScheduleEnabledState from '@/api/device/sendScheduleEnabledState';
import fetchDeviceState from '@/api/device/fetchDeviceState';

const Zeitplan: React.FC<{ stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = ({ stackProps: { navigation } }) => {
    const { schedule_enabled } = useAppSelector(state => state.appData.deviceState)
    const isFetchingSchedule = useAppSelector(state => state.appState.isFetchingSchedule)
    const dispatch = useAppDispatch()

    const refetchData = async () => {
        const res = await fetchSchedule(dispatch)
        errorHandlerUI(res)

        const res2 = await fetchDeviceState(dispatch)
        errorHandlerUI(res2)
    }

    const toggleSchedule = async () => {
        const res = await sendScheduleEnabledState(!schedule_enabled)
        if (res.status != 200) {
            errorHandlerUI(res)
            return
        }
        dispatch(setScheduleEnabled(!schedule_enabled))
    }

    return (
        <View style={{ paddingTop: 0, flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ fontWeight: "600", fontSize: 22 }}>Zeitplan</Text>
                    <Text style={{ fontSize: 12, backgroundColor: schedule_enabled ? "green" : "orange", color: "white", borderRadius: 3, paddingHorizontal: 3, lineHeight: 17 }}>
                        {schedule_enabled ? "Aktiv" : "Inaktiv"}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                    {isFetchingSchedule ?
                        <ActivityIndicator size={25} color={_colors.primary} /> :
                        <Pressable style={{}} onPress={() => refetchData()} >
                            <MaterialCommunityIcons name='refresh' size={25} color={"gray"} />
                        </Pressable>
                    }
                    <Switch value={schedule_enabled} onValueChange={toggleSchedule} theme={{ colors: { primary: "green" } }} />
                </View>
            </View >
            <EventsTable stackProps={{ navigation }} />
        </View >
    )
}

export default Zeitplan