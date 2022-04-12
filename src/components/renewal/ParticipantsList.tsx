import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';

import icBack from '../../../assets/new/icons/ic_back.png';
import icMaster from '../../../assets/new/icons/ic_master.png';

const { OS } = Platform;
// const { height, width } = Dimensions.get('window');

export interface participantsListProps {
  onClose: () => void;
  title: string;
  participants: {
    image: any;
    name: string;
    status: 'master' | 'normal' | 'extra';
  }[];
}

export default function ParticipantsList(
  props: participantsListProps & { isHorizon: boolean }
) {
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [height, setHeight] = useState(Dimensions.get('window').height);

  const { onClose, participants, title } = props;

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

  return (
    <SafeAreaView
      style={{
        zIndex: 2,
        elevation: 2,
        height: height,
        width: width,
        backgroundColor: '#F7F8FA',
        position: 'absolute'
      }}
    >
      <View
        style={{
          elevation: 1
        }}
      >
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: '4.5%', width: '10%' }}
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
              style={{
                fontSize: 20,
                marginHorizontal: 3,
                fontWeight: 'bold'
              }}
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
          <View
            style={{
              marginRight: '3%',
              width: '10%',
              height: '100%'
            }}
          />
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={participants}
          style={{marginBottom: OS === 'android'  ? 50 : 20}}
          renderItem={user => {
            const { index, item, separators } = user;

            return (
              <TouchableOpacity
                style={{
                  // width: '100%',
                  flexDirection: 'row',
                  // height: 70,
                  paddingVertical: 10,
                  // marginBottom:30,
                  marginHorizontal: '5%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                disabled={true}
              >
                <Image
                  source={{ uri: item.image }}
                  resizeMode={'cover'}
                  style={{ width: 40, height: 40, borderRadius: 40 }}
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
                        paddingHorizontal: 10,
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
