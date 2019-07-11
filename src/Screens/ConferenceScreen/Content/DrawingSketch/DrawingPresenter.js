/**
 * DrawingPresenter
 */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  Button,
  Platform
} from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingBoard from './DrawingBoard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
// import FastImage from 'react-native-fast-image'
const isIOS = Platform.OS === 'ios';
const hasNotch = DeviceInfo.hasNotch() && isIOS;

const DrawingPresenter = props => {
  const {
    image,
    selectedTab,
    stroke,
    color,
    eraser,
    palette,
    tabs,
    display,
    showTool,
    presenter,
    orientation,
    onChangeShowToolState
  } = props;

  const vertical = orientation === 'vertical';

  return (
    <View style={[styles.container, styles[`flexDirection_${orientation}`]]}>
      {/* 드로잉 영역 */}
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1, width: '100%' }}
        onPress={() => onChangeShowToolState('showTool')}
      >
        <View
          style={[
            styles.boardContainer,
            styles[`boardContainer_${orientation}`]
          ]}
        >
          <ImageBackground
            source={{ uri: image }}
            resizeMode={'contain'}
            style={[
              // styles.imageBackground,
              {
                width: '75%',
                height: '75%',
                borderColor: 'blue',
                borderWidth: 1
              }
            ]}
          >
            <DrawingBoard
              onStrokeEnd={props.onSetDrawingData}
              color={selectedTab == 2 ? '#ffffff' : tabs[1].values[color]}
              stroke={
                selectedTab == 2
                  ? tabs[2].values[eraser]
                  : tabs[0].values[stroke]
              }
            />
          </ImageBackground>
        </View>
      </TouchableOpacity>

      {/* 하단 영역 */}
      {showTool && presenter && (
        <View
          style={[
            styles.bottomArea,
            styles[`bottomArea_${orientation}`],
            {
              width: vertical // 세로모드
                ? '100%'
                : hasNotch // 가로모드
                ? 134 - (palette ? 0 : 55) // 노치 유무
                : 110 - (palette ? 0 : 55) // 서브팔레트 유무
            },
            {
              height: !vertical
                ? 'auto'
                : hasNotch
                ? 134 - (palette ? 0 : 55)
                : 110 - (palette ? 0 : 55)
            },
            { right: hasNotch && !vertical ? -36 : 0 }
          ]}
        >
          {/* 팔레트 서브 */}
          {palette && (
            <View
              style={{
                ...styles.detailSettingWrapper,
                ...styles[`detailSettingWrapper_${orientation}`]
                // flexDirection: orientation === 'vertical' ? 'row' : 'column'
              }}
            >
              {tabs[selectedTab].values.map((value, valueIndex) => (
                <TouchableOpacity
                  key={String(value)}
                  onPress={() =>
                    selectedTab === 2 && value === 0
                      ? props.onClear()
                      : props.onChangeState(tabs[selectedTab].id, valueIndex)
                  }
                >
                  <View
                    style={{
                      ...styles.detailSettingItem,
                      ...styles[`detailSettingItem_${orientation}`],
                      opacity:
                        props[tabs[selectedTab].id] === valueIndex ? 0.45 : 1
                    }}
                  >
                    {tabs[selectedTab].render(value)}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ===== 메인 팔레드 ===== */}
          <View
            style={[
              styles.mainSettingWrapper,
              styles[`mainSettingWrapper_${orientation}`]
            ]}
          >
            {/* === 메인탭 === */}
            <View
              style={[
                styles.mainTabWrapper,
                styles[`mainTabWrapper_${orientation}`]
              ]}
            >
              {tabs.map((tab, tabIndex) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() =>
                    tab.onPress
                      ? tab.onPress()
                      : props.onChangeState('selectedTab', tabIndex)
                  }
                >
                  <View
                    style={{
                      ...styles.mainSettingItem,
                      // borderColor: '#fff',
                      opacity: selectedTab === tabIndex ? 0.85 : 1,
                      backgroundColor:
                        selectedTab === tabIndex
                          ? 'rgba(255,255,255, 0.45)'
                          : '#00000000',
                      ...styles[`mainSettingItem_${orientation}`]
                    }}
                  >
                    <Icon name={tab.icon} size={20} color={'#fff'} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: vertical ? 'flex-end' : 'center',
                marginRight: vertical ? 7.5 : 0,
                marginTop: orientation === 'horizontal' ? 7.5 : 0
              }}
            >
              <TouchableOpacity
                // style={styles[`modeChangeButton_${orientation}`]}
                // onPress={() => alert(!props.drawing)}
                // onPress={() => props.onChangeDrawing(!props.drawing)}
                onPress={() => props.onChangeDrawingMode(false)}
              >
                <Text style={{ fontSize: 18, color: '#fff' }}>모두 삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ===== 메인선택 ===== */}

          {/* 노치영역 */}
          {hasNotch && (
            <View
              style={{
                width: vertical ? '100%' : 24,
                height: vertical ? 24 : '100%',
                backgroundColor: '#000'
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexDirection_vertical: {
    flexDirection: 'column'
  },
  flexDirection_horizontal: {
    flexDirection: 'row'
  },

  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  boardContainer_vertical: {
    width: '100%'
  },
  boardContainer_horizontal: {
    height: '100%'
  },

  bottomArea: {
    position: 'absolute',
    backgroundColor: '#000'
  },
  bottomArea_vertical: {
    flexDirection: 'column',
    // width: '100%',
    height: 110,
    bottom: 0,
    left: 0,
    right: 0
  },
  bottomArea_horizontal: {
    flexDirection: 'row',
    width: 134,
    top: 48,
    right: 0,
    bottom: 0
    // height: '100%'
  },

  // 완료버튼
  modeChangeButton_vertical: {
    position: 'absolute',
    right: 15,
    bottom: 33 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    zIndex: 9
  },
  modeChangeButton_horizontal: {
    position: 'absolute',
    // right: 25,
    top: 20,
    // left: hasNotch ? 50 : 25,
    right: 16 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    zIndex: 9
  },

  // tabWrapper: {
  //   display: 'flex',
  //   // height: 200,
  //   // bottom: 0,
  //   backgroundColor: '#1f1f1f',
  //   borderColor: '#c1c1c1',
  //   zIndex: 7
  // },
  // tabWrapper_vertical: {
  //   // position: 'absolute',
  //   // justifyContent: 'space-between',
  //   // alignItems: 'flex-start',
  //   width: '100%'
  // },
  // tabWrapper_horizontal: {
  //   // position: 'relative',
  //   flexDirection: 'row',
  //   height: '100%'
  //   // justifyContent: 'flex-end',
  //   // alignItems: 'center'
  // },

  // 메인 팔레트
  mainSettingWrapper: {
    backgroundColor: '#000'
    // display: 'flex'
    // height: hasNotch ? 95 : 70,
  },
  mainSettingWrapper_vertical: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
    paddingLeft: 7.5,
    paddingRight: 7.5,
    // height: 70 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mainSettingWrapper_horizontal: {
    // justifyContent: 'flex-end',
    // alignItems: 'flex-start',
    // width: 70 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    flexDirection: 'column',
    width: 55,
    height: '100%',
    paddingTop: 7.5,
    paddingBottom: 7.5
    // justifyContent: 'center',
    // alignItems: 'center'
  },

  mainTabWrapper: {
    flex: 1,
    // width: '100%',
    // height: '100%',
    // height: hasNotch ? 95 : 70,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  mainTabWrapper_vertical: {
    // width: '100%',
    // height: 70 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    flexDirection: 'row',
    paddingLeft: 7.5,
    paddingRight: 7.5
  },
  mainTabWrapper_horizontal: {
    // justifyContent: 'flex-end',
    // alignItems: 'flex-start',
    // width: 70 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    // height: '100%',
    flexDirection: 'column'
    // paddingTop: 7.5,
    // paddingBottom: 7.5
  },

  mainSettingItem: {
    width: 39,
    height: 39,
    borderRadius: 25,
    // marginTop: 7.5,
    // marginBottom: 7.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainSettingItem_vertical: {
    marginRight: 7.5
  },
  mainSettingItem_horizontal: {
    marginBottom: 7.5
  },

  // 서브 팔레트
  detailSettingWrapper: {
    backgroundColor: '#1f1f1f',
    justifyContent: 'flex-start',
    alignItems: 'center'
    // padding: 5
    // borderColor: '#c1c1c1'
  },
  // 세로
  detailSettingWrapper_vertical: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
    paddingLeft: 7.5,
    paddingRight: 7.5
    // paddingTop: 7.5
    // borderBottomWidth: 1
  },
  detailSettingWrapper_horizontal: {
    flexDirection: 'column',
    width: 55,
    height: '100%',
    justifyContent: 'flex-start'
    // alignItems: 'center',
    // paddingTop: 7.5,
    // paddingRight: 7.5,
    // marginTop: -20
  },

  detailSettingItem: {
    width: 30,
    height: 30,
    backgroundColor: '#f1f1f1',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailSettingItem_vertical: {
    marginLeft: 7.5,
    marginRight: 7.5
  },
  // 가로
  detailSettingItem_horizontal: {
    marginTop: 7.5,
    marginBottom: 7.5
  }

  // // 탭토글 컨테이너
  // tabToggleWrapper: {
  //   display: 'flex',
  //   // height: 100,
  //   alignContent: 'center',
  //   justifyContent: 'center',
  //   textAlign: 'center',
  //   backgroundColor: '#f2f2f2'
  // },
  // // 탭토글 컨테이너
  // tabToggleWrapper_vertical: {
  //   width: '100%'
  // },
  // // 탭토글 컨테이너
  // tabToggleWrapper_horizontal: {},

  // // 접기 버튼
  // tabToggleIcon: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   textAlign: 'center'
  // },
  // tabToggleIcon_vertical: {},
  // tabToggleIcon_horizontal: {
  //   marginLeft: 10,
  //   marginRight: 10
  // },

  // childrenWrapper: {
  //   position: 'absolute',
  //   bottom: 0,
  //   width: '100%'
  // }
});

DrawingPresenter.defaultProps = {
  display: true
};

export default DrawingPresenter;
