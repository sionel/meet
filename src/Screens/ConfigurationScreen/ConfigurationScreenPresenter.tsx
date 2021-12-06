import React, { Fragment } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity
} from 'react-native';

import icBack from '../../../assets/new/icons/ic_back_w.png';

import icMenuInfo from '../../../assets/new/icons/ic_menu_info.png';
import icMenuInfoLaw from '../../../assets/new/icons/ic_menu_info_law.png';
import icMenuTrophy from '../../../assets/new/icons/ic_menu_trophy.png';
import icMenuLogin from '../../../assets/new/icons/ic_menu_login.png';
import icArrowRight from '../../../assets/new/icons/ic_arrow_right.png';

interface propsTypes {
  onRedirect: (destination: string) => void;
  onLogout: () => void;
  goBack: () => void;
}

export default function ConfigurationScreenPresenter(props: propsTypes) {
  const { onRedirect, onLogout, goBack } = props;

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#1c90fb' }} />
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: 50,
            backgroundColor: '#1c90fb',
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity onPress={goBack}>
            <Image
              source={icBack}
              resizeMode={'contain'}
              style={{ width: 30 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 18,
              color: '#fff'
            }}
          >
            {'기본 설정'}
          </Text>
          <View style={{ width: 30 }} />
        </View>

        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          <View
            style={{
              height: 50,
              paddingHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#d1d1d1',
              borderBottomWidth: 1
            }}
          >
            <Image
              source={icMenuInfo}
              style={{ width: 30, height: 25, marginRight: 15 }}
              resizeMode={'contain'}
            />
            <Text style={{ flex: 1 }}> {'버전정보'} </Text>
            <Text>{'2.3.0'}</Text>
          </View>

          <TouchableOpacity
            onPress={() => onRedirect('Policy')}
            style={{
              height: 50,
              paddingHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#d1d1d1',
              borderBottomWidth: 1
            }}
          >
            <Image
              source={icMenuInfoLaw}
              style={{ width: 30, height: 25, marginRight: 15 }}
              resizeMode={'contain'}
            />
            <Text style={{ flex: 1 }}> {'이용약관 및 법률정보'} </Text>
            <Image
              source={icArrowRight}
              style={{ width: 30, height: 25 }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onRedirect('Awards')}
            style={{
              height: 50,
              paddingHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#d1d1d1',
              borderBottomWidth: 1
            }}
          >
            <Image
              source={icMenuTrophy}
              style={{ width: 30, height: 25, marginRight: 15 }}
              resizeMode={'contain'}
            />
            <Text style={{ flex: 1 }}> {'수상 및 인증내역'} </Text>
            <Image
              source={icArrowRight}
              style={{ width: 30, height: 25 }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onLogout}
            style={{
              height: 50,
              paddingHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#d1d1d1',
              borderBottomWidth: 1
            }}
          >
            <Image
              source={icMenuLogin}
              style={{ width: 30, height: 25, marginRight: 15 }}
              resizeMode={'contain'}
            />
            <Text style={{ flex: 1 }}> {'로그아웃'} </Text>
            <Image
              source={icArrowRight}
              style={{ width: 30, height: 25 }}
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
    </Fragment>
  );
}

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
