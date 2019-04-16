import React from "react";
import { Link } from "react-router-dom";
import { Menu} from "semantic-ui-react";

//import history from "../history";

class NavBar extends React.Component {
	state = { activeItem: "Home" };

	handleItemClick = (e, {name}) => {
		this.setState({ activeItem: name });
	};

	render() {
		const { activeItem } = this.state;
	
		return (
			<Menu color={"blue"}  inverted stackable widths={4}>
				<Menu.Item
					as={Link}
					to="/Home"
					name="Home"
					active={activeItem === "Home"}
					onClick={this.handleItemClick}
				/>

				<Menu.Item
					as={Link}
					to="/Entries"
					name="Journal Entries"
					active={this.state.activeItem === "Journal Entries"}
					onClick={this.handleItemClick}
				/>

				<Menu.Item
					as={Link}
					to="/"
					name="Add Content"
					active={activeItem === "Add Content"}
					onClick={this.handleItemClick}
				/>

				<Menu.Item
					name = "Log In"
					active={activeItem === "Log In"}
					onClick={this.handleItemClick}
				>
					
				</Menu.Item>

			</Menu>
		);
	}
}

export default NavBar;
