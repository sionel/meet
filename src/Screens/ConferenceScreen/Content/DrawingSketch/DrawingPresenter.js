/**
 * DrawingPresenter
 */

import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingBoard from './DrawingBoard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
const hasNotch = DeviceInfo.hasNotch();

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
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5,
          padding: 15,
          backgroundColor: '#f2f2f2',
          // backgroundColor: '#1D1D1D',
          width: '100%',
          height: '100%'
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
      <View style={styles.childrenWrapper}>{}</View>

      {/* 팔레트 디스플레이 */}
      <View
        style={{
          ...styles.tabWrapper,
          ...styles[`tabWrapper_${orientation}`],
          // height: 100,
          height:
            orientation === 'horizontal'
              ? '100%'
              : palette
              ? hasNotch
                ? 150
                : 125
              : hasNotch
              ? 100
              : 75,
          width:
            orientation === 'vertical'
              ? '100%'
              : palette
              ? hasNotch
                ? 150
                : 125
              : hasNotch
              ? 100
              : 75
        }}
      >
        <TouchableOpacity
          key={'color'}
          onPress={() => props.onChangeState('palette', !palette)}
          style={{
            ...styles.tabToggleWrapper,
            ...styles[`tabToggleWrapper_${orientation}`]
          }}
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
        <TouchableOpacity
          style={styles[`modeChangeButton_${orientation}`]}
          // onPress={() => alert(!props.drawing)}
          // onPress={() => props.onChangeDrawing(!props.drawing)}
          onPress={() => props.onChangeDrawingMode(false)}
        >
          <Text style={{ fontSize: 18, color: '#fff' }}>완료</Text>
        </TouchableOpacity>

        {/* 토글버튼 */}

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

        {/* ===== 메인선택 ===== */}
        <View
          style={{
            ...styles.mainSettingWrapper,
            ...styles[`mainSettingWrapper_${orientation}`]
          }}
        >
          {/* === 메인탭 === */}
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
          {/* === 메인탭 === */}
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
    bottom: 69,
    zIndex: 9
  },
  modeChangeButton_horizontal: {
    position: 'absolute',
    right: 25,
    top: 20,
    // left: hasNotch ? 50 : 25,
    right: hasNotch ? 62 : 40,
    zIndex: 9
  },

  tabWrapper: {
    bottom: 0,
    backgroundColor: '#1f1f1f',
    borderColor: '#c1c1c1',
    justifyContent: 'flex-end',
    zIndex: 7
  },
  // 세로
  tabWrapper_vertical: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  // 가로
  tabWrapper_horizontal: {
    position: 'relative',
    flexDirection: 'row'
  },

  mainSettingWrapper: {
    width: '100%',
    height: hasNotch ? 95 : 70,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  // 세로
  mainSettingWrapper_vertical: {
    height: hasNotch ? 105 : 70,
    flexDirection: 'row'
  },
  // 가로
  mainSettingWrapper_horizontal: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    width: hasNotch ? 105 : 75,
    height: '100%',
    flexDirection: 'column'
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#c1c1c1'
  },
  // 세로
  detailSettingWrapper_vertical: {
    height: 60,
    width: '100%'
    // borderBottomWidth: 1
  },
  // 가로
  detailSettingWrapper_horizontal: {
    justifyContent: 'flex-end',
    width: 65,
    paddingTop: 10,
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
    marginBottom: 14
  },

  // 탭토글 컨테이너
  tabToggleWrapper: {
    // height: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center'
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
  tabToggleIcon_horizontal: {},

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
