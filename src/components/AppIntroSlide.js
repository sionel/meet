import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { actionCreators as UserActions } from '../redux/modules/user';

const rootPath = `../../assets`;
const introImages = [
  require(`${rootPath}/introImages/intro01.png`),
  require(`${rootPath}/introImages/intro02.png`),
  require(`${rootPath}/introImages/intro03.png`),
  require(`${rootPath}/introImages/intro04.png`),
  require(`${rootPath}/introImages/intro05.png`)
];
const logo_login = require(`${rootPath}/logo_login.png`);
const slides = [
  {
    key: '1',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: introImages[0],
    backgroundColor: '#1C90FB'
  },
  {
    key: '2',
    title: 'Title 2',
    text: 'Other cool stuff',
    image: introImages[1],
    backgroundColor: '#c34bef'
  },
  {
    key: '3',
    title: 'Rocket guy',
    text: "I'm already out of descriptions",
    image: introImages[2],
    backgroundColor: '#8ad335'
  }
];

class AppIntroSlide extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.intro ? (
          this.props.children
        ) : (
          <AppIntroSlider
            renderItem={this._renderItem}
            slides={slides}
            onDone={this._onDone}
            renderNextButton={this._renderNextButton}
            renderDoneButton={this._renderDoneButton}
          />
        )}
      </View>
    );
  }

  _renderItem = (item, index) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          padding: 0,
          backgroundColor: item.backgroundColor,
          overflow: "hidden"
        }}
      >
        {/* 
				이미지 원본크기로 지정해야 가로크기가 맞음..
				*/}
        <Image
          source={item.image}
          style={{ width: item.width, height: item.height }}
          resizeMode="contain" />
        {/* <View style={{
          width: item.width, height: item.width / 474 * 843}}>
          <Image
            source={item.image}
            style={{ flex:1, width: item.width, height: item.width / 474 * 843 }}
          />
        </View> */}
      </View>
    );
  };

  _onDone = () => {
    return this.props.onIntro();
  };

  _renderNextButton = () => {
    return (
      <View style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Done</Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  nextButton: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 25,
    borderWidth: 0
    // marginBottom: 200
  },
  nextButtonText: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 16
  }
});

// map state to props
const mapStateToProps = state => ({
  intro: state.user.appIntro
});

// map dispatch to props
const mapDispatchToProps = dispatch => ({
  onIntro: () => dispatch(UserActions.toggleVisibleAppIntro())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppIntroSlide);
