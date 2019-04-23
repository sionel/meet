/**
 * HomeRoute
 *
 */

import React from 'react';
import { Image, TouchableOpacity, Dimensions, Platform } from 'react-native';

import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome';

/** Screens */
import HomeScreen from '../Screens/HomeScreen';
import ConfigurationScreen from '../Screens/ConfigurationScreen';
import UserInfoScreen from '../Screens/UserInfoScreen';
import CreateScreen from '../Screens/CreateScreen';

/** Components */
import RouteTitle from './RouteTitle';
import DrawerContent from '../components/DrawerContent';

const commonStyle = {
  height: 53,
  color: 'white',
  backgroundColor: '#1C90FB'
};
const backBtn = require('../../assets/buttons/back_btn.png');

const { height, width } = Dimensions.get('window');

/**
 * Back button
 * 뒤로가기버튼
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
/**
 * rightMenuImage
 * 사이드메뉴 토글아이콘
 */
const RightMenuImage = ({ navigation }) => {
  return (
    <Icon
      // name="cog"
      name="bars"
      size={20}
      color="#fff"
      style={{
        marginLeft: 20,
        // marginRight: 20,
        zIndex: 10
      }}
    />
  );
};

/**
 * Drawer 메뉴
 */
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
    drawerWidth: Math.min(height, width) * 0.75,
    contentComponent: ({ navigation }) => (
      <DrawerContent navigation={navigation} />
    )
  }
);

const HomeRoute = createStackNavigator(
  {
    /**
     * 메인
     */
    Home: {
      screen: HomeDrwawer,
      headerStyle: {
        color: '#ffffff'
      },
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle />,
        headerTintColor: '#fff',
        gesturesEnabled: false,
        headerStyle: commonStyle,
        // headerRight: (
        headerLeft: (
          // Platform.OS === 'ios' &&
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('Configuration');
              navigation.toggleDrawer();
            }}
          >
            <RightMenuImage navigation={navigation} />
          </TouchableOpacity>
        )
        // headerLeft: (
        // 	Platform.OS === "android" &&
        // 	<TouchableOpacity
        // 		onPress={() => {
        // 			navigation.navigate('Configuration');
        // 		}}
        // 	>
        // 		<RightMenuImage navigation={navigation} />
        // 	</TouchableOpacity>
        // )
      })
    },

    /**
     * Configuration
     * 환경설정
     */
    Configuration: {
      screen: ConfigurationScreen,
      headerStyle: {
        color: '#fff'
      },

      navigationOptions: ({ navigation }) => ({
        title: '환경설정',
        headerLeft: <BackButton navigation={navigation} to={'Home'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    /**
     * UserInfo
     * 환경설정
     */
    UserInfo: {
      screen: UserInfoScreen,
      headerStyle: {
        color: '#fff'
      },

      navigationOptions: ({ navigation }) => ({
        title: '내정보',
        headerLeft: <BackButton navigation={navigation} to={'Home'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    /**
     * Create
     * 화상대화 생성
     */
    Create: {
      screen: CreateScreen,
      headerStyle: {
        color: '#fff'
      },
      navigationOptions: ({ navigation }) => ({
        title: '새 화상대화',
        headerLeft: <BackButton navigation={navigation} to={'Home'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    }
  },
  {
    cardStyle: { transparent: true }
  }
);

export default createAppContainer(HomeRoute);
