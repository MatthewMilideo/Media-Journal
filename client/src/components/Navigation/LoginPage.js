import React from "react";
import { connect } from "react-redux";
import {
	Button,
	Form,
	Message,
	Input,
	Radio,
	Icon,
} from "semantic-ui-react";
import _ from "lodash";

import {
	loginUser,
	registerUser,
	checkUsername,
	checkEmail
} from "../../actions";
import { getUser } from "../../reducers";
import * as T from "../../actions/types";

/*
		const regEmailErr = "CLIENT_ERR_REG_EMAIL";
		const regUserErr = "CLIENT_ERR_REG_USER";
		const regEmailUserErr = "CLIENT_ERR_REG_EMAILUSER";
		const regErr = "CLIENT_ERR_REG";
	*/

class LoginPage extends React.Component {
	state = {
		logRegFlag: false,
		registered: false,
		username: "",
		email: "",
		pass1: "",
		pass2: ""
	};

	componentDidUpdate(prevProps) {
		if (
			this.props.user.registration.status === T.FINISHED_REGISTER &&
			prevProps.user.registration.status !== T.FINISHED_REGISTER
		)
			this.setState({ logRegFlag: false, registered: true });
	}

	stateChange = (target, elem) => {
		let obj;
		obj[target] = elem;
		this.setState({ obj });
	};

	// Handles all inputChanges.
	onInput = async (e, type, func = () => null) => {
		let obj = {};
		obj[type] = e.target.value;
		this.setState(obj);
		await func();
	};

	// Calls Async Action Creator that checks if the username is unique.
	checkUsername = _.debounce(() => {
		this.props.checkUsername({ user_name: this.state.username });
	}, 200);

	// Calls Async Action Creator that checks if the email is unique.
	checkEmail = _.debounce(() => {
		this.props.checkEmail({ user_email: this.state.email });
	}, 200);

	validatePass = () => {
		const { pass1, pass2 } = this.state;
		let obj = { icon: null, message: null, ready: false };
		if (pass1 === "" || pass2 === "") return obj;
		obj.icon = <Icon name="delete" color="red" />;
		if (pass1.length < 5) {
			obj.message = this.renderError(
				"Password Error",
				"Your password must be at least 5 characters or longer."
			);
			return obj;
		}
		if (pass1 !== pass2) {
			obj.message = this.renderError(
				"Password Error",
				" The two passwords must match. "
			);
			return obj;
		}
		obj.icon = <Icon name="check" color="green" />;
		obj.ready = true;
		return obj;
	};

	validateUser = () => {
		const { username } = this.state;
		let obj = { icon: null, message: null, ready: false };
		if (username === "") return obj;
		obj.icon = <Icon name="delete" color="red" />;
		if (username.length < 3) {
			obj.message = this.renderError(
				"Username Error",
				"Your username must be 3 characters or longer."
			);
			return obj;
		}
		if (this.props.user.registration.userName !== T.VALID_USER) {
			obj.message = this.renderError(
				"Username Error",
				"Your username must be unique. "
			);
			return obj;
		}
		obj.icon = <Icon name="check" color="green" />;
		obj.ready = true;
		return obj;
	};
	// Validates the email. The reverse flag is for the login button which looks for an email that's in use as opposed to
	// not in use so we just reverse the meaning of being invalid.
	validateEmail = (reverse = false) => {
		const { email } = this.state;
		let obj = { icon: null, message: null, ready: false };
		if (email === "") return obj;
		obj.icon = <Icon name="delete" color="red" />;
		const emailRegEx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
		if (!emailRegEx.test(email)) {
			obj.message = this.renderError(
				"Email Error",
				"You must enter a valid email address."
			);
			return obj;
		}
		if (
			this.props.user.registration.email === T.INVALID_EMAIL &&
			reverse === true
		) {
			obj.icon = <Icon name="check" color="green" />;
			obj.ready = true;
			return obj;
		}

		if (
			this.props.user.registration.email !== T.VALID_EMAIL &&
			reverse === false
		) {
			obj.message = this.renderError(
				"Email Error",
				"You must enter a unique email address."
			);
			return obj;
		}
		if (reverse === false) {
			obj.icon = <Icon name="check" color="green" />;
			obj.ready = true;
			return obj;
		} else {
			return obj;
		}
	};

	onLoginSubmit = e => {
		e.preventDefault();
		this.props.loginUser({
			user_email: this.state.email,
			password: this.state.pass1
		});
	};

	onRegisterSubmit = (e, ready) => {
		const { username, email, pass1 } = this.state;
		e.preventDefault();
		if (ready === true) {
			this.props.registerUser({
				user_name: username,
				user_email: email,
				password: pass1
			});
		}
	};

