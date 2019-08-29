import React from "react";

import * as T from "../../actions/types";

import SearchBar from "../SearchBar";
import SearchContainer from "../SearchContainer";

class SearchPage extends React.Component {
	render() {
		return (
			<div>
				<SearchBar />
				<SearchContainer />
			</div>
		);
	}
}

export default SearchPage;
