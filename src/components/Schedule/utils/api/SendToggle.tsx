import React from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native'


function SendToggle() {

    async function send() {
        try {
            // const uri = "http://85.215.44.199:6500/toggle"
            const uri = "http://192.168.178.64:6500/get-status"
            console.log("requested")
            const res = await (await fetch(uri, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })).json()
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View>

            <TouchableOpacity onPress={send}>
                <View style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Click me</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default SendToggle