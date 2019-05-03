import React, { Component } from 'react';
import { Alert } from 'react-native';
import DrawerContentPresenter from './DrawerContentPresenter';

class DrawerContentContainer extends Component {
  state = { selectCompany: false };

  render() {
    const { navigation, auth } = this.props;
    const drawerList = [
      // { name: '내정보', src: 'UserInfo' },
      {
        name: '회사변경',
        src: 'Company',
        action: () => {
          this._handleChangeState('selectCompany', true);
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

    const companyList = [
      {
        title: '1',
        company_id: '1',
        action: () => {
          this._handleCompanyChange('params');
        }
      },
      {
        title: '2',
        company_id: '2',
        action: () => {
          this._handleCompanyChange('params');
        }
      }
    ];

    return (
      <DrawerContentPresenter
        auth={auth}
        navigation={navigation}
        drawerList={drawerList}
        companyList={companyList}
        selectCompany={this.state.selectCompany}
        onChangeState={this._handleChangeState}
      />
    );
  }

  _handleChangeState = (target, state) => {
    this.setState({ [target]: state });
  };

  _handleCompanyChange = params => {
    // API 호출
    // 띠리리삐리리뿅

    this._handleChangeState('selectCompany', false);
  };
}

export default DrawerContentContainer;
