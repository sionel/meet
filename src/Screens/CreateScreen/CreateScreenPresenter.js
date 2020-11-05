/**
 * CreateScreenPresenter
 * 화상회의 히스토리 프레젠터
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SectionList,
  Animated
} from 'react-native';
import {
  ListItemComp,
  SearchForm,
  Placeholder,
  CustomAlert,
  SectionListHeader
} from '../../components';

/**
 * CreateScreenPresenter
 */
const CreateScreenPresenter = props => {
  const personalList = props.list.filter(
    item => item.room_type === '1' && item.is_video_access === 'F'
  );
  const groupList = props.list.filter(
    item => item.room_type === '2' && item.is_video_access === 'F'
  );
  const semuList = props.list.filter(
    item => item.room_type === '4' && item.is_video_access === 'F'
  );
  const suimList = props.list.filter(
    item => item.room_type === '5' && item.is_video_access === 'F'
  );

  const personalHeight = new Animated.Value(54 * personalList.length);
  const groupHeight = new Animated.Value(54 * groupList.length);
  const semuHeight = new Animated.Value(54 * semuList.length);
  const suimHeight = new Animated.Value(54 * suimList.length);
  const SectionFooter = ({ section }) => {
    const items = section.data.map((item, index) => (
      <ListItemComp
        key={item.room_id}
        title={item.room_title}
        personnel={item.receiver_user_count}
        updated={item.update_timestamp}
        room_profile_url={item.room_profile_url}
        lottie={false}
        customLottie={true}
        underline={index < section.length ? true : false}
        active={item.is_video_access === 'T' ? true : false}
        disable={
          item.receiver_user_count === 1 && item.room_type === '1'
            ? true
            : false
        }
        onClick={() => props.onActivateModal(item.room_id, item.room_title)}
      />
    ));

    return (
      <Animated.View
        style={{
          overflow: 'hidden',
          height:
            section.type === 'group'
              ? groupHeight
              : section.type === 'personal'
              ? personalHeight
              : section.type === 'semu'
              ? semuHeight
              : suimHeight,
          justifyContent: 'flex-start'
        }}
      >
        {items}
      </Animated.View>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const _redirect = setInterval(() => {
      setRefreshing(true);
      // props.onRefresh();
      // setTimeout(() => {
      //   setRefreshing(false);
      // }, 1000);
    }, 10000);
    return () => {
      clearInterval(_redirect);
    };
  }, []);
  return (
    <View style={styles.container}>
      {/* 검색바 */}
      <SearchForm onChange={props.onSearch} />

      {props.list.length < 1 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={props.onRefresh} />
          }
        >
          <Placeholder
            mainText="검색 결과가 없습니다."
            subText={'위하고에서 메신저를 생성해 보세요'}
          />
        </ScrollView>
      ) : (
        <SectionList
          keyExtractor={(item, index) => index.toString()}
          refreshing={false}
          // refreshing={refreshing}
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
              length: groupList.length - 1,
              type: 'group'
            },
            {
              title: `1:1대화(${personalList.length})`,
              data: personalList,
              length: personalList.length - 1,
              type: 'personal'
            },
            {
              title: `세무사와의 대화(${semuList.length})`,
              data: semuList,
              length: semuList.length - 1,
              type: 'semu'
            },
            {
              title: `수임처와의 대화(${suimList.length})`,
              data: suimList,
              length: suimList.length - 1,
              type: 'suim'
            }
          ]}
          renderSectionHeader={({ section }) =>
            section.data.length > 0 && (
              <SectionListHeader
                title={section.title}
                section={section}
                collapse={true}
                onPress={() => {
                  section.type === 'group'
                    ? Animated.timing(groupHeight, {
                        toValue:
                          groupHeight._value === 0
                            ? 54 * section.data.length
                            : 0,
                        duration: 400
                        // easing: Easing.bounce
                      }).start()
                    : section.type === 'personal'
                    ? Animated.timing(personalHeight, {
                        toValue:
                          personalHeight._value === 0
                            ? 54 * section.data.length
                            : 0,
                        duration: 400
                        // easing: Easing.bounce
                      }).start()
                    : section.type === 'semu'
                    ? Animated.timing(semuHeight, {
                        toValue:
                          semuHeight._value === 0
                            ? 54 * section.data.length
                            : 0,
                        duration: 400
                        // easing: Easing.bounce
                      }).start()
                    : Animated.timing(suimHeight, {
                        toValue:
                          suimHeight._value === 0
                            ? 54 * section.data.length
                            : 0,
                        duration: 400
                        // easing: Easing.bounce
                      }).start();
                }}
              />
            )
          }
          renderSectionFooter={SectionFooter}
          renderItem={({ item, index, section }) => null}
        />
      )}

      <CustomAlert
        visible={props.modal}
        title={'화상회의 생성'}
        width={320}
        description={'화상회의를 생성하시겠습니까?'}
        actions={[
          {
            name: '취소',
            action: () => props.onActivateModal(null)
          },
          {
            name: '확인',
            action: () => props.onCreateConference()
          }
        ]}
        onClose={() => props.onActivateModal(null)}
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
    width: '100%',
    fontFamily: 'DOUZONEText30'
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
