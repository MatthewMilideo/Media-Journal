import React from "react";
import { connect } from "react-redux";
import { Form, Button} from "semantic-ui-react";


import { fetchSearchResult } from "../actions";

/* Props: 
	searchType - the redux store's current searchType, 
	config - an object containing configuration data for
		the different search bars, their number, type, etc
*/

class SearchBar extends React.Component {

	state = {
		textValues: null,
	};

	componentWillMount(props){
		this.setState({textValues: this.props.config.textValues})
	}

	onSearchSubmit = e => {
		e.preventDefault();
		this.props.fetchSearchResult(
			this.props.searchType,
			this.state.textValues[0],
			this.state.textValues[1]
		);
		let textLocal = this.state.textValues; 
		textLocal = textLocal.map( elem => elem = '');
		this.setState({textValues: textLocal });
	};


	configureSearch = (type, config) => {
		//////console.log((type);
		return config[type].map((elem, index) => {
			return (
				<Form.Input
					label={elem.label}
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
		let {searchType, config} = this.props; 
		return (
			<Form onSubmit = {this.onSearchSubmit}>
				<Form.Group widths= 'equal'>
					{this.configureSearch(searchType, config)}
				</Form.Group>
				
				
			</Form>
		);
	}
}

export default connect(
	null,
	{ fetchSearchResult }
)(SearchBar);
