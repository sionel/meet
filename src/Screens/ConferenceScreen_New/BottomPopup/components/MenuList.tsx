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

import { MenuListProps } from '@screens/ConferenceScreen_New/types';

//Icon
import icDocument from '@assets/icons/ic_document.png';
import icHand from '@assets/icons/ic_hand.png';
import icRecord from '@assets/icons/ic_record.png';
import icSketch from '@assets/icons/ic_sketch.png';
import icWrite from '@assets/icons/ic_write.png';
import icoScreenShagre from '@oldassets/icons/icoScreenShagre.png';

const isPad = deviceInfoModule.isTablet();
const { height } = Dimensions.get('window');
const { OS } = Platform;

const MenuList: React.FC<MenuListProps> = ({
  onPressSketch,
  onPressDocumentShare,
  onPressScreenShare,
  onPressRequestMic,
  isMaster,
  isMicControl
}) => {
  return (
    <BlurView
      style={styles.popupContainer}
      overlayColor="rgba(255,255,255,0.01)"
    >
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}
      >
        <View style={styles.popupHeader}>
          <Text style={styles.headerText}>{`더보기`}</Text>
        </View>
        <View>
          {/* 스케치 */}
          <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(() => onPressSketch(), 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icSketch}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`스케치`}</Text>
            </View>
          </TouchableHighlight>
          {/* 문서공유 */}
          <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(() => onPressDocumentShare(), 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icDocument}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`문서공유`}</Text>
            </View>
          </TouchableHighlight>
          {/* 화면공유 */}
          <TouchableHighlight
            style={styles.MenuRow}
            activeOpacity={0.9}
            underlayColor="rgba(242,242,242,0.1)"
            onPress={_.throttle(() => onPressScreenShare(), 750)}
          >
            <View style={styles.MenuRowView}>
              <Image
                source={icoScreenShagre}
                resizeMode={'contain'}
                style={styles.frontIcon}
              />
              <Text style={styles.menuText}>{`화면공유`}</Text>
            </View>
          </TouchableHighlight>
          {/* 발언권 모드 */}
          {isMaster && (
            <TouchableHighlight
              style={styles.MenuRow}
              activeOpacity={0.9}
              underlayColor="rgba(242,242,242,0.1)"
              onPress={_.throttle(() => onPressRequestMic(), 750)}
            >
              <View style={styles.MenuRowView}>
                <Image
                  source={icHand}
                  resizeMode={'contain'}
                  style={styles.frontIcon}
                />
                <Text style={styles.menuText}>
                  {isMicControl ? '발언권 모드 종료' : '발언권 모드'}
                </Text>
              </View>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
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

export default MenuList;
