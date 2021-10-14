import React from 'react';
import SearchFormPresenter from './SearchFormPresenter';

class SearchFormContainer extends React.Component {
	state = {
		active: false, 
		value: '' 
	};

	render() {
		const { active, value } = this.state;
		return (
			<SearchFormPresenter
				active={active}
				value={value}
				onFocus={this._handleOnFocus}
				onChange={this._handleOnChange}
			/>
		);
	}

	_handleOnChange = value => {
		const { onChange } = this.props;
		onChange(value);
		this.setState({
			value,
			active: value ? true : false
		});
	};
}

SearchFormContainer.defaultProps = {
	onChange: () => console.log('on change searchform')
};

export default SearchFormContainer;
