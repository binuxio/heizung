import React from 'react';
import { AppRegistry } from 'react-native';
import appConf from './app.config';
import Main from './src/Main';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store';
import { AlertPaperProvider } from './src/components/UI/AlertPaperProvider';
import { PaperDialogProvider } from './src/components/UI/PaperDialogProvider';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <AlertPaperProvider>
            <PaperDialogProvider>
              <NavigationContainer>
                <Main />
              </NavigationContainer>
            </PaperDialogProvider>
          </AlertPaperProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
}

AppRegistry.registerComponent(appConf.name, () => App);