import CompanySelectContainer from './CompanySelectContainer';

import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  from: state.user.from
});

const mapDispatchToProps = dispatch => {
  return {
    changeCompanyRequest: (auth, company) =>
      dispatch(UserActions.changeCompanyRequest(auth, company)),
    onLogout: () => dispatch(UserActions.logout()),
    onSetInitialList: () => dispatch(WetalkActions.setInitialList())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanySelectContainer);
