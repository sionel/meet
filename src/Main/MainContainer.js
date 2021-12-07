/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import MainPresenter from './MainPresenter';

// 로그인 했을때 정보를 저장
// 딥링크 타고 들어오면 정보를 저장?
// 로그인, 딥링크, 위하고 로그인 3개를 비교해봐야함

class MainContainer extends Component {
  constructor(props) {
    super();
  }

  render() {
    return <MainPresenter />;
  }
}
export default MainContainer;
