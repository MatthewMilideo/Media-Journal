import React from "react";
import { connect } from "react-redux";
import { Button, Dropdown } from "semantic-ui-react";

import { addTag } from "../../actions";



/* Props: 
curNotes: a list of the current notes.   
*/

class AddTagButton extends React.Component {
	state = { clicked: false };

	handleClick = e => {
		this.setState({ clicked: true });
	};

	renderDropdown() {
		return (
			<Button> Add Tag </Button> 
		);
	}

	

	render() {
		let clicked = this.state.clicked;
		return(
		<Button> Hello </Button>);
	}
}

export default connect(
	null,
	{ addTag }
)(AddTagButton);
