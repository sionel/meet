/**
 * 
 */

import RouteTitleContainer from './RouteTitleContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';

const mapStateToProps = state => ({
	auth: state.user.auth,
	cno: state.user.auth.last_access_company_no
});

const mapDispatchToProps = dispatch => ({
	onChangeCompany: cno => dispatch(UserActions.changeCompany(cno))
});

export default connect(mapStateToProps, mapDispatchToProps)(RouteTitleContainer);
// export default RouteTitleContainer;
