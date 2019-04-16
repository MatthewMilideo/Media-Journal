import React from "react";
import { Dropdown } from "semantic-ui-react";


class Dropdown2 extends React.Component {
    state = { 
        searchQuery: "",
        currentValues: [],  
	}
	
	componentDidMount(){
		this.setState({
			currentValues: this.props.selectedTags
		})
	}

    handleSearchQueryChange = (e, data) => {
		this.setState({ searchQuery: data.searchQuery.toLowerCase() });
	};

	handleAddItem = (e, { value }) => {
		this.props.addTag({ id: value, text: value, value });
		this.setState({ searchInput: "" });
	};

	handleChange = (e, { value }) => {
		this.setState({ currentValues: value });
	};

	render() {

		return (
			<Dropdown
				options={this.props.tags}
				placeholder= {this.props.placeholder}
				search
				selection
				fluid
				multiple
				allowAdditions
				searchQuery={this.state.searchInput}
				onSearchChange={this.handleSearchChange}
				value={this.state.currentValues}
				onAddItem={this.handleAddItem}
				onChange={this.handleChange}
				
			/>
		);
	}
}

export default Dropdown2