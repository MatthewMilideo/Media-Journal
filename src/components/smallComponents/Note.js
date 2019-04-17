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

import Dropdown2 from "../smallComponents/Dropdown";

class Note extends React.Component {
	state = {
		noteTitle: "",
		noteValue: "",
		noteTags: [],
		options: this.options,
		currentValues: [],
		searchInput: "",
		active: 1,
		mouse: false
	};

	componentDidMount() {
		if (this.props.noteData) {
			this.setState({
				noteTitle: this.props.noteData.title,
				noteValue: this.props.noteData.text,
				active: 0
			});
		}
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

		this.props.new 
			? this.props.add('post', {
					title: this.state.noteTitle,
					text: this.state.noteValue,
					type: this.props.type,
					cID: this.props.cID,
					status: false, 
					id: ''
			  })
			: this.props.patch('patch', {
					
					title: this.state.noteTitle,
					text: this.state.noteValue,
					status: false, 
			  }, this.props.noteData.id );
	};

	onDeleteClick = () => {
		this.props.delete('delete', null, this.props.noteData.id); 
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
