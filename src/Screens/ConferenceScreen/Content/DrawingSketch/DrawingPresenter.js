/**
 * DrawingPresenter
 */

import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import DrawingBoard from './DrawingBoard';
import Icon from 'react-native-vector-icons/FontAwesome';

const DrawingPresenter = props => {
  const { selectedTab, stroke, color, eraser, palette, tabs } = props;

  return (
    <View style={styles.container}>
      {/* 팔레트 디스플레이 */}
      <View style={{ ...styles.tabWrapper, height: palette ? 150 : 100 }}>
        <Fragment>
          <View
            style={{
              position: 'absolute',
              right: 15,
              top: 50,
              zIndex: 9
            }}
          >
            <Button
              title="완료"
              color={'#fff'}
              onPress={() => props.onChangeDrawing(!props.drawing)}
            />
          </View>
          <View style={styles.mainSettingWrapper}>
            {tabs.map((tab, tabIndex) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => props.onChangeState('selectedTab', tabIndex)}
              >
                <View
                  style={{
                    ...styles.mainSettingItem,
                    opacity: selectedTab === tabIndex ? 0.35 : 1
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
          {palette && (
            <View style={styles.detailSettingWrapper}>
              {tabs[selectedTab].values.map((value, valueIndex) => (
                <TouchableOpacity
                  key={String(value)}
                  onPress={() =>
                    props.onChangeState(tabs[selectedTab].id, valueIndex)
                  }
                >
                  <View
                    style={{
                      ...styles.detailSettingItem,
                      opacity:
                        props[tabs[selectedTab].id] === valueIndex ? 0.35 : 1
                    }}
                  >
                    <Text>{value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Fragment>
      </View>
      <TouchableOpacity
        key={'color'}
        onPress={() => props.onChangeState('palette', !palette)}
        style={{
          flex: 0,
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: '#00000000'
        }}
      >
        <Icon
          name={`angle-${palette ? `up` : `down`}`}
          size={40}
          color={'#333'}
          style={styles.tabToggleIcon}
        />
      </TouchableOpacity>

      {/*  */}
      <View
        style={{
          flex: 1,
          // flexDirection: 'row',
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
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
    // paddingLeft: 15
  },

  tabWrapper: {
    // flex: 1.8,
    // position: 'absolute',

    // height: 150,
    height: 'auto',
    backgroundColor: '#333',
    width: '100%',
    zIndex: 7
  },

  mainSettingWrapper: {
    height: 95,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },

  mainSettingItem: {
    width: 39,
    height: 39,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 25,
    marginTop: 7.5,
    marginBottom: 7.5,
    marginLeft: 7.5,
    marginRight: 7.5
  },

  detailSettingWrapper: {
    height: 60,
    paddingLeft: 15,
    backgroundColor: '#333',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
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

  tabToggleIcon: {
    bottom: 0,
    alignContent: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },

  childrenWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  }
});

export default DrawingPresenter;
