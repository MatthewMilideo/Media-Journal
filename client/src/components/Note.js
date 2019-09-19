import React from "react";
import TagSearch from "./TagSearch";
import { connect } from "react-redux";
import Styled from "styled-components";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { editNote, postNote, deleteNote } from "../actions";
import { getNote, getUser } from "../reducers";

const StyledP = Styled.p`
white-space: pre-wrap; 
`;

class Note extends React.Component {
	constructor(props) {
		super(props);

		this.props.Note.new
			? (this.state = {
					edit: true,
					localTitle: "",
					localData: "",
					localTags: [],
					rmTags: [],
					addTags: []
			  })
			: (this.state = {
					edit: false,
					localTitle: this.props.Note.title,
					localData: this.props.Note.data,
					localTags: this.props.Note.tags,
					rmTags: [],
					addTags: []
			  });
	}

	onSaveChanges = () => {
		
		const { id, type, CID } = this.props;
		const { user_id } = this.props.User;
		const { localTitle, localData, rmTags, addTags } = this.state;
		console.log(this.props.Note);
		!this.props.Note.new
			? this.props.editNote(id, localTitle, localData, rmTags, addTags)
			: this.props.postNote(
					id,
					localTitle,
					localData,
					this.props.Note.tags,
					{ CID, type, title: "Hi" },
					user_id
			  );
		this.setState({ edit: false });
	};

	onDiscardChanges = () => {
		Note.new
			? this.props.deleteNote(this.props.Note)
			: this.setState({ edit: false });
	};

	addNoteTag = tag => {
		let { localTags, addTags } = this.state;
		localTags.push(tag);
		addTags.push(tag);
		this.setState({ localTags, addTags });
	};

	removeNoteTag = tag => {
		let { localTags, rmTags } = this.state;
		rmTags.push(tag);
		localTags = localTags.filter(elem => {
			if (elem.title.toLowerCase().trim() !== tag.title.toLowerCase().trim()) {
				return elem;
			}
		});
		this.setState({ localTags, rmTags });
	};

	renderStatic = () => {
		const { title, data, tags } = this.props.Note;

		return (
			<Card className="mb-3 p-3 shadow-sm">
				<Card.Title className=" ml-n1 mr-n1 pb-2 border-bottom">
					{title}
				</Card.Title>
				<StyledP>{data}</StyledP>

				<TagSearch
					tags={tags}
					edit={this.state.edit}
					removeNoteTag={this.removeNoteTag}
					addNoteTag={this.addNoteTag}
				/>

				<Card.Footer className="m-n3">
					<div className="d-flex">
						<Button
							onClick={() => this.setState({ edit: true })}
							className="bg-warning"
						>
							Edit
						</Button>
						<Button
							className=" ml-auto bg-danger"
							onClick={() => this.props.deleteNote(this.props.Note)}
						>
							Delete
						</Button>
					</div>
				</Card.Footer>
			</Card>
		);
	};

	renderEdit = () => {
		const { localTitle, localData, localTags } = this.state;
		const { tags, note_id } = this.props.Note;

		let saveDisabled = false;
		if (!localTitle || !localData) saveDisabled = true;

		return (
			<Card className="mb-3 p-3 shadow-sm">
				<Card.Title>
					<Form.Group controlId="noteTitle">
						<Form.Label>Note Title: </Form.Label>
						<Form.Control
							type="text"
							value={localTitle}
							onChange={e => this.setState({ localTitle: e.target.value })}
						/>
					</Form.Group>
				</Card.Title>
				<Form.Group controlId="noteData">
					<Form.Label>Note Text: </Form.Label>
					<Form.Control
						as="textarea"
						rows="5"
						value={localData}
						onChange={e => this.setState({ localData: e.target.value })}
					/>
				</Form.Group>
				<TagSearch
					tags={localTags}
					edit={this.state.edit}
					removeNoteTag={this.removeNoteTag}
					addNoteTag={this.addNoteTag}
				/>
				<Card.Footer className="m-n3">
					<div className="d-flex">
						<Button
							className="mr-1"
							onClick={this.onSaveChanges}
							disabled={saveDisabled}
						>
							Save Changes
						</Button>
						<Button
							onClick={this.onDiscardChanges}
							className="bg-warning ml-auto"
						>
							Discard Changes
						</Button>
					</div>
				</Card.Footer>
			</Card>
		);
	};

	render() {
		const { edit } = this.state;
		return edit ? this.renderEdit() : this.renderStatic();
	}
}

const mapStateToProps = (state, props) => {
	return {
		Note: getNote(state, props.id),
		User: getUser(state)
	};
};

export default connect(
	mapStateToProps,
	{ editNote, postNote, deleteNote }
)(Note);
