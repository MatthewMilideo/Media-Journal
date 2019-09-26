import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotesUser } from "../../actions";
import TestComponent from "../testComponent";
import MediaCardHook from "../MediaCardHook";
import NoteManager from "../NoteManager";

function JournalHome(props) {
	const user_id = useSelector(state => state.user.user_id);
	const notes = useSelector(state => state.notes);
	const dispatch = useDispatch();
	console.log(user_id);
	console.log(notes);

	useEffect(() => {
		dispatch(getNotesUser(user_id));
	}, [user_id]);

	return (

			<NoteManager notes = {notes.keysArr} />

	);
}

export default JournalHome;
