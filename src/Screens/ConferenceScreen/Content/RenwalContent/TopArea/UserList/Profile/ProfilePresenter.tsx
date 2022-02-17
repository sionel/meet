import { ParticipantsTypes } from '@redux/participants';
import React, { Component, Fragment } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';

import icMail from '@assets/icons/ic_mail.png';
import icCall from '@assets/icons/ic_call.png';

const { width, height } = Dimensions.get('window');

type ProfilePresenter = {
  content: ParticipantsTypes;
};

const ProfilePresenter = (props: ProfilePresenter) => {
  const { content } = props;
  const { userInfo } = content;

  // console.log('content :', content);

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
        <Image source={{ uri: profileUrl }} style={styles.profileSize} />
        <Text style={styles.nameStyle}>{userName}</Text>
        <Text style={styles.pathStyle}>{fullPath}</Text>
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
    alignItems: 'center'
  },
  profileSize: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: height * 0.03
  },
  nameStyle: {
    fontFamily: 'DOUZONEText30',
    fontSize: 18,
    color: '#fff',
    marginTop: height * 0.02
  },
  pathStyle: {
    fontFamily: 'DOUZONEText30',
    fontSize: 12,
    color: '#939393',
    marginTop: height * 0.01
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: width * 0.05
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginRight: width * 0.02,
    marginVertical: height * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
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
export default ProfilePresenter;
