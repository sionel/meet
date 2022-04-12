import React, { Fragment, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  FlatList,
  StyleSheet,
  Platform,
  TouchableHighlight
} from 'react-native';
import deviceInfo from 'react-native-device-info';
// import {Text,TextInput} from '../../../components/StyledText';
const { OS } = Platform;
const { isTablet } = deviceInfo;
// const { width, height } = Dimensions.get('window');
const icPerson = require('../../../../assets/new/icons/ic_user.png');

export interface content {
  icon1?: ImageSourcePropType;
  icon2?: ImageSourcePropType | null;
  name: string;
  onClick: () => void;
}

interface BottomPopupProps {
  title: string;
  contentList: content[];
  onClickOutside: () => void;
}

export default function BottomPopup(
  props: BottomPopupProps & { isHorizon: boolean }
) {
  const { title, contentList, onClickOutside, isHorizon } = props;
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [height, setHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const updateLayout = () => {
      setWidth(Dimensions.get('window').width);
      setHeight(Dimensions.get('window').height);
    };
    Dimensions.addEventListener('change', updateLayout);
    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  });

  return isHorizon ? (
    <View style={[styles.botPopContainer, { width: width, height: height }]}>
      <SafeAreaView style={styles.popupSafeAreaView}>
        <TouchableOpacity
          onPress={onClickOutside}
          style={[styles.outsideTouch, { width: width, height: height }]}
          activeOpacity={1}
        />
        <View style={styles.botPopupContainer}>
          <View style={styles.headerConatainer}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={contentList}
            renderItem={data => {
              const { item } = data;
              return (
                <TouchableOpacity
                  style={styles.menuRow}
                  activeOpacity={0.3}
                  onPress={item.onClick}
                >
                  {item.icon1 && (
                    <Image
                      source={item.icon1}
                      resizeMode={'contain'}
                      style={styles.frontIcon}
                    />
                  )}
                  <Text style={styles.menuText} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.icon2 && (
                    <Image
                      source={item.icon2}
                      resizeMode={'contain'}
                      style={{ height: '80%' }}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  ) : (
    <View style={[styles.botVerPopContainer, { width: width, height: height }]}>
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClickOutside}
        />

        <View
          style={[
            styles.botVerPopupContainer,
            OS === 'ios' &&
              !isTablet() && {
                marginBottom: 10
              }
          ]}
        >
          <View style={styles.verHeaderConatainer}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={contentList}
            renderItem={data => {
              const { item } = data;
              return (
                <TouchableHighlight
                  style={styles.verMenuRow}
                  onPress={item.onClick}
                  underlayColor={'rgba(0,0,0,0.05)'}
                >
                  <View style={styles.verRowInner}>
                    {item.icon1 && (
                      <Image
                        source={item.icon1}
                        resizeMode={'contain'}
                        style={styles.frontIcon}
                      />
                    )}
                    <Text style={styles.menuText} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.icon2 && (
                      <Image
                        source={item.icon2}
                        resizeMode={'contain'}
                        style={{ width: 24, height: 24 }}
                      />
                    )}
                  </View>
                </TouchableHighlight>
              );
            }}
          />
          {OS === 'ios' && <View style={{ height: 24 }} />}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  botPopContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  botVerPopContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  popupSafeAreaView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  outsideTouch: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  botPopupContainer: {
    width: '30%',
    backgroundColor: '#fff',
    zIndex: 2,
    borderRadius: 30
  },
  botVerPopupContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 600
  },
  headerConatainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6'
  },
  verHeaderConatainer: {
    marginTop: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6'
  },
  headerText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'DOUZONEText50',
    letterSpacing: -0.36
  },
  menuRow: {
    marginHorizontal: 17,
    marginVertical: 10,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
  },
  verMenuRow: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  verRowInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    paddingHorizontal: 17
  },
  frontIcon: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  menuText: {
    // backgroundColor: 'blue',
    fontSize: 15,
    flex: 1,
    fontFamily: 'DOUZONEText30',
    lineHeight: 20,
    letterSpacing: -0.3
  }
});
