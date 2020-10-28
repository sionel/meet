import SettingScreenContainer from './SettingScreenContainer';
import { connect } from 'react-redux';

const mapStatetoProps = state => {
  return {
    auth: state.user.auth,
    from: state.user.from
  };
};

const mapDispathtoProps = dispath => ({});

export default connect(
  mapStatetoProps,
  mapDispathtoProps
)(SettingScreenContainer);
