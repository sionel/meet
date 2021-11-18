import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageSourcePropType
} from 'react-native';
const { width, height } = Dimensions.get('window');
const icPerson = require('../../../../assets/new/icons/ic_user.png');

export interface content {
  icon1: ImageSourcePropType;
  icon2: ImageSourcePropType | null;
  name: string;
  onClick: () => void;
}

interface BottomPopupProps {
  title: string;
  contentList: content[];
  onClickOutside: () => void;
}

export default function BottomPopup(props: BottomPopupProps) {
  const { title, contentList, onClickOutside } = props;
  return (
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

      <View style={{ backgroundColor: '#fff', borderRadius: 20 }}>
        <View
          style={{
            marginTop: 25,
            paddingBottom: 10,
            height: 40,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderColor: '#e6e6e6'
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        </View>
        {contentList.map(content => (
          <TouchableOpacity
            style={{
              marginHorizontal: 20,
              marginVertical: 8,
              flexDirection: 'row',
              height: 40,
              alignItems: 'center'
              // backgroundColor:'red'
            }}
            activeOpacity={0.3}
            onPress={content.onClick}
          >
            <Image
              source={content.icon1}
              resizeMode={'contain'}
              style={{ height: '80%', marginRight: 10 }}
            />
            <Text
              style={{
                fontSize: 20,
                // fontWeight: '500',
                flex: 1,
                // fontFamily: 'DOUZONEText50'
              }}
              numberOfLines={1}
            >
              {content.name}
            </Text>
            {content.icon2 && (
              <Image
                source={content.icon2}
                resizeMode={'contain'}
                style={{ height: '80%' }}
              />
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: 50 }}></View>
      </View>
    </View>
  );
}
