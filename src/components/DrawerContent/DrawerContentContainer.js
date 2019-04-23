import React, { Component } from 'react';
import { Alert } from 'react-native';
import DrawerContentPresenter from './DrawerContentPresenter';

class DrawerContentContainer extends Component {
  render() {
    const { navigation, auth } = this.props;
    const drawerList = [
      // { name: '내정보', src: 'UserInfo' },
      {
        name: '회사변경',
        src: 'Company',
        action: () => {
          Alert.alert('', '준비중입니다.', [{ text: 'OK' }], {
            cancelable: true
          });
        }
      },
      {
        name: '환경설정',
        src: 'Configuration',
        action: () => {
          navigation.closeDrawer();
          navigation.navigate('Configuration');
        }
      }
    ];

    return (
      <DrawerContentPresenter
        auth={auth}
        navigation={navigation}
        drawerList={drawerList}
      />
    );
  }
}

export default DrawerContentContainer;
