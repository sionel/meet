import { createAppContainer, createStackNavigator } from 'react-navigation';
import ConferenceScreen from '../Screens/ConferenceScreen';

const Deeplink2Navigation = createStackNavigator(
  {
    Conference: {
      screen: ConferenceScreen,
      navigationOptions: {
        header: null,
        headerLeft: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: 'Conference',
    mode: 'modal',
    headerMode: 'screen',
    cardStyle: { backgroundColor: '#FFF', transparent: true }
  }
);

export default createAppContainer(Deeplink2Navigation);
