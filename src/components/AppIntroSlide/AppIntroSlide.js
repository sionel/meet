import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  StatusBar
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AppIntroSlider from './react-native-intro-slider/AppIntroSlider';
import { WEHAGO_TYPE } from '../../../config';

import { getT } from '../../utils/translateManager';

const { height } = Dimensions.get('window');

const isTablet = DeviceInfo.isTablet();

const introImages = [
  require('./images/img_intro_meet/drawable-xxxhdpi/img_intro_meet.png'),
  require('./images/walkthroughs_02/drawable-xxxhdpi/walkthroughs_02.png'),
  require('./images/walkthroughs_03/drawable-xxxhdpi/walkthroughs_03.png'),
  require('./images/walkthroughs_04/drawable-xxxhdpi/walkthroughs_04.png'),
  require('./images/walkthroughs_05/drawable-xxxhdpi/walkthroughs_05.png')
];

class AppIntroSlide extends React.Component {
  t = getT();
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
              marginTop: 150,
              color: '#FFF',
              fontSize: 17,
              // fontWeight: '700',
              textAlign: 'center',
              fontFamily: 'DOUZONEText50'
            }}
          >
            {this.t('splash.1번타이틀') + WEHAGO_TYPE + ' Meet'}
          </Text>
          <Text
            style={{
              marginTop: 24.5,
              color: 'rgb(193, 219, 246)',
              fontSize: 12,
              fontFamily: 'DOUZONEText30'
            }}
          >
            {this.t('splash.1번내용')}
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
            <Text style={styles.textTitle}>
              {this.t('splash.2번타이틀')}
            </Text>
            <Text style={styles.textContent}>{this.t('splash.2번내용')}</Text>
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
            <Text style={styles.textTitle}>{this.t('splash.3번타이틀')}</Text>
            <Text style={styles.textContent}>{this.t('splash.3번내용')}</Text>
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
            <Text style={styles.textTitle}>{this.t('splash.4번타이틀')}</Text>
            <Text style={styles.textContent}>{this.t('splash.4번내용')}</Text>
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
            <Text style={styles.textTitle}>{this.t('splash.5번타이틀')}</Text>
            <Text style={styles.textContent}>{this.t('splash.5번내용')}</Text>
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
        <Text style={styles.nextButtonText}>{this.t('splash.시작하기')}</Text>
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.doneButton}>
        <Text style={styles.nextButtonText}>{this.t('splash.시작하기')}</Text>
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
    fontFamily: 'DOUZONEText30'
  },
  textTitle: {
    marginTop: height * 0.1,
    color: 'rgb(50, 56, 74)',
    fontSize: 21,
    // fontWeight: '700',
    fontFamily: 'DOUZONEText50'
  },
  textContent: {
    marginTop: 14.5,
    color: 'rgb(100, 113, 133)',
    fontSize: 14,
    textAlign: 'center',
    height: 50,
    fontFamily: 'DOUZONEText30'
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
