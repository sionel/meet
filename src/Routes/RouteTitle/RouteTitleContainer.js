/**
 *
 */

import React from 'react';
import { Text } from 'react-native';
import RouteTitlePresenter from './RouteTitlePresenter';

class RouteTitleContainer extends React.Component {
  // state = {
  //   company_no: -1,
  //   company_name: ''
  // };

  /**
   *
   */
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps !== this.props) {
  //     this._handleChangeCompany(nextProps.auth);
  //     return false;
  //   }

  //   return true;
  // }

  /**
   *
   */
  render() {
    return (
      <RouteTitlePresenter
        // {...this.state}
        // {...this.props}
        title={this.props.title || ''}
        // onChangeValue={this._handleChangeValue}
      />
    );
  }

  // _handleChangeCompany = auth => {
  //   const { employee_list, last_access_company_no } = auth;
  //   if (typeof employee_list === 'undefined') return;
  //   const selectedCompany = employee_list.find(
  //     company => company.company_no === last_access_company_no
  //   );

  //   this.setState({
  //     company_no: selectedCompany.company_no,
  //     company_name: selectedCompany.company_name_kr
  //   });
  // };

  /**
   *
   */
  // _handleChangeValue = selectedCompany => {
  //   this.setState({ selectedCompany });
  // };
}

export default RouteTitleContainer;
