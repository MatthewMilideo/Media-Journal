import React from "react";
import { Container, Menu, Segment, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import * as T from "../../actions/types";


import { getSearch } from "../../reducers/index";

import SearchBar from "../SearchBar";
import Test from '../test';
import SwipeRow from "../smallComponents/SwipeRow";

class SearchPage extends React.Component {
	state = { searchType: T.MOVIE };

	handleItemClick = (e, data) => {
		this.setState({ searchType: data.name });
	};

	renderMenu = list => {
		let menuConfig = [
			{ const: T.MOVIE, name: "Movies" },
			{ const: T.TV_SEASON, name: "TV Shows" },
			{ const: T.BOOK, name: "Books" },
			{ const: T.GAME, name: "Video Games", disabled: true }
		];

		let returnList = menuConfig.map(item => {
			return (
				<Menu.Item
					name={item.const}
					key={item.const}
					active={this.state.searchType === item.const}
					onClick={this.handleItemClick}
					disabled = {item.disabled}
				>
					{item.name}
				</Menu.Item>
			);
		});
		return (
			<Menu fluid widths={4}>
				{returnList}
			</Menu>
		);
	};

	renderSearchBar = searchType => {
		let searchBarConfig = {
			MOVIE: [{ name: T.MOVIE, label: "Movie", placeholder: "Blue Velvet" }],
			TV_SEASON: [{ label: "Televison Show", placeholder: "The Sopranos" }],
			BOOK: [
				{ label: "Book", placeholder: "The Castle Franz Kafka"  },
			],
			GAME: [
				{ label: "Game", placeholder: "Half Life 2" },
				{ label: "Platform", placeholder: "PC" }
			],
			textValues: ["", ""]
		};
		return <SearchBar searchType={searchType} config={searchBarConfig} />;
	};

	

	render() {
		const searchType =  this.state.searchType;
		const searchData = this.props[searchType];

		console.log('type', searchType, 'data', searchData);
		
		return (
			<Container>
				{this.renderMenu()}
				{this.renderSearchBar(searchType)}
				<Test type = {this.state.searchType}/>
			</Container>
		);
	}
}



/* <PosterContainer content = {this.props.searchData} /> */



export default SearchPage;
