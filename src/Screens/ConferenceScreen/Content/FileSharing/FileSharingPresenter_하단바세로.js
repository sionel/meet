import React from 'react';
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
  StatusBar
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DrawingSketch from '../DrawingSketch';
import CustomButton from '../../../../components/CustomButton';

const isIOS = Platform.OS === 'ios';
const hasNotch = DeviceInfo.hasNotch() && isIOS;

const FileSharingPresenter = props => {
  const { height, width } = Dimensions.get('window');
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

  const headerPadding =
    orientation === 'vertical' ? 0 + (isIOS ? 24 : 0) + (hasNotch ? 12 : 0) : 0;
  const bottomPadding =
    orientation === 'vertical'
      ? 0 + (hasNotch ? 12 : 0)
      : 0 + (hasNotch ? 0 : 0);
  const containerPadding =
    orientation === 'vertical' ? 0 : 0 + (hasNotch ? 36 : 0);
  const titleWidth = width - (containerPadding + 12) * 2 - 28 - 30 * 1;

  // 제목 표시줄
  const headerTitle = (
    <View
      style={{
        ...styles.topArea,
        // height: 46 + headerPadding,
        // 전체 기본 padding 12
        paddingTop: headerPadding + 12,
        paddingBottom: 12,
        paddingLeft: containerPadding + 12,
        paddingRight: containerPadding + 12
      }}
    >
      {presenter && (
        <CustomButton
          name={'buttonClose'}
          onPress={() => props.onChangeSharingMode(false, false)}
          style={{ paddingRight: 12, margin: 0 }}
          width={24}
          height={24}
          areaWdith={24}
          areaHeight={24}
        />
      )}
      <Text
        numberOfLines={1}
        ellipsizeMode={'tail'}
        style={[styles.headerText, { width: titleWidth }]}
      >
        {props.attributes.fileName}
      </Text>
      {/* <CustomButton
        name={'buttonClose'}
        onPress={() => props.onChangeSharingMode(false)}
        style={{ paddingLeft: 12, margin: 0 }}
        width={24}
        height={24}
        areaWdith={24}
        areaHeight={24}
      />
      <CustomButton
        name={'buttonClose'}
        onPress={() => props.onChangeSharingMode(false)}
        style={{ paddingLeft: 12, margin: 0 }}
        width={24}
        height={24}
        areaWdith={24}
        areaHeight={24}
      />
      <CustomButton
        name={'buttonClose'}
        onPress={() => props.onChangeSharingMode(false)}
        style={{ paddingLeft: 12, margin: 0 }}
        width={24}
        height={24}
        areaWdith={24}
        areaHeight={24}
      /> */}
    </View>
  );

  //미리보기
  const preView = (
    <View style={styles.preView}>
      <ScrollView horizontal={true}>
        <FlatList
          data={resources}
          page={page}
          horizontal={true}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => onChangePage(index, presenter)}>
              <Image
                source={{ uri: item }}
                style={[
                  styles.resourceItem,
                  {
                    borderColor:
                      index === page
                        ? 'rgb(28, 144, 251)'
                        : 'rgb(210, 210, 210)'
                  }
                ]}
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {!showTool && !showPreView && <StatusBar hidden={true} />}

      {/* topArea */}
      <View style={styles.headerTitle}>
        {!showTool && orientation === 'vertical' && (
          <View
            style={[
              styles.hideTopArea,
              {
                backgroundColor: showPreView ? '#000' : 'transparent',
                height: hasNotch ? 36 : showPreView ? 24 : 0
              }
            ]}
          />
        )}
        {showTool && headerTitle}
        {showPreView && preView}
        <CustomButton
          name={showPreView ? 'btnArrowUp' : 'btnArrowDown'}
          onPress={() => onChangeState('showPreView')}
          style={{ padding: 0, margin: 0 }}
          width={24}
          height={24}
          areaWdith={24}
          areaHeight={24}
        />
      </View>

      {/* mainArea */}
      <View
        style={[
          styles.mainArea,
          {
            paddingLeft: containerPadding,
            paddingRight: containerPadding
            // paddingBottom: bottomPadding + (showTool && presenter ? 54 : 0) + 12
          }
        ]}
      >
        {/* 문서공유 메인 화면 */}
        <View
          style={[
            styles.mainContainer,
            orientation === 'vertical'
              ? styles.mainContainerVertical
              : styles.mainContainerHorizontal
          ]}
        >
          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => onChangeState('showTool')}
            style={{ flex: 1 }}
          > */}
          <DrawingSketch
            // drawing={true}
            image={resources[page]}
            showTool={showTool}
            presenter={presenter}
            orientation={orientation}
            onChangeShowToolState={onChangeState}
            onClear={() => {}}
            // onChangeDrawing={() => {}}
            // onSetDrawingData={() => {}}
            onChangeDrawingMode={() => {}}
            // onClear={props.onClear}
            // orientation={props.orientation}
            onChangeDrawing={props.setDrawingMode}
            onSetDrawingData={props.onSetDrawingData}
            // onChangeDrawingMode={props.onChangeDrawingMode}
            hasNotch={props.hasNotch}
          />
          {/* </TouchableOpacity> */}
        </View>
      </View>
      {/* end mainArea */}

      {/* BottomArea */}
      {/* {showTool && presenter && (
        <View
          style={{
            ...styles.bottomArea,
            height: 54 + bottomPadding,
            // 전체 기본 padding 12
            paddingTop: 12,
            paddingBottom: bottomPadding + 12,
            paddingLeft: containerPadding,
            paddingRight: containerPadding
          }}
        >
          <View style={styles.drawingTool} />
          <Text style={{ color: '#fff' }}>bottomArea</Text>
        </View>
      )} */}
      {/* end bottomArea */}
    </View>
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
    height: 24
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
    height: 90,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 10,
    borderBottomColor: 'rgb(210, 210, 210)',
    borderBottomWidth: 1,
    backgroundColor: 'rgb(242, 242, 242)'
  },
  resourceItem: {
    width: 68,
    height: 68,
    marginLeft: 10,
    borderWidth: 1
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
