import { connect } from 'react-redux';
import ConferenceScreenContainer from './ConferenceScreenContainer';
import { actionCreators as DocumentShareActions } from '../../redux/modules/documentShare';

const getMainUser = (mainUserId, localUser, participants) => {
	if (!localUser) {
		return null;
	} else if (mainUserId === localUser.id) {
		return localUser;
	} else {
		return participants.find(participant => participant.id === mainUserId);
	}
};

const mapStateToProps = state => {
	const { 
		local: { user, createdTime },
		mainUser: { mainUserId },
		participants: { list },
		user: { auth },
		documentShare
	} = state;
	
	const mainUser = getMainUser(mainUserId, user, list);

	return {
		mainUser,
		user_name: auth.user_name,
		createdTime,
		auth: auth,
		documentShare,
		list
	};
};

const mapDispatchToProps = dispatch => {
	return {
		dispatch: dispatch,
		setSharingMode: () => DocumentShareActions.setSharingMode()
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(ConferenceScreenContainer);
