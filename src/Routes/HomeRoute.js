/**
 * HomeRoute
 * 
 */

import React from 'react'
import { 
    createAppContainer,
    createSwitchNavigator,
} from "react-navigation";
// import HomeScreen from "../Screens/HomeScreen";
// import HomeSc from "../Screens/HomeScreen/SearchForm";
// import HomeScreen2 from "../Pages/Home";
import HomeScreen2 from "../Pages/Home2";


const commonStyle = { 
    height: 53, 
    color:"white",
    // backgroundColor: "#3397D6" 
    backgroundColor: "#1C90FB" 
}

const HomeRoute = createSwitchNavigator({
    /**
     * 메인
     */
    Home: {
        screen: HomeScreen2,
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
});

// export default createAppContainer(HomeRoute);
export default (HomeRoute);