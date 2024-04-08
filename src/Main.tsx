import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StackScreens from './StackScreens/StackScreens';
import { useAppDispatch } from './storage/redux/hooks';
import storage from './storage/storage';
import { setDeviceState, setSchedule } from './storage/redux/slice.appData';

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    storage.load({ key: "deviceState" }).then(e => {
      if (e)
        dispatch(setDeviceState(e))
    }
    ).catch(e => console.log("Persist Storage Error", e))

    storage.load({ key: "schedule" }).then(e => {
      if (e)
        dispatch(setSchedule(e))
    }
    ).catch(e => console.log("Persist Storage Error", e))
  }, [])

  return <StackScreens />
}

export default Main;

