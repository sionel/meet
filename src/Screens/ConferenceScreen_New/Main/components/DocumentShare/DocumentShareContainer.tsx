import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Alert, Dimensions } from 'react-native';

import { DocumentShareContainerProps } from '@screens/ConferenceScreen_New/types';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { getT } from '@utils/translateManager';
import FastImage from 'react-native-fast-image';
import DocumentSharePresenter from './DocumentSharePresenter';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const previewWidth = 78;

const DocumentShareContainer: React.FC<DocumentShareContainerProps> = ({
  onClose
}) => {
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
    here: previewWidth
  });
  const [resources, setResources] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prePage, setPrePage] = useState(-1);
  // const [preImageList, setPreImageList] = useState<any>(undefined);

  useEffect(() => {
    if (prePage > -1 && scrollRef) {
      const { width } = Dimensions.get('window');
      const raise = page > prePage;
      scrollX.here = (page + 1) * previewWidth;

      if(raise) {
        if (scrollX.start + width < scrollX.here) {
          const gap = scrollX.here - (scrollX.start + width);
          scrollX.start += gap + 10;
          scrollRef.current.scrollTo({
            x: scrollX.start,
            y: 0,
            animated: false
          });
        }
      } else {
        if (scrollX.start > scrollX.here - previewWidth) {
          scrollX.start = page * previewWidth;
          scrollRef.current.scrollTo({
            x: scrollX.start,
            y: 0,
            animated: false
          });
        }
      }
    }

    console.log('page : ', page);
    setPrePage(page);
  }, [page]);

  useEffect(() => {
    let parseResources =
      typeof attributes !== 'boolean' ? JSON.parse(attributes.resources) : [];
    parseResources.length > 0 && setResources(JSON.parse(attributes.resources));
  }, [attributes]);

  useEffect(() => {
    if (resources.length > 0) {
      let preImgList = resources;
      preImgList = preImgList.map((src: any) => ({
        uri: src,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.cacheOnly
      }));
      FastImage.preload(preImgList);
    }
  }, [resources]);

  const imgList = (() => {
    if (resources.length > 0) {
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
    }
  })();

  const _handleChangeImageSize = (value: any, index: number) => {
    const imgLength = resources.length;

    let newImage = [];
    if (imageSize.length !== imgLength) {
      newImage = new Array(imgLength);
    }
    newImage[index] = value;

    let sizeList = imageSize.slice(0);
    sizeList.unshift(newImage[index]);
    setImageSize(sizeList);

    if (JSON.stringify(newImage).indexOf('null') < 0) {
      setImageSize(newImage);
      setIsLoading(false);
    }
  };

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
    const MODE = t('meet_share');
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
        room && room.sendMessage.setToogleDocumentShare(false);
      } else {
        onClose();
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

  const _handlePressImgList = (pressPage: number) => {
    if (page !== pressPage) {
      room && room.sendMessage.setDocumentPage(pressPage, presenter);
    }
  };

  const _handlePressArrow = () => {
    setShowPreView(!showPreView);
  };

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
    />
  );
};

export default DocumentShareContainer;
