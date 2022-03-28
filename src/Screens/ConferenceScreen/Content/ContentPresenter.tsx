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
  handdlePersonPlus: () => void;
  handleKickUser: (id: string, masterName: string, userName: string) => void;
  updateRolefromMaster: (newMaster: string) => void;
  handleMicControlFromMaster: () => void;
  handleToggleMic: () => void;
  // limitedTime: number;
};

const ContentPresenter = (props: ContentPresenterProps) => {
  // console.log(props);

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
    handdlePersonPlus,
    handleToggleMic
  } = props;

  // const localPipMode = useSelector((state: RootState) => state.local.pipMode);
  const hideStatusbar = orientation === 'horizontal';
  return (
    <View
      style={{
        // position: 'absolute',
        // zIndex: 0,
        // elevation: 0,
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0,
        flex: 1
      }}
      onTouchEnd={({ nativeEvent }) => toggleConferenceMode(nativeEvent)}
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
          handleMicControlFromMaster={props.handleMicControlFromMaster}
          // limitedTime={limitedTime}
        />
      )}
      <MainView
        mainUser={props.mainUser}
        onClose={props.onClose}
        isVideoReverse={isVideoReverse}
        objectFit={objectFit}
        isMultipleView={isMultipleView}
      />
      {!localPipMode && <BottomArea {...props} />}
      {bottomPopup.show && (
        <BottomPopup
          {...bottomPopup}
          handleBottomPopup={handleBottomPopup}
          bottomPopup={bottomPopup}
          handelProfieBackButton={handelProfieBackButton}
          setIsPopupTouch={setIsPopupTouch}
          handdlePersonPlus={handdlePersonPlus}
          handleKickUser={props.handleKickUser}
          updateRolefromMaster={props.updateRolefromMaster}
          userList={userList}
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
