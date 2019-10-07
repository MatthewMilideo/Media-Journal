import React from "react";
import { connect } from "react-redux";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import debounce from "lodash/debounce";
import Styled from "styled-components";
import TheNav from "./Nav";
import { signUp, signIn, signOut } from "../actions/firebase";

const StyledForm = Styled(Form.Control)`
    background-color: ${props => {
			return props.valid === undefined
				? `rgba(217, 83, 79, 0.0);`
				: props.valid
				? `rgb(212, 237, 214);`
				: `rgb(248, 215, 218);`;
		}}
        
    :focus {
        background-color: ${props => {
					return props.valid === undefined
						? `rgba(217, 83, 79, 0.0);`
						: props.valid
						? `rgb(212, 237, 214);`
						: `rgb(248, 215, 218);`;
				}}
    }
`;

class Signup extends React.Component {
	state = { type: "Sign In", email: "", pass1: "", pass2: "" };

	onSubmit = e => {
		e.preventDefault();

		if (this.state.type === "Sign In") {
			this.props.signIn(this.state.email, this.state.pass1);
			return;
		}

		this.props.signUp(this.state.email, this.state.pass1);
	};

	numArray = {
		1: true,
		2: true,
		3: true,
		4: true,
		5: true,
		6: true,
		7: true,
		8: true,
		9: true,
		0: true
	};

	verifyEmail = () => {
		const { email, vEmail } = this.state;
		if (
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				email
			)
		) {
			this.setState({ emailV: true });
			return true;
		}

		this.setState({ emailV: false });
		return false;
	};

	deVEmail = debounce(this.verifyEmail, 400);

	verifyPass1 = () => {
		const { pass1, pass2, pass2V } = this.state;
		if (pass1.length >= 6) {
			let flag = false;
			for (let i = 0; i < pass1.length; i++) {
				if (this.numArray[pass1[i]] === true) {
					if (pass1 === pass2) this.setState({ pass1V: true, pass2V: true });
					this.setState({ pass1V: true });
					return true;
				}
			}
		}
		if (pass2V === true) {
			this.setState({ pass1V: false, pass2V: false });
			return;
		}
		this.setState({ pass1V: false });
		return false;
	};

	deVP1 = debounce(this.verifyPass1, 400);

	verifyPass2 = () => {
		const { pass1, pass2 } = this.state;
		if (this.verifyPass1()) {
			if (pass1 === pass2) {
				this.setState({ pass2V: true });
				return;
			}
			this.setState({ pass2V: false });
			return;
		}
		this.setState({ pass1V: false, pass2V: false });
	};

	deVP2 = debounce(this.verifyPass2, 400);

	render() {
		const { auth } = this.props;
		const { pass1V, pass2V, emailV } = this.state;

		let variant = "primary";
		let disabled = true;

		if (pass1V === false || pass2V === false || emailV === false) {
			variant = "danger";
		}

		if (this.state.type === "Sign In") {
			if (emailV) {
				disabled = false;
			}
		} else {
			if (pass1V && pass2V && emailV) {
				disabled = false;
			}
		}

		return (
			<div>
				<TheNav
					activeElem={this.state.type}
					navList={["Sign In", "Sign Up"]}
					setActiveElem={e => this.setState({ type: e })}
				/>

				<Card className="mb-3 p-3">
					<Card.Title>
						{this.state.type === "Sign In" ? "Sign In" : "Create an Account"}
					</Card.Title>
					<Form onSubmit={this.onSubmit}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<StyledForm
								type="email"
								placeholder="Enter email"
								value={this.state.email}
								onChange={e => {
									this.setState({ email: e.target.value });
									this.deVEmail();
								}}
								required
								valid={this.state.emailV}
							/>
						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<StyledForm
								type="password"
								value={this.state.pass1}
								placeholder="Password"
								onChange={e => {
									this.setState({ pass1: e.target.value });
									this.deVP1();
								}}
								required
								valid={this.state.pass1V}
							/>
						</Form.Group>

						{this.state.type === "Sign Up" ? (
							<React.Fragment>
								<Form.Label className="mt-2">Verify Password</Form.Label>
								<StyledForm
									controlId="formBasicPassword2"
									type="password"
									value={this.state.pass2}
									placeholder="Password"
									onChange={e => {
										this.setState({ pass2: e.target.value });
										this.deVP2();
									}}
									valid={this.state.pass2V}
									required
								/>
								<Alert className="mt-3" variant={variant}>
									<span>
										Note: Your password must be at least six characters long and
										contain one number.
									</span>
								</Alert>{" "}
							</React.Fragment>
						) : null}

						{this.state.pass}

						<Button type="submit" disabled={disabled}>
							{" "}
							Submit
						</Button>
					</Form>
				</Card>
			</div>
		);
	}
}

/*

	<Form.Label className="mt-2">Verify Password</Form.Label>
							<StyledForm
								controlId="formBasicPassword2"
								type="password"
								value={this.state.pass2}
								placeholder="Password"
								onChange={e => {
									this.setState({ pass2: e.target.value });
									this.deVP2();
								}}
								valid={this.state.pass2V}
								required
							/>

							<Alert className="mt-3" variant={variant}>
							<span>
								Your password must be at least six characters long and contain
								at least one number.
							</span>
						</Alert>


							*/

const mapStateToProps = state => {
	return { auth: state.firebaseReducer.auth };
};

export default connect(
	mapStateToProps,
	{ signUp, signIn }
)(Signup);
