import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { signOut } from "../actions/firebase";
import { getUserInfo, getUserErr } from "../reducers";
class NavBar extends React.Component {
	state = { activeItem: "" };

	componentDidMount() {
		if (this.props.location === "/home") this.setState({ activeItem: "home" });
		else if (this.props.location === "/journal")
			this.setState({ activeItem: "Notes" });
		else if (this.props.location === "/login")
			this.setState({ activeItem: "Sign In" });
		else this.setState({ activeItem: "Content" });
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			if (this.props.location === "/home")
				this.setState({ activeItem: "home" });
			else if (this.props.location === "/journal")
				this.setState({ activeItem: "Notes" });
			else if (this.props.location === "/login")
				this.setState({ activeItem: "Sign In" });
			else this.setState({ activeItem: "Content" });
		}
	}

	render() {
		return (
			<Nav
				variant="tabs"
				activeKey={this.state.activeItem}
				className="pl-3 pt-2 pr-3 bg-light"
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
				<Nav.Item className="ml-auto">
					{this.props.auth.isLoaded && this.props.auth.isEmpty ? (
						<Nav.Link
							as={Link}
							to="/login"
							eventKey="Sign In"
							onClick={() => this.setState({ activeItem: "Sign In" })}
						>
							Sign In/Sign Up
						</Nav.Link>
					) : (
						<Nav.Link eventKey="Sign In" onClick={() => this.props.signOut()}>
							Sign Out
						</Nav.Link>
					)}
				</Nav.Item>
			</Nav>
		);
	}
}

const mapStateToProps = state => {
	return {
		userInfo: getUserInfo(state),
		userErr: getUserErr(state),
		auth: state.firebaseReducer.auth
	};
};

export default connect(
	mapStateToProps,
	{ signOut }
)(NavBar);
