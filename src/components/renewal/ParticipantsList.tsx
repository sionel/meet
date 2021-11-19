import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';

import icBack from '../../../assets/new/icons/ic_back.png';

const { height, width } = Dimensions.get('window');

export interface participantsListProps {
  onClose: () => void;
  title: string;
  participants: {
    image: any;
    name: string;
    status: 'master' | 'normal' | 'extra';
  }[];
}

export default function ParticipantsList(props: participantsListProps) {
  const { onClose, participants, title } = props;
  return (
    <SafeAreaView style={{ zIndex: 1 }}>
      <View
        style={{
          backgroundColor: '#F7F8FA',
          height: height,
          width: width,
          position: 'absolute'
        }}
      >
        <View
          style={{
            height: '6%',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: '3%', width: '10%' }}
            onPress={onClose}
          >
            <Image
              source={icBack}
              resizeMode={'contain'}
              style={{ height: '70%' }}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{ fontSize: 20, marginHorizontal: 3, fontWeight: 'bold' }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 20,
                marginHorizontal: 3,
                fontWeight: 'bold',
                color: '#1c90fb'
              }}
            >
              {participants.length}
            </Text>
          </View>
          <View style={{ marginRight: '3%', width: '10%', height: '100%' }} />
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={participants}
          renderItem={user => {
            const { index, item, separators } = user;
            console.log(item);

            return (
              <TouchableOpacity
                style={{
                  // width: '100%',
                  flexDirection: 'row',
                  height: 35,
                  marginVertical: '2%',
                  marginHorizontal: '3%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* <View
                  style={{
                    height: 100,
                    width: '100%',
                    margin: 5,
                    backgroundColor: '#9922af'
                  }}
                /> */}
                <Image
                  source={{ uri: item.image }}
                  resizeMode={'cover'}
                  style={{ width: 35, height: 35, borderRadius: 35 }}
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 20,
                    marginHorizontal: 15
                  }}
                >
                  {item.name}
                </Text>
                <Image
                  source={item.image}
                  style={{ width: '20%', backgroundColor: '#100200' }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
