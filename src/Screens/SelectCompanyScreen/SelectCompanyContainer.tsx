import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectCompanyPresenter from './SelectCompanyPresenter';
import { RootState } from '../../redux/configureStore';
import ReactNativeRestart from 'react-native-restart';

import { actionCreators as RootAction } from '../../redux/modules/root';
import { actionCreators as UserActions } from '../../redux/modules/user';

import { UserApi } from '../../services';
import { MeetNavigationProps } from '../../Navigations/RootNavigation';

const SelectCompanyContainer = ({navigation,route}: MeetNavigationProps<'SelectCompany'>) => {
  // const { handleChangeCompany } = props;
  const [prevAuth, setPrevAuth] = useState<any>(null);

  const { from, auth, selectedCompany, employee_list } = useSelector(
    (state: RootState) => {
      const {
        user: {
          from,
          auth,
          auth: { last_company, employee_list }
        }
      } = state;
      return {
        from,
        auth,
        selectedCompany: last_company,
        employee_list
      };
    }
  );

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

  useEffect(() => {
    if (prevAuth === null) {
      setPrevAuth(auth);
    } else if (prevAuth.cno !== auth.last_access_company_no) {
      ReactNativeRestart.Restart();
    }
  }, [auth]);

  const handleChangeCompany = async (cno: number) => {
    const companyInfo = employee_list.find(
      (emp: any) => emp.company_no === cno
    );
    const company = {
      company_no: companyInfo.company_no,
      company_code: companyInfo.company_code
    };

    await changeCompanyRequest(auth, company);
  };

  const onLogout = async () => {
    from === 'this' && (await UserApi.logoutRequest(auth));
    _logout();
  };
  return (
    <SelectCompanyPresenter
      {...{
        employee_list,
        selectedCompany,
        handleChangeCompany,
        onLogout,
        from
      }}
    />
  );
};

export default SelectCompanyContainer;
