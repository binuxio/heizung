import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicon from "react-native-vector-icons/Ionicons"
import Svg, { Path } from 'react-native-svg';


const DeviceStatus = () => {
    const [deviceStatus, setDeviceStatus] = useState<"undefined" | "unreachable" | "active" | "loading">("active")
    if (deviceStatus === "loading")
        return <ActivityIndicator color={"white"}></ActivityIndicator>

    if (deviceStatus === "undefined")
        return <View style={style.container}>
            <Ionicon name="radio-button-on" style={{ color: "red", alignSelf: "center", fontSize: 17 }} />
            <Text style={styles.cellText}>
                Nicht erreichbar
            </Text>
        </View>

    if (deviceStatus === "unreachable")
        return <View style={style.container}>
            <Ionicon name="radio-button-on" style={{ color: "red", alignSelf: "center", fontSize: 17 }} />
            <Text style={styles.cellText}>
                Nicht erreichbar
            </Text>
        </View>

    if (deviceStatus === "active")
        return <View style={style.container}>
            <Ionicon name="radio-button-on" style={{ color: "limegreen", alignSelf: "center", fontSize: 17 }} />
            <Text style={styles.cellText}>
                Aktiv
            </Text>
        </View>
}

const HeizungStatus = () => {
    const [deviceStatus, setDeviceStatus] = useState<"undefined" | "on" | "off">("on")

    if (deviceStatus === "undefined")
        return <Text style={styles.cellText}>-</Text>

    if (deviceStatus === "on")
        return <View style={style.container}>
            <Svg fill="red" width="18px" height="18px" viewBox="0 0 32 22">
                <Path d="M7.071 15.386c-0.749-0.769-1.424-1.618-2.008-2.53l-0.038-0.064c-0.848-1.685-1.345-3.672-1.345-5.775 0-0.925 0.096-1.828 0.279-2.698l-0.015 0.085c0.005-0.031 0.007-0.067 0.007-0.103 0-0.414-0.336-0.75-0.75-0.75-0.385 0-0.702 0.29-0.745 0.664l-0 0.003c-0.176 0.847-0.277 1.821-0.277 2.818 0 2.375 0.573 4.615 1.588 6.592l-0.038-0.081c0.678 1.071 1.414 2.002 2.235 2.849l-0.004-0.005c0.611 0.642 1.186 1.335 1.712 2.066l0.040 0.058c1.047 1.61 1.669 3.579 1.669 5.694 0 1.13-0.178 2.219-0.507 3.24l0.021-0.075c-0.021 0.067-0.034 0.143-0.034 0.223 0 0.335 0.219 0.618 0.522 0.715l0.005 0.001c0.067 0.020 0.143 0.033 0.222 0.033h0c0 0 0.001 0 0.001 0 0.334 0 0.618-0.219 0.713-0.522l0.001-0.005c0.36-1.085 0.567-2.334 0.567-3.631 0-2.423-0.724-4.678-1.967-6.559l0.028 0.044c-0.608-0.851-1.226-1.597-1.891-2.298l0.009 0.009zM16.526 15.446c-0.906-0.931-1.723-1.959-2.43-3.063l-0.046-0.077c-1.031-2.043-1.635-4.453-1.635-7.004 0-1.117 0.116-2.207 0.336-3.258l-0.018 0.103c0.003-0.024 0.004-0.052 0.004-0.081 0-0.414-0.336-0.75-0.75-0.75-0.377 0-0.689 0.278-0.742 0.641l-0 0.004c-0.211 1.010-0.331 2.171-0.331 3.36 0 2.823 0.68 5.487 1.885 7.837l-0.045-0.097c0.809 1.277 1.687 2.386 2.666 3.397l-0.005-0.005c0.737 0.775 1.43 1.61 2.065 2.491l0.048 0.070c1.271 1.956 2.026 4.348 2.026 6.916 0 1.373-0.216 2.696-0.616 3.936l0.025-0.091c-0.021 0.066-0.034 0.143-0.034 0.222 0 0.335 0.219 0.619 0.522 0.716l0.005 0.001c0.067 0.021 0.143 0.033 0.222 0.033h0c0 0 0.001 0 0.001 0 0.335 0 0.618-0.219 0.714-0.522l0.001-0.005c0.427-1.288 0.673-2.771 0.673-4.312 0-2.877-0.858-5.554-2.332-7.788l0.033 0.053c-0.725-1.013-1.461-1.903-2.254-2.739l0.010 0.011zM27.826 17.874c-0.608-0.85-1.225-1.596-1.89-2.297l0.009 0.009c-0.749-0.77-1.424-1.62-2.009-2.533l-0.038-0.064c-0.849-1.684-1.346-3.67-1.346-5.773 0-0.925 0.096-1.827 0.279-2.698l-0.015 0.085c0.004-0.028 0.006-0.061 0.006-0.094 0-0.414-0.336-0.75-0.75-0.75-0.381 0-0.696 0.284-0.744 0.652l-0 0.004c-0.177 0.847-0.278 1.821-0.278 2.819 0 2.374 0.573 4.615 1.589 6.59l-0.038-0.081c0.678 1.073 1.414 2.005 2.237 2.853l-0.004-0.004c0.611 0.642 1.185 1.333 1.71 2.063l0.040 0.058c1.046 1.609 1.669 3.578 1.669 5.692 0 1.131-0.178 2.22-0.508 3.242l0.021-0.075c-0.021 0.066-0.034 0.143-0.034 0.222 0 0.335 0.219 0.619 0.522 0.716l0.005 0.001c0.065 0.021 0.14 0.033 0.218 0.033 0.002 0 0.003 0 0.005 0h-0c0 0 0.001 0 0.001 0 0.335 0 0.618-0.219 0.714-0.522l0.001-0.005c0.359-1.084 0.566-2.332 0.566-3.629 0-2.424-0.724-4.679-1.966-6.561l0.028 0.045z" />
            </Svg>
            <Text style={styles.cellText}>
                Ein
            </Text>
        </View>

    if (deviceStatus === "off")
        return <View style={style.container}>
            <Ionicon name="snow" style={{ color: "white", alignSelf: "center", fontSize: 17 }} />
            <Text style={styles.cellText}>
                Aus
            </Text>
        </View>
}

const StatusTable = () => {
    return (
        <View style={styles.container}>
            <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                    <Text style={styles.cellText}>Gerätestatus:</Text>
                </View>
                <View style={styles.tableCell}>
                    <DeviceStatus />
                </View>
            </View>

            <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                    <Text style={styles.cellText}>Heizung:</Text>
                </View>
                <View style={styles.tableCell}>
                    <HeizungStatus />
                </View>
            </View>

            <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                    <Text style={styles.cellText}>Nächstes Einschalten:</Text>
                </View>
                <View style={styles.tableCell}>
                    <Text style={styles.cellText}>23. Jan, 13:00 Uhr</Text>
                </View>
            </View>

            <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                    <Text style={styles.cellText}>Nächstes Auschalten:</Text>
                </View>
                <View style={styles.tableCell}>
                    <Text style={styles.cellText}>23. Jan, 18:00 Uhr</Text>
                </View>
            </View>
        </View>
    );
};
export default StatusTable;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#0284c7",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableCell: {
        flex: 1,
        padding: 2.5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    cellText: {
        color: "white",
        fontSize: 17,
    }
});

const style = StyleSheet.create({
    container: { display: "flex", flexDirection: "row", gap: 5 },
})