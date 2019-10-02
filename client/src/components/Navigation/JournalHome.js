import React from "react";
import { connect } from "react-redux";
import { getNotesUser, getMediaUser, getNotesTags } from "../../actions";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import NoteManager from "../NoteManager";
import * as T from "../../actions/types";

function RenderFilter(props) {
	let obj = {};
	obj[T.BOOK] = "Books";
	obj[T.MOVIE] = "Movies";
	obj[T.TV] = "Televison Shows";

	return (
		<Form className="d-inline-flex flex-grow-1">
			{Object.keys(props.typeFilter).map(type => {
				return (
					<Form.Check
						key={type}
						className=" flex-grow-1 justify-content-center"
						inline
						label={obj[type]}
						type="checkbox"
						id={`inline-checkbox-${type}`}
						checked={props.typeFilter[type]}
						onClick={e => props.setTypes(props.label, type)}
					/>
				);
			})}
		</Form>
	);
}

class JournalHome extends React.Component {
	constructor(props) {
		super(props);
		let typeFilter = {};
		typeFilter[T.BOOK] = true;
		typeFilter[T.MOVIE] = true;
		typeFilter[T.TV] = true;
		this.state = { noteMediaFilter: { notes: true, media: false }, typeFilter };
	}

	componentDidMount() {
		this.props.getMediaUser(this.props.user);
		this.props.getNotesUser(this.props.user);
	}

	setTypes = (label, type) => {
		let stateObj = {};
		let filter = this.state[label];
		filter[type] = !filter[type];
		stateObj[label] = filter;
		this.setState(stateObj);
	};

	render() {
		console.log(this.props.notes.notes);
		console.log(this.props.notes.notes.mKeysArr);
		let keysArr = [...this.props.notes.notes.keysArr];
		let mKeysArr = [...this.props.media.keysArr];

		keysArr = keysArr.filter(key => {
			let tempType = this.props.notes.notes[key].type;
			console.log(
				tempType,
				this.state.typeFilter,
				this.state.typeFilter[tempType]
			);
			if (this.state.typeFilter[tempType]) return key;
		});

		mKeysArr = mKeysArr.filter(key => {
			let tempType = this.props.media.media[key].type;
			if (this.state.typeFilter[tempType]) return key;
		});

		let notesCopy = { ...this.props.notes.notes };
		let mediaCopy = { ...this.props.media };
		notesCopy.keysArr = keysArr;
		mediaCopy.keysArr = mKeysArr;
		console.log(mediaCopy);

		return (
			<div>
				<Card className="p-3 mb-3 ">
					Filter by Media Type:
					<RenderFilter
						label={"typeFilter"}
						typeFilter={this.state.typeFilter}
						setTypes={this.setTypes}
					/>
				</Card>

				<NoteManager
					mediaFlag={false}
					buttonFlag={false}
					givenNotes={notesCopy}
					media={mediaCopy}
				/>
			</div>
		);
	}
}

/*
	
	*/

const mapStateToProps = state => {
	return {
		notes: state.notes,
		media: state.viewed,
		user: state.user.user_id
	};
};

export default connect(
	mapStateToProps,
	{ getNotesUser, getMediaUser, getNotesTags }
)(JournalHome);
