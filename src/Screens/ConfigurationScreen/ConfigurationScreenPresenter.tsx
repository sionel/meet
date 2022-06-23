import React, { Fragment } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Dimensions
} from 'react-native';

// const { width } = Dimensions.get('screen');

// import icBack from '../../../assets/new/icons/ic_back_w.png';

// import icMenuInfo from '../../../assets/new/icons/ic_menu_info.png';
// import icMenuInfoLaw from '../../../assets/new/icons/ic_menu_info_law.png';
// import icMenuTrophy from '../../../assets/new/icons/ic_menu_trophy.png';
// import icMenuLogin from '../../../assets/new/icons/ic_menu_login.png';
import icArrowRight from '../../../assets/new/icons/ic_arrow_right.png';
import icBack from '../../../assets/new/icons/ic_back.png';
import icArrowDownBlack from '../../../assets/new/icons/ic_arrow_down_black.png';
import { getT } from '../../utils/translateManager';
import { isTablet } from 'react-native-device-info';

interface propsTypes {
  // onRedirect: (destination: string) => void;
  onLogout: () => void;
  goBack: () => void;
  handleGoPolicy: () => void;
  handleGoAwards: () => void;
  handleGoOpenSource: () => void;
  authInfo: {
    user_name: any;
    rankname: any;
    profile_url: any;
    full_path: any;
    companyName: any;
    isFreelancer: boolean;
  };
  onCompanyChange: () => void;
  width: number;
}

export default function ConfigurationScreenPresenter(props: propsTypes) {
  const {
    onLogout,
    goBack,
    handleGoAwards,
    handleGoOpenSource,
    handleGoPolicy,
    authInfo,
    onCompanyChange,
    width
  } = props;

  const t = getT();
  const userName = authInfo?.user_name;
  const rankName = authInfo?.rankname;
  return (
    // <Fragment>
    //   <SafeAreaView style={{ flex: 0, backgroundColor: '#1c90fb' }} />
    //   <SafeAreaView style={{ flex: 1 }}>
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View
        style={[styles.topTitle, { paddingHorizontal: isTablet() ? 20 : '5%' }]}
      >
        <TouchableOpacity onPress={goBack}>
          <Image
            source={icBack}
            style={{ width: 24, height: 24 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text style={styles.HeaderTitleText}>
          {t('renewal.option_setting')}
        </Text>
        <TouchableOpacity disabled={true}>
          <Text style={styles.emptyText}>확인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileView}>
        <Image
          source={{ uri: authInfo.profile_url }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.userName}>
            {userName ? userName + ' ' + rankName : ''}
          </Text>
          {!authInfo.isFreelancer && authInfo.full_path && (
            <Text style={styles.userEmail}>{authInfo.full_path}</Text>
          )}
        </View>
      </View>
      <View
        style={{
          width: '100%',
          backgroundColor: 'rgb(230,230,230)',
          height: 1
        }}
      />
      <View style={styles.menuText}>
        <Text style={styles.menuTextStyle}>{`Space`}</Text>
        <TouchableOpacity
          style={styles.selectConpany}
          onPress={() => onCompanyChange()}
        >
          <Text style={styles.menuTextStyle}>{authInfo.companyName}</Text>
          <Image
            source={icArrowDownBlack}
            style={styles.downArrow}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          backgroundColor: 'rgb(247,248,250)',
          height: 8
        }}
      />
      <View
        style={{
          // flex: 1,
          width: '100%',
          backgroundColor: '#fff'
        }}
      >
        <TouchableOpacity
          onPress={() => handleGoPolicy()}
          style={styles.menuText}
        >
          {/* <Image
            source={icMenuInfoLaw}
            style={styles.imgStyle}
            resizeMode={'contain'}
          /> */}
          <Text style={styles.menuTextStyle}>{t('renewal.option_legal')}</Text>
          <Image
            source={icArrowRight}
            style={styles.icRightArrow}
            resizeMode={'contain'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleGoAwards()}
          style={styles.menuText}
        >
          {/* <Image
            source={icMenuTrophy}
            style={styles.imgStyle}
            resizeMode={'contain'}
          /> */}
          <Text style={styles.menuTextStyle}> {t('option_awards')} </Text>
          <Image
            source={icArrowRight}
            style={styles.icRightArrow}
            resizeMode={'contain'}
          />
        </TouchableOpacity>

        <View
          style={{
            height: 48,
            width: width - 30,
            paddingLeft: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff'
          }}
        >
          {/* <Image
            source={icMenuInfo}
            style={styles.imgStyle}
            resizeMode={'contain'}
          /> */}
          <Text style={styles.menuTextStyle}>
            {t('renewal.option_version')}
          </Text>
          <Text
            style={{
              fontFamily: 'DOUZONEText30',
              color: '#1c90fb',
              fontSize: 13
            }}
          >
            {'2.4.3'}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            backgroundColor: 'rgb(247,248,250)',
            height: 8
          }}
        />
        <TouchableOpacity onPress={() => onLogout()} style={styles.menuText}>
          {/* <Image
            source={icMenuLogin}
            style={styles.imgStyle}
            resizeMode={'contain'}
          /> */}
          <Text style={styles.menuTextStyle}>{t('renewal.option_logout')}</Text>
          <Image
            source={icArrowRight}
            style={styles.icRightArrow}
            resizeMode={'contain'}
          />
        </TouchableOpacity>

        {/* <SectionList
        sections={[{ title: t('option_system'), data: userConfig }]}
        renderItem={({ item }, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.action}
            activeOpacity={0.6}
            style={styles.listItem}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CustomIcon name={item.icon} width={24} height={24} />
              <Text style={styles.item}>{item.title}</Text>
            </View>

            {item.content ? (
              <Text style={[styles.item, styles.content]}>{item.content}</Text>
            ) : item.nextPage ? (
              <CustomIcon name={'btn_next'} width={24} height={24} />
            ) : null}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index}
        style={
          props.hasNotch && {
            paddingLeft: props.orientation === 'LANDSCAPE-LEFT' ? 24 : 0,
            paddingRight: props.orientation === 'LANDSCAPE-RIGHT' ? 24 : 0
          }
        }
      /> */}
      </View>
    </SafeAreaView>
    //   </SafeAreaView>
    // </Fragment>
  );
}

const styles = StyleSheet.create({
  topTitle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    // borderColor: '#d1d1d1',
    // borderBottomWidth: 1,
    backgroundColor: '#fff'
  },
  HeaderTitleText: {
    fontSize: 18,
    // fontWeight: '600',
    color: '#333',
    fontFamily: 'DOUZONEText50'
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#00ff0000'
  },
  menuText: {
    height: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  menuTextStyle: {
    fontSize: 15,
    fontFamily: 'DOUZONEText30',
    color: '#333'
  },
  imgStyle: {
    width: 30,
    height: 25,
    marginRight: 15
  },
  icRightArrow: {
    width: 30,
    height: 25
  },
  profileView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    marginRight: 10
  },
  userName: {
    fontSize: 15,
    fontFamily: 'DOUZONEText30',
    color: '#000',
    marginBottom: 2
  },
  userEmail: {
    fontSize: 12,
    fontFamily: 'DOUZONEText30',
    color: 'rgb(147,147,147)'
  },
  selectConpany: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  downArrow: {
    width: 18,
    height: 18,
    marginLeft: 4
  }
});