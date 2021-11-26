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
import icMaster from '../../../assets/new/icons/ic_master.png';

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

            return (
              <TouchableOpacity
                style={{
                  // width: '100%',
                  flexDirection: 'row',
                  height: 35,
                  marginVertical: '2%',
                  marginHorizontal: '5%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  resizeMode={'cover'}
                  style={{ width: 35, height: 35, borderRadius: 35 }}
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 20,
                    marginHorizontal: '5%'
                  }}
                >
                  {item.name}
                </Text>
                {item.status === 'master' && (
                  <View
                    style={{
                      height: '70%',
                      width: '20%',
                      marginHorizontal: '5%',
                      borderRadius: 35,
                      backgroundColor: '#febc2c',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row'
                    }}
                  >
                    <Image
                      source={icMaster}
                      resizeMode={'cover'}
                      style={{
                        width: 20,
                        height: 20
                      }}
                    />
                    <Text
                      style={{
                        paddingHorizontal: 5,
                        color: '#fff',
                        fontSize: 14
                      }}
                    >
                      {'마스터'}
                    </Text>
                  </View>
                )}
                {item.status === 'extra' && (
                  <View
                    style={{
                      height: '70%',
                      width: '20%',
                      borderRadius: 35,
                      marginHorizontal: '5%',
                      backgroundColor: '#75b7cb',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row'
                    }}
                  >
                    <Text
                      style={{
                        paddingHorizontal: 5,
                        color: '#fff',
                        fontSize: 14
                      }}
                    >
                      {'외부참여자'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
