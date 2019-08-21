import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AppIntroSlider from './react-native-intro-slider/AppIntroSlider';

const { width, height } = Dimensions.get('window');
const ratio = 375 / 449;

// const isTablet = (
//   Platform.OS === 'ios' &&
//   Platform.isPad
// );
const isTablet = DeviceInfo.isTablet();

const introImages = [
  require('./images/img_intro_meet/drawable-xxxhdpi/img_intro_meet.png'),
  require('./images/walkthroughs_02/drawable-xxxhdpi/walkthroughs_02.png'),
  require('./images/walkthroughs_03/drawable-xxxhdpi/walkthroughs_03.png'),
  require('./images/walkthroughs_04/drawable-xxxhdpi/walkthroughs_04.png'),
  require('./images/walkthroughs_05/drawable-xxxhdpi/walkthroughs_05.png')
];

class AppIntroSlide extends React.Component {
  slides = [
    {
      key: '0',
      view: (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'rgb(0, 105, 224)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={introImages[0]}
            style={{ width: 144, height: 144 }}
            resizeMode="contain"
          />
          <Text
            style={{
              marginTop: 70.5,
              color: '#FFF',
              fontSize: 25,
              // fontWeight: '700',
              textAlign: 'center',
              fontFamily: 'NanumSquareEB'
            }}
          >
            {'언제 어디서나\nWEHAGO Meet'}
          </Text>
          <Text
            style={{
              marginTop: 24.5,
              color: 'rgb(193, 219, 246)',
              fontSize: 16,
              fontFamily: 'NanumSquareB'
            }}
          >
            시간과 장소의 제약 없는 효율적인 화상회의
          </Text>
        </View>
      )
    },
    {
      key: '1',
      view: (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'rgb(244, 250, 254)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={styles.textTitle}>WAHAGO 연동</Text>
            <Text style={styles.textContent}>
              {'새로운 회의를 만들거나 진행중인\nWE톡 화상회의에 바로 참여'}
            </Text>
          </View>
          <Image
            source={introImages[1]}
            style={{ width: '100%', flex: 2 }}
            resizeMode="contain"
          />
        </View>
      )
    },
    {
      key: '2',
      view: (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'rgb(244, 250, 254)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={styles.textTitle}>화상 및 음성전화</Text>
            <Text style={styles.textContent}>
              {'연결된 조직도 직원부터\n거래처까지 화상/음성전화 지원'}
            </Text>
          </View>
          <Image
            source={introImages[2]}
            style={{ width: '100%', flex: 2 }}
            resizeMode="contain"
          />
        </View>
      )
    },
    {
      key: '3',
      view: (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'rgb(244, 250, 254)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={styles.textTitle}>실시간 공유기능</Text>
            <Text style={styles.textContent}>
              {'PC화면이나 문서를 실시간으로 공유\n화상회의 중 대화기능 제공'}
            </Text>
          </View>
          <Image
            source={introImages[3]}
            style={{ width: '100%', flex: 2 }}
            resizeMode="contain"
          />
        </View>
      )
    },
    {
      key: '4',
      view: (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'rgb(244, 250, 254)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={styles.textTitle}>고화질의 화상회의</Text>
            <Text style={styles.textContent}>
              {'네트워크 속도에 따라\n자동으로 조절되는 화질'}
            </Text>
          </View>
          <Image
            source={introImages[4]}
            style={{ width: '100%', flex: 2 }}
            resizeMode="contain"
          />
        </View>
      )
    }
  ];

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <StatusBar hidden={true} />
        {this.props.intro ? (
          this.props.children
        ) : (
          <AppIntroSlider
            renderItem={this._renderItem}
            slides={this.slides}
            onDone={this._onDone}
            renderNextButton={this._renderNextButton}
            renderDoneButton={this._renderDoneButton}
            bottomButton
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
          />
        )}
      </View>
    );
  }

  _renderItem = (item, index) => {
    return (
      <View style={{ flex: 1, width: item.width, height: '100%' }}>
        {item.view}
      </View>
    );
  };

  _onDone = () => {
    return this.props.onIntro();
  };

  _renderNextButton = () => {
    return (
      <View style={styles.nextButton}>
        <Text style={styles.nextButtonText}>시작하기</Text>
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.doneButton}>
        <Text style={styles.nextButtonText}>시작하기</Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  nextButton: {
    backgroundColor: 'rgba(0, 0, 0, .7)',
    height: 56 + (isTablet ? 30 : 0),
    justifyContent: 'center',
    alignItems: 'center'
  },
  doneButton: {
    backgroundColor: 'rgb(30, 63, 94)',
    height: 56 + (isTablet ? 30 : 0),
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'NanumSquareB'
  },
  textTitle: {
    marginTop: height * 0.1,
    color: 'rgb(50, 56, 74)',
    fontSize: 27,
    // fontWeight: '700',
    fontFamily: 'NanumSquareEB'
  },
  textContent: {
    marginTop: 14.5,
    color: 'rgb(100, 113, 133)',
    fontSize: 18,
    textAlign: 'center',
    height: 50,
    fontFamily: 'NanumSquareB'
  },
  dotStyle: {
    width: 4,
    height: 4,
    backgroundColor: 'rgb(224, 232, 238)'
  },
  activeDotStyle: {
    width: 8,
    height: 8,
    backgroundColor: 'rgb(204, 210, 219)'
  }
});

export default AppIntroSlide;
