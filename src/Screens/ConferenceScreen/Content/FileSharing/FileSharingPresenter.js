import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  FlatList,
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
    onChangeState
  } = props;

  const headerPadding =
    orientation === 'vertical' ? 0 + (isIOS ? 24 : 0) + (hasNotch ? 24 : 0) : 0;
  const bottomPadding =
    orientation === 'vertical'
      ? 0 + (hasNotch ? 12 : 0)
      : 0 + (hasNotch ? 0 : 0);
  const containerPadding =
    orientation === 'vertical' ? 0 : 0 + (hasNotch ? 36 : 0);
  const titleWidth = width - (containerPadding + 12) * 2 - 28 - 30 * 1;

  //미리보기
  const preView = (
    <View style={styles.preView}>
      <ScrollView horizontal={true}>
        <FlatList
          data={resources}
          page={page}
          horizontal={true}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => onChangeState('page', index)}>
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
      {/* topArea */}
      {showTool ? (
        <View
          style={{
            ...styles.topArea,
            height: 46 + headerPadding,
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
      ) : (
        <View style={{ ...styles.topArea, height: headerPadding }} />
      )}
      {/* end topArea */}

      {/* mainArea */}
      <View
        style={[
          styles.mainArea,
          {
            paddingLeft: containerPadding,
            paddingRight: containerPadding,
            paddingBottom: bottomPadding + (showTool && presenter ? 54 : 0) + 12,
          }
        ]}
      >
        {/* 미리보기 */}
        {showPreView && preView}

        {/* 미리보기 접기 버튼 */}
        <CustomButton
          name={showPreView ? 'btnArrowUp' : 'btnArrowDown'}
          onPress={() => onChangeState('showPreView')}
          style={{ padding: 0, margin: 0 }}
          width={24}
          height={24}
          areaWdith={24}
          areaHeight={24}
        />
        {/* 문서공유 메인 화면 */}
        <View
          style={[
            styles.mainContainer,
            orientation === 'vertical'
              ? styles.mainContainerVertical
              : styles.mainContainerHorizontal
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onChangeState('showTool')}
            style={{ flex: 1 }}
          >
            <ImageBackground
              source={{ uri: resources[page] }}
              resizeMode={'contain'}
              style={styles.imageBackground}
            >
              {/* <Text>Close Component</Text> */}
              {/* <DrawingSketch /> */}
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
      {/* end mainArea */}

      {/* BottomArea */}
      {showTool && presenter && (
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
      )}
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
  topArea: {
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    height: 24,
  },
  mainArea: {
    flex: 1,
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1,
    width: '100%',
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
  },
  resourceItem: {
    width: 68,
    height: 68,
    marginLeft: 10,
    borderWidth: 1,
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
    height: 40,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default FileSharingPresenter;
