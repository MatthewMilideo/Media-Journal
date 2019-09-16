import React from "react";
import TagSearch from "./TagSearch";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { editNote, postNote, deleteNote } from "../actions";
import { getNote, getUser } from "../reducers";

import * as T from "../actions/types";

class Note extends React.Component {
	state = {
		edit: this.props.Note.new,
		localTitle: "",
		localData: "",
		tagData: ""
	};

	onSaveChanges = () => {
		const { id, type, CID } = this.props;
		const { user_id } = this.props.User;
		const { localTitle, localData } = this.state;
		const { tags } = this.props.Note;
		console.log("user_id", user_id);

		if (!this.props.Note.new) {
			this.props.editNote(id, localTitle, localData);
		}

		this.props.postNote(
			localTitle,
			localData,
			user_id,
			{ CID, type, title: "Hi" },
			id,
			tags
		);

		this.setState({ edit: false });
	};

	onDiscardChanges = () => {};

	renderStatic = () => {
		const { title, data } = this.props.Note;
		return (
			<Card className="mb-3 p-3 shadow-sm">
				<Card.Title> {title} </Card.Title>
				<Card.Body>
					{data}
					Note Tags:
				</Card.Body>

				<div className="d-flex">
					<Button
						onClick={() =>
							this.setState({ edit: true, localTitle: title, localData: data })
						}
						className="bg-warning"
					>
						Edit
					</Button>
					<Button
						className=" ml-auto bg-danger"
						onClick={() => this.props.deleteNote(this.props.Note)}
					>
						{" "}
						Delete{" "}
					</Button>
				</div>
			</Card>
		);
	};

	renderEdit = () => {
		const { localTitle, localData } = this.state;
		const { tags, note_id } = this.props.Note;
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
				<TagSearch tags={tags} note_id={note_id} />
				<Card.Footer className="m-n3">
					<div className="d-flex">
						<Button className="mr-1" onClick={this.onSaveChanges}>
							Save Changes
						</Button>
						<Button
							onClick={() => this.setState({ edit: false })}
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
