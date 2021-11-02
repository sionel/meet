import SettingScreenContainer from './SettingScreenContainer';
import { connect } from 'react-redux';
import { actionCreators as AlertAcions } from '../../redux/modules/alert';

const mapStatetoProps = state => {
  return {
    auth: state.user.auth,
    isLogin: state.user.isLogin,
    from: state.user.from,
    params: state.root.params
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