	handleButtonClick = e => {
		const { logRegFlag } = this.state;
		this.setState({ logRegFlag: !logRegFlag });
	};

	renderError(header, text, onClick = null) {
		return (
			<Message error visible header={header} content={text} onClick={onClick} />
		);
	}

	renderLogin() {
		const loginEmailErr = "CLIENT_ERR_LOGIN_EMAIL";
		const loginEmailPassErr = "CLIENT_ERR_LOGIN_EMAILPASS";
		const { email, pass1 } = this.state;
		const { errType } = this.props.user;
		const emailCheck = this.validateEmail(true);

		let error1;
		let error2;

		if(this.state.registered) this.checkEmail(); 

		if (errType === loginEmailErr) {
			error1 = true;
			error2 = false;
		}
		if (errType === loginEmailPassErr) {
			error1 = true;
			error2 = true;
		}

		return (

			<div>
				{this.state.registered ? (
						<Message
							visible
							success
							header={"Registration Complete"}
							content={`You've registered an account with email: ${
								this.state.email
							} and username ${this.state.username}. You can now login!`}
							onClick={this.handleButtonClick}
						/>
					) : null}
				<Form onSubmit={this.onLoginSubmit}>
					<Form.Field error={error1}>
						<label> Email: </label>
						<Input
							onChange={e => this.onInput(e, "email", this.checkEmail)}
							icon={emailCheck.icon}
							type="text"
							value={email}
							required
						/>
					</Form.Field>
					{error1 && !error2
						? this.renderError(
								"Email Error",
								"The email address you entered was not recognized."
						  )
						: null}
					<Form.Field error={error2}>
						<label> Password: </label>
						<Input
							onChange={e => this.onInput(e, "pass1")}
							type="password"
							value={pass1}
							required
						/>
					</Form.Field>
					{error2
						? this.renderError(
								"Email and Password Error",
								"The email address and password combination you entered was not recognized!"
						  )
						: null}
					<Button> Submit </Button>
					
				</Form>
				<h2> Don't have an account? Click here to register! </h2>
				<Button onClick={this.handleButtonClick}> Register </Button>
			</div>
		);
	}

	renderRegister() {
		const { username, email, pass1, pass2 } = this.state;
		let userCheck = this.validateUser();
		let emailCheck = this.validateEmail();
		let passCheck = this.validatePass();
		let submitCheck;
		userCheck.ready === true &&
		emailCheck.ready === true &&
		passCheck.ready === true
			? (submitCheck = true)
			: (submitCheck = false);

		return (
			<div>
				<Form

					onSubmit={e => this.onRegisterSubmit(e, submitCheck)}
				>
						<Form.Field >
							<label> Username: </label>
							<Input
								icon={userCheck.icon}
								onChange={e => this.onInput(e, "username", this.checkUsername)}
								value={username}
								type="text"
								required
							/>
						</Form.Field>
						{userCheck.message}
						<Form.Field >
							<label> Email: </label>
							<Input
								icon={emailCheck.icon}
								onChange={e => this.onInput(e, "email", this.checkEmail)}
								value={email}
								type="email"
								required
							/>
						</Form.Field>
						{emailCheck.message}
						<Form.Field >
							<label> Password: </label>
							<Input
								onChange={e => this.onInput(e, "pass1", this.validatePass)}
								icon={passCheck.icon}
								value={pass1}
								type="password"
								required
							/>
						</Form.Field>
						<Form.Field >
							<label> Verify Password: </label>
							<Input
								onChange={e => this.onInput(e, "pass2", this.validatePass)}
								icon={passCheck.icon}
								value={pass2}
								type="password"
								required
							/>
						</Form.Field>
						{passCheck.message}
						<Button disabled={!submitCheck}> Submit </Button>
					) : null}
				</Form>
				<h2> Have an account? Click here to Login! </h2>
				<Button onClick={this.handleButtonClick}> Login </Button>
			</div>
		);
	}

	render() {
		const { logRegFlag } = this.state;
		let headerText;
		{
			logRegFlag ? (headerText = "Register") : (headerText = "Login");
		}
		return (
			<div className="login-main-div">
				<div className="login-top-div">
					<h1> {headerText} </h1>
					<div className="login-radio-div">
						<label> Login </label>
						<Radio
							toggle
							checked={this.state.logRegFlag}
							onChange={this.handleButtonClick}
						/>
						<label> Register </label>
					</div>
				</div>
				<div className="login-form-div">
					{logRegFlag ? this.renderRegister() : this.renderLogin()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: getUser(state)
	};
};

export default connect(
	mapStateToProps, //mapDispatchToProps
	{
		loginUser,
		registerUser,
		checkUsername,
		checkEmail
	}
)(LoginPage);
