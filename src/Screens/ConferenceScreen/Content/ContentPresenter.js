import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import RBSheet from 'react-native-raw-bottom-sheet';
import DrawingSketch from './DrawingSketch';
import MainVideo from './MainVideo';
import TopArea from './TopArea';
import BottomArea from './BottomArea';
import OverView from './OverView';

/**
 * ContentPresenter
 */
const ContentPresenter = props => {
  const {
    mainUser,
    callType,
    selectedRoomName,
    isVideoReverse,
    speaker,
    drawingMode,
    conferenceMode,
    createdTime,
    orientation,
    onClose
  } = props;

  const hideStatusbar = orientation === 'horizontal';

  return (
    <View style={styles.container} onLayout={props.onLayout}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'#000'}
        hidden={hideStatusbar}
      />
      {/* {drawingMode && ( */}
      {/* <DrawingSketch
        // display={true}
        display={drawingMode}
        drawing={drawingMode}
        onClear={props.onClear}
        orientation={props.orientation}
        onChangeDrawing={props.setDrawingMode}
        onSetDrawingData={props.onSetDrawingData}
        onChangeDrawingMode={props.onChangeDrawingMode}
        hasNotch={props.hasNotch}
      /> */}
      {/* )} */}

      {/* START MAIN VIDEO 영역 */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={props.toggleConferenceMode}
        activeOpacity={1}
      >
        <MainVideo
          mainUser={mainUser}
          callType={callType}
          selectedRoomName={selectedRoomName}
          isVideoReverse={isVideoReverse}
          // orientation={props.orientation}
          // onPress={props.toggleConferenceMode}
          orientation={props.orientation}
          hasNotch={props.hasNotch}
          objectFit={props.objectFit}
          drawing={drawingMode}
          conferenceMode={conferenceMode}
          createdTime={createdTime}
          onClose={onClose}
        />
      </TouchableOpacity>
      {/* END MAIN VIDEO 영역 */}

      {/* START 싱단 영역 */}
      <View
        style={[
          styles.topArea,
          props.orientation === 'vertical'
            ? [styles.topAreaVertical, { top: props.hasNotch ? 47 : 27 }]
            : [styles.topAreaHorizontal, { left: props.hasNotch ? 35 : 20 }]
        ]}
      >
        {callType != 2 && !drawingMode && (
          <TopArea
            orientation={props.orientation}
            drawing={props.drawingMode}
            sharing={props.attributes}
            onReverseVideo={props.onReverseVideo}
            onChangeState={props.onChangeState}
            onChangeDrawing={props.setSharingMode}
            onChangeObjectFit={props.onChangeObjectFit}
            objectFit={props.objectFit}
            onChangeDrawingMode={props.onChangeDrawingMode}
          />
        )}
      </View>
      {/* END 싱단 영역 */}

      {/* START 하단 영역 */}
      {/* {!drawingMode && ( */}
      <View
        style={[
          styles.bottomArea,
          props.orientation === 'vertical'
            ? styles.bottomAreaVertical
            : styles.bottomAreaHorizontal
        ]}
      >
        <BottomArea
          onClose={props.onClose}
          onChangeSpeaker={props.onChangeSpeaker}
          orientation={props.orientation}
          callType={callType}
          speaker={speaker}
        />
      </View>
      {/* )} */}
      {/* END 하단 영역 */}

      {/* OverView 영역 */}
      {props.documentListMode && (
        // <RBSheet
        //   ref={ref => props.onSetRef(ref)}
        //   height={props.height}
        //   closeOnDragDown={true}
        //   onClose={() => props.setDocumentListMode(false)}
        //   customStyles={{
        //     container: {
        //       backgroundColor: 'transparent'
        //     }
        //   }}
        // >
        <OverView
          mode={['USERLIST', 'FILELIST']}
          defaultMode={'FILELIST'}
          orientation={props.orientation}
          speaker={props.speaker}
          onChangeSharingMode={props.onChangeSharingMode}
          onChangeSpeaker={props.onChangeSpeaker}
        />
        // </RBSheet>
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
    position: 'absolute',
    display: 'flex',
    flex: 2
  },
  topAreaVertical: {
    // top: 25,
    right: 20,
    flexDirection: 'column'
  },
  topAreaHorizontal: {
    bottom: 15,
    // left: 25,
    flexDirection: 'row'
  },
  middleArea: {
    flex: 9
  },
  bottomArea: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 9
  },
  bottomAreaVertical: {
    bottom: '5%',
    left: 0,
    right: 0,
    flexDirection: 'row'
  },
  bottomAreaHorizontal: {
    right: '5%',
    top: 0,
    bottom: 0,
    flexDirection: 'column'
  }
});

export default ContentPresenter;
