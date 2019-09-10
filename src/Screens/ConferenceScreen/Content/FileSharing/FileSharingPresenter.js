import React, { Fragment } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

import DrawingSketch from '../DrawingSketch';
// import { CustomButton, CustomModal, CustomAlert } from '../../../../components';
import CustomButton from '../../../../components/CustomButton';
import CustomAlert from '../../../../components/CustomAlert';
import OverView from '../OverView';

const SafetyView = Platform.OS === 'ios' ? SafeAreaView : View;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FileSharingPresenter = props => {
  const {
    orientation,
    showTool,
    showPreView,
    presenter,
    resources,
    page,
    onChangeState,
    onChangePage
  } = props;

  const localPipMode = useSelector(state => state.local.pipMode);

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
        width={24}
        height={24}
        areaWidth={32}
        areaHeight={32}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode={'tail'}
        style={[styles.headerText, { flex: 1 }]}
      >
        {props.attributes.fileName}
      </Text>
      {/* <CustomButton
        name={'userList'}
        onPress={() => props.setDocumentListMode(true)}
        style={{ margin: 0 }}
        width={28}
        height={28}
        areaWidth={42}
        areaHeight={32}
      /> */}
      <CustomButton
        name={'talk'}
        onPress={() => props.setDocumentListMode(['CHATTING', 'USERLIST'])}
        style={{ margin: 0 }}
        width={28}
        height={28}
        areaWidth={42}
        areaHeight={32}
      />
    </View>
  );

  const imgList = () => {
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
  };

  //미리보기
  const preView = (
    <View style={[styles.preView, !showPreView && styles.preViewHidden]}>
      <ScrollView
        horizontal={true}
        // pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        ref={ref => props.onSetRef('preView', ref)}
      >
        <FlatList
          data={imgList()}
          horizontal={true}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onChangePage(index, presenter)}
              style={styles.resourceItem}
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

  const modalMessage =
    presenter === 'localUser'
      ? {
          title: '문서공유 종료',
          text:
            '문서공유를 종료하시겠습니까?\n(종료할 경우, 모든 참여자에게 문서가 보이지 않으며 화상대화 화면으로 돌아갑니다.)',
          onClickFeedback: () => props.onChangeSharingMode(false, false)
        }
      : {
          title: '화상대화 종료',
          text: '화상대화를 종료하시겠습니까?',
          onClickFeedback: props.onDisposeConference
        };

  return (
    <Fragment>
      <SafetyView
        style={{ flex: 1, backgroundColor: '#000', position: 'relative' }}
      >
        <View style={styles.container}>
          {/* topArea */}
          {!localPipMode && (
            <View style={styles.headerTitle}>
              {showTool && headerTitle}
              {preView}

              <CustomButton
                name={showPreView ? 'btnArrowUp' : 'btnArrowDown'}
                onPress={() => onChangeState('showPreView')}
                style={{ padding: 0, margin: 0 }}
                width={24}
                height={24}
                areaWidth={24}
                areaHeight={24}
              />
            </View>
          )}

          {/* mainArea */}
          <View
            style={[
              styles.mainArea,
              {
                paddingLeft: 0,
                paddingRight: 0
              }
            ]}
          >
            {/* 문서공유 메인 화면 */}
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
                  {localPipMode
                    ? '문서 로딩을 위해\n앱으로 돌아가세요.'
                    : '문서를 불러오는 중입니다.'}
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
                  imgList={imgList()}
                  imageSize={props.imageSize}
                  showTool={showTool}
                  presenter={presenter}
                  orientation={orientation}
                  onChangeShowToolState={onChangeState}
                  onChangeDrawing={props.setDrawingMode}
                  onSetDrawingData={props.onSetDrawingData}
                  onChangePage={props.onChangePage}
                  hasNotch={props.hasNotch}
                />
              </View>
            )}
          </View>
          {/* end mainArea */}
        </View>
      </SafetyView>

      {/* OverView 영역 */}
      {props.documentListMode && !localPipMode && (
        // <RBSheet
        //   ref={ref => props.onSetRef(ref)}
        //   height={props.height}
        //   closeOnDragDown={true}
        //   onClose={() => props.setDocumentListMode(false)}
        //   customStyles={{
        //     container: {
        //       backgroundColor: 'transparent'
        //     }
        //   }}
        // >
        <OverView
          mode={props.documentListMode}
          defaultMode={props.documentListMode[0]}
          orientation={props.orientation}
          speaker={props.speaker}
          onChangeSpeaker={props.onChangeSpeaker}
        />
        // </RBSheet>
      )}

      {/* <CustomModal
        display={props.modal}
        title={modalMessage.title}
        text={modalMessage.text}
        feedbackText="확인"
        onClickClose={() => props.onChangeState('modal')}
        onClickFeedback={modalMessage.onClickFeedback}
      /> */}
      {!localPipMode && (
        <CustomAlert
          visible={props.modal}
          title={modalMessage.title}
          width={320}
          description={modalMessage.text}
          actions={[
            {
              name: '취소',
              action: () => props.onChangeState('modal')
            },
            {
              name: '확인',
              action: modalMessage.onClickFeedback
            }
          ]}
          onClose={() => props.onChangeState('modal')}
        />
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(242, 242, 242)'
  },
  headerTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    fontSize: 20,
    height: 32,
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
    paddingRight: 10,
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
