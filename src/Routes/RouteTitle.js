/**
 * 
 */

import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

const RouteTitle = props => {
	const company_name = props.auth ? props.auth.last_company.company_name_kr : '-';
	// console.log('props.auth ; ', props.auth);

	// return <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>company_name</Text>;
	return <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>{company_name}</Text>;
};

const mapStateToProps = state => ({
	auth: state.user.auth
});

export default connect(mapStateToProps, null)(RouteTitle);
