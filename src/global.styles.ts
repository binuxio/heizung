import { StyleSheet } from "react-native";

const eventItemStyles = StyleSheet.create({
    screenContainer: {
        height: "100%"
    },
    event: {
        marginBottom: 7
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        paddingHorizontal: 10,
    },
    timeContainer: {
        flexDirection: "row",
        gap: 20
    },
    timeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white",
        paddingHorizontal: 10,
        borderRadius: 7
    },
    powerIcon: {
        fontSize: 18
    },
    durationText: {
        fontSize: 18
    },
    loadingContainer: {

    },
    indicator: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        position: 'absolute'
    },
});

export { eventItemStyles }