/**
 * 
 */

import React from 'react';
import { Text } from 'react-native';
import RouteTitlePresenter from './RouteTitlePresenter';

class RouteTitleContainer extends React.Component {
	// state = {
	// 	employeeList: [],
	// 	selectedCompany: null
	// }
	constructor(props) {
		super(props);
		this.state = {
			employeeList: this.props.auth.employee_list.map(e => ({
				label: e.company_name_kr,
				value: e.company_no
			})),
			selectedCompany: this.props.auth.last_access_company_no ? this.props.auth.last_access_company_no : null
		};
	}

	/**
	 * 
	 */
	shouldComponentUpdate(nextProps, nextState) {
		try {
			this.props.onChangeCompany(nextState.selectedCompany);
			if (this.state.selectedCompany != nextState.selectedCompany) {
				return true;
			}
			return false;
		} catch (e) {
			return false;
		}

		// return false;
	}
	componentWillUpdate(nextProps, nextState) {}

	/**
	 * 
	 */
	render() {
		return <RouteTitlePresenter {...this.state} {...this.props} onChangeValue={this._handleChangeValue} />;
	}

	/**
	 * 
	 */
	_handleChangeValue = selectedCompany => {
		this.setState({ selectedCompany });
	};
}

export default RouteTitleContainer;
