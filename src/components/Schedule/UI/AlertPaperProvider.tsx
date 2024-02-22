import * as React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import { TextStyle } from 'react-native';
import theme from '../../../theme';

interface DialogButtonAction {
    text: string;
    buttonStyle?: TextStyle;
    onPress?: () => void;
}

interface AlertContextProps {
    showAlert: (config: AlertConfig) => void;
    setConfig: (config: AlertConfig) => void;
}

interface AlertConfig {
    title?: string;
    titleStyle?: TextStyle;
    message?: string | null;
    messageStyle?: TextStyle;
    actions?: DialogButtonAction[];
    buttonsStyle?: TextStyle;
    dialogStyle?: ViewStyle
    dismissable?: boolean
}

const AlertPaperContext = React.createContext<AlertContextProps | undefined>(undefined);
const initialConf: AlertConfig = {
    title: '',
    titleStyle: {},
    actions: [],
    buttonsStyle: {},
    message: null,
    messageStyle: {},
    dialogStyle: { borderRadius: 15, backgroundColor: "white" },
    dismissable: true
}
const AlertPaperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alertConfig, setAlertConfig] = React.useState<AlertConfig>(initialConf);
    const [isVisible, setIsVisible] = React.useState(false)

    const setConfig = React.useCallback((config: AlertConfig) => {
        setAlertConfig({ ...config });
    }, []);

    const showAlert = React.useCallback((config: AlertConfig) => {
        setAlertConfig((prevConfig) => ({
            ...prevConfig,
            ...config,
        }));
        setIsVisible(true)
    }, []);

    const DialogActions = () => (
        <Dialog.Actions>
            {alertConfig?.actions && alertConfig.actions.map((action, i) => (
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    action.onPress && action.onPress();
                    setIsVisible(false)
                }} key={i}>
                    <Text style={action.buttonStyle}>{action.text}</Text>
                </TouchableOpacity>
            ))}
        </Dialog.Actions>
    );

    const AlertComponent = () => {

        return (
            <Portal>
                <Dialog dismissable={alertConfig.dismissable || initialConf.dismissable}
                    onDismiss={() => setIsVisible(false)}
                    style={[initialConf.dialogStyle, alertConfig.dialogStyle]}
                    visible={isVisible} >
                    <Dialog.Title style={alertConfig?.titleStyle}>{alertConfig?.title}</Dialog.Title>
                    {alertConfig.message && (
                        <Dialog.Content>
                            <Text style={alertConfig.messageStyle}>{alertConfig.message}</Text>
                        </Dialog.Content>
                    )}
                    <DialogActions />
                </Dialog>
            </Portal>
        )
    };

    return (
        <AlertPaperContext.Provider value={{ showAlert, setConfig }}>
            {children}
            <AlertComponent />
        </AlertPaperContext.Provider>
    );
};

const useAlert = ({ title, titleStyle, actions, buttonsStyle, message, messageStyle, dismissable, dialogStyle }: AlertConfig = initialConf) => {
    const context = React.useContext(AlertPaperContext);

    React.useEffect(() => {
        if (context)
            context.setConfig({ title, titleStyle, actions, buttonsStyle, message, messageStyle, dismissable, dialogStyle })
    }, [])

    if (!context) {
        throw new Error('useAlert must be used within an AlertPaperProvider');
    }
    return context;
};

export { AlertPaperProvider, useAlert };
