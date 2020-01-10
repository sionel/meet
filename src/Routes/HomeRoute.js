/**
 * HomeRoute
 *
 */

import React from 'react';
import { Image, TouchableOpacity, Dimensions, View } from 'react-native';

import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from 'react-navigation';

import CustomIcon from './../components/CustomIcon';

/** Screens */
import HomeScreen from '../Screens/HomeScreen';
import ConfigurationScreen from '../Screens/ConfigurationScreen';
import PolicyScreen from '../Screens/ConfigurationScreen/PolicyScreen';
import AwardsScreen from '../Screens/ConfigurationScreen/AwardsScreen';
import CreateScreen from '../Screens/CreateScreen';

/** Components */
import RouteTitle from './RouteTitle';
import DrawerContent from '../components/DrawerContent';

const commonStyle = {
  height: 53,
  color: '#fff',
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
  const { state } = navigation;

  // const opacity = new Animated.Value(1);
  // const rotate = new Animated.Value(0);
  // const spin = rotate.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0deg', '360deg']
  // });

  // if (
  //   (state.drawerMovementDirection === 'opening') ||
  //   (state.drawerMovementDirection === 'closing')
  // ) {
  // Animated.timing(opacity, {
  //   toValue: 0.3,
  //   // duration: 20
  // }).start(() =>
  //   Animated.timing(opacity, {
  //     toValue: 1,
  //     // duration: 200
  //   }).start()
  // );
  // Animated.timing(rotate, {
  //   toValue: 1,
  //   // duration: 4000
  // }).start();
  // }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        margin: 10
      }}
    >
      {/* <Animated.View
        style={{
          // transform: [{ rotate: spin }],
          // opacity: opacity,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10
        }}
      > */}
      <CustomIcon
        name={
          state.drawerMovementDirection === 'opening'
            ? 'buttonClose'
            : state.drawerMovementDirection === 'closing'
            ? 'buttonMenu'
            : state.isDrawerOpen
            ? 'buttonClose'
            : 'buttonMenu'
          // iconName
        }
        width={26}
        height={26}
      />
      {/* </Animated.View> */}
    </View>
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
    overlayColor: '#00000090',
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
        headerTitle: <RouteTitle title={'WEHAGO Meet'} />,
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
            activeOpacity={0.5}
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
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={'설정'} />,
        headerLeft: <BackButton navigation={navigation} to={'Home'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    /**
     * Policy
     * 수상 및 인증내역
     */
    Policy: {
      screen: PolicyScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={'이용약관 및 법률정보'} />,
        headerLeft: <BackButton navigation={navigation} to={'Configuration'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },
    /**
     * Awards
     * 수상 및 인증내역
     */
    Awards: {
      screen: AwardsScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={'수상 및 인증내역'} />,
        headerLeft: <BackButton navigation={navigation} to={'Configuration'} />,
        headerTintColor: '#fff',
        headerStyle: commonStyle
      })
    },

    /**
     * UserInfo
     * 사용자 정보
     */
    // UserInfo: {
    //   screen: UserInfoScreen,
    //   headerStyle: {
    //     color: '#fff'
    //   },

    //   navigationOptions: ({ navigation }) => ({
    //     title: '내정보',
    //     headerLeft: <BackButton navigation={navigation} to={'Home'} />,
    //     headerTintColor: '#fff',
    //     headerStyle: commonStyle
    //   })
    // },

    /**
     * Create
     * 화상대화 생성
     */
    Create: {
      screen: CreateScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <RouteTitle title={'화상회의'} />,
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

export default HomeRoute;
// export default createAppContainer(HomeRoute);
