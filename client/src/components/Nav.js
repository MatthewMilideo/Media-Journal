import React from 'react'
import Nav from "react-bootstrap/Nav";
import PropTypes from "prop-types";

const TheNav = (props) => {
	return (
		<Nav
			fill
			variant="pills"
			defaultActiveKey={props.activeElem}
			className="pl-0 pr-0 mt-3 mb-3 bg-white"
			onSelect={e => props.setActiveElem(e)}
		>
			{props.navList.map(navElem => {
				return (
					<Nav.Item key={navElem}>
						<Nav.Link eventKey={navElem}> {navElem}</Nav.Link>
					</Nav.Item>
				);
			})}
		</Nav>
	);
}

TheNav.propTypes = {
    activeElem: PropTypes.string.isRequired, 
    setActiveElem: PropTypes.func.isRequired, 
    navList: PropTypes.array.isRequired, 
  };

export default TheNav;
