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
			<Dropdown button size="tiny" multipule icon="book">
				<Dropdown.Menu>
					{/*xthis.props.curNotes.map( note => <Dropdown.item text = {note.title}/>) */}
					<Dropdown.Item text="Add to note 1" />
				</Dropdown.Menu>
			</Dropdown>
		);
	}

	renderButton() {
		return <Button size="tiny" icon="book" onClick={this.handleClick} />;
	}

	render() {
		let clicked = this.state.clicked;

		return <div>{this.renderDropdown()}</div>;
	}
}

export default connect(
	null,
	{ addTag }
)(AddTagButton);
