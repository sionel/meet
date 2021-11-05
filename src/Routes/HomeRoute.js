/**
 * HomeRoute
 *
 */

import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import CustomIcon from './../components/CustomIcon';

/** Screens */
import HomeScreen from '../Screens/HomeScreen';
import ConfigurationScreen from '../Screens/ConfigurationScreen';
import PolicyScreen from '../Screens/ConfigurationScreen/subScreens/PolicyScreen';
import AwardsScreen from '../Screens/ConfigurationScreen/subScreens/AwardsScreen';
import OpenSourceScreen from '../Screens/ConfigurationScreen/subScreens/OpenSourceScreen';
import OpenSourceDetailScreen from '../Screens/ConfigurationScreen/subScreens/OpenSourceDetailScreen';
import CreateScreen from '../Screens/CreateScreen';
import ConferenceStateScreen from '../Screens/ConferenceStateScreen';

/** Components */
import RouteTitle from './RouteTitle';
import DrawerContent from '../components/DrawerContent';
import { WEHAGO_TYPE } from '../../config';
import { getT } from '../utils/translateManager';
import CreateMeetScreen from '../Screens/CreateMeetScreen';

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
const RightMenuImage = ({ navigation }) => {
  const { state } = navigation;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        margin: 10
      }}
    >
      <CustomIcon
        name={
          state.drawerMovementDirection === 'opening'
            ? 'buttonClose'
            : state.drawerMovementDirection === 'closing'
            ? 'buttonMenu'
            : state.isDrawerOpen
            ? 'buttonClose'
            : 'buttonMenu'
        }
        width={26}
        height={26}
      />
    </View>
  );
};

const HomeDrwawer = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        drawerLabel: 'Home'
      }
    }
  },
  {
    initialRouteName: 'Home',
    drawerPosition: 'right',
    overlayColor: '#00000090',
    contentComponent: ({ navigation }) => (
      <DrawerContent navigation={navigation} />
    )
  }
);

const HomeRouteStack = () => {
  return {
    Home: {
      screen: HomeDrwawer,
      headerStyle: {
        color: '#ffffff'
      },
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={WEHAGO_TYPE + ' Meet'} />,
        headerTintColor: '#fff',
        gesturesEnabled: false,
        headerStyle: commonStyle,
        headerRight: (
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}
            activeOpacity={0.5}
          >
            <RightMenuImage navigation={navigation} />
          </TouchableOpacity>
        )
      })
    },

    Configuration: {
      screen: ConfigurationScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle title={navigation.getScreenProps().t('option_setting')} />
        ),
        headerLeft: <BackButton navigation={navigation} to={'Home'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    Policy: {
      screen: PolicyScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle title={navigation.getScreenProps().t('option_legal')} />
        ),
        headerLeft: <BackButton navigation={navigation} to={'Configuration'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    Awards: {
      screen: AwardsScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle title={navigation.getScreenProps().t('option_awards')} />
        ),
        headerLeft: <BackButton navigation={navigation} to={'Configuration'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    OpenSource: {
      screen: OpenSourceScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle
            title={navigation.getScreenProps().t('option_opensource')}
          />
        ),
        headerLeft: <BackButton navigation={navigation} to={'Policy'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    OpenSourceDetail: {
      screen: OpenSourceDetailScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle
            title={navigation.getScreenProps().t('option_opensource')}
          />
        ),
        headerLeft: <BackButton navigation={navigation} to={'OpenSource'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    Create: {
      screen: CreateScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle
            title={navigation.getScreenProps().t('option_conference')}
          />
        ),
        headerLeft: <BackButton navigation={navigation} to={'Home'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    ConferenceState: {
      screen: ConferenceStateScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <RouteTitle
            title={navigation.getScreenProps().t('option_conference')}
          />
        ),
        headerLeft: <BackButton navigation={navigation} to={'Home'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    CreateMeetRoom: {
      screen: CreateMeetScreen,
      navigationOptions: ({ navigation }) => ({
        header:null
      }),
      
    }
  };
};

const HomeRoute = createStackNavigator(HomeRouteStack(), {
  cardStyle: { transparent: true }
});

export default HomeRoute;
