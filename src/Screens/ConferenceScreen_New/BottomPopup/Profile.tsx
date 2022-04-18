import React, { Fragment } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';

import icMail from '@assets/icons/ic_mail.png';
import icCall from '@assets/icons/ic_call.png';
import wehagoIcon from '@assets/icons/appicon_wehago.png';

import Device from 'react-native-device-info';
import { ProfileProps } from '../types';

const isPad = Device.isTablet();
const { width, height } = Dimensions.get('window');

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { userInfo } = user;

  const profileUrl = userInfo.profile_url
    ? wehagoMainURL + userInfo.profile_url
    : wehagoDummyImageURL;
  const { userName } = userInfo;
  const fullPath = userInfo.companyFullpath;
  const userEamil = userInfo.user_email;
  const userContact = userInfo.user_contact;

  return (
    <Fragment>
      <View style={styles.middleContainer}>
        <Image source={{ uri: profileUrl }} style={styles.profileSize} resizeMode={'cover'} />
        <Text style={styles.nameStyle}>{userName}</Text>
        <Text style={styles.pathStyle}>{fullPath}</Text>
        <Image
          source={wehagoIcon}
          style={{ width: 50, height: 50 }}
          resizeMode={'cover'}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.rowCenter}>
          <View style={styles.imageContainer}>
            <Image
              source={icMail}
              style={styles.imageSize}
              resizeMode={'cover'}
            />
          </View>
          <Text style={styles.contentStyle}>{userEamil}</Text>
        </View>
        <View style={styles.rowCenter}>
          <View style={styles.imageContainer}>
            <Image
              source={icCall}
              style={styles.imageSize}
              resizeMode={'cover'}
            />
          </View>
          <Text style={styles.contentStyle}>{userContact}</Text>
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  middleContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24
  },
  profileSize: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  nameStyle: {
    fontFamily: 'DOUZONEText30',
    fontSize: 18,
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    letterSpacing: -0.36
  },
  pathStyle: {
    fontFamily: 'DOUZONEText30',
    fontSize: 12,
    color: '#939393',
    textAlign: 'center',
    letterSpacing: -0.24
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48
  },
  imageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageSize: {
    width: 18,
    height: 18
  },
  contentStyle: {
    fontFamily: 'DOUZONEText30',
    fontSize: 14,
    color: '#fff'
  }
});

export default Profile;