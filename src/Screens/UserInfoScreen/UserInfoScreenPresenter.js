import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const UserInfoScreenPresenter = props => {
  return (
    <ScrollView style={{ flex: 1 }}>
      {Object.keys(props.auth).map(item => (
        <Text>
          {item} : {JSON.stringify(props.auth[item])}
        </Text>
      ))}
    </ScrollView>
  );
};

export default UserInfoScreenPresenter;
