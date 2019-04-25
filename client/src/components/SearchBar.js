import React from "react";
import { connect } from "react-redux";
import { Form, Button } from "semantic-ui-react";

import { fetchSearchResult } from "../actions";

/* Props: 
	searchType - the redux store's current searchType, 
	config - an object containing configuration data for
		the different search bars, their number, type, etc
*/

class SearchBar extends React.Component {
	state = {
		textValues: null
	};

	componentWillMount(props) {
		this.setState({ textValues: this.props.config.textValues });
	}

	onSearchSubmit = e => {
		e.preventDefault();
		this.props.fetchSearchResult(
			this.props.searchType,
			this.state.textValues[0],
			this.state.textValues[1]
		);
		let textLocal = this.state.textValues;
		textLocal = textLocal.map(elem => (elem = ""));
		this.setState({ textValues: textLocal });
	};

	configureSearch = (type, config) => {
		return config[type].map((elem, index) => {
			return (
				<Form.Input
					label={elem.label}
					width={15}
					placeholder={elem.placeholder}
					value={this.state.textValues[index]}
					key={index}
					onChange={e => {
						let tempValues = this.state.textValues;
						tempValues[index] = e.target.value;
						this.setState({ textValues: tempValues });
					}}
				/>
			);
		});
	};

	render() {
		let { searchType, config } = this.props;
		return (
			<div className = 'search-form-div'> 
			<Form onSubmit={this.onSearchSubmit}>
				<Form.Group width={15}>
					{this.configureSearch(searchType, config)}
					<div className="search-bar-button-div">
						<Form.Button width = {1} color="blue"> Submit </Form.Button>
					</div>
				</Form.Group>
			</Form>
			</div>
		);
	}
}

export default connect(
	null,
	{ fetchSearchResult }
)(SearchBar);
