import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectCompanyPresenter from './SelectCompanyPresenter';
import { RootState } from '../../redux/configureStore';
import ReactNativeRestart from 'react-native-restart';

import { actionCreators as RootAction } from '../../redux/modules/root';
import { actionCreators as UserActions } from '../../redux/modules/user';

import { UserApi } from '../../services';

const SelectCompanyContainer = (props: any) => {
  // const { handleChangeCompany } = props;
  const dispatch = useDispatch();

  const changeCompanyRequest = (
    auth: any,
    company: {
      company_no: number;
      company_code: number;
    }
  ) => dispatch(UserActions.changeCompanyRequest(auth, company));
  const _logout = () => {
    dispatch(UserActions.logout());
  };
  const { auth } = props;

  const selectedCompany = auth.last_company;
  const employee_list = auth.employee_list;
  const {} = useSelector((state: RootState) => {
    //  state.user['from']
    //  state.user.from
    debugger;
    return {
      //       from: state.user.from,
      //       selectedCompany,
      // employee_list
    };
  });

  const handleChangeCompany = async (cno: number) => {
    const companyInfo = employee_list.find(
      (emp: any) => emp.company_no === cno
    );
    const company = {
      company_no: companyInfo.company_no,
      company_code: companyInfo.company_code
    };

    await changeCompanyRequest(auth, company);
    ReactNativeRestart.Restart();
  };

  const onLogout = async () => {
    // const from = props.from;
    // dispatch(rootAction.setDestination('Login'));
    // from === 'this' && (await UserApi.logoutRequest(auth));
    _logout();
    // props.onLogout();
    // props.onSetInitialList();
  };
  return (
    <SelectCompanyPresenter
      {...{
        employee_list,
        selectedCompany,
        handleChangeCompany,
        onLogout,
        // from
      }}
    />
  );
};

export default SelectCompanyContainer;
