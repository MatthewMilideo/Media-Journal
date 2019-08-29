import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

import { getUserInfo, getUserErr } from "../reducers";
class NavBar extends React.Component {
	state = { activeItem: "Add Content" };

	render() {
		return (
			<Nav variant="tabs" defaultActiveKey="home" className = 'pl-3 pt-2 bg-light'>
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
		//	logoutUser
	}
)(NavBar);
