import React from "react";
import { Container, Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import * as T from "../../actions/types";
import { fetchEntries } from "../../actions";

import { getSearch } from "../../reducers/index";

import SearchBar from "../SearchBar";
import SwipeRow from "../smallComponents/SwipeRow";

class SearchPage extends React.Component {
	state = { searchType: T.MOVIE };

	handleItemClick = (e, data) => {
		this.setState({ searchType: data.name });
	};

	renderMenu = list => {
		let menuConfig = [
			{ const: T.MOVIE, name: "Movies" },
			{ const: T.TV_SEASON, name: "TV Show" },
			{ const: T.BOOK, name: "Book" },
			{ const: T.GAME, name: "Video Game" }
		];

		let returnList = menuConfig.map(item => {
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

	renderSearchBar = searchType => {
		let searchBarConfig = {
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

		return <SearchBar searchType={searchType} config={searchBarConfig} />;
	};


	configureInputList = (list, configObj) => {
		if (!list) return;

		let localList = list.map(elem => {
			//console.log(('elem', elem);
			let image;
			elem[configObj.imageP2] === null
				? (image = configObj.imageD)
				: (image = `${configObj.imageP1}${elem[configObj.imageP2]}`);
			return {
				image: image,
				title1: configObj.text1,
				text1: elem[configObj.text1],
				title2: configObj.text2,
				text2: elem[configObj.text2],
				cast_id: elem.cast_id,
				id: elem.ID
			};
		});
		//console.log((localList);
		return localList
	};

	//
	renderContent = (type, searchData) => {
		//console.log((type, searchData);
		const configObj = {
			imageP1: "",
			imageP2: "largeImage",
			imageD:
				"https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg",
			text1: "title",
			text2: "character",
			id: 'id'
		};

		let data = this.configureInputList (searchData.data, configObj); 

		let swipeRow = (
			<SwipeRow
				cType = {type}
				type={0}
				elemType = {'search'}
				rows={1}
				eSize={215}
				list={data}
				listConfig={configObj}
			/>
		);

		switch (searchData.status) {
			case T.UNLOADED:
				return <div> please choose some content above. </div>;
			case `${type}${T._BEGAN_SEARCH}`:
				return <div> loading </div>;
			case `${type}${T._BEGAN_SEARCH_NEXT}`:
				return <div> loading next </div>;
			case `${type}${T._FINISHED_SEARCH}`:
				return (
					<div>
						{swipeRow}
						<div> loading next </div>{" "}
					</div>
				);
			case `${type}${T._FINISHED_SEARCH_NEXT}`:
				return swipeRow;
			case `${type}${T._ERRORED_SEARCH}`:
				return <div> there was an error with your search please try again</div>;
			case `${type}${T._ERRORED_SEARCH_NEXT}`:
				return (
					<div>
						{swipeRow}
						there was an error with your next search
					</div>
				);
		}
	};

	render() {
		const searchType =  this.state.searchType;
		const searchData = this.props[searchType];
		
		return (
			<Container>
			
				{this.renderMenu()}
				{this.renderSearchBar(searchType)}
				{this.renderContent(searchType, searchData)}
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
	{}
)(SearchPage);
