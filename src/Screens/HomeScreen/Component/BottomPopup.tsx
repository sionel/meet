import React, { Fragment } from 'react';
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
  Platform
} from 'react-native';
// import {Text,TextInput} from '../../../components/StyledText';
const { OS } = Platform;
const { width, height } = Dimensions.get('window');
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
  return isHorizon ? (
    <View style={styles.botPopContainer}>
      <SafeAreaView style={styles.popupSafeAreaView}>
        <TouchableOpacity
          onPress={onClickOutside}
          style={styles.outsideTouch}
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
    <View style={styles.botVerPopContainer}>
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

        <View style={[
            styles.botVerPopupContainer,
            OS === 'ios' && {
              marginBottom: 10
            }
          ]}>
          <View style={styles.verHeaderConatainer}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={contentList}
            renderItem={data => {
              const { item } = data;
              return (
                <TouchableOpacity
                  style={styles.verMenuRow}
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
          <View style={{ height: 20 }}></View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  botPopContainer: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  botVerPopContainer: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  popupSafeAreaView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  outsideTouch: {
    position: 'absolute',
    width,
    height,
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
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#d1d1d1'
  },
  verHeaderConatainer: {
    marginTop: 25,
    marginBottom: 10,
    paddingBottom: 10,
    height: 40,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#e6e6e6'
  },
  headerText: {
    fontSize: 19,
    color: '#333',
    fontFamily: 'DOUZONEText50'
  },
  menuRow: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
  },
  verMenuRow: {
    marginHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
  },
  frontIcon: { height: '80%', marginRight: 10 },
  menuText: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'DOUZONEText30'
  }
});
