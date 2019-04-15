import React, { Component } from 'react';
import DrawerContentPresenter from './DrawerContentPresenter';

class DrawerContentContainer extends Component {
  render() {
    const { navigation, auth } = this.props;
    const drawerList = [
      { name: '내정보', src: 'UserInfo' },
      { name: '회사변경', src: 'Configuration' },
      { name: '환경설정', src: 'Configuration' }
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
