/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component, Fragment } from 'react';
import { View, SafeAreaView } from 'react-native';

import MainPresenter from './MainPresenter';

// 로그인 했을때 정보를 저장
// 딥링크 타고 들어오면 정보를 저장?
// 로그인, 딥링크, 위하고 로그인 3개를 비교해봐야함

class MainContainer extends Component {
  constructor(props) {
    super();
    this.state = {
      isLogin: false,
      hasService: false,
      url: null,
      alert: {
        visible: false,
        type: 0,
        description: '',
        actions: [],
        onClose: () => {}
      },
      topAraa:'rgb(0,121,221)',
      bottomArea : 'rgb(60,160,210)'
    };
  }
  // backgroundColor: 'rgb(0,111,222)',

  render() {
    const { params, destination, onChangeRootState, from } = this.props;
    return (
      <Fragment>
        {/* <SafeAreaView style={{ flex: 0, backgroundColor: this.state.topAraa }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(60,160,210)' }}> */}
          <MainPresenter
            params={params}
            from={from}
            destination={destination}
            onChangeRootState={onChangeRootState}
            onChangeMainState={this._handleChangeMainState}
          />
        {/* </SafeAreaView> */}
      </Fragment>
    );
  }

  _handleChangeMainState = state => {
    this.setState({
      ...this.state,
      ...state
    });
  };
}
export default MainContainer;
