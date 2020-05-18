import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import { ConferenceModes } from '../../../../utils/ConstantsBackup';
import _ from 'underscore';

/**
 * TopAreaPresenter
 */
const TopAreaPresenter = props => {
  if (props.conferenceMode !== ConferenceModes.NORMAL) {
    return (
      // <TouchableOpacity
      // <View
      //   activeOpacity={1}
      //   style={
      //     props.orientation === 'vertical'
      //       ? styles.containerVertical
      //       : styles.containerHorizontal
      //   }
      // >
      <View
        style={
          props.orientation === 'vertical'
            ? styles.settingBoxVertical
            : styles.settingBoxHorizontal
        }
      >
        {/* {props.isMuteVideo ? null : ( */}
        <Fragment>
          <CustomButton
            name="talk"
            onPress={() =>
              props.toggleDocumentListMode(['CHATTING', 'USERLIST'])
            }
            width={30}
            height={30}
            areaWidth={42}
            areaHeight={36}
          />
          <CustomButton
            name="pen"
            width={24}
            height={24}
            areaWidth={42}
            areaHeight={36}
            // onPress={() => props.onChangeDrawing(!props.drawing)}
            onPress={_.throttle(() => props.onChangeDrawingMode(true), 500)}
          />
          <CustomButton
            name="docShare"
            width={28}
            height={28}
            areaWidth={42}
            areaHeight={36}
            // onPress={() => props.onChangeDrawing(!props.drawing)}
            // onPress={_.throttle(() => props.onChangeSharingMode(!props.sharing), 500)}
            onPress={_.throttle(
              () => props.toggleDocumentListMode(['FILELIST']),
              500
            )}
          />
          {/* <CustomButton
            name={props.objectFit === 'contain' ? 'zoomIn' : 'zoomOut'}
            onPress={props.onChangeObjectFit}
            width={23}
            height={23}
            areaWidth={42}
            areaHeight={36}
          /> */}
          <CustomButton
            name="switch"
            width={30}
            height={30}
            areaWidth={42}
            areaHeight={36}
            onPress={() => {
              // props.toggleCameraFacingMode();
              props.onReverseVideo();
            }}
          />
          <CustomButton
            name="reverse"
            onPress={props.onReverseVideo}
            width={24}
            height={24}
            areaWidth={42}
            areaHeight={36}
          />
        </Fragment>
        {/* )} */}
        {/* </View> */}
        {/* </TouchableOpacity> */}
        {/* isVideoReverse */}
      </View>
    );
  } else {
    return <View style={styles.container} />;
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
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
    alignItems: 'flex-end'
  },
  settingBoxHorizontal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginVertical: 10
  }
});

export default TopAreaPresenter;
