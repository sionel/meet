import SettingScreenContainer from './SettingScreenContainer';
import { connect } from 'react-redux';

const mapStatetoProps = state => {
  

  return {
    auth: state.user.auth,
  };
};

const mapDispathtoProps = dispath => ({});

export default connect(
  mapStatetoProps,
  mapDispathtoProps
)(SettingScreenContainer);
