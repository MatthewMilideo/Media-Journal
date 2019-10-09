import React from "react";
import { connect } from "react-redux";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import debounce from "lodash/debounce";
import Styled from "styled-components";
import { signUp, signIn, signOut } from "../actions/firebase";
import * as T from "../actions/types";

const ValidtyDiv = Styled.div`
    position: absolute;
    width: auto;
    bottom: 7px;
    right: 10px;
    margin-top: 0;
`;

const CheckedForm = props => {
	const { validty, ...rest } = props;
	if (props.validity === true) {
		return (
			<React.Fragment>
				<Form.Control className="border-success" {...rest} />
				<ValidtyDiv>
					<span className=" text-success oi oi-check"></span>
				</ValidtyDiv>
			</React.Fragment>
		);
	} else if (props.validity === false) {
		return (
			<React.Fragment>
				<Form.Control className="border-danger" {...rest} />
				<ValidtyDiv>
					<span className="text-danger oi oi-x"></span>
				</ValidtyDiv>
			</React.Fragment>
		);
	}
	return <Form.Control {...props} />;
};

class Signup extends React.Component {
	state = {
		type: "Sign In",
		email: "",
		pass1: "",
		pass2: "",
		emailV: null,
		passV: null
	};

	onSubmit = e => {
		e.preventDefault();
		if (this.state.type === "Sign In") {
			this.props.signIn(this.state.email, this.state.pass1);
			return;
		}
		this.props.signUp(this.state.email, this.state.pass1);
	};

	verifyEmail = () => {
		const { email } = this.state;
		if (
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				email
			)
		) {
			this.setState({ emailV: true });
			return;
		}

		this.setState({ emailV: false });
	};

	deVEmail = debounce(this.verifyEmail, 400);

	verifyPass = () => {
		const { pass1, pass2 } = this.state;
		if (pass1 === "" || pass2 === "") return this.setState({ passV: null });
		if (pass1 !== pass2) return this.setState({ passV: false });
		if (pass1.length >= 6) {
			for (let i = 0; i < pass1.length; i++) {
				if (Number.isInteger(parseInt(pass1[i]))) {
					this.setState({ passV: true });
					return;
				}
			}
		}
		this.setState({ passV: false });
		return;
	};

	deVPass = debounce(this.verifyPass, 400);

	renderLogIn = () => {
		console.log(this.props.user);
		const { status, message } = this.props.user;
		let alert = null;
		let className = null;

		if (status === T.SIGNIN_ERROR) {
			className = "border-danger";
			alert = (
				<Alert variant="danger">
					<Alert.Heading> Sign In Error: </Alert.Heading>
					{message}
				</Alert>
			);
		}

		return (
			<Card className="p-3">
				<Card.Title> Sign In</Card.Title>
				<Form onSubmit={this.onSubmit}>
					<Form.Group className="position-relative" controlid="formBasicEmail">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter email"
							value={this.state.email}
							autoComplete="email"
							onChange={e => {
								this.setState({ email: e.target.value });
							}}
							flag={alert}
							required
						/>
					</Form.Group>

					<Form.Group
						className="position-relative"
						controlid="formBasicPassword"
					>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							value={this.state.pass1}
							placeholder="Password"
							autoComplete="current-password"
							onChange={e => {
								this.setState({ pass1: e.target.value });
							}}
							className={className}
							required
						/>
					</Form.Group>

					<Button className="mb-3" type="submit">
						Submit
					</Button>

					{alert}
				</Form>

				<Card.Footer
					onClick={() => this.setState({ type: "Sign Up" })}
					className="mb-n3  ml-n3 mr-n3"
				>
					{" "}
					<p> Don't have an account? Click here to create one. </p>{" "}
				</Card.Footer>
			</Card>
		);
	};

	renderRegister = () => {
		const { passV } = this.state;
		const { status, message } = this.props.user;

		let alertVariant = "primary";
		let alertText =
			"Note: Your password must contain at least six characters long and one number.";

		if (passV === false) {
			alertVariant = "danger";
			alertText =
				"Note: Both passwords must match, and your password must contain at least six characters and one number.";
		}

		if (status === T.SIGNUP_ERROR || status === T.SIGNUP_ERROR_AXIOS) {
			alertVariant = "danger";
			alertText = message;
		}
		return (
			<Card className="p-3">
				<Card.Title> Sign Up</Card.Title>
				<Form onSubmit={this.onSubmit}>
					<Form.Group className=" position-relative" controlid="formBasicEmail">
						<Form.Label>Email address</Form.Label>
						<CheckedForm
							value={this.state.email}
							type="email"
							placeholder="Enter email"
							autoComplete="email"
							onChange={e => {
								this.setState({ email: e.target.value });
								this.deVEmail();
							}}
							required
							validity={this.state.emailV}
						/>
					</Form.Group>
					<Form.Group className="position-relative" controlid="formBasicPass1">
						<Form.Label>Password</Form.Label>
						<CheckedForm
							type="password"
							value={this.state.pass1}
							placeholder="Password"
							autoComplete="new-password"
							onChange={e => {
								this.setState({ pass1: e.target.value });
								this.deVPass();
							}}
							validity={this.state.passV}
							required
						/>
					</Form.Group>
					<Form.Group className="position-relative" controlid="formBasicPass2">
						<Form.Label className="mt-2">Verify Password</Form.Label>
						<CheckedForm
							value={this.state.pass2}
							controlid="formBasicPassword2"
							type="password"
							placeholder="Password"
							autoComplete="new-password"
							onChange={e => {
								this.setState({ pass2: e.target.value });
								this.deVPass();
							}}
							validity={this.state.passV}
							required
						/>
					</Form.Group>
					<Alert className="mt-3" variant={alertVariant}>
						<span>{alertText}</span>
					</Alert>

					<Button className="mb-3" type="submit">
						Submit
					</Button>
				</Form>
				<Card.Footer
					onClick={() => this.setState({ type: "Sign In" })}
					className="mb-n3  ml-n3 mr-n3"
				>
					{" "}
					<p> Already have an account? Click here to sign in. </p>{" "}
				</Card.Footer>
			</Card>
		);
	};

	renderLogOut = () => {
		const { email } = this.props.auth;

		return (
			<Card className="p-3">
				<Card.Title> Log Out </Card.Title>
				<p> Hello {email}!</p>
				<Button
					className="mb-3"
					type="submit"
					onClick={() => this.props.signOut()}
				>
					Click here to sign out.
				</Button>
			</Card>
		);
	};

	render() {
		const { type } = this.state;
		const { user_id } = this.props.user;

		return user_id === "Default"
			? type === "Sign In"
				? this.renderLogIn()
				: this.renderRegister()
			: this.renderLogOut();
	}
}

const mapStateToProps = state => {
	return { auth: state.firebaseReducer.auth, user: state.user };
};

export default connect(
	mapStateToProps,
	{ signUp, signIn, signOut }
)(Signup);
