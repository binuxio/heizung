import * as React from 'react';
import { ViewStyle } from 'react-native';
import { Dialog, DialogProps, Portal } from 'react-native-paper';

interface DialogContentProps {

}

interface DialogContextProps {
    showDialog: (config: DialogConfig) => void;
    hideDialog: () => void
    setConfig: (config: DialogConfig) => void;
}

interface DialogConfig {
    dialogContent: React.ReactNode
    contentWrapperStyle?: ViewStyle
    dialogConfig?: Partial<DialogProps>
}

const DialogContext = React.createContext<DialogContextProps | undefined>(undefined);
const initialConf: DialogConfig = {
    dialogContent: null,
    contentWrapperStyle: {}
}

const PaperDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [DialogConfig, setDialogConfig] = React.useState<DialogConfig>(initialConf);
    const [isVisible, setIsVisible] = React.useState(false)

    const setConfig = React.useCallback((config: DialogConfig) => {
        setDialogConfig({ ...config });
    }, []);

    const showDialog = React.useCallback((config: DialogConfig) => {
        setDialogConfig((prevConfig) => ({
            ...prevConfig,
            ...config,
        }));
        setIsVisible(true)
    }, []);

    const hideDialog = React.useCallback(() => {
        setIsVisible(false)
    }, []);

    const DialogComponent = () => {
        return <Portal>
            <Dialog visible={isVisible} onDismiss={hideDialog} style={DialogConfig.contentWrapperStyle} {...DialogConfig.dialogConfig}>
                <Dialog.Content>
                    <>{DialogConfig.dialogContent}</>
                </Dialog.Content>
            </Dialog>
        </Portal>
    }

    return <DialogContext.Provider value={{ hideDialog, showDialog, setConfig }}>
        {children}
        <DialogComponent />
    </DialogContext.Provider>

};

const useDialog = ({ dialogContent, contentWrapperStyle }: DialogConfig = { dialogContent: null, contentWrapperStyle: {} }) => {
    const context = React.useContext(DialogContext);

    React.useEffect(() => {
        if (context) context.setConfig({ dialogContent, contentWrapperStyle });
    }, [])

    if (!context) {
        throw new Error('useAlert must be used within an PaperDialogProvider');
    }
    return context;
};

export { PaperDialogProvider, useDialog };
