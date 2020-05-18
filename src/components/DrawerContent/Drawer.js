import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import { Drawer, CustomIcon } from 'rn-component';
import { WEHAGO_ENV } from '../../../config';

export default function DrawerContent(props) {
  const { navigation } = props;

  // redux
  const auth = useSelector(state => state.user.auth);
  // const user = useSelector(state => state.user.user);
  // const selectedCompany = useSelector(state => state.account.selectedCompany);

  const handleChangeCompany = async (cno, ccode) => {
    const company = {
      company_no: cno,
      company_code: ccode
    };

    await props.changeCompanyRequest(auth, company);
  };

  return (
    <Drawer
      wehagoType={WEHAGO_ENV}
      navigation={props.navigation}
      auth={auth}
      user={auth}
      logoComponent={
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ justifyContent: 'center' }}
        >
          <CustomIcon
            name={WEHAGO_ENV === 'WEHAGOV' ? 'WEHAGO_V_BI' : 'logo64'}
            width={85}
            height={16}
          />
        </TouchableOpacity>
      }
      // subActions={[
      //   <TouchableOpacity onPress={() => {}}>
      //     <CustomIcon name={'btnDrawAlertNone'} size={24} width={60} />
      //   </TouchableOpacity>
      // ]}
      onTouchSetting={() => {
        navigation.closeDrawer();
        navigation.navigate('Configuration');
      }}
      selectedCompany={auth.last_company}
      onChangeCompany={handleChangeCompany}
    />
  );
}
