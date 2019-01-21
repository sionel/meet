/**
 * CreateRoute
 * 
 */

import React from 'react'
import {
    View,
    Text,
    Button,
    TouchableOpacity
  } from 'react-native';
import { 
    createStackNavigator, 
    createAppContainer,
    createDrawerNavigator,
    DrawerActions
  } from "react-navigation";

import CreateScreen from "../Screens/CreateScreen";
const commonStyle = { 
    height: 53, 
    color:"white",
    backgroundColor: "#1C90FB" 
}

/**
 * 
 */
const CreateRoute = createStackNavigator({
    /**
     * 메인
     */
    Create: {
        screen: CreateScreen,
        headerStyle:{
        color:"#ffffff"
        },
        navigationOptions: ({navigation}) => ({
            title: "NEW",
            headerTintColor: '#fff',
            gesturesEnabled: false,
            headerStyle: { 
                ...commonStyle
            },
            headerLeft:
                <Button title="취소" color="#fff" style={{marginLeft:20, zIndex:10}} />,
            headerRight:
                <Button title="확인" color="#fff" style={{marginRight:20, zIndex:10}} />,
        }),
    },

});

export default createAppContainer(CreateRoute);