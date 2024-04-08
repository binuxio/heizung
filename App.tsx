import React from 'react';
import { AppRegistry } from 'react-native';
import appConf from './app.config';
import Main from './src/Main';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/storage/redux/store';
import { _AlertPaperProvider } from './src/components/UI/_AlertPaperProvider';
import { PaperDialogProvider } from './src/components/UI/PaperDialogProvider';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <_AlertPaperProvider>
            <PaperDialogProvider>
              <NavigationContainer>
                <Main />
              </NavigationContainer>
            </PaperDialogProvider>
          </_AlertPaperProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
}

AppRegistry.registerComponent(appConf.name, () => App);