import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet
} from 'react-native';

import ProfileImage from '../../../assets/icons/imgVcNophoto_2x.png';

const DrawerContentPresenter = props => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginTop: 6, padding: 10 }}>
        <View style={styles.profile}>
          <Image source={ProfileImage} style={styles.profile_img} />
        </View>
        <View style={{ padding: 16 }}>
          <Text>
            {props.auth.user_name} ({props.auth.portal_id})
          </Text>
          {/* <Text>{props.auth.portal_id}</Text> */}
          {/* <Text>{props.auth.last_company.full_path}</Text> */}
          <Text>{props.auth.last_company.company_name_kr}</Text>
          {/* <Text>{JSON.stringify(props.auth)}</Text> */}
          {/* <Text>{props.auth.profile_url}</Text> */}
        </View>
      </View>

      {props.drawerList.map(item => (
        <TouchableHighlight
          key={item.src}
          activeOpacity={0.9}
          underlayColor={'#00000010'}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate(item.src);
          }}
        >
          <Text style={styles.listItem}>{item.name}</Text>
        </TouchableHighlight>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'transparent'
  },
  profile: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    borderRadius: 50,
    overflow: 'hidden'
  },
  profile_img: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    backgroundColor: '#00000030'
  },
  listItem: {
    padding: 16
  }
});

export default DrawerContentPresenter;
