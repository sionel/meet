import SettingScreenContainer from './SettingScreenContainer';
import { connect } from 'react-redux';
import { actionCreators as AlertAcions } from '../../redux/modules/alert';

const mapStatetoProps = state => {
  return {
    auth: state.user.auth,
    from: state.user.from
  };
};

const mapDispathtoProps = dispatch => {
  return {
    setAlert: params => dispatch(AlertAcions.setAlert(params))
  };
};

export default connect(
  mapStatetoProps,
  mapDispathtoProps
)(SettingScreenContainer);
