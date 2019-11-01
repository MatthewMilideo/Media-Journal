import React from "react";
import SignUp from "./Signup";
import Alert from "react-bootstrap/Alert";
import { useSelector } from "react-redux";

// A Higher Order Component that only renders the provided component if
// the user is authorized.

// Props = A component to be renered.

const AuthCard = props => {
	const auth = useSelector(state => state.firebaseReducer.auth);
	return auth.isLoaded && auth.isEmpty ? (
		<React.Fragment>
			<Alert variant="warning">
				You must be logged-in to view this page. Please either log-in, or create
				an account.
			</Alert>
			<SignUp />
		</React.Fragment>
	) : (
		<React.Fragment> {props.children} </React.Fragment>
	);
};

export default AuthCard;
