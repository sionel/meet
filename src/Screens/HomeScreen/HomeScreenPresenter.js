/**
 * HomeScreenPresenter
 * 화상대화 히스토리 프레젠터
 */

import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SectionList,
  ScrollView,
  RefreshControl,
  Image,
  Platform
} from 'react-native';

import {
  ListItemComp,
  CustomAlert,
  Placeholder,
  SectionListHeader
} from '../../components';
import AddButton from './AddButton';
import Icon from 'react-native-vector-icons/FontAwesome';

// const rootPath = `../../../assets`;
// const waitingImage = require(`${rootPath}/waiting.gif`);

/**
 * HomeScreenPresenter
 */
const HomeScreenPresenter = props => {
  const activateList = props.list.filter(item => item.is_video_access === 'T');

  return (
    <View style={styles.container}>
      {/* 검색바 */}
      {/* <SearchForm onChange={props.onSearch} /> */}

      {props.list.length < 1 || activateList.length < 1 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={props.refreshing}
              onRefresh={props.onRefresh}
            />
          }
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#f1f2f5'
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
            flexGrow: 1
          }}
        >
          <Placeholder
            mainText={'진행중인 화상회의가 없습니다.'}
            subText={'대화를 시작하려면 +버튼을 누르세요.'}
            // other={reloadButton}
          />
          <View style={{ flex: 1 }} />
        </ScrollView>
      ) : (
        <Fragment>
          {/* 화상대화 히스토리 리스트 */}
          <SectionList
            keyExtractor={(item, index) => index.toString()}
            refreshing={props.refreshing}
            onRefresh={props.onRefresh}
            style={[
              styles.listContainer,
              props.hasNotch && {
                paddingLeft: props.orientation === 'LANDSCAPE-LEFT' ? 24 : 0,
                paddingRight: props.orientation === 'LANDSCAPE-RIGHT' ? 24 : 0
              }
            ]}
            sections={[
              {
                title: '진행중',
                data: activateList,
                length: activateList.length - 1
              }
            ]}
            renderSectionHeader={({ section }) =>
              section.data.length > 0 && (
                <SectionListHeader title={section.title} />
              )
            }
            renderItem={({ item, index, section }) => (
              // 히스토리 아이템
              <ListItemComp
                key={item.room_id}
                title={item.room_title}
                personnel={item.receiver_user_count}
                updated={item.update_timestamp}
                lottie={true}
                underline={index < section.length ? true : false}
                active={item.is_video_access === 'T' ? true : false}
                disable={
                  item.receiver_user_count === 1 && item.room_type === '1'
                    ? true
                    : false
                }
                onClick={() =>
                  item.is_video_access === 'T'
                    ? props.onCheckConference(
                        item.video_chat_id,
                        null,
                        item.room_title
                      )
                    : props.onActivateModal(item.room_id, item.room_title)
                }
              />
            )}
          />

          {/* 컨펌모달 */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={props.modal}
            blurRadius={1}
            supportedOrientations={[
              'portrait',
              'portrait-upside-down',
              'landscape',
              'landscape-left',
              'landscape-right'
            ]}
            onRequestClose={() => props.onActivateModal(null)}
          >
            <View style={styles.modalWrap}>
              <View style={styles.modalContentWrap}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    zIndex: 11
                  }}
                  onPress={() => props.onActivateModal(null)}
                >
                  <Icon
                    name="times-circle"
                    size={30}
                    color="#CACACA"
                    style={{
                      zIndex: 10
                    }}
                  />
                </TouchableOpacity>

                <View style={styles.modalMessage}>
                  <Text
                    style={{
                      fontSize: 22,
                      color: '#1C90FB',
                      marginBottom: 20,
                      fontFamily: 'DOUZONEText30'
                    }}
                  >
                    화상대화 종료
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'DOUZONEText30'
                    }}
                  >
                    {/* 새로운 화상대화를 시작하시겠습니까? */}
                    이미 종료된 화상대화 입니다.
                  </Text>
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={{
                      ...styles.modalButton,
                      ...styles.modalButtonConfirm
                    }}
                    onPress={() =>
                      // props.onCreateConference(props.selectedRoomId)
                      props.onActivateModal(null)
                    }
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily:
                          Platform.OS === 'ios' ? 'Arial' : 'sans-serif'
                      }}
                    >
                      확인
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Fragment>
      )}

      {/* 방생성 버튼 */}
      <AddButton onClick={() => props.onRedirect('Create')} />

      <CustomAlert
        visible={props.alert.visible}
        title={props.alert.title}
        width={320}
        description={props.alert.message}
        actions={[
          {
            name: '확인',
            action: props.alert.onClose
          }
        ]}
        onClose={props.alert.onClose}
      />
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },

  reloadButtonWrap: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: '#aaa'
  },
  reloadButton: {
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 12,
    marginRight: 12,
    textAlign: 'center'
  },

  listContainer: {
    width: '100%'
    // padding: '4% 3%'
  },

  notResult: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalWrap: {
    // marginTop: 22,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, .75)'
  },

  modalContentWrap: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 300,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  modalMessage: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
    // borderWidth: 1,
    // borderColor: '#1C90FB'
  },

  modalButtons: { flexDirection: 'row' },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: -1
  },
  modalButtonCancel: { backgroundColor: '#f1f1f1' },
  modalButtonConfirm: { backgroundColor: '#1C90FB' }
});

export default HomeScreenPresenter;
