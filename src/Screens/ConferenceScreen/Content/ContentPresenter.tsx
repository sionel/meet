import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';

import MainView from './RenwalContent/MainView';
import TopArea from './RenwalContent/TopArea';
import BottomArea from './RenwalContent/BottomArea';
import { ConferenceBottomPopupProps } from './ContentContainer';
import BottomPopup from './RenwalContent/Component/BottomPopup';
import { ParticipantsTypes } from '@redux/participants';
import OverView from './OverView';

type ContentPresenterProps = {
  mainUser: any;
  callType: any;
  selectedRoomName: any;
  isVideoReverse: any;
  speaker: any;
  drawingMode: any;
  conferenceMode: any;
  createdTime: any;
  orientation: any;
  onClose: any;
  localPipMode: any;
  toggleConferenceMode: any;
  objectFit: any;
  elapsedTime: any;
  bottomPopup: ConferenceBottomPopupProps;
  handleBottomPopup: any;
  onReverseVideo: any;
  setSharingMode: any;
  onChangeDrawingMode: any;
  onChangeSpeaker: () => void;
  onChangeMicMaster: () => void;
  userList: ParticipantsTypes[];
  isMultipleView: boolean;
  setIsMultipleView: () => void;
  handelProfieBackButton: () => void;
  setIsPopupTouch: any;
  documentListMode: any;
  onChangeSharingMode: any;
  // limitedTime: number;
};

const ContentPresenter = (props: ContentPresenterProps) => {
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
    onClose,
    localPipMode,
    toggleConferenceMode,
    objectFit,
    elapsedTime,
    bottomPopup,
    handleBottomPopup,
    userList,
    isMultipleView,
    setIsMultipleView,
    handelProfieBackButton,
    setIsPopupTouch,
    // limitedTime
  } = props;

  // const localPipMode = useSelector((state: RootState) => state.local.pipMode);
  const hideStatusbar = orientation === 'horizontal';
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 0,
        elevation: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}
      onTouchEnd={toggleConferenceMode}
    >
      {!localPipMode && Number(callType) !== 2 && !drawingMode && (
        <TopArea
          callType={Number(callType)}
          onReverseVideo={props.onReverseVideo}
          onChangeDrawing={props.setSharingMode}
          onChangeDrawingMode={props.onChangeDrawingMode}
          mainUser={props.mainUser}
          elapsedTime={elapsedTime}
          handleBottomPopup={handleBottomPopup}
          bottomPopup={bottomPopup}
          userList={userList}
          isMultipleView={isMultipleView}
          setIsMultipleView={setIsMultipleView}
          selectedRoomName={selectedRoomName}
          // limitedTime={limitedTime}
        />
      )}
      <MainView
        mainUser={props.mainUser}
        onClose={props.onClose}
        isVideoReverse={isVideoReverse}
        objectFit={objectFit}
        isMultipleView={isMultipleView}
        setIsMultipleView={setIsMultipleView}
      />
      {!localPipMode && <BottomArea {...props} />}
      {bottomPopup.show && (
        <BottomPopup
          {...bottomPopup}
          handleBottomPopup={handleBottomPopup}
          bottomPopup={bottomPopup}
          handelProfieBackButton={handelProfieBackButton}
          setIsPopupTouch={setIsPopupTouch}
        />
      )}
      {/* OverView 영역 */}
      {props.documentListMode && !localPipMode && (
        <OverView
          mode={props.documentListMode}
          defaultMode={props.documentListMode[0]}
          orientation={props.orientation}
          speaker={props.speaker}
          onChangeSharingMode={props.onChangeSharingMode}
          onChangeSpeaker={props.onChangeSpeaker}
        />
      )}
    </View>
    // <View style={styles.container} onLayout={props.onLayout}>
    //   <StatusBar
    //     barStyle="light-content"
    //     backgroundColor={'#000'}
    //     hidden={hideStatusbar}
    //   />
    //   <TouchableOpacity
    //     style={{ flex: 1 }}
    //     onPress={props.toggleConferenceMode}
    //     activeOpacity={1}
    //   >
    //     <MainVideo
    //       mainUser={mainUser}
    //       callType={callType}
    //       selectedRoomName={selectedRoomName}
    //       isVideoReverse={isVideoReverse}
    //       // orientation={props.orientation}
    //       // onPress={props.toggleConferenceMode}
    //       orientation={props.orientation}
    //       hasNotch={props.hasNotch}
    //       objectFit={props.objectFit}
    //       drawing={drawingMode}
    //       conferenceMode={conferenceMode}
    //       createdTime={createdTime}
    //       onClose={onClose}
    //     />
    //   </TouchableOpacity>
    //   {/* END MAIN VIDEO 영역 */}

    //   {/* START 싱단 영역 */}
    //   {!localPipMode && conferenceMode === ConferenceModes.CONTROL && (
    //     <View
    //       style={[
    //         styles.topArea,
    //         props.orientation === 'vertical'
    //           ? [styles.topAreaVertical, { top: props.hasNotch ? 47 : 27 }]
    //           : [styles.topAreaHorizontal, { left: props.hasNotch ? 35 : 20 }]
    //       ]}
    //     >
    //       {Number(callType) !== 2 && !drawingMode && (
    //         <TopArea
    //           callType={Number(callType)}
    //           orientation={props.orientation}
    //           drawing={props.drawingMode}
    //           sharing={props.attributes}
    //           onReverseVideo={props.onReverseVideo}
    //           onChangeState={props.onChangeState}
    //           onChangeDrawing={props.setSharingMode}
    //           objectFit={props.objectFit}
    //           onChangeDrawingMode={props.onChangeDrawingMode}
    //         />
    //       )}
    //     </View>
    //   )}
    //   {/* END 싱단 영역 */}

    //   {/* START 하단 영역 */}
    //   {/* {!drawingMode && ( */}
    //   {!localPipMode && (
    //     <View
    //       style={[
    //         styles.bottomArea,
    //         props.orientation === 'vertical'
    //           ? styles.bottomAreaVertical
    //           : styles.bottomAreaHorizontal
    //       ]}
    //     >
    //       <BottomArea
    //         onClose={props.onClose}
    //         onChangeSpeaker={props.onChangeSpeaker}
    //         orientation={props.orientation}
    //         callType={callType}
    //         speaker={speaker}
    //         onChangeMicMaster={props.onChangeMicMaster}
    //       />
    //     </View>
    //   )}
    //   {/* )} */}
    //   {/* END 하단 영역 */}

    //   {/* OverView 영역 */}
    //   {props.documentListMode && !localPipMode && (
    //     <OverView
    //       mode={props.documentListMode}
    //       defaultMode={props.documentListMode[0]}
    //       orientation={props.orientation}
    //       speaker={props.speaker}
    //       onChangeSharingMode={props.onChangeSharingMode}
    //       onChangeSpeaker={props.onChangeSpeaker}
    //     />
    //   )}
    //   {/* <TouchableOpacity
    //     style={{
    //       position: 'absolute',
    //       width: '100%',
    //       height: '100%',
    //       top: 100,
    //       backgroundColor: 'rgba(10,255,10,0.8)'
    //     }}
    //   /> */}
    // </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000'
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
  }
});

export default ContentPresenter;
