import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { SketchProps } from '@screens/ConferenceScreen/types';

import icMicOff from '@assets/icons/mic_off.png';
import icMicOn from '@assets/icons/mic_on.png';
import buttonClose from '@oldassets/buttons/btnTnaviCloseNone_3x.png';

import DrawingSketch from './DrawingSketch';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { useTranslation } from 'react-i18next';

const Sketch: React.FC<SketchProps> = ({ roomName, onClose }) => {
  const { t } = useTranslation();
  const {
    orientation,
    presenter,
    page,
    room,
    mikeState
  } = useSelector((state: RootState) => ({
    orientation: state.orientation.orientation,
    presenter: state.documentShare.presenter,
    page: state.documentShare.page,
    room: state.conference.room,
    mikeState: state.conference.mikeState
  }));

  const [isMikeOn, setIsMikeOn] = useState(!mikeState.isMuted());
  const [showTool, setShowTool] = useState(true);
  const [viewSize, setViewSize] = useState<{
    viewWidth: number;
    viewHeight: number;
  }>({ viewWidth: 0, viewHeight: 0 });
  const imageSize = [{ imgWidth: 4000, imgHeight: 3000 }];

  const resources: any[] = [];

  const handleDrawingData = (data: any) => {
    room && room.sendMessage.setDrawingData(data, page);
  };

  const _handlePressMike = () => {
    if (isMikeOn) {
      mikeState.mute();
    } else {
      mikeState.unmute();
    }
    setIsMikeOn(!isMikeOn);
  };

  const _handlePressExit = () => {
    const MODE = t('meet_sketch');
    const title =
      presenter === 'localUser'
        ? t('alert_title_mode_exit').replace('[@mode@]', MODE)
        : t('alert_title_exit');
    const text = (
      presenter === 'localUser'
        ? t('alert_text_quit')
        : t('alert_text_quitconference')
    )
      .replace('[@mode@]', MODE)
      .replace('[@mode@]', MODE);
    const handleConfirm = () => {
      if (presenter === 'localUser') {
        room && room.sendMessage.setDrawingData();
        room && room.sendMessage.setDrawingShareMode(false);
      } else {
        onClose(false);
      }
    };
    Alert.alert(title, text, [
      {
        text: t('alert_button_cancel'),
        onPress: () => {}
      },
      {
        text: t('alert_button_confirm'),
        onPress: () => handleConfirm()
      }
    ]);
  };

  return (
    <View style={styles.backGroundView}>
      {showTool && (
        <View
          style={{
            ...styles.topButtonBar,
            paddingTop: 11,
            paddingBottom: 11,
            paddingLeft: 16,
            paddingRight: 16
          }}
        >
          <TouchableOpacity
            style={styles.exitButton}
            onPress={_handlePressExit}
          >
            <Image
              source={buttonClose}
              resizeMode={'cover'}
              style={{ width: 16.5, height: 17 }}
            />
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[styles.headerText, { flex: 1 }]}
          >
            {roomName}
          </Text>

          <TouchableOpacity
            style={[
              styles.micButton,
              isMikeOn && { backgroundColor: '#1c90fb' }
            ]}
            onPress={_handlePressMike}
          >
            <Image
              source={isMikeOn ? icMicOn : icMicOff}
              resizeMode={'cover'}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
      )}
      <View
        style={[
          styles.mainArea,
          {
            paddingLeft: 0,
            paddingRight: 0
          }
        ]}
      >
        <View
          style={styles.mainContainer}
          onLayout={event =>
            setViewSize({
              viewWidth: event.nativeEvent.layout.width,
              viewHeight: event.nativeEvent.layout.height
            })
          }
        >
          <DrawingSketch
            viewWidth={viewSize.viewWidth}
            viewHeight={viewSize.viewHeight}
            image={resources[page]}
            imageSize={imageSize}
            showTool={showTool}
            presenter={presenter}
            orientation={orientation}
            mode={'drawing'}
            onChangeShowToolState={setShowTool}
            onSetDrawingData={handleDrawingData}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backGroundView: {
    flex: 1,
    backgroundColor: 'rgb(242, 242, 242)'
  },
  topButtonBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  exitButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 7.5
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    height: 28,
    lineHeight: 28,
    fontFamily: 'DOUZONEText30'
  },
  micButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainArea: {
    flex: 1,
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});

export default Sketch;
