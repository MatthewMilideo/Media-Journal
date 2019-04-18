import React from "react";
import Note from "./Note";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";

import * as T from "../../actions/types";
import { buildCrudQuery, addTag } from "../../actions";
import { getItemNotes } from "../../reducers";

class NoteManager extends React.Component {
	state = { notes: [] };

	componentDidMount() {
		this.props.buildCrudQuery("get", T.NOTE, {
			type: this.props.type,
			cID: this.props.cID
		});
	}

	componentWillUpdate(newProps) {
		if (this.props.notes.length !== newProps.notes.length) {
			this.setState({
				notes: newProps.notes
			});
		}
	}

	renderNotes = () => {
		let notes = [];
		if (this.state.notes.length > 0) {
			notes = this.state.notes.map(note => {
				return (
					<Note
						key={note.id}
						data={note}
						tags={null}
						addTag={null}
						query={this.props.buildCrudQuery}
					/>
				);
			});
		}
		return notes; 
	}

	handleClick = e => {
		let { notes } = this.state;
		const newNote = {
			title: "",
			text: "",
			type: this.props.type,
			cID: this.props.cID,
			id: 9000000 + notes.length,
			new: true
		};

		notes.push(newNote)
		this.setState({ notes: notes });
	};

	render() {
		if (this.state.notes === []) return null;
		return (
			<div>
				{this.renderNotes()}
				<Button attached="bottom" onClick={e => this.handleClick(e)}>
					Add Note
				</Button>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		notes: getItemNotes(state)
	};
};

export default connect(
	mapStateToProps,
	{ buildCrudQuery, addTag }
)(NoteManager);
