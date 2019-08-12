import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

import Nav from "react-bootstrap/Nav";

import { getUserInfo, getUserErr } from "../reducers";
import { logoutUser } from "../actions";

class NavBar extends React.Component {
	state = { activeItem: "Add Content" };

	handleLogout = (e, { name }) => {
		console.log("hello 2");
		this.props.logoutUser();
		this.setState({ activeItem: "Log In" });
	};

	renderLogin = () => {
		if (!this.props.userInfo.loggedIn) {
			return (
				<Nav.Item
					as={Link}
					to="/login"
					position="right"
					name="Log In"
					active={this.state.activeItem === "Log In" ? true : undefined}
					onClick={this.handleItemClick}
				/>
			);
		}
		return (
			<Nav.Item
				as={Button}
				to="/login"
				position="right"
				name={`Logout ${this.props.userInfo.userName}`}
				active={
					this.state.activeItem === `Logout ${this.props.userInfo.userName}`
				}
				onClick={this.handleLogout}
			/>
		);
	};

	render() {
		//const { activeItem } = this.state;

		//console.log("Test", this.props.userInfo);

		return (
			<Nav variant="tabs" defaultActiveKey="home">
				<Nav.Item>
					<Nav.Link as={Link} to="/home" eventKey="home">
						{" "}
						Home{" "}
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link as={Link} to="/" eventKey="Content">
						Browse Content
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link as={Link} to="/journal" eventKey="Notes">
						Browse Notes
					</Nav.Link>
				</Nav.Item>
				{this.renderLogin()}
			</Nav>
		);
	}
}

const mapStateToProps = state => {
	return {
		userInfo: getUserInfo(state),
		userErr: getUserErr(state)
	};
};

export default connect(
	mapStateToProps,
	{
		getUserInfo,
		getUserErr,
		logoutUser
	}
)(NavBar);
