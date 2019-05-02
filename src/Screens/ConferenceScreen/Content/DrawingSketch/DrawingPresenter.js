/**
 * DrawingPresenter
 */

import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  Platform
} from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingBoard from './DrawingBoard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
const hasNotch = DeviceInfo.hasNotch();
const isIOS = Platform.OS === 'ios';

const DrawingPresenter = props => {
  const {
    selectedTab,
    stroke,
    color,
    eraser,
    palette,
    tabs,
    display,
    orientation
  } = props;

  return (
    <View
      style={{
        ...styles.container,
        display: display ? 'flex' : 'none',
        flexDirection: orientation === 'vertical' ? 'column' : 'row'
      }}
    >
      {/* Sketch Board */}
      <View
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5,
          padding: 15,
          backgroundColor: '#f2f2f2',
          // backgroundColor: '#1D1D1D',
          // width: '100%',
          // height: '100%'
          height: orientation === 'horizontal' ? '100%' : 'auto',
          width: orientation === 'vertical' ? '100%' : 'auto'
        }}
      >
        <DrawingBoard
          // color={selectedTab == 2 ? '#00000000' : tabs[1].values[color]}
          onStrokeEnd={props.onSetDrawingData}
          color={selectedTab == 2 ? '#ffffff' : tabs[1].values[color]}
          stroke={
            selectedTab == 2 ? tabs[2].values[eraser] : tabs[0].values[stroke]
          }
        />
      </View>
      {/* <View style={styles.childrenWrapper}>{}</View> */}

      {/* 팔레트 디스플레이 */}
      <View
        style={{
          ...styles.tabWrapper,
          ...styles[`tabWrapper_${orientation}`],

          height:
            orientation === 'horizontal'
              ? '100%'
              : palette
              ? hasNotch
                ? 175
                : 150
              : hasNotch
              ? 125
              : 100,
          width:
            orientation === 'vertical'
              ? '100%'
              : palette
              ? hasNotch
                ? 175
                : 150
              : hasNotch
              ? 125
              : 100
        }}
      >
        {/* START 접기 버튼 */}
        <TouchableOpacity
          key={'color'}
          onPress={() => props.onChangeState('palette', !palette)}
          style={{
            ...styles.tabToggleWrapper,
            ...styles[`tabToggleWrapper_${orientation}`]
          }}
          activeOpacity={1}
        >
          <Icon
            name={`angle-${
              palette
                ? orientation === 'vertical'
                  ? `down`
                  : `right`
                : orientation === 'vertical'
                ? `up`
                : `left`
            }`}
            size={40}
            color={'#333'}
            style={{
              ...styles.tabToggleIcon,
              ...styles[`tabToggleIcon_${orientation}`]
            }}
          />
        </TouchableOpacity>
        {/* END 접기 버튼 */}

        {/* START 팔레트 서브 버튼 */}
        {palette && (
          <View
            style={{
              ...styles.detailSettingWrapper,
              ...styles[`detailSettingWrapper_${orientation}`]
              // flexDirection: orientation === 'vertical' ? 'row' : 'column'
            }}
          >
            {/* === 서브탭 === */}
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
            {/* === 서브탭 === */}
          </View>
        )}
        {/* END 팔레트 서브 버튼 */}

        {/* ===== 메인선택 ===== */}
        <View
          style={[
            styles.mainSettingWrapper,
            styles[`mainTabWrapper_${orientation}`]
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
                        : '#00000000'
                  }}
                >
                  <Icon name={tab.icon} size={20} color={'#fff'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* === 메인탭 === */}

          {/* START 완료 버튼 */}
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: orientation === 'vertical' ? 'flex-end' : 'center',
              marginRight: orientation === 'vertical' ? 7.5 : 0,
              marginTop: orientation === 'horizontal' ? 7.5 : 0
            }}
          >
            <TouchableOpacity
              // style={styles[`modeChangeButton_${orientation}`]}
              // onPress={() => alert(!props.drawing)}
              // onPress={() => props.onChangeDrawing(!props.drawing)}
              onPress={() => props.onChangeDrawingMode(false)}
            >
              <Text style={{ fontSize: 18, color: '#fff' }}>완료</Text>
            </TouchableOpacity>
          </View>
          {/* END 완료 버튼 */}
        </View>
        {/* ===== 메인선택 ===== */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent'
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

  tabWrapper: {
    display: 'flex',
    // height: 200,
    // bottom: 0,
    backgroundColor: '#1f1f1f',
    borderColor: '#c1c1c1',
    zIndex: 7
  },
  // 세로
  tabWrapper_vertical: {
    // position: 'absolute',
    // justifyContent: 'space-between',
    // alignItems: 'flex-start',
    width: '100%'
  },
  // 가로
  tabWrapper_horizontal: {
    // position: 'relative',
    flexDirection: 'row',
    height: '100%'
    // justifyContent: 'flex-end',
    // alignItems: 'center'
  },

  mainSettingWrapper: {
    display: 'flex'
    // height: hasNotch ? 95 : 70,
  },
  // 세로
  mainSettingWrapper_vertical: {
    width: '100%',
    // height: 70 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  // 가로
  mainSettingWrapper_horizontal: {
    // justifyContent: 'flex-end',
    // alignItems: 'flex-start',
    // width: 70 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    height: '100%',
    flexDirection: 'column'
    // justifyContent: 'center',
    // alignItems: 'center'
  },

  mainTabWrapper: {
    flex: 1,
    // height: hasNotch ? 95 : 70,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  // 세로
  mainTabWrapper_vertical: {
    // width: '100%',
    // height: 70 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    flexDirection: 'row'
  },
  // 가로
  mainTabWrapper_horizontal: {
    // justifyContent: 'flex-end',
    // alignItems: 'flex-start',
    // width: 70 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    // height: '100%',
    flexDirection: 'column-reverse'
  },

  mainSettingItem: {
    width: 39,
    height: 39,
    borderRadius: 25,
    marginTop: 7.5,
    marginBottom: 7.5,
    marginLeft: 7.5,
    marginRight: 7.5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  detailSettingWrapper: {
    backgroundColor: '#3f3f3f',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#c1c1c1'
  },
  // 세로
  detailSettingWrapper_vertical: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    paddingTop: 7.5
    // borderBottomWidth: 1
  },
  // 가로
  detailSettingWrapper_horizontal: {
    justifyContent: 'flex-end',
    width: 55,
    height: '100%',
    // paddingTop: 10,
    // paddingRight: 15,
    flexDirection: 'column'
  },

  detailSettingItem: {
    width: 30,
    height: 30,
    backgroundColor: '#f1f1f1',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 25,
    marginBottom: 7.5,
    marginLeft: 7.5,
    marginRight: 7.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // 세로
  detailSettingItem_vertical: {},
  // 가로
  detailSettingItem_horizontal: {
    // marginBottom: 14
  },

  // 탭토글 컨테이너
  tabToggleWrapper: {
    display: 'flex',
    // height: 100,
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#f2f2f2'
  },
  // 탭토글 컨테이너
  tabToggleWrapper_vertical: {
    width: '100%'
  },
  // 탭토글 컨테이너
  tabToggleWrapper_horizontal: {},

  // 접기 버튼
  tabToggleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  tabToggleIcon_vertical: {},
  tabToggleIcon_horizontal: {
    marginLeft: 10,
    marginRight: 10
  },

  childrenWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  }
});

DrawingPresenter.defaultProps = {
  display: true
};

export default DrawingPresenter;
