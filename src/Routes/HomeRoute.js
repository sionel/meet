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
		// return <Text>Menu{navigation.state.isDrawerOpen == true ? 1:2}</Text>
	} else {
		return <Icon name="times" size={24} color="#fff" style={{ marginLeft: 20, zIndex: 10 }} />;
		// return <Text>Close{navigation.state.isDrawerOpen == true ? 1:2}</Text>
	}
};

/**
 * Drawer 메뉴
 */
const HomeDrwawer = createDrawerNavigator(
	{
		Home: {
			screen: HomeScreen
		}
		// Home: {
		//     screen: HomeScreen,
		//     navigationOptions: {
		//       drawerLabel: 'Home'
		//     },
		// },
		// Configuration: {
		//     screen: ConfigurationScreen,
		//     navigationOptions: ({navigation}) => ({
		//       drawerLabel: 'Configuration',
		//     }),
		// },
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
			title: 'WE TALK',
			headerTintColor: '#fff',
			gesturesEnabled: false,
			headerStyle: {
				...commonStyle
			},
			headerLeft: (
				<TouchableOpacity
					onPress={() => {
						navigation.dispatch(DrawerActions.toggleDrawer());
					}}
				>
					<MenuImage navigation={navigation} />
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
	}

	/**
     * Configuration
     * 환경설정
     */
	// Configuration: {
	//     screen: HomeDrwawer,
	//     headerStyle:{
	//         color:"#fff"
	//     },
	//     navigationOptions: ({navigation}) => ({
	//         header: null,
	//         headerLeft:
	//             <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())} }>
	//                 <MenuImage navigation={navigation}/>
	//             </TouchableOpacity>,
	//         gesturesEnabled: false,
	//     })
	// },
});

export default createAppContainer(HomeRoute);
