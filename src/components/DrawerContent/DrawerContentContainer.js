import React, { Component } from 'react';
import DrawerContentPresenter from './DrawerContentPresenter';

class DrawerContentContainer extends Component {
  static defaultProps = {
    auth: {
      employee_list: [
        {
          title: '',
          key: '',
          action: () => {}
        }
      ]
    }
  };

  state = { selectCompany: false };

  render() {
    const { navigation, auth } = this.props;
    const drawerList = [
      // { name: '내정보', src: 'UserInfo' },
      {
        name: '회사변경',
        src: 'Company',
        action: () => {
          // this._handleChangeState('selectCompany', true);
          alert('준비중입니다.');
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

    const companyList =
      auth.employee_list &&
      auth.employee_list.map(item => {
        return {
          title: item.company_name_kr,
          key: item.company_no,
          action: () => {
            this._handleCompanyChange(item.company_no);
            // alert(item.company_no);
          }
        };
      });

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
