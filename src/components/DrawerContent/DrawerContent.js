import React from 'react';
import {
  Platform,
  TouchableOpacity,
  View,
  Text,
  Linking,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { UserApi } from '../../services';

import btnWehago from '../../../assets/icons/shortcut/ico_service_wehago.png'; // 위하고
import btnRs10 from '../../../assets/icons/shortcut/ico_service_remote.png'; // rs10
import btnWedrive from '../../../assets/icons/shortcut/ico_service_wedrive.png'; // 위드라이브
import btnAtr from '../../../assets/icons/shortcut/ico_service_atr.png'; // 근태관리
import btnElecapproval from '../../../assets/icons/shortcut/ico_service_elecapproval.png'; // 전자결재
import btnFax from '../../../assets/icons/shortcut/ico_service_fax.png'; // 팩스

import DrawerContentContainer from './DrawerContentContainer';
import CustomIcon from '../CustomIcon';
import { WEHAGO_ENV } from '../../../config';
import { getT } from '../../utils/translateManager';
import RNrestart from 'react-native-restart';

export default function DrawerContent(props) {
  const { navigation, setAlert } = props;
  const isWehagoV = WEHAGO_ENV === 'WEHAGOV';

  // redux
  const auth = useSelector(state => state.user.auth);
  const deployedServices = useSelector(
    state => state.deployed.deployedServices
  );
  const t = getT();

  const handleChangeCompany = async (cno, ccode) => {
    const company = {
      company_no: cno,
      company_code: ccode
    };

    await props.changeCompanyRequest(auth, company);
    RNrestart.Restart();
  };
  const onClickShortcutIcon = async type => {
    const os = Platform.OS;

    const iosMarketURL = {
      wehago: 'https://itunes.apple.com/app/id1363039300?mt=8',
      wedrive: 'https://itunes.apple.com/app/id1371359896?mt=8',
      fax: 'https://itunes.apple.com/app/id1490385513?mt=8',
      eapprovals: 'https://itunes.apple.com/app/id1485842855?mt=8',
      attendance: 'https://itunes.apple.com/app/id1494995182?mt=8',
      neors: 'https://itunes.apple.com/app/id1554789764?mt=8'
    };
    const androidMarketURL = {
      wehago:
        'https://play.google.com/store/apps/details?id=com.duzon.android.lulubizpotal',
      wedrive:
        'http://play.google.com/store/apps/details?id=com.douzone.android.wedrive',
      fax: 'http://play.google.com/store/apps/details?id=cloudfax.co.kr.wehagofax',
      eapprovals:
        'http://play.google.com/store/apps/details?id=com.douzone.android.eapprovals',
      attendance:
        'http://play.google.com/store/apps/details?id=com.douzone.android.attendance',
      neors:
        'http://play.google.com/store/apps/details?id=com.douzone.rs10.rs10viewer'
    };

    // ('RS10Viewer://mDeviceKey=<DeivceKey>&mPORTAL_ID=<portalId>&mAuth_a_token=<auth_a_token>&mAuth_r_token=<auth_r_token>&cno=<company_no>');
    const iosURL = {
      wehago: `wehago://?`,
      wedrive: `wedrive://?`,
      fax: `wehagofax://?`,
      eapprovals: `wehago.eapprovals://?`,
      attendance: `wehago.attendance://?`,
      neors: 'RS10Viewer://?'
    };
    const androidURL = {
      wehago: `wehago://app?name=meet&login=false`,
      wedrive: `com.douzone.android.wedrive://?`,
      fax: `cloudfax.co.kr.wehagofax://?`,
      eapprovals: `wehago.eapprovals://?`,
      attendance: `wehago.attendance://?`,
      neors: 'com.douzone.rs10.rs10viewer://?'
    };

    let deviceToken = type === 'neors' ? await UserApi.getDeviceInfo(auth) : '';

    const commonLoginInfo = `mPORTAL_ID=${auth.portal_id}&mHASH_KEY=${
      auth.HASH_KEY
    }&mAuth_r_token=${auth.AUTH_R_TOKEN}&mAuth_a_token=${
      auth.AUTH_A_TOKEN
    }&cno=${auth.cno}${
      type === 'neors'
        ? `&mDEVICE_TOKEN=${deviceToken?.thirdparty_a_token}`
        : ''
    }`;

    const androidLoginInfo = `portal_id=${auth.portal_id}&hash_key=${
      auth.HASH_KEY
    }&auth_r_token=${auth.AUTH_R_TOKEN}&auth_a_token=${auth.AUTH_A_TOKEN}&cno=${
      auth.cno
    }${
      type === 'neors' ? `&mDeviceKey=${deviceToken?.thirdparty_a_token}` : ''
    }`;

    /*
      param = { 
        mPORTAL_ID:auth.portal_id ... 
      }
      같은 형식으로 처리해서 보는게 더 깔끔할 것 같음 이렇게 수정 합시다
    */
    const url =
      type === 'wehago'
        ? os === 'ios'
          ? iosURL[type] + commonLoginInfo
          : androidURL[type] + androidLoginInfo
        : os === 'ios'
        ? iosURL[type] + commonLoginInfo
        : androidURL[type] + commonLoginInfo;

    Linking.openURL(url).catch(async err => {
      const result = await new Promise(res => {
        setAlert({
          type: 2,
          title: t('안내'),
          message: t('해당 서비스 사용을 위해 앱 설치가 필요합니다.\n해당 어플을 설치하시겠습니까?'),
          onConfirm: ()=>res(true),
          onCencel: ()=>res(false)
        });
      });
      debugger
      result &&
        Linking.openURL(
          os === 'ios' ? iosMarketURL[type] : androidMarketURL[type]
        ).catch(err => {
          setAlert({
            type: 1,
            title: t('alert_title_notion'),
            message: t('alert_text_no_app_store')
          });
        });
    });
  };
  const emptyIcon = () => (
    <TouchableOpacity style={styles.shortcut}>
      <>
        <View style={styles.shortcutImage} />
        <View style={styles.shortcutText} />
      </>
    </TouchableOpacity>
  );

  const ShortcutIcon = type => {
    if (!type) return emptyIcon();
    const onPress = () => onClickShortcutIcon(type);
    const text =
      type === 'wehago'
        ? 'WEHAGO'
        : type === 'neors'
        ? '내PC원격접속'
        : type === 'wedrive'
        ? '웹스토리지'
        : type === 'attendance'
        ? '근태관리'
        : type === 'eapprovals'
        ? '전자결재'
        : '';
    const source =
      type === 'wehago'
        ? btnWehago
        : type === 'neors'
        ? btnRs10
        : type === 'wedrive'
        ? btnWedrive
        : type === 'attendance'
        ? btnAtr
        : type === 'eapprovals'
        ? btnElecapproval
        : '';

    return (
      <TouchableOpacity onPress={onPress} style={styles.shortcut}>
        <>
          <Image source={source} style={styles.shortcutImage} />
          <Text style={styles.shortcutText}>{text}</Text>
        </>
      </TouchableOpacity>
    );
  };

  const DrawerChild = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <Text style={styles.serviceText}>{t('drawer_service')}</Text>
        <View style={styles.shortcutRow}>
          {ShortcutIcon(deployedServices[0])}
          {ShortcutIcon(deployedServices[1])}
          {ShortcutIcon(deployedServices[2])}
        </View>
        <View style={styles.shortcutRow}>
          {ShortcutIcon(deployedServices[3])}
          {ShortcutIcon(deployedServices[4])}
          {ShortcutIcon(deployedServices[5])}
        </View>
      </View>
    );
  };

  return (
    <DrawerContentContainer
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
            name={isWehagoV ? 'WEHAGO_V_BI' : 'logo64'}
            width={85}
            height={16}
          />
        </TouchableOpacity>
      }
      onTouchSetting={() => {
        navigation.closeDrawer();
        navigation.navigate('Configuration');
      }}
      selectedCompany={auth.last_company}
      onChangeCompany={handleChangeCompany}
    >
      <DrawerChild />
    </DrawerContentContainer>
  );
}

const styles = StyleSheet.create({
  shortcut: {
    width: 120,
    height: 80,
    marginHorizontal: 10,
    marginVertical: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  shortcutImage: {
    alignItems: 'center',
    width: 40,
    height: 40,
    marginBottom: 10
  },
  shortcutText: {
    fontSize: 11,
    alignItems: 'center'
  },
  shortcutRow: {
    height: 80,
    width: '100%',
    flexDirection: 'row',
    marginTop: 15
  },
  serviceText: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 15,
    width: '100%',
    fontWeight: 'bold'
  }
});
