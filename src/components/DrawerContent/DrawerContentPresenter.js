import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ImageBackground,
  StyleSheet,
  Platform
} from 'react-native';

import ChangeCompanyScreen from './ChangeCompanyScreen';
import ProfileImage from '../../../assets/icons/imgVcNophoto_2x.png';
import { wehagoMainURL } from '../../utils';

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
          borderColor: '#ececec'
        }}
      >
        <View style={styles.profile}>
          <ImageBackground source={ProfileImage} style={styles.profile_img}>
            <Image
              source={
                props.auth.profile_url
                  ? { uri: wehagoMainURL + props.auth.profile_url }
                  : ProfileImage
              }
              style={styles.profile_img}
            />
          </ImageBackground>
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
                fontSize: 15,
                color: '#515151',
                fontFamily: 'DOUZONEText50'
              }}
            >
              {props.auth.user_name}&nbsp;
              {/* <Text style={{ fontSize: 13 }}>({props.auth.portal_id})</Text> */}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 11,
                color: '#6d6d6d',
                fontFamily: 'DOUZONEText30'
              }}
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
          onPress={item.action}
        >
          <Text style={styles.listItem}>{item.name}</Text>
        </TouchableHighlight>
      ))}

      <ChangeCompanyScreen
        visible={props.selectCompany}
        onDisibleModal={() => props.onChangeState('selectCompany', false)}
        items={props.companyList}
      />
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
    resizeMode: 'cover',
    backgroundColor: '#00000020'
  },
  listItem: {
    padding: 16,
    fontSize: 12,
    fontFamily: 'DOUZONEText30'
  }
});

export default DrawerContentPresenter;
