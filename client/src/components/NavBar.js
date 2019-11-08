import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { signOut } from "../actions/firebase";
import { getUserInfo, getUserErr } from "../reducers";
class NavBar extends React.Component {
	state = { activeItem: "" };

	componentDidMount() {
		let location = this.props.location.location.pathname; 
		console.log(location);
		if (location === "/home") this.setState({ activeItem: "home" });
		else if (location === "/Journal")
			this.setState({ activeItem: "Notes" });
		else if (location === "/login")
			this.setState({ activeItem: "Sign In" });
		else if (location === "/Testpage") {
			this.setState({ activeItem: "TestPage" });
		} else this.setState({ activeItem: "Content" });
	}

	componentDidUpdate(prevProps) {
		console.log(this.props);
		let location = this.props.location.location.pathname; 
		console.log(location);
		if (location !== prevProps.location.location.pathname) {
			if (location === "/home")
				this.setState({ activeItem: "home" });
			else if (location === "/Journal")
				this.setState({ activeItem: "Notes" });
			else if (location === "/login")
				this.setState({ activeItem: "Sign In" });
			else if (location === "/Testpage") {
				this.setState({ activeItem: "TestPage" });
			} else this.setState({ activeItem: "Content" });
		}
	}

	render() {
		console.log(this.props.location);
		return (
			<Nav
				variant="tabs"
				activeKey={this.state.activeItem}
				className="pl-3 pt-2 pr-3 bg-light"
			>
				<Nav.Item href="/home">
					<Nav.Link
						as={Link}
						to={`${process.env.PUBLIC_URL}/Home`}
						eventKey="home"
						onClick={() => this.setState({ activeItem: "home" })}
					>
						Home
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						as={Link}
						to={`${process.env.PUBLIC_URL}/`}
						eventKey="Content"
						onClick={() => this.setState({ activeItem: "Content" })}
					>
						Browse Content
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						as={Link}
						to={`${process.env.PUBLIC_URL}/Journal`}
						eventKey="Notes"
						onClick={() => this.setState({ activeItem: "Notes" })}
					>
						Browse Notes
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link
						as={Link}
						to={`${process.env.PUBLIC_URL}/TestPage`}
						eventKey="TestPage"
						onClick={() => this.setState({ activeItem: "TestPage" })}
					>
						Test Page
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="ml-auto">
					{this.props.auth.isLoaded && this.props.auth.isEmpty ? (
						<Nav.Link
							as={Link}
							to={`${process.env.PUBLIC_URL}/Login`}
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
