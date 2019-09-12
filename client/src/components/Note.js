import React from "react";
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
		blur: false
	};

	onSaveChanges = () => {
		const { id, type, CID } = this.props;
		const { user_id } = this.props.User;
		const { localTitle, localData } = this.state;
		console.log("user_id", user_id);

		if (!this.props.Note.new) {
			this.props.editNote(id, localTitle, localData);
		}

		this.props.postNote(
			localTitle,
			localData,
			user_id,
			{ CID, type, title: "Hi" },
			id
		);

		this.setState({ edit: false });
	};

	onDiscardChanges = () => {};

	renderStatic = () => {
		const { title, data } = this.props.Note;
		return (
			<Card className="mb-3 p-3 shadow-sm">
				<Card.Title> {title} </Card.Title>
				<Card.Body> {data} </Card.Body>
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
		const { localTitle, localData, media } = this.state;
		return (
			<Card className="mb-3 p-3 shadow-sm">
				<Card.Title>
					<Form.Group controlId="noteTitle">
						<Form.Label>Title</Form.Label>
						<Form.Control
							type="text"
							value={localTitle}
							onChange={e => this.setState({ localTitle: e.target.value })}
						/>
					</Form.Group>
				</Card.Title>
				<Card.Body>
					<Form.Group controlId="noteData">
						<Form.Label>Note Text</Form.Label>
						<Form.Control
							as="textarea"
							rows="5"
							value={localData}
							onChange={e => this.setState({ localData: e.target.value })}
						/>
					</Form.Group>
				</Card.Body>
				<div className="d-flex">
					<Button className="mr-1" onClick={this.onSaveChanges}>
						Save Changes
					</Button>
					<Button
						onClick={() => this.setState({ edit: false })}
						className="bg-warning"
					>
						Discard Changes
					</Button>
					<Button className=" ml-auto bg-danger"> Delete </Button>
				</div>
			</Card>
		);
	};

	render() {
		console.log(this.state);
		console.log(this.props.new);
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
