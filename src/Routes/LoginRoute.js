/**
 * CreateRoute
 * 
 */

import { 
    createStackNavigator, 
    createAppContainer,
} from "react-navigation";
import LoginScreen from "../Screens/LoginScreen";

/**
 * 
 */
const CreateRoute = createStackNavigator({
    /**
     * 메인
     */
    Login: {
        screen: LoginScreen,
        headerStyle:{
        color:"#ffffff"
        },
        navigationOptions: ({navigation}) => ({
            header: null,
            gesturesEnabled: false,
        }),
    },

});

export default createAppContainer(CreateRoute);