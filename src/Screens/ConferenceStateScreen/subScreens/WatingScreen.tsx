import React, { Fragment, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { useSelector } from 'react-redux';
import waiting from '@oldassets/wating.png';
import icMaster from '@assets/icons/ic_master.png';

import { RootState } from '../../../redux/configureStore';
import { getT } from '@utils/translateManager';
import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';
import { isTablet } from 'react-native-device-info';

type accessUserInfo = {
  full_path: string;
  is_master: boolean;
  profile_url: string;
  user: string;
  user_name: string;
  user_type: number;
};

type watingScreenProps = {
  start: string;
  isTablet: boolean;
  accessUser: accessUserInfo[];
};

export default function WatingScreen(props: watingScreenProps) {
  const { start, isTablet, accessUser } = props;
  // console.log('start : ', start);

  const { length } = accessUser;

  const [time, setTime] = useState(0);
  const { isHorizon } = useSelector((state: RootState) => ({
    isHorizon: state.orientation.isHorizon
  }));

  useEffect(() => {
    const _timer = setInterval(() => {
      let reserveTime = new Date(start).getTime();
      let remainTime = Math.floor((reserveTime - Date.now()) / 1000);
      setTime(remainTime);
    }, 500);
    return () => {
      _timer && clearInterval(_timer);
    };
  });

  const second2String = (second: number) => {
    let minutes: any = Math.ceil(second / 60);
    let seconds: any = Math.ceil(second - (minutes - 1) * 60);

    if (minutes < 31) {
      return minutes + '분';
    } else if (minutes === 0 && seconds < 60) {
      console.log('second : ', second);
      console.log('seconds : ', seconds);
      return seconds + '초';
    }
  };

  return (
    <View style={styles.watingContainer}>
      <View style={styles.titleContainer}>
        <View style={styles.titleHeadView}>
          {time > 0 && (
            <Fragment>
              <Text style={styles.titleHeadText}>{`화상회의  시작 `}</Text>
              <Text style={styles.titleHeadTimeText}>{`${second2String(
                time
              )} `}</Text>
              <Text style={styles.titleHeadText}>{`전`}</Text>
            </Fragment>
          )}
        </View>
        <Text
          style={styles.titleSubText1}
        >{`해당 화상회의방은 현재 오픈 대기중입니다.`}</Text>
        <View style={styles.titleSubView}>
          <Text style={styles.titleSubText2}>{start}</Text>
          <Text style={styles.titleSubText1}>{`시작예정`}</Text>
        </View>
      </View>

      <Image
        source={waiting}
        style={{
          width: isTablet ? 500 : 330,
          height: isTablet ? 500 : 330,
          marginBottom: 24,
          alignSelf: 'center'
        }}
        resizeMode={'cover'}
      />

      <View style={styles.botContainer}>
        <View style={styles.botHeadView}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.botHeadText}>{`참여예정자 `}</Text>
            <Text style={styles.botHeadUserCount}>{length}</Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'DOUZONEText30',
                fontSize: 13,
                color: '#333'
              }}
            >{``}</Text>
          </View>
        </View>
        <FlatList
          data={accessUser}
          horizontal={true}
          windowSize={7}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const profileUrl = item.profile_url
              ? wehagoMainURL + item.profile_url
              : wehagoDummyImageURL;
            const userName = item.user_name ? item.user_name : '외부';
            const isMaster = item.is_master;
            return (
              <View
                style={{
                  paddingRight: 16,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <View style={{ marginBottom: 6 }}>
                  <Image
                    source={{ uri: profileUrl }}
                    style={styles.profileSize}
                  />
                  {isMaster && (
                    <View style={styles.masterCircle}>
                      <Image
                        source={icMaster}
                        style={{ width: 10, height: 10 }}
                        resizeMode={'cover'}
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.nameText}>{userName}</Text>
              </View>
            );
          }}
        />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.5 }}>
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{`오픈 대기중입니다.`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  watingContainer: {
    flex: 1
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  titleHeadView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  titleSubView: {
    flexDirection: 'row',
    marginBottom: 9
  },
  botContainer: {
    flex: 1,
    paddingLeft: isTablet() ? 30 :  20,
    marginBottom: 24
  },
  botHeadView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20
  },
  masterCircle: {
    width: 14,
    height: 14,
    borderRadius: 10,
    backgroundColor: '#febc2c',
    position: 'absolute',
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    backgroundColor: '#eaebed',
    width: 295,
    height: 42,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleHeadText: {
    fontFamily: 'DOUZONEText50',
    fontSize: 20,
    color: '#000'
  },
  titleHeadTimeText: {
    fontFamily: 'DOUZONEText50',
    fontSize: 20,
    color: '#1c90fb'
  },
  titleSubText1: {
    fontFamily: 'DOUZONEText30',
    fontSize: 13,
    color: '#939393'
  },
  titleSubText2: {
    fontFamily: 'DOUZONEText30',
    fontSize: 13,
    color: '#333'
  },
  botHeadText: {
    fontFamily: 'DOUZONEText50',
    fontSize: 14,
    color: '#333'
  },
  botHeadUserCount: {
    fontFamily: 'DOUZONEText50',
    fontSize: 14,
    color: '#1c90fb'
  },
  nameText: {
    fontFamily: 'DOUZONEText30',
    fontSize: 12,
    color: '#333'
  },
  buttonText: {
    fontFamily: 'DOUZONEText30',
    fontSize: 16,
    color: '#c5c7c9'
  },
  profileSize: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
});

