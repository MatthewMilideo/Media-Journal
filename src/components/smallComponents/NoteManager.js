import React from "react";
import Note from "./Note";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";

import * as T from '../../actions/types';
import { buildCrudQuery, addTag, } from "../../actions";
import { getItemNotes } from "../../reducers";

class NoteManager extends React.Component {
	state = { activeNote: null, noteCount: 0 };

	componentDidMount() {
		console.log('in note man',this.props.type);
		this.props.buildCrudQuery('get', T.NOTE, {type: this.props.type, cID: this.props.cID}, );
	}

	componentWillUpdate(newProps) {
		if (this.props.notes.length !== newProps.notes.length) {
			this.setState({ noteCount: newProps.notes.length });
		}
	}
	

	renderNotes = () => {
		let notes = [];
		if (this.props.notes.length > 0) {
			notes = this.props.notes.map(note => {
				return (
					<Note
						key={note.id}
						new={false}
						noteData={note}
						tags={null}
						addTag={null}
						patch={this.props.buildCrudQuery}
						delete = {this.props.buildCrudQuery}
					/>
				);
			});
		}
		while (notes.length < this.state.noteCount) {
			notes.push(
				<Note
					key={notes.length + 900000 + 1}
					new={true}
					cID={this.props.cID}
					type = {this.props.type}
					tags={null}
					addTag={null}
					add={this.props.buildCrudQuery}
				/>
			);
		}

		return notes;
	};

	handleClick = e => {
		this.setState({ noteCount: this.state.noteCount + 1 });
	};

	render() {
		if (this.props.notes === undefined )
			return null;
		return (
			<div>
				{this.renderNotes()}
				<Button attached="bottom" onClick={e => this.handleClick(e)}>
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
	{ buildCrudQuery, addTag }
)(NoteManager);
