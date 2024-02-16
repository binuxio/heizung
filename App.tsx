import React from 'react';
import { AppRegistry } from 'react-native';
import appConf from './app.config';
import Main from './src/Main';
import { MD3LightTheme as DefaultTheme, MD2Colors, MD3Colors, PaperProvider, shadow } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type MyThemes = {
  shadow: Object
}

const theme: ThemeProp & MyThemes = {
  // ...DefaultTheme,
  colors: {
    // ...DefaultTheme.colors,
    primary: '#0284c7',
    secondary: '#103247',
    background: "#d7f3fa",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }
};

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}

AppRegistry.registerComponent(appConf.name, () => App);