import React from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageSourcePropType,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Platform
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import UserList from '../TopArea/UserList';
import Chatting from '../TopArea/Chatting';
import Profile from '../TopArea/UserList/Profile';
import { ConferenceBottomPopupProps } from '../../ContentContainer';

import _ from 'underscore';

import icBackW from '@assets/icons/ic_back_w.png';
import icPersonPlusW from '@assets/icons/ic_person_plus_w.png';

import Device from 'react-native-device-info';

const isPad = Device.isTablet();

export type ConferenceBotPopupContent = {
  icon1: ImageSourcePropType;
  name: string;
  onClick: () => void;
};

type BottomPopupProps = {
  title: string;
  popupType: 'NORMAL' | 'USERLIST' | 'PROFILE' | 'CHATTING';
  contentList: ConferenceBotPopupContent[] | any;
  bottomPopup: ConferenceBottomPopupProps;
  handleBottomPopup: React.Dispatch<
    React.SetStateAction<ConferenceBottomPopupProps>
  >;
  handelProfieBackButton: () => void;
  setIsPopupTouch: React.Dispatch<React.SetStateAction<boolean>>;
  handdlePersonPlus: () => void;
  handleKickUser: (id: string) => void;
};

const { width, height } = Dimensions.get('window');
export default function BottomPopup(
  props: BottomPopupProps
  // & { isHorizon: boolean }
) {
  const {
    title,
    contentList,
    popupType,
    bottomPopup,
    handleBottomPopup,
    handelProfieBackButton,
    setIsPopupTouch,
    handdlePersonPlus,
    handleKickUser
  } = props;

  const { OS } = Platform;

  return popupType === 'CHATTING' ? (
    <Chatting />
  ) : (
    <BlurView
      style={[
        styles.botVerPopContainer,
        title === '더보기' && isPad && { right: 40 }
      ]}
      overlayColor="rgba(255,255,255,0.01)"
    >
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          paddingBottom: isPad
            ? 10
            : OS === 'ios'
            ? height * 0.05
            : height * 0.03
        }}
        onTouchStart={() => popupType !== 'NORMAL' && setIsPopupTouch(true)}
      >
        <View
          style={[
            styles.verHeaderConatainer,
            popupType === 'PROFILE' || popupType === 'USERLIST'
              ? { justifyContent: 'space-between' }
              : { justifyContent: 'center' }
          ]}
        >
          {popupType === 'USERLIST' && <View style={styles.size24} />}
          {popupType === 'PROFILE' && (
            <TouchableHighlight
              activeOpacity={0.5}
              onPress={handelProfieBackButton}
              style={{ width: 35 }}
              underlayColor="transparent"
            >
              <Image source={icBackW} style={styles.size24} />
            </TouchableHighlight>
          )}
          <Text style={styles.headerText}>{title}</Text>
          {popupType === 'PROFILE' && <View style={styles.size24} />}
          {popupType === 'USERLIST' && (
            <TouchableHighlight
              activeOpacity={0.5}
              onPress={handdlePersonPlus}
              style={{ width: 35 }}
              underlayColor="transparent"
            >
              <Image source={icPersonPlusW} style={styles.size24} />
            </TouchableHighlight>
          )}
        </View>
        {popupType === 'NORMAL' && (
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={contentList}
            renderItem={({ item }) => {
              return (
                <TouchableHighlight
                  style={[styles.verMenuRow]}
                  activeOpacity={0.9}
                  underlayColor="rgba(214,255,239,0.1)"
                  onPress={_.throttle(() => {
                    item.onClick();
                    handleBottomPopup({
                      ...bottomPopup,
                      popupType: 'NORMAL',
                      show: false
                    });
                  }, 750)}
                >
                  <View style={styles.verMenuRowView}>
                    {item.icon1 && (
                      <Image
                        source={item.icon1}
                        resizeMode={'contain'}
                        style={styles.frontIcon}
                      />
                    )}
                    <Text style={styles.menuText} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        )}
        {popupType === 'USERLIST' && (
          <UserList
            contentList={contentList}
            bottomPopup={bottomPopup}
            handleBottomPopup={handleBottomPopup}
            setIsPopupTouch={setIsPopupTouch}
            handleKickUser={handleKickUser}
          />
        )}
        {popupType === 'PROFILE' && <Profile content={contentList} />}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  botVerPopContainer: !isPad
    ? {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        elevation: 2,
        flex: 1,
        maxHeight: height * 0.62
      }
    : {
        position: 'absolute',
        right: 60,
        top: '10%',
        zIndex: 2,
        elevation: 2,
        flex: 1,
        width: 300,
        maxHeight: height * 0.62
      },
  verHeaderConatainer: {
    marginTop: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16
  },
  verMenuRow: {
    height: 48
  },
  verMenuRowView: {
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headerConatainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#d1d1d1'
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'DOUZONEText50'
  },
  menuRow: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
  },
  frontIcon: { width: 24, height: 24, marginRight: 16 },
  menuText: {
    fontSize: 15,
    fontFamily: 'DOUZONEText30',
    color: '#fff'
  },
  size24: { width: 24, height: 24 }
});
