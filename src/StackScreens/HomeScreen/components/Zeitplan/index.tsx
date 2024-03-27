import * as React from 'react'
import { Text, View } from 'react-native'
import { Switch } from 'react-native-paper';
import theme from '@/theme';
import EventsTable from './EventsTable';
import { RootStackScreenProps } from '@/StackScreens/types';

const Zeitplan: React.FC<{ stackProps: Partial<RootStackScreenProps<"HomeScreen">> }> = ({ stackProps: { navigation } }) => {
    const [timePlanActive, setTimePlanActive] = React.useState(true);

    return (
        <View style={{ padding: 16, flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
                    <Text style={{ fontWeight: "600", fontSize: 22, color: timePlanActive ? "green" : "black" }}>Zeitplan</Text>
                    <Text style={{ fontSize: 9, color: timePlanActive ? "green" : "orange", marginBottom: 3, borderRadius: 3, paddingHorizontal: 2 }}>
                        {timePlanActive ? "Aktiv" : "Inaktiv"}
                    </Text>
                </View>
                <Switch value={timePlanActive} onValueChange={() => setTimePlanActive(e => !e)} theme={{ colors: { primary: "green" } }} />
            </View>
            <EventsTable stackProps={{ navigation }} />
        </View>
    )
}

export default Zeitplan