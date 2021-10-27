import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import ConferenceStateScreen from '../Screens/ConferenceStateScreen';
import ConferenceScreen from '../Screens/ConferenceScreen';
import SettingScreen from '../Screens/SettingScreen';
import { Image, TouchableOpacity } from 'react-native';
import RouteTitle from '../Routes/RouteTitle';

const commonStyle = {
  height: 53,
  color: '#fff',
  backgroundColor: '#1C90FB',
};
const backBtn = require('../../assets/buttons/back_btn.png');

const BackButton = ({ navigation }) => {
  const { onChangeRootState, destination } = navigation.getScreenProps();
  destination === 'Conference' || destination === 'Setting';
  return (
    <TouchableOpacity
      onPress={() => {
        onChangeRootState({
          destination:
            destination === 'Conference' || destination === 'Setting'
              ? 'Login'
              : 'List'
        });
      }}
    >
      <Image
        source={backBtn}
        style={{ width: 23, height: 20, marginLeft: 20 }}
      />
    </TouchableOpacity>
  );
};

const Deeplink1Navigation = createStackNavigator(
  {
    ConferenceState: {
      screen: ConferenceStateScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={navigation.getScreenProps().t('option_conference')} />,
        headerLeft: <BackButton navigation={navigation} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    Setting: {
      screen: SettingScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={navigation.getScreenProps().t('roomstate_setting_header')} />,
        headerLeft: <BackButton navigation={navigation} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    Conference: {
      screen: ConferenceScreen,
      navigationOptions: {
        header: null,
        headerLeft: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: 'ConferenceState',
    mode: 'modal',
    headerMode: 'screen',
    cardStyle: { backgroundColor: '#FFF', transparent: true }
  }
);

export default createAppContainer(Deeplink1Navigation);
