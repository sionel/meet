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
      <View
        style={{
          // flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: 25,
          paddingBottom: 10,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderColor: '#cccccc'
        }}
      >
        <View style={styles.profile}>
          <Image source={ProfileImage} style={styles.profile_img} />
        </View>
        {props.auth.user_name && (
          <View
            style={
              {
                // padding: 17,
                // paddingTop: 27,
                // paddingBottom: 27
              }
            }
          >
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                fontSize: 17.5,
                color: '#515151',
                fontWeight: 'bold'
              }}
            >
              {props.auth.user_name}{' '}
              {/* <Text style={{ fontSize: 13 }}>({props.auth.portal_id})</Text> */}
            </Text>
            <Text
              style={{ textAlign: 'center', fontSize: 13, color: '#6d6d6d' }}
            >
              {props.auth.last_company.company_name_kr}
            </Text>
            <Text style={{}} />
            {/* <Text>{props.auth.portal_id}</Text> */}
            {/* <Text>{props.auth.last_company.full_path}</Text> */}
            {/* <Text>{JSON.stringify(props.auth)}</Text> */}
            {/* <Text>{props.auth.profile_url}</Text> */}
          </View>
        )}
      </View>

      {props.drawerList.map(item => (
        <TouchableHighlight
          key={item.src}
          activeOpacity={0.9}
          underlayColor={'#00000010'}
          onPress={() => {
            item.action();
            // props.navigation.closeDrawer();
            // props.navigation.navigate(item.src);
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
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 50,
    overflow: 'hidden'
  },
  profile_img: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    backgroundColor: '#00000030'
  },
  listItem: {
    padding: 16
  }
});

export default DrawerContentPresenter;
