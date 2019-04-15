import React from 'react';
import { View, StyleSheet, TouchableOpacity, dimmen } from 'react-native';
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
          onSetDrawingData={props.onSetDrawingData}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.container}
          onPress={props.toggleConferenceMode}
        >
          <MainVideo
            mainUser={mainUser}
            callType={callType}
            isVideoReverse={isVideoReverse}
          >
            <View
              style={
                props.orientation === 'vertical'
                  ? styles.contentVertical
                  : styles.contentHorizontal
              }
            >
              <View style={styles.topArea}>
                {callType != 2 && (
                  <TopArea
                    orientation={props.orientation}
                    drawing={props.drawingMode}
                    onReverseVideo={props.onReverseVideo}
                    onChangeState={props.onChangeState}
                    onChangeDrawing={props.setDrawingMode}
                  />
                )}
              </View>
              <View style={styles.middleArea} />
              <View
                style={
                  props.orientation === 'vertical'
                    ? styles.bottomAreaVertical
                    : styles.bottomAreaHorizontal
                }
              >
                {/* 하단 영역 */}
                <BottomArea
                  onClose={props.onClose}
                  onChangeSpeaker={props.onChangeSpeaker}
                  orientation={props.orientation}
                  callType={callType}
                  speaker={speaker}
                />
              </View>
            </View>
          </MainVideo>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentVertical: {
    flex: 1,
    flexDirection: 'column',
    transform: [{ rotateY: '0deg' }] // 좌우반전
  },
  contentHorizontal: {
    flex: 1,
    flexDirection: 'row',
    transform: [{ rotateY: '0deg' }] // 좌우반전
  },
  topArea: {
    flex: 2
  },
  middleArea: {
    flex: 9
  },
  bottomAreaVertical: {
    flex: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomAreaHorizontal: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ContentPresenter;
