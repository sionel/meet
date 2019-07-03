import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DrawingSketch from '../DrawingSketch';
import SettingButton from '../../Content/TopArea/SettingButton';

const isIOS = Platform.OS === 'ios';
const hasNotch = DeviceInfo.hasNotch() && isIOS;

const FileSharingPresenter = props => {
  const { height, width } = Dimensions.get('window');
  const { orientation, showTool, showPreView, onChangeState } = props;

  const headerPadding =
    orientation === 'vertical' ? 0 + (isIOS ? 12 : 0) + (hasNotch ? 24 : 0) : 0;
  const bottomPadding =
    orientation === 'vertical'
      ? 0 + (hasNotch ? 12 : 0)
      : 0 + (hasNotch ? 0 : 0);
  const containerPadding =
    orientation === 'vertical' ? 0 : 0 + (hasNotch ? 36 : 0);
  const titleWidth = width - (containerPadding + 12) * 2 - 28 - 30 * 1;

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
          <SettingButton
            name={'buttonClose'}
            onPress={() => props.onChangeSharingMode(false)}
            style={{ paddingRight: 12, margin: 0 }}
            width={24}
            height={24}
            areaWdith={24}
            areaHeight={24}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[styles.headerText, { width: titleWidth }]}
          >
            topArea topArea topArea topArea topArea.pptx
          </Text>
          <SettingButton
            name={'buttonClose'}
            onPress={() => props.onChangeSharingMode(false)}
            style={{ paddingLeft: 12, margin: 0 }}
            width={24}
            height={24}
            areaWdith={24}
            areaHeight={24}
          />
          <SettingButton
            name={'buttonClose'}
            onPress={() => props.onChangeSharingMode(false)}
            style={{ paddingLeft: 12, margin: 0 }}
            width={24}
            height={24}
            areaWdith={24}
            areaHeight={24}
          />
          <SettingButton
            name={'buttonClose'}
            onPress={() => props.onChangeSharingMode(false)}
            style={{ paddingLeft: 12, margin: 0 }}
            width={24}
            height={24}
            areaWdith={24}
            areaHeight={24}
          />
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
            paddingBottom: bottomPadding + (showTool ? 54 : 0) + 12
          }
        ]}
      >
        {showPreView && (
          <View
            style={[
              styles.preView,
              orientation === 'vertical'
                ? styles.preViewVertical
                : styles.preViewHorizontal
            ]}
          />
        )}
        <SettingButton
          name={showPreView ? 'btnArrowUp' : 'btnArrowDown'}
          onPress={() => onChangeState('showPreView')}
          style={{ padding: 0, margin: 0 }}
          width={24}
          height={24}
          areaWdith={24}
          areaHeight={24}
        />
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
            <Text>mainArea</Text>
          </TouchableOpacity>
        </View>
        {/* <ImageBackground
        source={{ uri: props.uri }}
        resizeMode={'contain'}
        style={styles.imageBackground}
      >
        <Text onPress={() => props.onChangeSharingMode(!props.sharing)}>
          Close Component
        </Text>
        <DrawingSketch/>
      </ImageBackground> */}
      </View>
      {/* end mainArea */}

      {/* BottomArea */}
      {showTool && (
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
    backgroundColor: 'red'
  },
  mainArea: {
    flex: 1,
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'yellow',
    borderWidth: 3,
    borderColor: 'red'
  },
  mainContainerVertical: {},
  mainContainerHorizontal: {},
  preView: {
    width: ' 100%',
    height: 90,
    // backgroundColor: 'blue',
    borderBottomColor: 'rgb(210, 210, 210)',
    borderBottomWidth: 1
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000'
  }
  // imageBackground: {
  //   width: width,
  //   height: height,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // }
});

export default FileSharingPresenter;
