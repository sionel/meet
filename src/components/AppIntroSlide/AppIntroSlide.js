import React, { Fragment } from 'react';
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
import * as RNLocalize from 'react-native-localize';

const { height } = Dimensions.get('window');

const isTablet = DeviceInfo.isTablet();

const KRintroImages = [
  require('./images/img_intro_meet/drawable-xxxhdpi/img_intro_meet.png'),
  require('./images/kr/walkthroughs_02/drawable-xxxhdpi/walkthroughs_02.png'),
  require('./images/kr/walkthroughs_03/drawable-xxxhdpi/walkthroughs_03.png'),
  require('./images/kr/walkthroughs_04/drawable-xxxhdpi/walkthroughs_04.png'),
  require('./images/kr/walkthroughs_05/drawable-xxxhdpi/walkthroughs_05.png')
];
const JAintroImages = [
  require('./images/img_intro_meet/drawable-xxxhdpi/img_intro_meet.png'),
  require('./images/ja/walkthroughs_02/drawable-xxxhdpi/walkthroughs_02.png'),
  require('./images/ja/walkthroughs_03/drawable-xxxhdpi/walkthroughs_03.png'),
  require('./images/ja/walkthroughs_04/drawable-xxxhdpi/walkthroughs_04.png'),
  require('./images/ja/walkthroughs_05/drawable-xxxhdpi/walkthroughs_05.png')
];

const ENintroImages = [
  require('./images/img_intro_meet/drawable-xxxhdpi/img_intro_meet.png'),
  require('./images/en/walkthroughs_02/drawable-xxxhdpi/walkthroughs_02.png'),
  require('./images/en/walkthroughs_03/drawable-xxxhdpi/walkthroughs_03.png'),
  require('./images/en/walkthroughs_04/drawable-xxxhdpi/walkthroughs_04.png'),
  require('./images/en/walkthroughs_05/drawable-xxxhdpi/walkthroughs_05.png')
];
class AppIntroSlide extends React.Component {
  constructor(props) {
    super(props);
    this.language = RNLocalize.getLocales()[0].languageCode;

    this.introImages =
      this.language === 'ko'
        ? KRintroImages
        : this.language === 'ja'
        ? JAintroImages
        : ENintroImages;
    this.slides = [
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
              source={this.introImages[0]}
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
              {this.t('splash_1sttitle') + ' ' + WEHAGO_TYPE + ' Meet'}
            </Text>
            <Text
              style={{
                marginTop: 24.5,
                color: 'rgb(193, 219, 246)',
                fontSize: 12,
                fontFamily: 'DOUZONEText30'
              }}
            >
              {this.t('splash_1stcontent')}
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
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={styles.textTitle}>{this.t('splash_2ndtitle')}</Text>
              <Text style={styles.textContent}>
                {this.t('splash_2ndcontent')}
              </Text>
            </View>
            <Image
              source={this.introImages[1]}
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
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={styles.textTitle}>{this.t('splash_3rdtitle')}</Text>
              <Text style={styles.textContent}>
                {this.t('splash_3rdcontent')}
              </Text>
            </View>
            <Image
              source={this.introImages[2]}
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
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={styles.textTitle}>{this.t('splash_4thtitle')}</Text>
              <Text style={styles.textContent}>
                {this.t('splash_4thcontent')}
              </Text>
            </View>
            <Image
              source={this.introImages[3]}
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
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={styles.textTitle}>{this.t('splash_5thtitle')}</Text>
              <Text style={styles.textContent}>
                {this.t('splash_5thcontent')}
              </Text>
            </View>
            <Image
              source={this.introImages[4]}
              style={{ width: '100%', flex: 2 }}
              resizeMode="contain"
            />
          </View>
        )
      }
    ];
  }

  t = getT();

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        {this.props.intro ? (
          this.props.children
        ) : (
          <Fragment>
            <StatusBar hidden={true} />
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
          </Fragment>
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
        <Text style={styles.nextButtonText}>{this.t('splash_start')}</Text>
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.doneButton}>
        <Text style={styles.nextButtonText}>{this.t('splash_start')}</Text>
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
