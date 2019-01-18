/**
 * HomeRoute
 * 
 */

import React from 'react'
import { 
    createAppContainer,
    createSwitchNavigator,
    createStackNavigator,
} from "react-navigation";

import HomeScreen from "../Screens/HomeScreen";
import ConferenceScreen from "../Screens/ConferenceScreen";

const commonStyle = { 
    height: 53, 
    color:"white",
    backgroundColor: "#1C90FB" 
}

const HomeRoute = createStackNavigator({
    /**
     * 메인
     */
    Home: {
        screen: HomeScreen,
        headerStyle:{
        color:"#ffffff"
        },
        navigationOptions: ({navigation}) => ({
            title: "WEHAGO",
            headerStyle: { 
                ...commonStyle
            },
            headerTintColor: '#fff',
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
});

export default createAppContainer(HomeRoute);
// export default (HomeRoute);