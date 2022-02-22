import React from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageSourcePropType,
  FlatList,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import UserList from '../TopArea/UserList';
import Chatting from '../TopArea/Chatting';
import Profile from '../TopArea/UserList/Profile';
import { ConferenceBottomPopupProps } from '../../ContentContainer';

import _ from 'underscore';

import icBackW from '@assets/icons/ic_back_w.png';

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
    setIsPopupTouch
  } = props;
  // console.log('height : ', height);

  // const { isHorizon } = props;
  return popupType === 'CHATTING' ? (
    <Chatting />
  ) : (
    <BlurView style={styles.botVerPopContainer} blurAmount={50}>
      <View
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onTouchStart={() => popupType !== 'NORMAL' && setIsPopupTouch(true)}
      >
        <View
          style={[
            styles.verHeaderConatainer,
            popupType === 'PROFILE'
              ? { justifyContent: 'space-between' }
              : { justifyContent: 'center' }
          ]}
        >
          {popupType === 'PROFILE' && (
            <TouchableHighlight
              activeOpacity={0.5}
              onPress={handelProfieBackButton}
              style={{ width: 35 }}
              underlayColor="transparent"
            >
              <Image source={icBackW} style={{ width: 24, height: 24 }} />
            </TouchableHighlight>
          )}
          <Text style={styles.headerText}>{title}</Text>
          {popupType === 'PROFILE' && (
            <View style={{ width: 24, height: 24 }}></View>
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
                  }, 500)}
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
          />
        )}
        {popupType === 'PROFILE' && <Profile content={contentList} />}
        <View style={{ height: height * 0.05 }}></View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  botVerPopContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    elevation: 2,
    width: '100%',
    maxHeight: height * 0.62,
    borderRadius: 10
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
  botPopupContainer: {
    width: '30%',
    backgroundColor: '#fff',
    zIndex: 2,
    borderRadius: 30
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
  }
});
