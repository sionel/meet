import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Dimensions
} from 'react-native';

import { DocumentSharePresenterProps } from '@screens/ConferenceScreen_New/types';
import DrawingSketch from '../DrawingSketch';
import { Header } from './DocumentShareComponents';

const DocumentSharePresenter: React.FC<DocumentSharePresenterProps> = ({
  fileName,
  isMikeOn,
  showTool,
  resources,
  scrollRef,
  showPreView,
  imgList,
  page,
  imageSize,
  orientation,
  presenter,
  viewSize,
  onPressExit,
  onPressMike,
  onPressImageList,
  setViewSize,
  onPressArrow,
  setShowTool,
  handleDrawingData,
  _handleChangeImageSize
}) => {

  if (imageSize.length === 0) {
    console.log(1);
    
    _handleChangeImageSize(
      {
        imgWidth: 4000,
        imgHeight: 3000
      },
      0
    );
  }
  
  return (
    <View style={styles.backGroundView}>
      <View style={styles.headerTitle}>
        <Header
          onPressExit={onPressExit}
          onPressMike={onPressMike}
          onPressImageList={onPressImageList}
          onPressArrow={onPressArrow}
          isMikeOn={isMikeOn}
          fileName={fileName}
          showTool={showTool}
          resources={resources}
          scrollRef={scrollRef}
          showPreView={showPreView}
          imgList={imgList}
          page={page}
        />
      </View>
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
                mode={'document'}
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
    flex: 1
  },
  headerTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
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
  },
  topArea: {
    flex: 1,
    backgroundColor: '#00000090'
  },
  bottomArea: {
    flex: 3,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(232, 235, 239)'
  },
  header: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
    backgroundColor: '#fff'
  },
  headerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listHeaderText: {
    color: 'rgb(28, 144, 251)',
    fontFamily: 'DOUZONEText30'
  }
});

export default DocumentSharePresenter;
