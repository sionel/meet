/**
 * DrawingPresenter
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  Platform,
  Dimensions,
  ScrollView,
  FlatList
} from 'react-native';
import { useSelector } from 'react-redux';

import DrawingBoard from './DrawingBoard';
import DeviceInfo from 'react-native-device-info';
import Slider from '@react-native-community/slider';
// import { Slider } from 'react-native';
import CustomIcon from './../../../../components/CustomIcon';

const isIOS = Platform.OS === 'ios';
const hasNotch = DeviceInfo.hasNotch() && isIOS;

const DrawingPresenter = props => {
  const {
    selectedTab,
    stroke,
    color,
    eraser,
    palette,
    tabs,
    showTool,
    presenter,
    orientation,
    onClearAll,
    onChangeShowToolState
  } = props;

  const localPipMode = useSelector(state => state.local.pipMode);

  const vertical = orientation === 'vertical'; // 세로모드 인지
  // 길이값 비율
  const dividingWidth =
    (props.viewWidth * (localPipMode ? 1 : 0.9)) /
    props.imageSize[props.page].imgWidth;
  // const dividingWidth = (width * 0.8) / imgWidth;
  // 높이값 비율
  const dividingHeight =
    (props.viewHeight * (localPipMode ? 1 : 0.9)) /
    props.imageSize[props.page].imgHeight;
  // const dividingHeight = (height * 0.8) / imgHeight;
  const calcScale =
    dividingWidth < dividingHeight ? dividingWidth : dividingHeight;
  const scale = calcScale < 1 ? calcScale : 1;
  const resultSize = {
    width: props.imageSize[props.page].imgWidth * scale,
    height: props.imageSize[props.page].imgHeight * scale
  };

  const mainPaletteRender = () => {
    const renderList = ['stroke'];
    let rednerTab = [];
    renderList.map(item => {
      tabs.some(tab => {
        if (item === tab.id) {
          rednerTab.push(
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.5}
              onPress={() =>
                tab.onPress
                  ? tab.onPress()
                  : props.onChangeState('selectedTab', tab.id)
              }
            >
              <View
                style={{
                  ...styles.mainSettingItem,
                  // opacity: selectedTab === tabIndex ? 0.85 : 1,
                  // backgroundColor:
                  //   selectedTab === tabIndex
                  //     ? 'rgba(255,255,255, 0.45)'
                  //     : '#00000000',
                  ...styles[`mainSettingItem_vertical`]
                }}
              >
                <CustomIcon
                  name={selectedTab === tab.id ? tab.icon[1] : tab.icon[0]}
                  width={24}
                  height={24}
                />
              </View>
            </TouchableOpacity>
          );
        }
      });
    });
    return rednerTab;
  };

  const subPaletteStroke = (
    <View
      style={{
        ...styles.detailSettingWrapper,
        ...styles[`detailSettingWrapper_vertical`],
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ref={ref => props.onSetRef('subPalette', ref)}
      >
        {tabs.map(tab => {
          if (tab.id === 'stroke') {
            return tab.values.map((item, index) => (
              <TouchableOpacity
                key={String(item)}
                activeOpacity={1}
                onPress={() => props.onChangeState('color', index)}
              >
                <View
                  style={{
                    ...styles.detailSettingItem,
                    ...styles[`detailSettingItem_vertical`]
                    // opacity: color === index ? 0.45 : 1
                  }}
                >
                  {tab.render(item)}
                  {color === index && (
                    <CustomIcon
                      name={index === 0 ? 'checkBlue' : 'checkWhite'}
                      width={14}
                      height={14}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: -7,
                        marginLeft: -7
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ));
          }
        })}
      </ScrollView>

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10
        }}
      >
        <TouchableOpacity
          disabled={props.stroke <= 3}
          onPress={() => {
            props.onChangeState('stroke', props.stroke - 1);
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: props.stroke <= 3 ? 0.2 : 1
          }}
        >
          <CustomIcon name={'icoDecrease'} width={24} height={24} />
        </TouchableOpacity>
        <Slider
          value={stroke}
          minimumValue={3}
          maximumValue={10}
          minimumTrackTintColor={'rgb(28, 144, 251)'}
          maximumTrackTintColor={'rgb(211, 228, 244)'}
          thumbTintColor={'#ccc'}
          step={1}
          onSlidingComplete={value => props.onChangeState('stroke', value)}
          style={{ display: 'flex', flex: 8, height: 30 }}
        />
        <TouchableOpacity
          disabled={props.stroke >= 10}
          onPress={() => {
            props.onChangeState('stroke', props.stroke + 1);
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: props.stroke >= 10 ? 0.2 : 1
          }}
        >
          <CustomIcon name={'icoIncrease'} width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const subPaletteRender = id => {
    switch (id) {
      case 'pointer':
        return null;
      case 'stroke':
        return subPaletteStroke;
      case 'color':
        return null;
      default:
        return null;
    }
  };

  const mainPalette = mainPaletteRender();
  const subPalette = subPaletteRender(selectedTab);

  return (
    <View
      style={[
        styles.container,
        // styles[`flexDirection_vertical`],
        { width: props.viewWidth, height: props.viewHeight }
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => onChangeShowToolState('showTool')}
      >
        <DrawingBoard
          mode={['stroke'].some(val => val === selectedTab)}
          presenter={presenter}
          orientation={orientation}
          rWidth={resultSize.width}
          rHeight={resultSize.height}
          scale={scale}
          color={selectedTab == 3 ? 'transparent' : tabs[1].values[color]}
          stroke={stroke}
          page={props.page}
          onStrokeEnd={props.onSetDrawingData}
        />
      </TouchableOpacity>

      {/* <ScrollView
        ref={ref => props.onSetRef('documentList', ref)}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={event => {
          const {
            layoutMeasurement: { width: width }
          } = event.nativeEvent;
          const offset = isIOS
            ? event.nativeEvent.targetContentOffset.x
            : event.nativeEvent.contentOffset.x;

          if (
            offset / width > props.page &&
            props.page < props.imgList.length - 1
          ) {
            props.onSetRef('isSwipe', true);
            props.onChangePage(props.page + 1, props.presenter);
          } else if (offset / width < props.page - 0.01 && props.page > 0) {
            props.onSetRef('isSwipe', true);
            props.onChangePage(props.page - 1, props.presenter);
          } else {
            props.onChangePage(props.page, props.presenter);
          }
        }}
        style={{
          width: props.viewWidth,
          height: props.viewHeight
        }}
      >
        <FlatList
          data={props.imgList}
          horizontal={true}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                width: props.viewWidth,
                height: props.viewHeightght
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={() => onChangeShowToolState('showTool')}
              >
                <View
                  style={[
                    styles.boardContainer,
                    styles[`boardContainer_${orientation}`]
                  ]}
                >
                  <View
                    style={{
                      width: resultSize.width,
                      height: resultSize.height,
                      position: 'relative'
                    }}
                  >
                    {item}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        /> */}

      {/* 드로잉 영역 */}
      {/* <View
          style={[
            {
              position: 'absolute',
              top: props.viewHeight / 2,
              left: props.viewWidth * props.page + props.viewWidth / 2,
              marginTop: (resultSize.height / 2) * -1,
              marginLeft: (resultSize.width / 2) * -1,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
        >
          <DrawingBoard
            mode={['stroke'].some(val => val === selectedTab)}
            presenter={presenter}
            orientation={orientation}
            rWidth={resultSize.width}
            rHeight={resultSize.height}
            scale={scale}
            color={selectedTab == 3 ? 'transparent' : tabs[1].values[color]}
            stroke={stroke}
            page={props.page}
            onStrokeEnd={props.onSetDrawingData}
          />

          {selectedTab < 0 && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              }}
            />
          )}
        </View>
      </ScrollView> */}

      {/* 하단 영역 */}
      {showTool && presenter === 'localUser' && !localPipMode && (
        <View
          style={[
            styles.bottomArea,
            styles[`bottomArea_vertical`]
            // {
            //   width: vertical // 세로모드
            //     ? '100%'
            //     : hasNotch // 가로모드
            //     ? 134 - (palette ? 0 : 55) // 노치 유무
            //     : 110 - (palette ? 0 : 55) // 서브팔레트 유무
            // },
            // {
            //   height: !vertical
            //     ? 'auto'
            //     : hasNotch
            //     ? 134 - (palette ? 0 : 55)
            //     : 110 - (palette ? 0 : 55)
            // },
            // { right: hasNotch && !vertical ? -36 : 0 }
          ]}
        >
          {/* 팔레트 서브 */}
          {palette && subPalette}

          {/* ===== 메인 팔레드 ===== */}
          <View
            style={[
              styles.mainSettingWrapper,
              styles[`mainSettingWrapper_vertical`]
            ]}
          >
            <View
              style={[styles.mainTabWrapper, styles[`mainTabWrapper_vertical`]]}
            >
              {mainPalette}
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // alignItems: vertical ? 'center' : 'center',
                // marginRight: vertical ? 7.5 : 0,
                marginTop: orientation === 'horizontal' ? 7.5 : 0,
                marginRight: 10
              }}
            >
              <TouchableOpacity onPress={() => props.onDrawAction('undo')}>
                <CustomIcon name={'btnBack'} width={36} height={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.onDrawAction('redo')}>
                <CustomIcon name={'btnForward'} width={36} height={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClearAll} activeOpacity={0.5}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#fff',
                    marginLeft: 10,
                    fontFamily: 'DOUZONEText50'
                  }}
                >
                  모두 삭제
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

