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
  state = {
    company_no: -1,
    company_name: ''
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     employeeList: this.props.auth.employee_list.map(e => ({
  //       label: e.company_name_kr,
  //       value: e.company_no
  //     })),
  //     selectedCompany: this.props.auth.last_access_company_no
  //       ? this.props.auth.last_access_company_no
  //       : null
  //   };
  // }

  /**
   *
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      this._handleChangeCompany(nextProps.auth);
      return false;
    }
    // try {
    //   this.props.onChangeCompany(nextState.selectedCompany);
    //   if (this.state.selectedCompany != nextState.selectedCompany) {
    //     return true;
    //   }
    //   return false;
    // } catch (e) {
    //   return false;
    // }

    return true;
  }

  /**
   *
   */
  render() {
    return (
      <RouteTitlePresenter
        {...this.state}
        // {...this.props}
        title={this.props.title}
        onChangeValue={this._handleChangeValue}
      />
    );
  }

  _handleChangeCompany = auth => {
    const { employee_list, last_access_company_no } = auth;
    if (typeof employee_list === 'undefined') return;
    const selectedCompany = employee_list.find(
      company => company.company_no === last_access_company_no
    );

    this.setState({
      company_no: selectedCompany.company_no,
      company_name: selectedCompany.company_name_kr
    });
  };

  /**
   *
   */
  _handleChangeValue = selectedCompany => {
    this.setState({ selectedCompany });
  };
}

export default RouteTitleContainer;
