import * as React from 'react'
import { ActivityIndicator, Button, Pressable, Text, View } from 'react-native'
import { Switch } from 'react-native-paper';
import theme, { _colors } from '@/theme';
import EventsTable from './EventsTable';
import { RootStackScreenProps } from '@/StackScreens/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import fetchSchedule from '@/api/schedule/fetchSchedule';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import errorHandlerUI from '@/components/UI/errorHandlerUI';

const Zeitplan: React.FC<{ stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = ({ stackProps: { navigation } }) => {
    const [timePlanActive, setTimePlanActive] = React.useState(true);
    const [isFetching, setIsFetching] = React.useState(false)
    const isFetchingSchedule = useAppSelector(state => state.appState.isFetchingSchedule)
    const dispatch = useAppDispatch()

    const refetchSchedule = async () => {
        const res = await fetchSchedule(dispatch)
        errorHandlerUI(res)
    }

    React.useEffect(() => {
        if (isFetchingSchedule) setIsFetching(true)
        else {
            setTimeout(() => {
                setIsFetching(false)
            }, 1000);
        }
    }, [isFetchingSchedule])

    return (
        <View style={{ padding: 16, flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
                    <Text style={{ fontWeight: "600", fontSize: 22, color: timePlanActive ? "green" : "black" }}>Zeitplan</Text>
                    <Text style={{ fontSize: 9, color: timePlanActive ? "green" : "orange", marginBottom: 3, borderRadius: 3, paddingHorizontal: 2 }}>
                        {timePlanActive ? "Aktiv" : "Inaktiv"}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                    {isFetching ?
                        <ActivityIndicator size={25} color={_colors.primary} /> :
                        <Pressable style={{}} onPress={() => refetchSchedule()} >
                            <MaterialCommunityIcons name='refresh' size={25} color={"gray"} />
                        </Pressable>
                    }
                    <Switch value={timePlanActive} onValueChange={() => setTimePlanActive(e => !e)} theme={{ colors: { primary: "green" } }} />
                </View>
            </View >
            <EventsTable stackProps={{ navigation }} />
        </View >
    )
}

export default Zeitplan