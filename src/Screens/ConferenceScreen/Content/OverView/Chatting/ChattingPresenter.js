import React, { Fragment } from 'react';
import {
  ScrollView,
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
const isIOS = Platform.OS === 'ios';

const ChattingPresenter = props => {
  const {
    cdm,
    user,
    messages,
    message,
    onSetRef,
    onChangeValue,
    onChangeState,
    onSendTextMessage
  } = props;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={ref => onSetRef('scrollView', ref)}
        onScrollBeginDrag={() => {
          onChangeValue('isEndScroll', false);
        }}
        onScrollEndDrag={({ nativeEvent }) => {
          const contentOffsetY = isIOS
            ? nativeEvent.targetContentOffset.y
            : nativeEvent.contentOffset.y; // 현재 스크롤 좌표
          const layoutMeasurementHeight = nativeEvent.layoutMeasurement.height; // 자식의 단일 component 높이
          const contentSizeHeight = nativeEvent.contentSize.height; // 전체 component 높이
          const isOverScroll =
            contentOffsetY + layoutMeasurementHeight + 2 > contentSizeHeight; // + 2 은 오차계산
          onChangeValue('isEndScroll', isOverScroll);
        }}
      >
        <FlatList
          data={messages}
          renderItem={({ item, index }) => {
            if (!cdm && index === messages.length - 1) {
              // item 갯수가 많을 경우, 여기가 componentDidMount 보다 더 늦게 실행되기 때문에 state 를 변경해서 알려준다.
              onChangeState('cdm', true);
            }
            const localUser = user.cid === item.user;
            return (
              <View
                style={[
                  styles.messageItem,
                  {
                    justifyContent: !localUser ? 'flex-start' : 'flex-end'
                  },
                  index === 0 && { paddingTop: 10 }
                ]}
              >
                {/* {!localUser && (
                  <View style={styles.profileField}>
                    <Text>img</Text>
                  </View>
                )} */}
                <View
                  style={[
                    styles.messageData,
                    localUser && { alignItems: 'flex-end' }
                  ]}
                >
                  {!localUser && (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.nameField}
                    >
                      {item.name}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.messageView,
                      {
                        flexDirection: localUser ? 'row-reverse' : 'row'
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.messageField,
                        {
                          backgroundColor: localUser ? '#aaf2ff' : '#fff',
                          marginLeft: localUser ? 10 : 0
                        }
                      ]}
                    >
                      <Text>{item.text}</Text>
                    </View>
                    <View style={styles.dateField}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ color: '#939598', fontSize: 10 }}
                      >
                        {/* {item.date} */}
                        {(() => {
                          const date = new Date(item.date);
                          const renderDate =
                            (date.getHours() < 10 ? '0' : '') +
                            date.getHours() +
                            ':' +
                            (date.getMinutes() < 10 ? '0' : '') +
                            date.getMinutes();
                          return renderDate;
                        })()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>

      <View style={styles.inputArea}>
        <View style={styles.textArea}>
          <TextInput
            multiline={true}
            numberOfLines={2}
            ellipsizeMode="tail"
            value={message}
            onChangeText={text => onChangeState('message', text)}
            style={{
              flex: 1,
              padding: 4,
              height: '100%'
            }}
          />
          {message && message !== '' ? (
            <TouchableOpacity
              onPress={onSendTextMessage}
              style={{
                width: 60,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#1c90fb' }}>전송</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
    // paddingBottom: 50
  },
  messageItem: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  inputArea: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0
  },
  textArea: {
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row'
  },
  profileField: {
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 25
  },
  messageData: { maxWidth: '100%', alignItems: 'flex-start' },
  nameField: { marginLeft: 2, marginBottom: 3, color: '#58595a' },
  messageView: { flexDirection: 'row', maxWidth: '90%' },
  messageField: {
    borderRadius: 4,
    padding: 8
  },
  dateField: {
    // width: 80,
    justifyContent: 'flex-end',
    paddingLeft: 4,
    paddingBottom: 2
  }
});

export default ChattingPresenter;
