/**
 * HomeRoute
 *
 */

import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, createAppContainer, createDrawerNavigator, DrawerActions } from 'react-navigation';

import HomeScreen from '../Screens/HomeScreen';
import ConfigurationScreen from '../Screens/ConfigurationScreen';
import CreateScreen from '../Screens/CreateScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

import RouteTitle from './RouteTitle';

const commonStyle = {
	height: 53,
	color: 'white',
	backgroundColor: '#1C90FB'
};
const backBtn = require('../../assets/buttons/back_btn.png');

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
			<Image source={backBtn} style={{ width: 23, height: 20, marginLeft: 20 }} />
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
			name="sliders"
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
			screen: HomeScreen,
			navigationOptions: {
				drawerLabel: 'Home'
			}
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
		screen: HomeScreen,
		headerStyle: {
			color: '#ffffff'
		},
		navigationOptions: ({ navigation }) => ({
			headerTitle: <RouteTitle />,
			// headerTitle: '<RouteTitle />',
			headerTintColor: '#fff',
			gesturesEnabled: false,
			headerStyle: commonStyle,
			headerRight: (
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('Configuration');
					}}
				>
					<RightMenuImage navigation={navigation} />
				</TouchableOpacity>
			)
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
});

export default createAppContainer(HomeRoute);
