import React from "react";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Note from "./Note";

import { getNotes, addNote } from "../actions";
import { getNotesState } from "../reducers";
import * as T from "../actions/types";

const Media = props => {
	return (
		<Card>
			<span>
				{props.media.title} // {props.media.type}
			</span>
			{props.children}
		</Card>
	);
};

/*

mediaFlag
notes
CID={id}
type={type}
title={title}
user_id={user_id}


*/

class NoteManager extends React.Component {
	componentDidMount() {
		const { notes, CID, type, user_id } = this.props;
		if (!notes) this.props.getNotes({ CID, type, user_id });
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

	renderNotesMedia() {
		const { givenNotes, media } = this.props;
		let data = [];
		let temp = [];
		media.keysArr.forEach(elem => {
			if (givenNotes.mediaOrg[elem]) {
				temp = givenNotes.mediaOrg[elem].map(note => {
					return (
						<Note
							id={note.note_id}
							key={note.note_id}
							CID={note.CID}
							title={note.media_title}
							type={note.type}
							user_id={note.user_id}
						/>
					);
				});
			}
			data.push(<Media media={media.media[elem]}>{temp}</Media>);
			temp = [];
		});
		return <div> {data} </div>;
	}

	renderNotes() {
		let keysArr;
		if (!this.props.givenNotes) keysArr = this.props.Notes.notes.keysArr;
		else keysArr = this.props.givenNotes.keysArr;

		const { CID, type, title, user_id } = this.props;

		console.log(keysArr);

		return (
			<Card className="p-2">
				<Card.Title> Notes </Card.Title>
				{keysArr.map(elem => (
					<Note
						id={elem}
						key={elem}
						CID={CID}
						title={title}
						type={type}
						user_id={user_id}
					/>
				))}
				{this.props.buttonFlag ? (
					<Button onClick={() => this.props.addNote()}> Add Note</Button>
				) : null}
			</Card>
		);
	}

	render() {
		const { mediaFlag } = this.props;
		switch (this.props.Notes.status) {
			case null: {
				return <div> Nothing </div>;
			}
			case T.ERRORED_GET_NOTES: {
				if (this.props.Notes.error.status === 404) return this.renderEmpty();
				else return <div> Error </div>;
			}
			default:
				if (mediaFlag) return this.renderNotesMedia();
				else return this.renderNotes();
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
