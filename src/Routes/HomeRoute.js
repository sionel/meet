/**
 * HomeRoute
 * 
 */

import React from 'react'
import {
    View,
    Text,
    TouchableOpacity
  } from 'react-native';
import { 
    createStackNavigator, 
    createAppContainer,
    createDrawerNavigator,
    DrawerActions
  } from "react-navigation";

import HomeScreen from "../Screens/HomeScreen";
import ConferenceScreen from "../Screens/ConferenceScreen";
import ConfigurationScreen from "../Screens/ConfigurationScreen";
import Icon from 'react-native-vector-icons/FontAwesome';
import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
const commonStyle = { 
    height: 53, 
    color:"white",
    backgroundColor: "#1C90FB" 
}
const toggleMenu = (<Icon name="bars" size={24} color="#fff" style={{marginLeft:20, zIndex:10}} />)

/**
 * MenuImage
 * 사이드메뉴 토글아이콘
 */
const MenuImage = ({navigation}) => {
    if(!navigation.state.isDrawerOpen){
        // return <Icon name="bars" size={24} color="#fff" style={{marginLeft:20, zIndex:10}} />
        return <Text>+</Text>
      }else{
        // return <Icon name="times" size={24} color="#fff" style={{marginLeft:20, zIndex:10}} />
        return <Text>+</Text>
    }
}

/**
 * Drawer 메뉴
 */
const HomeDrwawer = createDrawerNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        drawerLabel: 'Home'
      },
    },
  });

const HomeRoute = createStackNavigator({
    /**
     * 메인
     */
    Home: {
        screen: HomeDrwawer,
        headerStyle:{
        color:"#ffffff"
        },
        navigationOptions: ({navigation}) => ({
            title: "WEHAGO",
            headerTintColor: '#fff',
            gesturesEnabled: false,
            headerStyle: { 
                ...commonStyle
            },
            headerLeft:
                <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())} }>
                    <MenuImage navigation={navigation}/>
                </TouchableOpacity>,
        }),
    },

    /**
     * Conference
     * 화상대화 접속화면
     */
    Conference: {
        screen: ConferenceScreen,
        headerStyle:{
            color:"#fff"
        },
        navigationOptions: {
            header: null,
            headerLeft: null,
            gesturesEnabled: false,
        }
    },

    /**
     * Configuration
     * 환경설정
     */
    Configuration: {
        screen: ConfigurationScreen,
        headerStyle:{
            color:"#fff"
        },
        navigationOptions: ({navigation}) => ({
            header: null,
            headerLeft:
                <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())} }>
                    <MenuImage navigation={navigation}/>
                </TouchableOpacity>,
            gesturesEnabled: false,
        })
    },
});

export default createAppContainer(HomeRoute);