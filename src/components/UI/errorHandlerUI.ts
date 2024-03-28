import { Alert } from "react-native";
import { _Response } from "@/api/types";
import { NetInfoConnectedDetails, NetInfoState } from "@react-native-community/netinfo";

export default function (res: _Response, netinfo: NetInfoState | null = null) {
    if (res.status === 200) return

    if (netinfo) {
        if (!netinfo.isInternetReachable) res.status = "ERR_NETWORK"
    }

    if (res.status != 200) {
        console.log(res)
        if (res.status == 404)
            Alert.alert("Fehler - 404", res.error)
        else if (res.status == 500)
            Alert.alert("Interner Serverfehler", res.error || "Fehler Unbekannt");
        else if (res.status == "ERR_NETWORK")
            Alert.alert("Netzwerkfehler", res.error || "Fehler Unbekannt");
        else if (res.status == "ECONNABORTED")
            Alert.alert("Zeitüberschreitung", "Server konnte nicht erreicht werden");
        else if (res.status == "CLIENT_ERROR")
            Alert.alert("Ein unerwarteter Fehler ist aufgetreten", res.error || "Fehler Unbekannt");
    }
}