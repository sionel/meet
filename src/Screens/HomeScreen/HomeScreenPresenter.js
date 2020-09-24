/**
 * HomeScreenPresenter
 * 화상회의 히스토리 프레젠터
 */

import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text
} from 'react-native';

import {
  ListItemComp,
  CustomAlert,
  Placeholder,
  SectionListHeader
} from '../../components';
import AddButton from './AddButton';

// const rootPath = `../../../assets`;
// const waitingImage = require(`${rootPath}/waiting.gif`);

/**
 * HomeScreenPresenter
 */
const HomeScreenPresenter = props => {
  const activateList = props.list.filter(item => item.is_video_access === 'T');
  const started = props.started;
  const reservation = props.reservation;
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={{ position: 'absolute', top: 500, left: 200, backgroundColor:'#0a0', zIndex:99}} onPress={()=>{props.onMakeRoom()}}>
        <Text> ccghcghcghfgh</Text>
      </TouchableOpacity> */}
      {/* 검색바 */}
      {/* <SearchForm onChange={props.onSearch} /> */}

      {(props.list.length < 1 || activateList.length < 1) &&
      (props.started.length < 1 || started.length < 1) &&
      (props.reservation.length < 1 || reservation.length < 1) ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            props.memberType !== 1 && (
              <RefreshControl
                refreshing={props.refreshing}
                onRefresh={props.onRefresh}
              />
            )
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
            subText={
              props.memberType === 1 || props.plan === 'WE'
                ? 'WEHAGO앱에서 화상회의 및 통화를 시작해보세요.'
                : props.plan === 'SP'
                ? '화상회의방 생성 후 참여가 가능합니다.'
                : '대화를 시작하려면 +버튼을 누르세요.'
            }
            // other={reloadButton}
          />
          <View style={{ flex: 1 }} />
        </ScrollView>
      ) : (
        <Fragment>
          {/* 화상회의 히스토리 리스트 */}
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
                data: started,
                length: started.length - 1
              },
              {
                title: '예정',
                data: reservation,
                length: reservation.length - 1
              }
            ]}
            renderSectionHeader={({ section }) =>
              section.data.length > 0 && (
                <SectionListHeader title={section.title} />
              )
            }
            renderItem={({ item, index, section }) => {
              // 히스토리 아이템
              return (
                <ListItemComp
                  key={item.room_id}
                  title={item.name}
                  personnel={item.receiver_user_count}
                  updated={item.start_date_time}
                  room_profile_url={''}
                  lottie={true}
                  underline={index < section.length ? true : false}
                  active={true}
                  disable={false}
                  onClick={() =>
                    props.onRedirect('ConferenceState', {
                      item: {
                        roomId: item.room_id,
                        externalData: null,
                        from: 'meet'
                      }
                    })
                  }
                ></ListItemComp>
              );
            }}
          />
        </Fragment>
      )}

      {/* 방생성 버튼 */}
      {/* wehago one 회원은 불가 */}
      {/* 미구매 회원은 불가 */}
      {props.memberType !== 1 && props.permission && props.plan !== 'WE' && (
        <AddButton
          onClick={() =>
            props.onRedirect('Create', {
              onGetWetalkList: props.onGetWetalkList
            })
          }
        />
      )}

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
