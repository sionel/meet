import React, { Fragment } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

// import icBack from '../../../assets/new/icons/ic_back_w.png';

import icMenuInfo from '../../../assets/new/icons/ic_menu_info.png';
import icMenuInfoLaw from '../../../assets/new/icons/ic_menu_info_law.png';
import icMenuTrophy from '../../../assets/new/icons/ic_menu_trophy.png';
import icMenuLogin from '../../../assets/new/icons/ic_menu_login.png';
import icArrowRight from '../../../assets/new/icons/ic_arrow_right.png';
import icBack from '../../../assets/new/icons/ic_back.png';
import { getT } from '../../utils/translateManager';

interface propsTypes {
  // onRedirect: (destination: string) => void;
  onLogout: () => void;
  goBack: () => void;
  handleGoPolicy: () => void;
  handleGoAwards: () => void;
  handleGoOpenSource: () => void;
}

export default function ConfigurationScreenPresenter(props: propsTypes) {
  const {
    onLogout,
    goBack,
    handleGoAwards,
    handleGoOpenSource,
    handleGoPolicy
  } = props;

  const t = getT();

  return (
    // <Fragment>
    //   <SafeAreaView style={{ flex: 0, backgroundColor: '#1c90fb' }} />
    //   <SafeAreaView style={{ flex: 1 }}>
    <SafeAreaView style={{ backgroundColor: '#F7F8FA' }}>
      <View style={[styles.topTitle]}>
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
      <View
        style={{
          // flex: 1,
          width: '100%',
          backgroundColor: '#F7F8FA'
        }}
      >
        <View style={styles.menuText}>
          <Image
            source={icMenuInfo}
            style={styles.imgStyle}
            resizeMode={'contain'}
          />
          <Text style={styles.menuTextStyle}>
            {' '}
            {t('renewal.option_version')}{' '}
          </Text>
          <Text style={{ fontFamily: 'DOUZONEText30' }}>{'2.4.1'}</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleGoPolicy()}
          style={styles.menuText}
        >
          <Image
            source={icMenuInfoLaw}
            style={styles.imgStyle}
            resizeMode={'contain'}
          />
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
          <Image
            source={icMenuTrophy}
            style={styles.imgStyle}
            resizeMode={'contain'}
          />
          <Text style={styles.menuTextStyle}> {t('option_awards')} </Text>
          <Image
            source={icArrowRight}
            style={styles.icRightArrow}
            resizeMode={'contain'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onLogout()} style={styles.menuText}>
          <Image
            source={icMenuLogin}
            style={styles.imgStyle}
            resizeMode={'contain'}
          />
          <Text style={styles.menuTextStyle}>
            {' '}
            {t('renewal.option_logout')}{' '}
          </Text>
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
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderColor: '#d1d1d1',
    borderBottomWidth: 1,
    backgroundColor: '#F7F8FA'
  },
  HeaderTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#00ff0000'
  },
  menuText: {
    // width: '100%',
    // flex: 1,
    height: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d1d1d1',
    borderBottomWidth: 1,
    backgroundColor: '#F7F8FA'
    // backgroundColor: 'red'
  },
  menuTextStyle: {
    flex: 1,
    fontFamily: 'DOUZONEText30'
  },
  imgStyle: {
    width: 30,
    height: 25,
    marginRight: 15
  },
  icRightArrow: { width: 30, height: 25 }
});

// /**
//  * ConfigurationScreenPresenter
//  */

// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SectionList,
//   TouchableOpacity
// } from 'react-native';
// import { CustomAlert, CustomIcon } from '../../components';
// import { WEHAGO_ENV } from '../../../config';
// import { getT } from '../../utils/translateManager';

// const ConfigurationScreenPresenter = props => {
//   const t = getT();
//   const userConfig = [
//     {
//       // 버전 수정
//       title: t('option_version'),
//       icon: 'ico_menu_info',
//       content: '2.3.0'
//     },
//     {
//       title: t('option_legal'),
//       icon: 'ico_menu_info_law',
//       action: () => props.navigation.navigate('Policy'),
//       nextPage: true
//     },
//     {
//       title: t('option_awards'),
//       icon: 'icoMenuTrophy',
//       action: () => props.navigation.navigate('Awards'),
//       nextPage: true
//     },
//     {
//       title: t('option_logout'),
//       icon: 'ico_menu_login',
//       action: () => props.onChangeValue('alert', true)
//     }
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={{ flex: 1, width: '100%' }}>
//         <SectionList
//           sections={[{ title: t('option_system'), data: userConfig }]}
//           renderItem={({ item }, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={item.action}
//               activeOpacity={0.6}
//               style={styles.listItem}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <CustomIcon name={item.icon} width={24} height={24} />
//                 <Text style={styles.item}>{item.title}</Text>
//               </View>

//               {item.content ? (
//                 <Text style={[styles.item, styles.content]}>
//                   {item.content}
//                 </Text>
//               ) : item.nextPage ? (
//                 <CustomIcon name={'btn_next'} width={24} height={24} />
//               ) : null}
//             </TouchableOpacity>
//           )}
//           keyExtractor={(item, index) => index}
//           style={
//             props.hasNotch && {
//               paddingLeft: props.orientation === 'LANDSCAPE-LEFT' ? 24 : 0,
//               paddingRight: props.orientation === 'LANDSCAPE-RIGHT' ? 24 : 0
//             }
//           }
//         />
//       </View>
//       <CustomAlert
//         visible={props.alert}
//         title={t('alert_title_logout')}
//         width={320}
//         description={t('alert_text_logout')}
//         actions={[
//           {
//             name: t('alert_button_cancel'),
//             action: () => props.onChangeValue('alert', false)
//           },
//           { name: t('alert_button_confirm'), action: () => props.onLogout() }
//         ]}
//         onClose={() => {
//           props.onChangeValue('alert', false);
//         }}
//       />
//     </View>
//   );
// };

// /**
//  * styles
//  */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },

//   listContainer: {
//     width: '100%',
//     padding: '3%'
//   },

//   listItem: {
//     flexDirection: 'row',
//     height: 50,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ececec'
//   },
//   item: {
//     marginLeft: 6,
//     fontSize: 14,
//     fontFamily: 'DOUZONEText30'
//   },
//   content: {
//     color: '#999',
//     fontSize: 12
//   }
// });

// export default ConfigurationScreenPresenter;
