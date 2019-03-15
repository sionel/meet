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
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: introImages[0],
    backgroundColor: '#1C90FB'
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    image: introImages[1],
    backgroundColor: '#febe29'
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: "I'm already out of descriptions",
    image: introImages[2],
    backgroundColor: '#22bcb5'
  }
];

class AppIntroSlide extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // showRealApp: false
      showRealApp: this.props.intro
    };
  }

  _renderItem = (item, index) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          width: item.width,
          height: item.height,
          backgroundColor: item.backgroundColor
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', width: '100%' }}>
          {item.title}
        </Text>
        {/* 
				이미지 원본크기로 지정해야 가로크기가 맞음..
				*/}
        {/* <Image source={item.image} style={{ width: 275 }} /> */}
        <Image source={item.image} style={{ width: "100%" }} />
        {/* <View style={{ backgroundColor: '#f1f1f1', width: '100%' }}>
					<Text>asdasdlka</Text>
				</View>
				<Text style={{ color: '#fff', textAlign: 'center' }}>{JSON.stringify(item.text)}</Text> */}
      </View>
    );
  };

  _onDone = async () => {
    await this.props.onIntro();
    this._handleGetIntroState();
  };

  _handleGetIntroState = () => {
    const { intro } = this.props;
    this.setState({ showRealApp: intro });
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.showRealApp ? (
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
let mapStateToProps = state => ({
  intro: state.user.intro
});

// map dispatch to props
let mapDispatchToProps = dispatch => ({
  onIntro: () => dispatch(UserActions.intro())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppIntroSlide);
