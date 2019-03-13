/**
 * 
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RouteTitlePresenter from './RouteTitlePresenter';

class RouteTitleContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			employeeList: this.props.auth.employee_list.map(e => ({
				label: e.company_name_kr,
				value: e.company_no
			})),
			selectedCompany: this.props.auth.last_access_company_no
		};
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		console.log('NEXT : ', nextProps);
		console.log('nextState : ', nextState);
		return true;
	};

	/**
	 * 
	 */
	render() {
		if (!this.props.auth) {
			return <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>-</Text>;
		}
		return <RouteTitlePresenter {...this.state} {...this.props} />;
	} // render
}

export default RouteTitleContainer;
