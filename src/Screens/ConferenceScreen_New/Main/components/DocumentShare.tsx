import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';

import { DocumentShareProps } from '@screens/ConferenceScreen_New/types';

import FileList from './FileList';
import DrawingSketch from './DrawingSketch';

import icMicOff from '@assets/icons/mic_off.png';
import icMicOn from '@assets/icons/mic_on.png';
import buttonClose from '@oldassets/buttons/btnTnaviCloseNone_3x.png';

import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { getT } from '@utils/translateManager';

const DocumentShare: React.FC<DocumentShareProps> = ({ roomName }) => {
  const t = getT();
  const { documentListMode, room, mikeState } = useSelector(
    (state: RootState) => ({
      documentListMode: state.documentShare.documentListMode,
      room: state.conference.room,
      mikeState: state.conference.mikeState
    })
  );

  const localPipMode = false;

  const [isMikeOn, setIsMikeOn] = useState(!mikeState.isMuted());
  const [showTool, setShowTool] = useState(true);
  const [viewSize, setViewSize] = useState<{
    viewWidth: number;
    viewHeight: number;
  }>({ viewWidth: 0, viewHeight: 0 });

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
    const title = t('alert_title_mode_exit').replace('[@mode@]', MODE);
    const text = t('alert_text_quit')
      .replace('[@mode@]', MODE)
      .replace('[@mode@]', MODE);
    const handleConfirm = () => {
      room && room.sendMessage.setDrawingData();
      room && room.sendMessage.setDrawingShareMode(false);
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
            // imgList={imgList}
            imageSize={imageSize}
            showTool={showTool}
            presenter={presenter}
            orientation={orientation}
            mode={'drawing'}
            onChangeShowToolState={setShowTool}
            // onChangeDrawing={props.setDrawingMode}
            onSetDrawingData={handleDrawingData}
          />
        </View>
      </View>
      {documentListMode && !localPipMode && <FileList />}
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

export default DocumentShare;
