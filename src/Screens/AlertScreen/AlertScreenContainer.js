import React, { Children } from 'react';
import AlertScreenPresenter from './AlertScreenPresenter';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators } from '../../redux/modules/alert';

export default function AlertScreenContainer(props) {
  const alert = useSelector(state => state.alert);

  const dispatch = useDispatch();
  const resetAlert = () => {
    dispatch(actionCreators.resetAlert());
  };

  return (
    <AlertScreenPresenter
      alert={alert}
      resetAlert={resetAlert}
      children={props.children}
    />
  );
}
