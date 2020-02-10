import React from 'react';
import { useSelector } from 'react-redux';

import CompanySelectPresenter from './CompanySelectPresenter';
import UserApi from '../../services/api/UserApi';

export default function CompanySelect(props) {
  // const { handleChangeCompany } = props;

  const { auth } = props;

  const selectedCompany = auth.last_company;
  const employee_list = auth.employee_list;
  const isWehagoLogin = useSelector(state => state.user['isWehagoLogin']);

  const handleChangeCompany = async cno => {
    const companyInfo = employee_list.find(emp => emp.company_no === cno);
    const company = {
      company_no: companyInfo.company_no,
      company_code: companyInfo.company_code
    };

    await props.changeCompanyRequest(auth, company);
  };

  const onLogout = async () => {
    !isWehagoLogin && (await UserApi.logoutRequest(auth));
    props.onLogout();
    props.onSetInitialList();
  };

  return (
    <CompanySelectPresenter
      {...{ employee_list, selectedCompany, handleChangeCompany, onLogout }}
    />
  );
}
