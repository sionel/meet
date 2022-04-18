import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import React, { Fragment } from 'react';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import MainVideo from './MainVideo';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { WEHAGO_TYPE } from '../../../config';
import { ConferenceScreenPresenterProps } from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import icWoman1 from '@assets/icons/ic_woman1.png';
import icWoman2 from '@assets/icons/ic_woman2.png';
import icWoman3 from '@assets/icons/img_character_woman1.png';
const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected,
  handleClose,
  handleSpeaker
}) => {
  // const insets = useSafeAreaInsets();

  return (
    <Fragment>
      <StatusBar backgroundColor="#000" barStyle={'light-content'} />

      <SafeAreaView
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          enabled={false}
          behavior="height"
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={icWoman1}
              style={{ flex: 1, backgroundColor: 'red' }}
              resizeMode={'contain'}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <SafeAreaView
        style={{
          position: 'absolute',
          width: '100%',
          height: '70%',
          bottom: 0
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,255,0.5)'
          }}
        ></View>
        <TextInput
          style={{ height: 60, width: '100%', backgroundColor: '#fff' }}
        ></TextInput>
      </SafeAreaView>

      <SafeAreaView
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      ></SafeAreaView>
    </Fragment>
    // <SafeAreaView
    //   style={{
    //     position:'absolute',
    //     // flex: 1,
    //     backgroundColor: '#fff',
    //     width:'100%',
    //     height:'100%'
    //     // justifyContent:'center'
    //   }}
    // >
    //   {/* <KeyboardAvoidingView
    //     style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    //     behavior={'height'}
    //     enabled={false}
    //   >
    //     <Image
    //       source={icWoman1}
    //       style={{ flex: 1, backgroundColor: 'red' }}
    //       resizeMode={'contain'}
    //     />
    //   </KeyboardAvoidingView> */}
    //   <View
    //     style={{
    //       // position: 'absolute',
    //       backgroundColor: 'rgba(0,0,255,0.3)',
    //       height: '100%',
    //       width: '100%',
    //       // bottom: 0
    //     }}
    //   >
    //     {/* <View style={{ flex: 1 }}></View>
    //     <TextInput style={{ height: 60, backgroundColor: '#fff' }}></TextInput> */}
    //   </View>
    // </SafeAreaView>
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
    //   <StatusBar backgroundColor="#000" barStyle={'light-content'} />
    //   {!isConnected ? (
    //     <Fragment>
    //       <TopPopup insets={insets} />
    //       <TopContent insets={insets} />
    //       {/* <KeyboardAvoidingView
    //         style={[styles.avoidingView, { top: insets.top, bottom: insets.bottom }]}
    //       > */}
    //         <MainVideo insets={insets}/>
    //       {/* </KeyboardAvoidingView> */}
    //       {/* <SplitVideo /> */}
    //       <BottomPopup
    //         roomId="213564782"
    //         handleSpeaker={handleSpeaker}
    //         insets={insets}
    //       />
    //       {/* <BottomContent handleCloseConf={handleClose} insets={insets} /> */}
    //     </Fragment>
    //   ) : WEHAGO_TYPE === 'WEHAGO' ? (
    //     <Fragment></Fragment>
    //   ) : (
    //     <Fragment></Fragment>
    //   )}
    // </SafeAreaView>
  );
};

export default ConferenceScreenPresenter;
