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
import { typeToStr } from "../../helpers";
import Dropdown2 from "../smallComponents/Dropdown";
import "../../styles/style.css";

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
					cTitle: this.props.data.cTitle,
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
						cTitle: this.props.data.cTitle,
						cID: this.props.data.cID,
						id: this.props.data.id
					},
					this.props.data.id
			  );
	};

	onDeleteClick = () => {
		this.props.data.new === true ? this.props.data.remove(this.props.data.id) : 
		this.props.query("delete", T.NOTE, null, this.props.data.id);
	};

	renderActive() {
		let color;
		this.state.mouse ? (color = "orange") : (color = null);

		return (
			<div className="note-div-active note-div">
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
						<div> 
						<Button onClick={this.onSaveClick}> Save Note </Button>
						<Button onClick={this.onDeleteClick}> Delete Note </Button>
						</div>
					</Form>
				</Segment>
			</div>
		);
	}

	/*
	<Dropdown2
							disabled
							tags={this.props.tags}
							selectedTags={this.state.currentValues}
							fetchTags={this.props.fetchTags}
							addTag={this.props.addTag}
							placeholder="A Tag"
						/>
					*/

	renderInactive() {
		let color;
		this.state.mouse ? (color = "teal") : (color = null);

		return (
			<div className="note-outer-div-inactive note-div">
				<Segment
					color={color}
					raised
					onMouseEnter={this.mouseEnter}
					onMouseLeave={this.mouseLeave}
					onClick={this.onHandleSegClick}
				>
					<div className="note-inner-div-inactive">
						<div>
							<h1> {this.state.noteTitle} </h1>
							<h2>
								{` ${this.props.data.cTitle} ${typeToStr(
									this.props.data.type
								)}`}
							</h2>
						</div>
						<Icon className="icon" name="edit" size="large" color={color} />
						<Divider />
						<p> {this.state.noteValue} </p>
					</div>
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
