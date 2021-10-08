import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import ConferenceStateScreen from '../Screens/ConferenceStateScreen';
import ConferenceScreen from '../Screens/ConferenceScreen';
import SettingScreen from '../Screens/SettingScreen';
import { Image, TouchableOpacity } from 'react-native';
import RouteTitle from '../Routes/RouteTitle';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as RootActions } from '../redux/modules/root';

const commonStyle = {
  height: 53,
  color: '#fff',
  backgroundColor: '#1C90FB'
};
const backBtn = require('../../assets/buttons/back_btn.png');

const BackButton = () => {
  const dispatch = useDispatch();
  const _setRootState = rstate => dispatch(RootActions.setRootState(rstate));

  const root = useSelector(state => state.root);
  const { destination } = root;

  destination === 'Conference' || destination === 'Setting';
  return (
    <TouchableOpacity
      onPress={() => {
        _setRootState({
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
        headerTitle: (
          <RouteTitle
            title={navigation.getScreenProps().t('option_conference')}
          />
        ),
        headerLeft: <BackButton navigation={navigation} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    Setting: {
      screen: SettingScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle
            title={navigation.getScreenProps().t('roomstate_setting_header')}
          />
        ),
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
