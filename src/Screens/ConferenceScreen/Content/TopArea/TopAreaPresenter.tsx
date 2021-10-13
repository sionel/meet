import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import _ from 'underscore';

type propsType = {
  talkButton: boolean;
  penButton: boolean;
  docShareButton: boolean;
  screenShareButton: boolean;
  switchButton: boolean;
  reverseButton: boolean;
  orientation: 'horizontal' | 'vertical';
  onChangeDrawingMode: Function;
  toggleDocumentListMode: Function;
  toggleScreenFlag: Function;
  toggleCameraFacingMode: Function;
  onReverseVideo: Function;
};

const TopAreaPresenter = (props: propsType) => {
  const {
    talkButton,
    penButton,
    docShareButton,
    screenShareButton,
    switchButton,
    reverseButton,
    orientation,

    onChangeDrawingMode,
    toggleDocumentListMode,
    toggleScreenFlag,
    toggleCameraFacingMode,
    onReverseVideo
  } = props;

  return (
    <View
      style={
        orientation === 'vertical'
          ? styles.settingBoxVertical
          : styles.settingBoxHorizontal
      }
    >
      <View
        style={{
          position: 'absolute',
          width: 252,
          height: 36,
          top : 36,
          backgroundColor: '#ccf'
        }}
      />
      {talkButton && (
        <CustomButton
          name="talk"
          onPress={() => toggleDocumentListMode(['CHATTING', 'USERLIST'])}
          width={30}
          height={30}
          areaWidth={42}
          areaHeight={36}
        />
      )}
      {penButton && (
        <CustomButton
          name="pen"
          width={24}
          height={24}
          areaWidth={42}
          areaHeight={36}
          onPress={_.throttle(() => onChangeDrawingMode(true), 500)}
        />
      )}
      {docShareButton && (
        <CustomButton
          name="docShare"
          width={28}
          height={28}
          areaWidth={42}
          areaHeight={36}
          onPress={_.throttle(() => toggleDocumentListMode(['FILELIST']), 500)}
        />
      )}
      {screenShareButton && (
        <CustomButton
          name="icoScreenShagre"
          width={28}
          height={28}
          areaWidth={42}
          areaHeight={36}
          onPress={toggleScreenFlag}
        />
      )}
      {switchButton && (
        <CustomButton
          name="switch"
          width={30}
          height={30}
          areaWidth={42}
          areaHeight={36}
          onPress={toggleCameraFacingMode}
        />
      )}
      {reverseButton && (
        <CustomButton
          name="reverse"
          onPress={onReverseVideo}
          width={24}
          height={24}
          areaWidth={42}
          areaHeight={36}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000'
  },
  containerVertical: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 40,
    marginHorizontal: 10,
    alignItems: 'flex-start'
  },
  containerHorizontal: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 10,
    marginHorizontal: 20
  },
  timeBoxVertical: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  timeBoxHorizontal: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  settingBoxVertical: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#d12d'
  },
  settingBoxHorizontal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 10,
    backgroundColor: '#12d'
  }
});

export default TopAreaPresenter;
