// import React from 'react';
import AppIntroSlide from './AppIntroSlide';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '@redux/user';

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
