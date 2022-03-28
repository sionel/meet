import React, { Fragment } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

import DrawingSketch from '../DrawingSketch';
import CustomButton from '@components/CustomButton';
import CustomAlert from '@components/CustomAlert';
import OverView from '../OverView';
import { getT } from '@utils/translateManager';
import { gestureHandlerRootHOC, ScrollView, FlatList } from 'react-native-gesture-handler';

import micOFF from '@assets/icons/mic_off.png';
import micON from '@assets/icons/mic_on.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const { width, height } = Dimensions.get('screen');

const FileSharingPresenter = gestureHandlerRootHOC((props) => {
  const {
    orientation,
    showTool,
    showPreView,
    presenter,
    resources,
    page,
    mode,
    onChangeState,
    onChangePage,
    isMuteMic
  } = props;

  const localPipMode = useSelector(state => state.local.pipMode);
  const t = getT();
  // 제목 표시줄
  const headerTitle = (
    <View
      style={{
        ...styles.topArea,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 6,
        paddingRight: 6
      }}
    >
      <CustomButton
        name={'buttonClose'}
        onPress={() => props.onChangeState('modal')}
        style={{ margin: 0, marginRight: 10 }}
        width={22}
        height={22}
        areaWidth={28}
        areaHeight={28}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode={'tail'}
        style={[styles.headerText, { flex: 1 }]}
      >
        {mode === 'document'
          ? props.attributes.fileName
          : props.selectedRoomName}
      </Text>
      <TouchableOpacity
        style={[
          {
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center'
          },
          !isMuteMic && { backgroundColor: '#1c90fb' }
        ]}
        onPress={() => handleToggleMic()}
      >
        <Image
          source={isMuteMic ? micOFF : micON}
          resizeMode={'cover'}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      {/* <CustomButton
        name={'talk'}
        onPress={() => props.setDocumentListMode(['CHATTING', 'USERLIST'])}
        style={{ margin: 0 }}
        width={28}
        height={28}
        areaWidth={42}
        areaHeight={32}
      /> */}
    </View>
  );

  const imgList = (() => {
    const list = resources.map((item, index) => (
      <FastImage
        source={{
          uri: item,
          priority: FastImage.priority.high
        }}
        resizeMode={FastImage.resizeMode.contain}
        onLoad={event => {
          const size = {
            imgWidth: event.nativeEvent.width,
            imgHeight: event.nativeEvent.height
          };
          const scale = Math.max(
            screenWidth / size.imgWidth,
            screenHeight / size.imgHeight
          );
          if (scale > 1) {
            size.imgWidth = size.imgWidth * scale * 1.5;
            size.imgHeight = size.imgHeight * scale * 1.5;
          } else {
            size.imgWidth = size.imgWidth * 1.5;
            size.imgHeight = size.imgHeight * 1.5;
          }
          props.onChangeImageSize(size, index);
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    ));
    return list;
  })();

  //미리보기
  const preView = (
    <View style={[styles.preView, !showPreView && styles.preViewHidden]}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ref={ref => props.onSetRef('preView', ref)}
      >
        <FlatList
          data={imgList}
          horizontal={true}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onChangePage(index, presenter)}
              style={[
                styles.resourceItem,
                index === imgList.length - 1 && { marginRight: 10 }
              ]}
            >
              <Text style={styles.preViewPageNumber}>{index + 1}</Text>
              <View
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor:
                    index === page ? 'rgb(28, 144, 251)' : 'rgb(210, 210, 210)'
                }}
              >
                {item}
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );

  const MODE = mode === 'drawing' ? t('meet_sketch') : t('meet_share');
  const modalMessage =
    presenter === 'localUser'
      ? {
          title: t('alert_title_mode_exit').replace('[@mode@]', MODE),
          text: t('alert_text_quit')
            .replace('[@mode@]', MODE)
            .replace('[@mode@]', MODE),
          onClickFeedback: () => {
            props.onSetDrawingData();
            props.onChangeSharingMode(false, false);
            props.onChangeDrawingMode(false);
          }
        }
      : {
          title: t('alert_title_exit'),
          text: t('alert_text_quitconference'),
          onClickFeedback: props.onDisposeConference
        };

  if (props.imageSize === null) {
    props.onChangeImageSize(
      {
        imgWidth: 4000,
        imgHeight: 3000
      },
      0
    );
  }

  return (
    <Fragment>
      <StatusBar barStyle={'dark-content'} />
      <View style={[styles.container, Platform.OS ==='ios' && {marginBottom: height * 0.05}]}>
        {!localPipMode && (
          <View style={styles.headerTitle}>
            {showTool && headerTitle}
            {resources.length > 0 && preView}

            {resources.length > 0 && (
              <CustomButton
                name={showPreView ? 'btnArrowUp' : 'btnArrowDown'}
                onPress={() => onChangeState('showPreView')}
                style={{ padding: 0, margin: 0 }}
                width={24}
                height={24}
                areaWidth={24}
                areaHeight={24}
              />
            )}
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
          {props.isLoading ? (
            <View
              style={{
                flex: 1,
                alignContent: 'center',
                justifyContent: 'center'
              }}
            >
              <Text
                style={{ fontFamily: 'DOUZONEText30', textAlign: 'center' }}
              >
                {localPipMode ? t('meet_back') : t('meet_storage')}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.mainContainer,
                orientation === 'vertical'
                  ? styles.mainContainerVertical
                  : styles.mainContainerHorizontal
              ]}
              onLayout={event => {
                props.onChangeState('viewSize', {
                  viewWidth: event.nativeEvent.layout.width,
                  viewHeight: event.nativeEvent.layout.height
                });
              }}
            >
              <DrawingSketch
                viewWidth={props.viewWidth}
                viewHeight={props.viewHeight}
                image={resources[page]}
                imgList={imgList}
                imageSize={props.imageSize}
                showTool={showTool}
                presenter={presenter}
                orientation={orientation}
                mode={mode}
                onChangeShowToolState={onChangeState}
                onChangeDrawing={props.setDrawingMode}
                onSetDrawingData={props.onSetDrawingData}
                onChangePage={props.onChangePage}
                hasNotch={props.hasNotch}
              />
            </View>
          )}
        </View>
      </View>

      {props.documentListMode && !localPipMode && (
        <OverView
          mode={props.documentListMode}
          defaultMode={props.documentListMode[0]}
          orientation={props.orientation}
          speaker={props.speaker}
          onChangeSpeaker={props.onChangeSpeaker}
        />
      )}
      {!localPipMode && (
        <CustomAlert
          visible={props.modal}
          title={modalMessage.title}
          width={320}
          description={modalMessage.text}
          actions={[
            {
              name: t('alert_button_cancel'),
              action: () => props.onChangeState('modal')
            },
            {
              name: t('alert_button_confirm'),
              action: modalMessage.onClickFeedback
            }
          ]}
          onClose={() => props.onChangeState('modal')}
        />
      )}
    </Fragment>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.055,
    backgroundColor: 'rgb(242, 242, 242)'
  },
  headerTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    alignItems: 'center'
  },
  topArea: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'flex-start'
  },
  hideTopArea: {
    width: '100%'
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    height: 28,
    lineHeight: 28,
    fontFamily: 'DOUZONEText30'
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
  mainContainerVertical: {},
  mainContainerHorizontal: {},
  preView: {
    width: '100%',
    height: 85,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomColor: 'rgb(210, 210, 210)',
    borderBottomWidth: 1,
    backgroundColor: 'rgb(242, 242, 242)'
  },
  preViewHidden: {
    height: 0,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0
  },
  resourceItem: {
    position: 'relative',
    width: 68,
    height: 68,
    marginLeft: 10
  },
  preViewPageNumber: {
    fontSize: 12,
    marginBottom: 3,
    fontFamily: 'DOUZONEText30'
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000'
  },
  drawingTool: {
    position: 'absolute',
    left: 0,
    top: -40,
    width: '100%',
    height: 40
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1
  }
});

export default FileSharingPresenter;
