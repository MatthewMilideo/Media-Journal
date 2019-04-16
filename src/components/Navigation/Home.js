import React from "react";
import { Container, Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import * as T from "../../actions/types";
import { fetchEntries } from "../../actions";

import { getSearch } from "../../reducers/index";

import SearchBar from "../SearchBar";
import SwipeRow from "../smallComponents/SwipeRow";

class Home extends React.Component {
	state = { searchType: T.MOVIE };

	componentDidMount() {
		this.props.fetchEntries();
	}

	searchBarConfig = {
		MOVIE: [{ name: T.MOVIE, label: "Movie", placeholder: "Blue Velvet" }],
		TV_SEASON: [{ label: "Televison Show", placeholder: "The Sopranos" }],
		BOOK: [
			{ label: "Book", placeholder: "The Castle" },
			{ label: "Author", placeholder: "Franz Kafka" }
		],
		GAME: [
			{ label: "Game", placeholder: "Half Life 2" },
			{ label: "Platform", placeholder: "PC" }
		],
		textValues: ["", ""]
	};

	menuConfig = [
		{ const: T.MOVIE, name: "Movies" },
		{ const: T.TV_SEASON, name: "TV Show" },
		{ const: T.BOOK, name: "Book" },
		{ const: T.GAME, name: "Video Game" }
	];

	renderMenu = list => {
		let returnList = list.map(item => {
			return (
				<Menu.Item
					name={item.const}
					key={item.const}
					active={this.state.searchType === item.const}
					onClick={this.handleItemClick}
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

	handleItemClick = (e, data) => {
		this.setState({ searchType: data.name });
	};

	render() {
		const configObj = {
			imageP1: "",
			imageP2: "largeImage",
			imageD:
				"https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg",
			text1: "title",
			text2: "character"
		};
		return (
			<Container>
				{this.renderMenu(this.menuConfig)}
				<SearchBar
					searchType={this.state.searchType}
					config={this.searchBarConfig}
				/>
				<SwipeRow
					type={0}
					rows={1}
					eSize={215}
					list={this.props[this.state.searchType].data}
					listConfig={configObj}
				/>
			</Container>
		);
	}
}

/* <PosterContainer content = {this.props.searchData} /> */

const mapStateToProps = state => {
	return {
		MOVIE: getSearch(T.MOVIE, state),
		TV_SEASON: getSearch(T.TV_SEASON, state),
		BOOK: getSearch(T.BOOK, state),
		GAME: getSearch(T.GAME, state)
	};
};

export default connect(
	mapStateToProps,
	{ fetchEntries }
)(Home);