// 예약페이지 리뉴얼로 이전소스 주석처리
// const content = () => {
//   const t = getT();
//   return (
//     <View
//       style={{
//         ...styles.container,
//         paddingHorizontal: isHorizon ? '20%' : 15,
//         paddingVertical: isHorizon ? 20 : 0
//       }}
//     >
//       <View
//         style={{
//           height: isHorizon ? 260 : 500,
//           marginBottom: isHorizon ? 10 : 0,
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}
//       >
//         <Image
//           source={waiting}
//           resizeMode="contain"
//           style={{ width: 200, height: 200 }}
//         />
//         <Text style={{ fontSize: 14, color: 'rgb(80,80,80)' }}>
//           {t('roomstate_wating_title')}
//         </Text>
//         <View style={{paddingTop: 25 }}>
//           <Text style={{fontSize: 12, textAlign: 'center', color: 'rgb(171,171,171)' }}>
//             {t('roomstate_wating_thisroom')}
//             <Text style={{ color: 'rgb(28,144,251)' }}>{start}</Text>
//             {t('roomstate_wating_willstart')}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.infoBox}>
//         <View style={styles.line}>
//           <Text style={styles.linedot}>{'\u2B24'}</Text>
//           <Text style={{ fontSize: 12 }}>
//             {isTablet
//               ? `${t('roomstate_wating_modify')} ${t(
//                   'roomstate_wating_unable'
//                 )}`
//               : `${t('roomstate_wating_modify')}\n${t(
//                   'roomstate_wating_unable'
//                 )}`}
//           </Text>
//         </View>
//         <View style={styles.line}>
//           <Text style={styles.linedot}>{'\u2B24'}</Text>
//           <Text style={{ fontSize: 12 }}>
//             {t('roomstate_wating_master')}
//           </Text>
//         </View>
//         <View style={styles.line}>
//           <Text style={styles.linedot}>{'\u2B24'}</Text>
//           <Text style={{ fontSize: 12 }}>
//             {isTablet
//               ? `${t('roomstate_wating_continue')} ${t(
//                   'roomstate_wating_center'
//                 )}`
//               : `${t('roomstate_wating_continue')}\n${t(
//                   'roomstate_wating_center'
//                 )}`}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };
