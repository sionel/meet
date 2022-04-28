import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SketchProps } from '@screens/ConferenceScreen_New/types';

import icMicOff from '@assets/icons/mic_off.png';
import icMicOn from '@assets/icons/mic_on.png';
import buttonClose from '@oldassets/buttons/btnTnaviCloseNone_3x.png';
import DrawingSketch from './DrawingSketch';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

const Sketch: React.FC<SketchProps> = ({
  isMikeOn,
  roomName,
  onPressExit,
  onPressMike
}) => {
  const { orientation, presenter, attributes, room } = useSelector(
    (state: RootState) => ({
      orientation: state.orientation.orientation,
      presenter: state.documentShare.presenter,
      attributes: state.documentShare.attributes,
      room: state.conference.room
    })
  );

  const [showTool, setShowTool] = useState(true);
  const [viewSize, setViewSize] = useState<{
    viewWidth: number;
    viewHeight: number;
  }>({ viewWidth: 0, viewHeight: 0 });
  const imageSize = [{ imgWidth: 4000, imgHeight: 3000 }];
  const [resources, setResources] = useState<any[]>(
    attributes ? JSON.parse(attributes?.resources) : []
  );

  const handleDrawingData = (data: any, page: number) => {
    console.log('handleDrawingData');
    room && room.sendMessage.setDrawingData(data, page);
  }

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
          <TouchableOpacity style={styles.exitButton} onPress={onPressExit}>
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
            onPress={onPressMike}
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
            image={resources[0]}
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
