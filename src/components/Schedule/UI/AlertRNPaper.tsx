import * as React from 'react';
import { Alert, TextStyle, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import theme from '../../../theme';
import { ViewStyle } from 'react-native';

interface Props {
    title: string
    titleStyle?: TextStyle,
    message?: string | undefined
    messageStyle?: TextStyle,
    isVisible: boolean
    actions: DialogAction[]
}

interface DialogAction {
    text: string
    buttonStyle?: TextStyle,
    onPress: () => void
}

const AlertRNPaper: React.FC<Props> = ({ title, message = null, titleStyle, messageStyle, actions = [], isVisible = false }) => {

    const DialogActions = () => {
        return <Dialog.Actions>
            {actions.map((action, i) =>
                <TouchableOpacity activeOpacity={.7} onPress={action.onPress} key={i}>
                    <Text style={action.buttonStyle}>
                        {action.text}
                    </Text>
                </TouchableOpacity>)}
        </Dialog.Actions>
    }

    return (
        <View>
            <Portal>
                <Dialog
                    dismissable={false}
                    style={{ backgroundColor: "white" }}
                    visible={!isVisible}>
                    <Dialog.Title style={titleStyle}>{title}</Dialog.Title>
                    {message &&
                        <Dialog.Content >
                            <Text style={messageStyle}>
                                {message}
                            </Text>
                        </Dialog.Content>
                    }
                    <DialogActions />
                </Dialog>
            </Portal>
        </View>
    );
};

export default AlertRNPaper;