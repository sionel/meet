import React, { Fragment } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import CustomIcon from '../../../../../components/CustomIcon';

const UserListPresenter = props => {
  const {
    userList,
    presenter,
    speaker,
    toggleMuteMic,
    // toggleMuteSpeaker,
    onChangeSpeaker // 스피커폰
  } = props;

  return (
    <ScrollView
      style={{ height: '100%' }}
      showsVerticalScrollIndicator={false}
    >
      <FlatList
        data={userList}
        style={styles.userList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemBox}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View
              style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={styles.profileCover}>
                <Image
                  style={styles.profileImg}
                  source={
                    item.userInfo
                      ? {
                          uri: `https://www.wehago.com${
                            item.userInfo.profile_url
                          }`
                        }
                      : null
                  }
                  resizeMode={'center'}
                />
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.nameField}
              >
                {item.name}
                {/* ({item.userInfo.wehagoId || '외부참여자'}) */}
              </Text>
              {item.id === 'localUser' && (
                <View style={[styles.presenter, { backgroundColor: '#fb0' }]}>
                  <Text style={styles.presenterText}>나</Text>
                </View>
              )}
              {item.id === presenter && (
                <View style={styles.presenter}>
                  <Text style={styles.presenterText}>발표자</Text>
                </View>
              )}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}
            >
              {/* 스피커폰 컨트롤 */}
              <TouchableOpacity onPress={onChangeSpeaker}>
                {speaker === 1 && item.id === 'localUser' && (
                  <CustomIcon name={'speakerOn'} width={30} height={24} />
                )}
                {speaker === 2 && item.id === 'localUser' && (
                  <CustomIcon name={'speakerOff'} width={30} height={24} />
                )}
              </TouchableOpacity>

              {/* 마이크 컨트롤 */}
              {item.id === 'localUser' ? (
                <TouchableOpacity onPress={toggleMuteMic}>
                  <CustomIcon
                    name={item.isMuteMic ? 'mikeOff' : 'mikeOn'}
                    width={30}
                    height={24}
                  />
                </TouchableOpacity>
              ) : // <CustomIcon
              //   name={item.isMuteAudio ? 'mikeOff' : 'mikeOn'}
              //   width={30}
              //   height={24}
              // />
              null}
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  userList: {
    paddingTop: 16,
    paddingBottom: 16
  },
  itemBox: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 7,
    paddingLeft: 14,
    paddingRight: 14
  },
  profileCover: {
    width: 32,
    height: 32,
    borderWidth: 0,
    borderRadius: 15,
    backgroundColor: '#ccc',
    overflow: 'hidden'
  },
  profileImg: {
    width: 32,
    height: 32
  },
  nameField: {
    maxWidth: '50%',
    marginLeft: 10,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif'
  },
  presenter: {
    marginLeft: 5,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#690',
    borderRadius: 20,
    borderWidth: 0
  },
  presenterText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif'
  }
});

export default UserListPresenter;
