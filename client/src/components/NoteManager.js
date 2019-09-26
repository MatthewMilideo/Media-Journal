import React from "react";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import Note from "./Note";
import Button from "react-bootstrap/Button";

import { getNotes, addNote } from "../actions";
import { getNotesState } from "../reducers";
import * as T from "../actions/types";

class NoteManager extends React.Component {
	componentDidMount() {
		const { CID, type, user_id} = this.props;
		this.props.getNotes({ CID, type, user_id });
	}

	renderEmpty() {
		return (
			<Card>
				<Button onClick={() => this.props.addNote()}>
					Click here to add a note!
				</Button>
			</Card>
		);
	}

	renderNotes() {
		const { CID, type, user_id } = this.props;
		const { keysArr } = this.props.Notes.notes;
		return (
			<Card className="p-2">
				<Card.Title> Notes </Card.Title>
				{keysArr.map(elem => {
					return (
						<Note
							id={elem}
							key={elem}
							CID={CID}
							type={type}
							user_id={user_id}
						/>
					);
				})}
				<Button onClick={() => this.props.addNote()}> Add Note</Button>
			</Card>
		);
	}

	render() {
		switch (this.props.Notes.status) {
			case null: {
				return <div> Nothing </div>;
			}
			case T.ERRORED_GET_NOTES: {
				if (this.props.Notes.error.status === 404) return this.renderEmpty();
				else return <div> Error </div>;
			}
			default:
				return this.renderNotes();
		}
	}
}

const mapStateToProps = state => {
	return {
		Notes: getNotesState(state)
	};
};

export default connect(
	mapStateToProps,
	{ getNotes, addNote }
)(NoteManager);
