import React from "react";
import Note from "./Note";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";

//import { getAllNotes, postNote } from "../../actions";
import { getItemNotes, getNotesState } from "../../reducers";
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
		//this.props.getAllNotes();
		//this.props.postNote( 'Test Note', 'The test note has this data', 61, 70 )
	}
	//70

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

	removeNewNote = id => {
		let notes = this.state.notes;

		notes = notes.filter(elem => elem.id !== id);
		console.log(notes);
		this.setState({ notes });
	};

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

	newRenderNotes = () => {
		const { notes } = this.props;
		if (!notes.currNotes || !notes.allNotes)
			return <div> Error: Missing data from the store. </div>;
		let retNotes = [];
		for (let i = 0; i < notes.currNotes.length; i++) {
			let id = notes.currNotes[i];
			retNotes.push(
				<Note key={id} data={notes.allNotes[id]} tags={null} addTag={null} />
			);
		}
		return retNotes;
	};

	render() {
		if (!this.props.notes) return <div> No Notes</div>;

		return (
			<div className="note-manager-div">
				{this.newRenderNotes()}
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
		notes: getNotesState(state)
	};
};

export default connect(
	mapStateToProps,
	null //{ getAllNotes, postNote }
)(NoteManager);
