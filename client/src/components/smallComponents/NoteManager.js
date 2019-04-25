import React from "react";
import Note from "./Note";
import { Button, PopupContent } from "semantic-ui-react";
import { connect } from "react-redux";

import * as T from "../../actions/types";
import { buildCrudQuery} from "../../actions";
import { getItemNotes } from "../../reducers";
import "../../styles/style.css";

/*
Props:
Title - The Title of the content where the NoteManager is initilized or Unaffiliated. 
Type - The type the content 
cID - The ContentID ...


*/
class NoteManager extends React.Component {
	state = { notes: [] };

	componentDidMount() {
		//console.log(this.props);
		if (this.props.type === "ALL") {
			this.props.buildCrudQuery("get", T.NOTE);
		} else {
			this.props.buildCrudQuery("get", T.NOTE, {
				type: this.props.type,
				cID: this.props.cID
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.notes.length != prevProps.notes.length) {
			this.setState({
				notes: [...this.props.notes]
			});
		}
	}

	renderNotes = () => {
		let notes = [];
		if (this.state.notes.length > 0) {
			notes = this.state.notes.map(note => {
				//console.log("note", note);
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
	};
	removeNewNote = (id) => {
		let notes = this.state.notes; 

		notes = notes.filter( elem => elem.id !== id);
		console.log(notes);
		this.setState({notes});
		}

	handleClick = e => {
		let { notes } = this.state;
		let { type, title, cID } = this.props;
		if (type === "ALL") {
			cID = -1;
			title = "Personal Notes";
		}
		const newNote = {
			title: "",
			text: "",
			cTitle: title,
			type: type,
			cID: cID,
			id: 9000000 + notes.length,
			new: true,
			remove: this.removeNewNote
		};

		notes.push(newNote);
		this.setState({ notes: notes });
	};

	
	

	render() {
		if (this.state.notes === []) return null;

		return (
			<div className="note-manager-div">
				{this.renderNotes()}
				<Button
					className="note-button"
					color="blue"
					onClick={e => this.handleClick(e)}
				>
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
	{ buildCrudQuery}
)(NoteManager);

