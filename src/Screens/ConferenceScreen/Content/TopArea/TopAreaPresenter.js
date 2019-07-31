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
            name={props.objectFit === 'contain' ? 'zoomIn' : 'zoomOut'}
            onPress={props.onChangeObjectFit}
            width={23}
            height={23}
            areaWdith={28}
            areaHeight={28}
          />
          <CustomButton name="switch" onPress={props.toggleCameraFacingMode} />
          <CustomButton
            name="reverse"
            onPress={props.onReverseVideo}
            width={24}
            height={24}
            areaWdith={28}
            areaHeight={28}
          />
          {/* <CustomButton
            name="pen"
            width={25}
            height={25}
            areaWdith={25}
            areaHeight={28}
            // onPress={() => props.onChangeDrawing(!props.drawing)}
            onPress={_.throttle(() => props.onChangeDrawingMode(!props.drawing), 500)}
          /> */}
          <CustomButton
            name="docShare"
            width={28}
            height={28}
            areaWdith={28}
            areaHeight={28}
            // onPress={() => props.onChangeDrawing(!props.drawing)}
            // onPress={_.throttle(() => props.onChangeSharingMode(!props.sharing), 500)}
            onPress={_.throttle(() => props.toggleDocumentListMode(!props.documentListMode), 500)}
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
