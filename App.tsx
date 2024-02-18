import React from 'react';
import { AppRegistry } from 'react-native';
import appConf from './app.config';
import Main from './src/Main';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}

AppRegistry.registerComponent(appConf.name, () => App);