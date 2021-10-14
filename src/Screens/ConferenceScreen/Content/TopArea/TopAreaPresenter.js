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

//TODO: 각 상황에 따라서 버튼 활성화를 해주는데 이 부분을 컨테이너에서 처리해주고 여기서는 해당 기능 플래그로만 관리하는게 베스트
const TopAreaPresenter = props => {
  if (props.conferenceMode !== ConferenceModes.NORMAL) {
    return (
      <View
        style={
          props.orientation === 'vertical'
            ? styles.settingBoxVertical
            : styles.settingBoxHorizontal
        }
      >
        <Fragment>
          {props.callType === 3 && (
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
          )}
          <CustomButton
            name="pen"
            width={24}
            height={24}
            areaWidth={42}
            areaHeight={36}
            onPress={_.throttle(() => props.onChangeDrawingMode(true), 500)}
          />
          {props.memberType !== 1 &&
            props.deployedServices.includes('wedrive') && (
              <CustomButton
                name="docShare"
                width={28}
                height={28}
                areaWidth={42}
                areaHeight={36}
                onPress={_.throttle(
                  () => props.toggleDocumentListMode(['FILELIST']),
                  500
                )}
              />
            )}
          {!Platform.isPad && (
            <CustomButton
              name="icoScreenShagre"
              width={28}
              height={28}
              areaWidth={42}
              areaHeight={36}
              onPress={props.toggleScreenFlag}
            />
          )}
          {!props.isScreenShare && (
            <CustomButton
              name="switch"
              width={30}
              height={30}
              areaWidth={42}
              areaHeight={36}
              onPress={props.toggleCameraFacingMode}
            />
          )}
          {!props.isScreenShare && (
            <CustomButton
              name="reverse"
              onPress={props.onReverseVideo}
              width={24}
              height={24}
              areaWidth={42}
              areaHeight={36}
            />
          )}
        </Fragment>
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
