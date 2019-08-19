import React, { Fragment } from 'react';
import {
  ScrollView,
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const ChattingPresenter = props => {
  const { messages } = props;

  return (
    <View style={[styles.container, { paddingBottom: 64 }]}>
      <ScrollView>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
              <View style={styles.profileField}>
                <Text>img</Text>
              </View>
              <View style={styles.messageData}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.nameField}
                >
                  {item.user}
                </Text>
                <View style={styles.messageView}>
                  <View style={styles.messageField}>
                    <Text>{item.text}</Text>
                  </View>
                  <View style={styles.dateField}>
                    {/* {Date.parse(String(item.date)).getHours()} */}
                    {(() => {
                      const date = Date.parse(String(item.date));
                      console.log(date);
                      return (
                        <Text numberOfLines={1} ellipsizeMode="tail">
                          date
                        </Text>
                      );
                    })()}
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>

      <View style={styles.inputArea}>
        <View style={styles.textArea}>
          <TextInput
            multiline={true}
            numberOfLines={2}
            ellipsizeMode="tail"
            // value={''}
            style={{
              flex: 1,
              padding: 4,
              height: '100%'
            }}
          />
          <TouchableOpacity
            onPress={() => {}}
            style={{
              width: 72,
              height: '100%',
              backgroundColor: 'yellow',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text>전송</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  messageItem: {
    flexDirection: 'row',
    width: '100%',
    padding: 10
  },
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
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
  messageData: { maxWidth: '90%' },
  nameField: { marginLeft: 2 },
  messageView: { flexDirection: 'row', maxWidth: '90%' },
  messageField: {
    marginLeft: 10,
    backgroundColor: 'skyblue',
    borderRadius: 8,
    padding: 8
  },
  dateField: { width: 80, justifyContent: 'flex-end' }
});

export default ChattingPresenter;
