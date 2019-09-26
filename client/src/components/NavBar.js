import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

import { getUserInfo, getUserErr } from "../reducers";
class NavBar extends React.Component {
	state = { activeItem: "" };

	componentDidMount() {
		if (this.props.location === "/home") this.setState({ activeItem: "home" });
		else if (this.props.location === "/journal")
			this.setState({ activeItem: "Notes" });
		else this.setState({ activeItem: "Content" });
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			if (this.props.location === "/home")
				this.setState({ activeItem: "home" });
			else if (this.props.location === "/journal")
				this.setState({ activeItem: "Notes" });
			else this.setState({ activeItem: "Content" });
		}
	}

	render() {
		console.log(this.props, this.state);
		return (
			<Nav
				variant="tabs"
				activeKey={this.state.activeItem}
				className="pl-3 pt-2 bg-light"
			>
				<Nav.Item href="/home">
					<Nav.Link
						as={Link}
						to="/home"
						eventKey="home"
						onClick={() => this.setState({ activeItem: "home" })}
					>
						Home
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						as={Link}
						to="/"
						eventKey="Content"
						onClick={() => this.setState({ activeItem: "Content" })}
					>
						 Browse Content
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						as={Link}
						to="/journal"
						eventKey="Notes"
						onClick={() => this.setState({ activeItem: "Notes" })}
					>
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
