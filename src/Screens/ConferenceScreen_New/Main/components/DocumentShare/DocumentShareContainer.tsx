import React, {
  Fragment,
  MutableRefObject,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Dimensions
} from 'react-native';

import { DocumentShareContainerProps } from '@screens/ConferenceScreen_New/types';
import DrawingSketch from '../DrawingSketch';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { getT } from '@utils/translateManager';
import FastImage from 'react-native-fast-image';
import DocumentSharePresenter from './DocumentSharePresenter';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DocumentShareContainer: React.FC<DocumentShareContainerProps> = ({}) => {
  const t = getT();
  const { room, mikeState, page, orientation, presenter, attributes } =
    useSelector((state: RootState) => ({
      room: state.conference.room,
      mikeState: state.conference.mikeState,
      page: state.documentShare.page,
      orientation: state.orientation.orientation,
      presenter: state.documentShare.presenter,
      attributes: state.documentShare.attributes
    }));

  const dispatch = useDispatch();

  const localPipMode = false;
  const [imageSize, setImageSize] = useState<any[]>([]);
  const scrollRef: MutableRefObject<any> = React.useRef();
  const [isMikeOn, setIsMikeOn] = useState(!mikeState.isMuted());
  const [showTool, setShowTool] = useState(true);
  const [showPreView, setShowPreView] = useState(true);
  const [viewSize, setViewSize] = useState<{
    viewWidth: number;
    viewHeight: number;
  }>({ viewWidth: 0, viewHeight: 0 });
  const [scrollX, setScrollX] = useState<{ start: number; here: number }>({
    start: 0,
    here: 78
  });
  const [resources, setResources] = useState(
    attributes ? JSON.parse(attributes.resources) : []
  );
  const [isLoading, setIsLoading] = useState(true);

  let preImgList = attributes ? JSON.parse(attributes.resources) : [];
  preImgList = preImgList.map((src: any) => ({
    uri: src,
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.cacheOnly
  }));
  console.log('preImgList : ', preImgList);
  FastImage.preload(preImgList);

  const imgList = (() => {
    const list = resources.map((item: any, index: number) => (
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
          _handleChangeImageSize(size, index);
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    ));
    return list;
  })();

  const _handleChangeImageSize = (value: any, index: number) => {
    const imgLength = resources.length;
    let newimageSize=[];

    if (imageSize.length !== imgLength) {
      newimageSize = new Array(imgLength);
    }
    newimageSize[index] = value;

    debugger
    if (JSON.stringify(newimageSize).indexOf('null') < 0) {
      setImageSize(newimageSize);
      setIsLoading(false);
      
    }
    
  };

  const handleDrawingData = (data: any, param_page: number) => {
    room && room.sendMessage.setDrawingData(data, param_page);
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
    const MODE = t('meet_share');
    const title = t('alert_title_mode_exit').replace('[@mode@]', MODE);
    const text = t('alert_text_quit')
      .replace('[@mode@]', MODE)
      .replace('[@mode@]', MODE);
    const handleConfirm = () => {
      room && room.sendMessage.setDrawingData();
      room && room.sendMessage.setDrawingShareMode(false);
      room && room.sendMessage.setToogleDocumentShare(false);
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

  const _handlePressImgList = () => {};

  const _handlePressArrow = () => {
    setShowPreView(!showPreView);
  }

  useEffect(() => {
    console.log('page : ', page);
    // if(scrollRef) {
    //   const { width } = Dimensions.get('window');
    //   const raise =
    // }
  }, [page]);

  useEffect(() => {
    console.log('attributes : ', attributes);
    setResources(attributes ? JSON.parse(attributes.resources) : []);
  }, [attributes]);

  return (
    <DocumentSharePresenter
      isMikeOn={isMikeOn}
      fileName={attributes.fileName}
      showTool={showTool}
      scrollRef={scrollRef}
      showPreView={showPreView}
      imgList={imgList}
      resources={resources}
      page={page}
      imageSize={imageSize}
      orientation={orientation}
      presenter={presenter}
      viewSize={viewSize}
      onPressExit={_handlePressExit}
      onPressMike={_handlePressMike}
      onPressImageList={_handlePressImgList}
      setViewSize={setViewSize}
      onPressArrow={_handlePressArrow}
      setShowTool={setShowTool}
      handleDrawingData={handleDrawingData}
      _handleChangeImageSize={_handleChangeImageSize}
    />
  );
};

const styles = StyleSheet.create({
  backGroundView: {
    flex: 1
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

export default DocumentShareContainer;
