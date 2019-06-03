import { connect } from 'react-redux';
import ConferenceScreenContainer from './ConferenceScreenContainer';

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
		local: { user },
		mainUser: { mainUserId },
		participants: { list },
		user: { auth }
	} = state;
	
	const mainUser = getMainUser(mainUserId, user, list);

	return {
		mainUser,
		user_name: auth.user_name,
		auth: auth,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		dispatch: dispatch
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(ConferenceScreenContainer);
