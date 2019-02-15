/**
 * HomeRoute
 *
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, createAppContainer, createDrawerNavigator, DrawerActions } from 'react-navigation';

import HomeScreen from '../Screens/HomeScreen';
import ConfigurationScreen from '../Screens/ConfigurationScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

import RouteTitle from './RouteTitle';

const commonStyle = {
	height: 53,
	color: 'white',
	backgroundColor: '#1C90FB'
};

const HomeRouteTitle = props => {
	return <Text>{props.auth.last_company}</Text>;
};

// export default HomeRouteTitle;

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
			headerTitle: <RouteTitle />,
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
			headerTintColor: '#fff',
			headerStyle: commonStyle
		})
	}
});

export default createAppContainer(HomeRoute);
