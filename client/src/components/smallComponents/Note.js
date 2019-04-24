import React from "react";
import {
	Form,
	TextArea,
	Button,
	Container,
	Segment,
	Divider,
	Icon
} from "semantic-ui-react";

import * as T from "../../actions/types";
import Dropdown2 from "../smallComponents/Dropdown";
import '../../styles/style.css'

class Note extends React.Component {
	state = {
		noteTitle: "",
		noteValue: "",
		noteTags: [],
		currentValues: [],
		active: 1,
		mouse: false
	};

	componentDidMount() {
		this.props.data.title === ""
			? this.setState({
					noteTitle: this.props.data.title,
					noteValue: this.props.data.text,
					active: 1
			  })
			: this.setState({
					noteTitle: this.props.data.title,
					noteValue: this.props.data.text,
					active: 0
			  });
	}

	onTitleChange = e => {
		this.setState({ noteTitle: e.target.value });
	};

	onValueChange = e => {
		this.setState({ noteValue: e.target.value });
	};

	mouseEnter = () => {
		this.setState({ mouse: true });
	};

	mouseLeave = () => {
		this.setState({ mouse: false });
	};

	onHandleSegClick = () => {
		this.setState({ active: 1 });
	};

	onSaveClick = () => {
		this.setState({
			active: 0,
			title: this.state.noteTitle,
			text: this.state.noteValue
		});
		this.props.data.new === true
			? this.props.query("post", T.NOTE, {
					title: this.state.noteTitle,
					text: this.state.noteValue,
					type: this.props.data.type,
					cID: this.props.data.cID
			  })
			: this.props.query(
					"patch",
					T.NOTE,
					{
						title: this.state.noteTitle,
						text: this.state.noteValue,
						type: this.props.data.type,
						cID: this.props.data.cID,
						id: this.props.data.id
					},
					this.props.data.id
			  );
	};

	onDeleteClick = () => {
		this.props.query("delete", T.NOTE, null, this.props.data.id);
	};

	renderActive() {
		let color;
		this.state.mouse ? (color = "orange") : (color = null);

		return (
			<div className="note-segment">
				<Segment
					raised
					color={color}
					onMouseEnter={this.mouseEnter}
					onMouseLeave={this.mouseLeave}
				>
					<Form>
						<Form.Field
							label="Note Title"
							placeholder="Title"
							control="input"
							value={this.state.noteTitle}
							onChange={this.onTitleChange}
						/>

						<TextArea
							rows={4}
							value={this.state.noteValue}
							onChange={this.onValueChange}
						/>

						<Dropdown2
							tags={this.props.tags}
							selectedTags={this.state.currentValues}
							fetchTags={this.props.fetchTags}
							addTag={this.props.addTag}
							placeholder="poop"
						/>

						<Button onClick={this.onSaveClick}> Save Note </Button>
						<Button onClick={this.onDeleteClick}> Delete Note </Button>
					</Form>
				</Segment>
			</div>
		);
	}

	renderInactive() {
		let color;
		this.state.mouse ? (color = "teal") : (color = null);

		return (
			<div className="note-segment">
				<Segment
					color={color}
					raised
					onMouseEnter={this.mouseEnter}
					onMouseLeave={this.mouseLeave}
					onClick={this.onHandleSegClick}
				>
					<h2 className="header"> {this.state.noteTitle} </h2>
					<Icon className="icon" name="edit" size="large" color={color} />
					<Divider />
					<p> {this.state.noteValue} </p>
				</Segment>
			</div>
		);
	}

	render() {
		return (
			<Container>
				{this.state.active ? this.renderActive() : this.renderInactive()}
			</Container>
		);
	}
}

export default Note;
