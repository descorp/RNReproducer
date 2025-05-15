/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  NativeModules,
  AppState,
  Text,
  EmitterSubscription,
  NativeEventEmitter,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

const {ForcedAlert} = NativeModules;
const {EVENT_A, EVENT_B} = ForcedAlert.getConstants();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    var subscriptions: EmitterSubscription[] = [];
    subscriptions.push(
      AppState.addEventListener('change', nextAppState => {
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
      }),
    );

    const eventEmitter = new NativeEventEmitter(ForcedAlert);
    subscriptions.push(
      eventEmitter.addListener(EVENT_A, message => {
        console.log('Event A: ', message);
      }),
    );
    subscriptions.push(
      eventEmitter.addListener(EVENT_B, async message => {
        await sleep(500);
        console.log('Event B: ', message);
      }),
    );

    return () => {
      subscriptions.forEach(s => s.remove());
    };
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <Text>Current state is: {appStateVisible}</Text>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            title="Press me"
            onPress={async () => {
              console.log('\n');
              await sleep(500);
              console.log('Timer works before Activity');
              ForcedAlert.alert('Native Alert', 'Custom Android Activity');
              console.log('Custom activity started');
              await sleep(500);
              console.log('Timer works after async');
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function sleep(ms: number) {
  return new Promise(async resolve => {
    await fetch('https://google.com');
    resolve(1);
  });
}

export default App;
