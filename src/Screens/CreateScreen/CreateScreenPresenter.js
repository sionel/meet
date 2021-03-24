import React from 'react';
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

import { getT } from '../../utils/translateManager';

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
    item =>
      item.room_type === '5' &&
      item.is_video_access === 'F' &&
      !item.unpaid_status
  );

  const t = getT();
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
            mainText={t('create_room.검색결과없음')}
            subText={t('create_room.검색결과없음텍스트')}
          />
        </ScrollView>
      ) : (
        <SectionList
          keyExtractor={(item, index) => index.toString()}
          refreshing={false}
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
              title: `${t('create_room.그룹')}(${groupList.length})`,
              data: groupList,
              length: groupList.length - 1,
              type: 'group'
            },
            {
              title: `${t('create_room.일대일')}(${personalList.length})`,
              data: personalList,
              length: personalList.length - 1,
              type: 'personal'
            },
            {
              title: `${t('create_room.세무')}(${semuList.length})`,
              data: semuList,
              length: semuList.length - 1,
              type: 'semu'
            },
            {
              title: `${t('create_room.수임')}(${suimList.length})`,
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
                      }).start()
                    : section.type === 'personal'
                    ? Animated.timing(personalHeight, {
                        toValue:
                          personalHeight._value === 0
                            ? 54 * section.data.length
                            : 0,
                        duration: 400
                      }).start()
                    : section.type === 'semu'
                    ? Animated.timing(semuHeight, {
                        toValue:
                          semuHeight._value === 0
                            ? 54 * section.data.length
                            : 0,
                        duration: 400
                      }).start()
                    : Animated.timing(suimHeight, {
                        toValue:
                          suimHeight._value === 0
                            ? 54 * section.data.length
                            : 0,
                        duration: 400
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
        title={t('alert.title.화상회의생성')}
        width={320}
        description={t('alert.text.방만들기')}
        actions={[
          {
            name: t('alert.button.cancel'),
            action: () => props.onActivateModal(null)
          },
          {
            name: t('alert.button.confirm'),
            action: () => props.onCreateConference()
          }
        ]}
        onClose={() => props.onActivateModal(null)}
      />
    </View>
  );
};

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
  },

  notResult: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalWrap: {
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
