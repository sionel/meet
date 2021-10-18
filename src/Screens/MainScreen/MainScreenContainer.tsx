import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { RootStateOrAny, useSelector } from 'react-redux';
import MainScreenPresenter from './MainScreenPresenter';

const MainScreenContainer = (props: any) => {
  const root = useSelector((state: RootStateOrAny) => state.root);
  const { destination } = root;
  
  const [state, setState] = useState({
    isLogin: false,
    hasService: false,
    url: null,
    alert: {
      visible: false,
      type: 0,
      description: '',
      actions: [],
      onClose: () => {}
    }
  });

  const handleChangeMainState = (stateD: any) => {
    setState({
      ...state,
      ...stateD
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <MainScreenPresenter 
        {...{ handleChangeMainState, destination }}
      />
    </SafeAreaView>
  );
};

export default MainScreenContainer;