DrawingPresenter.defaultProps = {
  display: true
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
    width: '100%',
    height: '100%'
  },
  boardContainer_horizontal: {
    width: '100%',
    height: '100%'
  },

  bottomArea: {
    position: 'absolute',
    backgroundColor: '#000'
  },
  bottomArea_vertical: {
    flexDirection: 'column',
    // height: 110,
    bottom: 0,
    left: 0,
    right: 0
    // width: '100%'
  },
  bottomArea_horizontal: {
    flexDirection: 'row',
    width: 134,
    top: 48,
    right: 0,
    bottom: 0
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
    top: 20,
    right: 16 + hasNotch ? 24 : 0 + isIOS ? 12 : 0,
    zIndex: 9
  },

  // 메인 팔레트
  mainSettingWrapper: {
    backgroundColor: '#000'
  },
  mainSettingWrapper_vertical: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    // paddingLeft: 7.5,
    // paddingRight: 7.5,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mainSettingWrapper_horizontal: {
    flexDirection: 'column',
    width: 55,
    height: '100%',
    paddingTop: 7.5,
    paddingBottom: 7.5
  },

  mainTabWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  mainTabWrapper_vertical: {
    flexDirection: 'row',
    paddingLeft: 7.5,
    paddingRight: 7.5
  },
  mainTabWrapper_horizontal: {
    flexDirection: 'column'
  },

  mainSettingItem: {
    width: 39,
    height: 39,
    borderRadius: 25,
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
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  // 세로
  detailSettingWrapper_vertical: {
    // flexDirection: 'row',
    width: '100%',
    // height: 55,
    paddingLeft: 7.5,
    paddingRight: 7.5
  },
  detailSettingWrapper_horizontal: {
    flexDirection: 'column',
    width: 55,
    height: '100%',
    justifyContent: 'flex-start'
  },

  detailSettingItem: {
    width: 25,
    height: 25,
    backgroundColor: '#f1f1f1',
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
});

export default DrawingPresenter;
