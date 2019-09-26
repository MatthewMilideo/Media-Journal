import React from "react";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import { extSearch, searchBarActiveElem, searchBarText } from "../actions";

import { getUser, getSearchState } from "../reducers";
import * as T from "../actions/types";

class SearchBar extends React.Component {
	componentDidMount() {
		const { user_id } = this.props.User;
		this.props.extSearch(user_id, "Star Wars", T.MOVIE, 1);
	}

	renderType = type => {
		let convObj = {};
		convObj[T.MOVIE] = "Movies";
		convObj[T.TV] = "Television";
		convObj[T.BOOK] = "Books";
		convObj[T.GAME] = "Games";
		return convObj[type];
	};

	renderNav = navList => {
		const { activeElem } = this.props.Search;
		return (
			<Nav
				fill
				variant="pills"
				defaultActiveKey={activeElem}
				className="pl-0 pr-0 mt-3 mb-3 bg-white"
				onSelect={e => this.props.searchBarActiveElem(e)}
			>
				{navList.map(navElem => {
					let disabled;
					navElem === T.GAME ? (disabled = true) : (disabled = false);
					return (
						<Nav.Item key={navElem}>
							<Nav.Link disabled={disabled} eventKey={navElem}>
								{" "}
								{this.renderType(navElem)}{" "}
							</Nav.Link>
						</Nav.Item>
					);
				})}
			</Nav>
		);
	};

	renderForm = () => {
		const { searchText } = this.props.Search;
		return (
			<Form onSubmit={this.onSubmit}>
				<InputGroup>
					<Form.Control
						type="text"
						placeholder="Enter Text"
						value={searchText}
						onChange={e => this.props.searchBarText(e.target.value)}
					/>
					<InputGroup.Append>
						<Button variant="primary" type="submit" className="pt-0">
							Submit
						</Button>
					</InputGroup.Append>
				</InputGroup>
			</Form>
		);
	};

	onSubmit = e => {
		e.preventDefault();
		const { activeElem, searchText } = this.props.Search;
		const { user_id } = this.props.User;
		this.props.extSearch(user_id, searchText, activeElem, 0);
		this.props.searchBarText("");
	};

	render() {
		const navList = [T.MOVIE, T.TV, T.BOOK, T.GAME];
		return (
			<div>
				{this.renderNav(navList)}
				{this.renderForm()}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		User: getUser(state),
		Search: getSearchState(state)
	};
};

export default connect(
	mapStateToProps,
	{ extSearch, searchBarActiveElem, searchBarText }
)(SearchBar);
