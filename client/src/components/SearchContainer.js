import React from "react";
import * as T from "../actions/types";
import MediaGrid from "./smallComponents/MediaGrid";

import { connect } from "react-redux";

// Converts the Redux Object into an array. 
// Hopefully this function becomes uncessary as I optimize the code. 
function makeGrid (media){
	let arr = [];
	for (let i = 0; i < media.keysArr.length; i++) {
		let key = media.keysArr[i];
		arr.push({
			...media[key],
			largeImage: `https://image.tmdb.org/t/p/w500${media[key].poster_path}`
		});
	}
	return <MediaGrid media = {arr}/>;
};

const SearchContainer = props => {
	const { type } = props;
	const data = props[type];
    console.log(data);
	switch (data.status) {
		default:
			return <div> Please search for some content. </div>;
		case T.BEGAN_SEARCH:
			return <div> Please search for some content. </div>;
		case T.ERROR_SEARCH:
			return <div> There was an error in the search.</div>;
		case T.FINISHED_SEARCH: {
			return makeGrid(data.data);
		}
	}
};

const mapStateToProps = state => {
	return {
        MOVIE: state.test,
        TV: state.test,
        BOOK: state.test,
        GAME: state.test
	};
};

export default connect(
	mapStateToProps, {}
)(SearchContainer);
