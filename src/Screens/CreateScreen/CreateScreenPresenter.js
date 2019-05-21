/**
 * CreateScreenPresenter
 * 화상대화 히스토리 프레젠터
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SafeAreaView
} from 'react-native';
// common components
import {
  ListItemComp,
  SearchForm,
  Placeholder,
  CustomModal,
  SectionListHeader
} from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';

/**
 * CreateScreenPresenter
 */
const CreateScreenPresenter = props => {
  const groupList = props.list.filter(
    item => item.room_type === '2' && item.is_video_access === 'F'
  );
  const personnelList = props.list.filter(
    item => item.room_type === '1' && item.is_video_access === 'F'
  );

  return (
    <View style={styles.container}>
      {/* 검색바 */}
      <SearchForm onChange={props.onSearch} />

      {props.list.length < 1 && (
        <Placeholder
          mainText="검색 결과가 없습니다."
          subText={'위하고에서 위톡을 생성해 보세요'}
        />
      )}

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
            title: `그룹대화(${groupList.length})`,
            data: groupList,
            length: groupList.length - 1
          },
          {
            title: `1:1대화(${personnelList.length})`,
            data: personnelList,
            length: personnelList.length - 1
          }
        ]}
        renderSectionHeader={({ section }) =>
          section.data.length > 0 && <SectionListHeader title={section.title} />
        }
        renderItem={({ item, index, section }) => (
          // 히스토리 아이템
          <ListItemComp
            key={item.room_id}
            title={item.room_title}
            personnel={item.receiver_user_count}
            updated={item.update_timestamp}
            lottie={false}
            customLottie={true}
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

      <CustomModal
        display={props.modal}
        title="화상대화 생성"
        text="화상대화를 생성하시겠습니까?"
        feedbackText="시작하기"
        onClickClose={() => props.onActivateModal(null)}
        onClickFeedback={() => props.onCreateConference(props.selectedRoomId)}
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

export default CreateScreenPresenter;
