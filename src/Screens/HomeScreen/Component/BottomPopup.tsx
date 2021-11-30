import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  FlatList
} from 'react-native';
// import {Text,TextInput} from '../../../components/StyledText';
const { width, height } = Dimensions.get('window');
const icPerson = require('../../../../assets/new/icons/ic_user.png');

export interface content {
  icon1: ImageSourcePropType;
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
    <View
      style={{
        position: 'absolute',
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <TouchableOpacity
        onPress={onClickOutside}
        style={{
          position: 'absolute',
          width,
          height,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}
        activeOpacity={1}
      />
      <View
        style={{
          width: '30%',
          backgroundColor: '#fff',
          zIndex: 2,
          borderRadius: 30
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            borderBottomWidth: 2,
            borderBottomColor: '#d1d1d1'
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'DOUZONEText50'
            }}
          >
            {title}
          </Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={contentList}
          renderItem={data => {
            const { item } = data;
            return (
              <TouchableOpacity
                style={{
                  marginHorizontal: 20,
                  marginVertical: 10,
                  flexDirection: 'row',
                  height: 40,
                  alignItems: 'center'
                }}
                activeOpacity={0.3}
                onPress={item.onClick}
              >
                <Image
                  source={item.icon1}
                  resizeMode={'contain'}
                  style={{ height: '80%', marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    flex: 1,
                    fontFamily: 'DOUZONEText30'
                  }}
                  numberOfLines={1}
                >
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
    </View>
  ) : (
    <View
      style={{
        position: 'absolute',
        width,
        height,
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={onClickOutside}
      />

      <View
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: 600
        }}
      >
        <View
          style={{
            marginTop: 25,
            marginBottom: 10,
            paddingBottom: 10,
            height: 40,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderColor: '#e6e6e6'
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'DOUZONEText50'
            }}
          >
            {title}
          </Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={contentList}
          renderItem={data => {
            const { item } = data;
            return (
              <TouchableOpacity
                style={{
                  marginHorizontal: 20,
                  marginVertical: 8,
                  flexDirection: 'row',
                  height: 40,
                  alignItems: 'center'
                }}
                activeOpacity={0.3}
                onPress={item.onClick}
              >
                <Image
                  source={item.icon1}
                  resizeMode={'contain'}
                  style={{ height: '80%', marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    flex: 1,
                    fontFamily: 'DOUZONEText30'
                  }}
                  numberOfLines={1}
                >
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
    </View>
  );
}
