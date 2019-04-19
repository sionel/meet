import React from 'react';
import { View, StyleSheet, TouchableOpacity, dimmen, Text } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import DrawingSketch from './DrawingSketch';
import MainVideo from './MainVideo';
import TopArea from './TopArea';
import BottomArea from './BottomArea';
/**
 * ContentPresenter
 */
const ContentPresenter = props => {
  const { mainUser, callType, isVideoReverse, speaker, drawingMode } = props;

  return (
    <View style={styles.container} onLayout={props.onLayout}>
      {drawingMode ? (
        <DrawingSketch
          drawing={drawingMode}
          onChangeDrawing={props.setDrawingMode}
        />
      ) : (
        // <TouchableOpacity
        //   activeOpacity={0.7}
        //   style={styles.container}
        //   onPress={props.toggleConferenceMode}
        // >
        // 위에꺼로 좌우반전하면 ㅈ됨
        // 아래 View 로 해야 잘됨
        <View style={styles.container}>
          <MainVideo
            mainUser={mainUser}
            callType={callType}
            isVideoReverse={isVideoReverse}
            // orientation={props.orientation}
            // onPress={props.toggleConferenceMode}
            orientation={props.orientation}
            hasNotch={props.hasNotch}
            objectFit={props.objectFit}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={props.toggleConferenceMode}
            >
              <View
                style={
                  props.orientation === 'vertical'
                    ? styles.topAreaVertical
                    : styles.topAreaHorizontal
                }
              >
                {callType != 2 && (
                  <TopArea
                    orientation={props.orientation}
                    drawing={props.drawingMode}
                    onReverseVideo={props.onReverseVideo}
                    onChangeState={props.onChangeState}
                    onChangeDrawing={props.setDrawingMode}
                    onChangeObjectFit={props.onChangeObjectFit}
                    objectFit={props.objectFit}
                  />
                )}
              </View>

              {/* 하단 영역 */}
              <View
                style={
                  props.orientation === 'vertical'
                    ? styles.bottomAreaVertical
                    : styles.bottomAreaHorizontal
                }
              >
                <BottomArea
                  onClose={props.onClose}
                  onChangeSpeaker={props.onChangeSpeaker}
                  orientation={props.orientation}
                  callType={callType}
                  speaker={speaker}
                />
              </View>
            </TouchableOpacity>
          </MainVideo>
          {/* 싱단 영역 */}
        </View>
        // </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  contentVertical: {
    flex: 1,
    flexDirection: 'column'
    // transform: [{ rotateY: '0deg' }] // 좌우반전
  },
  contentHorizontal: {
    flex: 1,
    flexDirection: 'row'
    // transform: [{ rotateY: '0deg' }] // 좌우반전
  },
  topArea: {
    flex: 2
  },
  topAreaVertical: {
    position: 'absolute',
    top: 50,
    right: 25,
    display: 'flex',
    flexDirection: 'column'
  },
  topAreaHorizontal: {
    position: 'absolute',
    bottom: 50,
    left: 25,
    display: 'flex',
    flexDirection: 'row'
  },
  middleArea: {
    flex: 9
  },
  bottomAreaVertical: {
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
    // height: '21.5%',
    // flex: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomAreaHorizontal: {
    position: 'absolute',
    right: '5%',
    top: 0,
    bottom: 0,
    // width: '21.5%',
    // flex: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ContentPresenter;
