import React from 'react';
import {
  Platform,
  TouchableOpacity,
  View,
  Text,
  Linking,
  Image,
  StyleSheet
} from 'react-native';
import { useSelector } from 'react-redux';

import btnWehago from '../../../assets/icons/shortcut/ico_service_wehago.png'; // 위하고
import btnWedrive from '../../../assets/icons/shortcut/ico_service_wedrive.png'; // 위드라이브
import btnFax from '../../../assets/icons/shortcut/ico_service_fax.png'; // 팩스
import btnElecapproval from '../../../assets/icons/shortcut/ico_service_elecapproval.png'; // 전자결재
import btnAtr from '../../../assets/icons/shortcut/ico_service_atr.png'; // 근태관리

// import { DrawerContentContainer } from 'rn-component';
import DrawerContentContainer from './DrawerContentContainer';
import CustomIcon from '../CustomIcon';
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

  const onClickShortcutIcon = type => {
    const os = Platform.OS;

    const iosMarketURL = {
      wehago: 'https://itunes.apple.com/app/id1363039300?mt=8',
      wedrive: 'https://itunes.apple.com/app/id1371359896?mt=8',
      fax: 'https://itunes.apple.com/app/id1490385513?mt=8',
      elecapproval: 'https://itunes.apple.com/app/id1485842855?mt=8',
      atr: 'https://itunes.apple.com/app/id1494995182?mt=8'
    };
    const androidMarketURL = {
      wehago:
        'https://play.google.com/store/apps/details?id=com.duzon.android.lulubizpotal',
      wedrive:
        'http://play.google.com/store/apps/details?id=com.douzone.android.wedrive',
      fax:
        'http://play.google.com/store/apps/details?id=cloudfax.co.kr.wehagofax',
      elecapproval:
        'http://play.google.com/store/apps/details?id=com.douzone.android.eapprovals',
      atr:
        'http://play.google.com/store/apps/details?id=com.douzone.android.attendance'
    };

    const iosURL = {
      // wehago: `wehago://app?name=meet&login=false`,
      wehago: `wehago://?`,
      wedrive: `wedrive://?`,
      fax: `wehagofax://?`,
      elecapproval: `wehago.eapprovals://?`,
      atr: `wehago.attendance://?`
    };
    const androidURL = {
      wehago: `wehago://app?name=meet&login=false`,
      wedrive: `com.douzone.android.wedrive://?`,
      fax: `cloudfax.co.kr.wehagofax://?`,
      elecapproval: `wehago.eapprovals://?`,
      atr: `wehago.attendance://?`
    };
    const commonLoginInfo = `&mPORTAL_ID=${auth.portal_id}&mHASH_KEY=${auth.HASH_KEY}&mAuth_r_token=${auth.AUTH_R_TOKEN}&mAuth_a_token=${auth.AUTH_A_TOKEN}&cno=${auth.cno}`;
    const androidLoginInfo = `&portal_id=${auth.portal_id}&hash_key=${auth.HASH_KEY}&auth_r_token=${auth.AUTH_R_TOKEN}&auth_a_token=${auth.AUTH_A_TOKEN}&cno=${auth.cno}`;

    Linking.openURL(
      type === 'wehago'
        ? os === 'ios'
          ? iosURL[type] + commonLoginInfo
          : androidURL[type] + androidLoginInfo
        : os === 'ios'
        ? iosURL[type] + commonLoginInfo
        : androidURL[type] + commonLoginInfo
    ).catch(err => {
      console.warn('err1', err);
      Linking.openURL(
        os === 'ios' ? iosMarketURL[type] : androidMarketURL[type]
      ).catch(err => {
        console.warn('err2', err);
        Alert.alert(
          '스토어에서 해당 앱을 찾을 수 없습니다.',
          '',
          [{ text: 'OK' }],
          {
            cancelable: true
          }
        );
      });
    });
  };

  const DrawerChild = () => (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.serviceText}>전체서비스</Text>

      <View style={styles.shortcutRow}>
        <TouchableOpacity
          onPress={() => {
            onClickShortcutIcon('wehago');
          }}
          style={styles.shortcut}
        >
          <>
            <Image source={btnWehago} style={styles.shortcutImage} />
            <Text style={styles.shortcutText}>{'WEHAGO'}</Text>
          </>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onClickShortcutIcon('wedrive');
          }}
          style={styles.shortcut}
        >
          <>
            <Image source={btnWedrive} style={styles.shortcutImage} />
            <Text style={styles.shortcutText}>{'웹오피스'}</Text>
          </>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onClickShortcutIcon('atr');
          }}
          style={styles.shortcut}
        >
          <>
            <Image source={btnAtr} style={styles.shortcutImage} />
            <Text style={styles.shortcutText}>{'근태관리'}</Text>
          </>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            onClickShortcutIcon('fax');
          }}
          style={styles.shortcut}
        >
          <>
            <Image source={btnFax} style={styles.shortcutImage} />
            <Text style={styles.shortcutText}>{'팩스'}</Text>
          </>
        </TouchableOpacity> */}
      </View>

      <View style={styles.shortcutRow}>
        <TouchableOpacity
          onPress={() => {
            onClickShortcutIcon('elecapproval');
          }}
          style={styles.shortcut}
        >
          <>
            <Image source={btnElecapproval} style={styles.shortcutImage} />
            <Text style={styles.shortcutText}>{'전자결재'}</Text>
          </>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcut}>
          <>
            <View style={styles.shortcutImage} />
            <View style={styles.shortcutText} />
          </>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcut}>
          <>
            <View style={styles.shortcutImage} />
            <View style={styles.shortcutText} />
          </>
        </TouchableOpacity>
      </View>
    </View>
  );

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
    >
      <DrawerChild />
    </DrawerContentContainer>
  );
}

const styles = StyleSheet.create({
  shortcut: {
    width: 80,
    height: 60,
    marginHorizontal: 15,
    marginVertical: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
