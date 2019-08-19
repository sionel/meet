import React, { Fragment } from 'react';
import { ScrollView, FlatList, Text, View, StyleSheet } from 'react-native';

const ChattingPresenter = props => {
  const { messages, orientation, hasNotch } = props;

  return (
    <View style={[styles.container, { paddingBottom: 64 }]}>
      <ScrollView>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
              <Text>{item.user}</Text>
              <Text>{item.text}</Text>
              <Text>{item.date}</Text>
            </View>
          )}
        />
      </ScrollView>

      <View style={styles.inputArea}>
        <View style={styles.textArea}>
          <Text>input feild</Text>
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
    padding: 10
  },
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  textArea: {
    backgroundColor: '#fff',
    height: 64
  }
});

export default ChattingPresenter;
