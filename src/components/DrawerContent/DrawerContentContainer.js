import * as React from 'react';

import DrawerContentPresenter from './DrawerContentPresenter';
import CustomIcon from '../CustomIcon';
import UserApi from '../../services/api/LoginApi/UserApi';

export default function DrawerContainer(props) {
  const {
    wehagoType,
    navigation,
    auth,
    user,
    logoComponent,
    subActions,
    statusBarHeight,
    selectedCompany,
    onTouchSetting,
    onTouchNotice,
    onShowProfile,
    onChangeCompany
  } = props;

  // state
  const [companyChange, setCompanyChange] = React.useState(false);
  const [serviceDeploy, setServiceDeploy] = React.useState({});

  const getServiceDeploy = async () => {
    const UserApiRequest = UserApi;
    const deploys = await UserApiRequest.serviceDeployCheck(
      auth,
      auth.last_access_company_no
    );
    return deploys;
  };

  navigation &&
    React.useEffect(() => {
      if (!navigation.state.isDrawerIdle) {
        setCompanyChange(false);
      }
    }, [navigation.state]);

  React.useEffect(() => {
    const isServiceDeploy = (async () => {
      const deploys = await getServiceDeploy();
      if (deploys) {
        const newDeploys = {};
        deploys.map(deploy => (newDeploys[deploy.service_code] = 'T'));

        // 가입자가 Edge 일 경우 메일 미사용
        newDeploys['mail'] =
          selectedCompany.membership_code === 'WE' ? 'F' : 'T';

        setServiceDeploy(newDeploys);
      } else return;
    })();
  }, []);

  return (
    <DrawerContentPresenter
      {...{
        wehagoType,
        navigation,
        user,
        serviceDeploy,
        logoComponent,
        subActions,
        selectedCompany,
        statusBarHeight,
        companyChange,
        setCompanyChange,
        onTouchSetting,
        onTouchNotice,
        onShowProfile,
        onChangeCompany
      }}
    >
      {props.children}
    </DrawerContentPresenter>
  );
}

DrawerContainer.defaultProps = {
  wehagoType: 'WEHAGO',
  navigation: null,
  auth: {
    AUTH_A_TOKEN: '',
    AUTH_R_TOKEN: '',
    HASH_KEY: '',
    last_access_company_no: ''
  },
  user: {
    profile_url: null,
    user_name: '',
    user_default_email: '',
    user_email: '',
    employee_list: null
  },
  logoComponent: <CustomIcon name={'logo64'} width={85} height={16} />,
  subActions: null,
  selectedCompany: {},
  statusBarHeight: 0,
  onTouchSetting: () => {},
  onShowProfile: () => {},
  onChangeCompany: () => {}
};
