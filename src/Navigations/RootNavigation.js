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

// import LoginScreen from '../Screens/LoginScreen';
// import LoadingScreen from '../Screens/LoadingScreen';

/**
 * RootNavigation
 */

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

    /**
     * Conference Navigation
     */
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
      // navigationOptions:  {
      //   header: null,
      //   headerLeft: null,
      //   gesturesEnabled: false
      // }
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={'기본 설정'} />,
        // headerTitle:  null,
        headerLeft: <BackButton navigation={navigation} to={'Main'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    }

    /**
     * Login Navigation
     */
    // Login: {
    // 	screen: LoginScreen,
    // 	navigationOptions: {
    // 		header: null,
    // 		headerLeft: null,
    // 		gesturesEnabled: false
    // 	}
    // },

    /**
     * Loding Navigation
     */
    // Loading: {
    // 	screen: LoadingScreen,
    // 	navigationOptions: {
    // 		header: null,
    // 		headerLeft: null,
    // 		gesturesEnabled: false
    // 	}
    // }
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
