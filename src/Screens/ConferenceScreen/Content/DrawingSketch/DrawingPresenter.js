/**
 * DrawingPresenter
 */

import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingBoard from './DrawingBoard';
import Icon from 'react-native-vector-icons/FontAwesome5';

const DrawingPresenter = props => {
  const {
    selectedTab,
    stroke,
    color,
    eraser,
    palette,
    tabs,
    display,
    orientation,
    hasNotch
  } = props;

  return (
    <View
      style={{
        ...styles.container,
        display: display ? 'flex' : 'none',
        flexDirection: orientation === 'vertical' ? 'column' : 'row'
      }}
    >
      {/* 팔레트 디스플레이 */}
      <View
        style={{
          ...styles.tabWrapper,
          ...styles[`tabWrapper_${orientation}`],
          height: orientation === 'horizontal' ? '100%' : palette ? 150 : 100,
          width: orientation === 'vertical' ? '100%' : palette ? 150 : 100
        }}
      >
        <TouchableOpacity
          style={styles[`modeChangeButton_${orientation}`]}
          onPress={() => props.onChangeDrawing(!props.drawing)}
        >
          <Text style={{ fontSize: 18, color: '#fff' }}>완료</Text>
        </TouchableOpacity>
        <View
          style={{
            ...styles.mainSettingWrapper,
            ...styles[`mainSettingWrapper_${orientation}`]
          }}
        >
          {tabs.map((tab, tabIndex) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => props.onChangeState('selectedTab', tabIndex)}
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

        {/* 확장 역역 */}
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
      </View>
      <TouchableOpacity
        key={'color'}
        onPress={() => props.onChangeState('palette', !palette)}
        style={
          {
            // flexDirection: 'row',
            // alignContent: 'center',
            // justifyContent: 'center'
          }
        }
      >
        <Icon
          name={`angle-${
            palette
              ? orientation === 'vertical'
                ? `up`
                : `left`
              : orientation === 'vertical'
              ? `down`
              : `right`
          }`}
          size={40}
          color={'#fff'}
          style={{
            ...styles.tabToggleIcon
            // ...styles[`tabToggleIcon_${orientation}`]
          }}
        />
      </TouchableOpacity>

      {/* Sketch Board */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5,
          backgroundColor: '#1D1D1D',
          width: '100%',
          hieght: '100%'
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
      {/*  */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // position: 'absolute',
    // zIndex: 22,
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    position: 'relative',
    width: '100%',
    height: '100%',
    // justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1D1D1D'
    // paddingLeft: 15
  },

  // 완료버튼
  modeChangeButton_vertical: {
    position: 'absolute',
    right: 15,
    top: 58,
    zIndex: 9
  },
  modeChangeButton_horizontal: {
    position: 'absolute',
    top: 20,
    left: 50,
    zIndex: 9
  },

  tabWrapper: {
    // flex: 0.3,
    // position: 'absolute',
    // width: '100%',
    // height: 150,
    // height: 'auto',
    backgroundColor: '#333',
    // width: '100%',

    borderColor: '#c1c1c1',
    zIndex: 7
  },
  // 세로
  tabWrapper_vertical: {
    // width: '100%',
    borderBottomWidth: 1
  },
  // 가로
  tabWrapper_horizontal: {
    // width: 150,
    // height: '100%',
    borderRightWidth: 1,
    flexDirection: 'row'
    // flexDirection: 'column'
  },

  mainSettingWrapper: {
    width: '100%',
    height: 95,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  // 세로
  mainSettingWrapper_vertical: {
    height: 95,
    flexDirection: 'row'
  },
  // 가로
  mainSettingWrapper_horizontal: {
    justifyContent: 'flex-end',
    width: 90,
    height: '100%',
    flexDirection: 'column'
    // justifyContent: 'flex-end'
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
    paddingLeft: 15,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#c1c1c1'
  },
  // 세로
  detailSettingWrapper_vertical: {
    height: 60,
    width: '100%',
    borderBottomWidth: 1
  },
  // 가로
  detailSettingWrapper_horizontal: {
    justifyContent: 'flex-end',
    width: 65,
    paddingTop: 10,
    paddingRight: 15,
    borderRightWidth: 1,
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
    marginBottom: 14.5
  },

  // 접기 버튼
  tabToggleIcon: {
    marginLeft: 10,
    marginRight: 10
    // alignContent: 'center',
    // justifyContent: 'center'
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3
  },
  tabToggleIcon_vertical: {
    // bottom: 20,
    // zIndex: 99
  },
  tabToggleIcon_horizontal: {
    // left: 0
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
