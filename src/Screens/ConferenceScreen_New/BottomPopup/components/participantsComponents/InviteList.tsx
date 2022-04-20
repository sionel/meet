import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableHighlight,
  Image
} from 'react-native';

import { BlurView } from '@react-native-community/blur';
import deviceInfoModule from 'react-native-device-info';
import _ from 'lodash';

import { InviteListProps } from '@screens/ConferenceScreen_New/types';

//Icon
import icOrganizationW from '@assets/icons/ic_organization_w.png';
import icMailW from '@assets/icons/ic_mail_w.png';
import icPhoneW from '@assets/icons/ic_phone_w.png';
import icShareW from '@assets/icons/ic_share_w.png';
import icLinkW from '@assets/icons/ic_link_w.png';
import icCodeW from '@assets/icons/ic_code.png';

const isPad = deviceInfoModule.isTablet();
const { height } = Dimensions.get('window');
const { OS } = Platform;

const InviteList: React.FC<InviteListProps> = ({
  onPressCode,
  onPressEmail,
  onPressSms,
  onPressLink,
  onPressShare
}) => {
  return (
    <BlurView
      style={[styles.popupContainer]}
      overlayColor="rgba(255,255,255,0.01)"
    >
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}
      >
        <View style={styles.popupHeader}>
          <Text style={styles.headerText}>{`참석자 초대`}</Text>
        </View>
        <View>
          {/* 조직도로 초대하기 */}
          {/* <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(()=>{}, 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icOrganizationW}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`조직도로 초대하기`}</Text>
            </View>
          </TouchableHighlight> */}
          {/* 이메일로 초대하기 */}
          <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(() => onPressEmail(), 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icMailW}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`이메일로 초대하기`}</Text>
            </View>
          </TouchableHighlight>
          {/* SMS로 초대하기 */}
          <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(() => onPressSms, 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icPhoneW}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`SMS로 초대하기`}</Text>
            </View>
          </TouchableHighlight>
          {/* 공유하기 */}
          <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(() => onPressShare, 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icShareW}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`공유하기`}</Text>
            </View>
          </TouchableHighlight>
          {/* 공유링크 복사하기 */}
          <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(() => onPressLink, 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icLinkW}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`공유링크 복사하기`}</Text>
            </View>
          </TouchableHighlight>
          {/* 참여코드 복사하기 */}
          <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(() => onPressCode, 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icCodeW}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`참여코드 복사하기`}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    elevation: 2,
    flex: 1
  },

  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'DOUZONEText50'
  },
  MenuRow: {
    flex: 1
  },
  MenuRowView: {
    paddingLeft: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  frontIcon: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  menuText: {
    fontSize: 15,
    fontFamily: 'DOUZONEText30',
    color: '#fff',
    letterSpacing: -0.3
  }
});

export default InviteList;
