/**
 * HomeRoute
 * 
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator, DrawerActions } from 'react-navigation';

import HomeScreen from '../Screens/HomeScreen';
import ConferenceScreen from '../Screens/ConferenceScreen';
import ConfigurationScreen from '../Screens/ConfigurationScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const commonStyle = {
	height: 53,
	color: 'white',
	backgroundColor: '#1C90FB'
};

/**
 * MenuImage
 * 사이드메뉴 토글아이콘
 */
const MenuImage = ({ navigation }) => {
	if (!navigation.state.isDrawerOpen) {
		return <Icon name="bars" size={24} color="#fff" style={{ marginLeft: 20, zIndex: 10 }} />;
	} else {
		return <Icon name="times" size={24} color="#fff" style={{ marginLeft: 20, zIndex: 10 }} />;
	}
};

/**
 * rightMenuImage
 * 사이드메뉴 토글아이콘
 */
const RightMenuImage = ({ navigation }) => {
	return (
		<Icon
			name="cog"
			size={24}
			color="#fff"
			style={{
				marginLeft: 20,
				marginRight: 20,
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
			screen: HomeScreen
			// navigationOptions: {
			// 	drawerLabel: 'Home'
			// },
		}
	},
	{
		initialRouteName: 'Home',
		// contentComponent: ,
		drawerWidth: 240
	}
);

const HomeRoute = createStackNavigator({
	/**
	 * 메인
	 */
	Home: {
		screen: HomeDrwawer,
		headerStyle: {
			color: '#ffffff'
		},
		navigationOptions: ({ navigation }) => ({
			title: 'WEHAGO V',
			headerTintColor: '#fff',
			gesturesEnabled: false,
			headerStyle: commonStyle,
			headerRight: (
				<TouchableOpacity
					onPress={() => {
						// navigation.dispatch(DrawerActions.toggleDrawer());
						navigation.navigate('Configuration');
					}}
				>
					<RightMenuImage navigation={navigation} />
				</TouchableOpacity>
			)
		})
	},

	/**
	 * Conference
	 * 화상대화 접속화면
	 */
	Conference: {
		screen: ConferenceScreen,
		headerStyle: {
			color: '#fff'
		},
		navigationOptions: {
			header: null,
			headerLeft: null,
			gesturesEnabled: false
		}
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
			headerTintColor: '#fff',
			headerStyle: commonStyle
		})
	}
});

export default createAppContainer(HomeRoute);
