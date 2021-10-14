import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import MainNavigation from './MainNavigation';
import ConferenceScreen from '../Screens/ConferenceScreen';
import SettingScreen from '../Screens/SettingScreen';
import { Image, TouchableOpacity } from 'react-native';

import RouteTitle from '../Routes/RouteTitle';

const commonStyle = {
  height: 53,
  color: '#fff',
  backgroundColor: '#1C90FB'
};
const backBtn = require('../../assets/buttons/back_btn.png');


const BackButton = ({ navigation, to }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(to);
      }}
    >
      <Image
        source={backBtn}
        style={{ width: 23, height: 20, marginLeft: 20 }}
      />
    </TouchableOpacity>
  );
};

const RootNavigation = createStackNavigator(
  {
    /**
     * Main Navigation
     */
    Main: {
      screen: MainNavigation,
      navigationOptions: {
        header: null,
        // headerLeft: null,
        gesturesEnabled: false
      }
    },

    Conference: {
      screen: ConferenceScreen,
      navigationOptions: {
        header: null,
        headerLeft: null,
        gesturesEnabled: false
      }
    },

    Setting: {
      screen: SettingScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={navigation.getScreenProps().t('roomstate_setting_header')} />,
        headerLeft: <BackButton navigation={navigation} to={'Main'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    }

  },
  // initial
  {
    initialRouteName: 'Main',
    mode: 'modal',
    headerMode: 'screen',
    cardStyle: { backgroundColor: '#FFF', transparent: true }
  }
);

export default createAppContainer(RootNavigation);
