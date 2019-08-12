import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

import {
	editNoteTitle,
	editNoteData,
	discardNoteChanges,
	noteEditState,
	saveNote
} from "../../actions";
import * as T from "../../actions/types";

const StyledCard = styled(Card)`
	:hover {
		span {
			color: blue;
		}
	}
`;

class Note extends React.Component {
	onTitleChange = e => {
		this.props.editNoteTitle(this.props.data.id, e.target.value);
	};

	onDataChange = e => {
		this.props.editNoteData(this.props.data.id, e.target.value);
	};

	onCardClick = () => {
		const { data } = this.props;

		if (data.editState === false) this.props.noteEditState(data.id);
	};

	onDiscardClick = () => {
		this.props.discardNoteChanges(this.props.data.id);
	};

	onSaveClick = () => {
		this.props.saveNote(this.props.data.id);
	};

	renderActive = () => {
		const { data } = this.props;
		return (
			<StyledCard
				key={data.id}
				className="mt-3 ml-3 mr-3 p-3 rounded-lg shadow"
				onClick={this.onCardClick}
			>
				<Card.Title className="d-flex">
					{" "}
					<FormControl
						value={data.newTitle}
						aria-label="The Note Title"
						onChange={this.onTitleChange}
					/>
				</Card.Title>
				<Card.Body>
					<FormControl
						value={data.newData}
						aria-label="The Note Data"
						onChange={this.onDataChange}
					/>
				</Card.Body>
				<div className="d-flex">
					<Button variant="primary"
						onClick={this.onSaveClick}> Save </Button>
					<Button
						className="ml-3"
						variant="warning"
						onClick={this.onDiscardClick}
					>
						{" "}
						Discard{" "}
					</Button>
					<Button className="ml-auto" variant="danger">
						{" "}
						Delete{" "}
					</Button>
				</div>
			</StyledCard>
		);
	};

	renderInactive = () => {
		const { data } = this.props;
		return (
			<StyledCard
				key={data.id}
				className="mt-3 ml-3 mr-3 p-3 rounded-lg shadow"
				onClick={this.onCardClick}
			>
				<Card.Title className="d-flex">
					{" "}
					{data.newTitle} <span className="oi oi-pencil ml-auto" />
				</Card.Title>
				<Card.Body>{data.newData}</Card.Body>
			</StyledCard>
		);
	};

	render() {
		const { data } = this.props;
		return (
			<div>{data.editState ? this.renderActive() : this.renderInactive()}</div>
		);
	}
}

export default connect(
	null,
	{ editNoteTitle, editNoteData, discardNoteChanges, noteEditState, saveNote }
)(Note);
