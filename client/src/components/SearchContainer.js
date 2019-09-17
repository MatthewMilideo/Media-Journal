import React from "react";

import { connect } from "react-redux";
import debounce from "lodash/debounce";
import Alert from "react-bootstrap/Alert";

import MediaGrid from "./MediaGrid";
import { extSearch } from "../actions/index";
import { getUser, getSearchState, getMediaState } from "../reducers";
import * as T from "../actions/types";

const getHeight = () => {
	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.body.clientHeight,
		document.documentElement.clientHeight
	);
};

class SearchContainer extends React.Component {
	state = {
		width: window.innerWidth,
		height: window.innerHeight,
		totalHeight: null
	};

	componentDidMount() {
		window.addEventListener("scroll", this.debounceHandleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.debounceHandleScroll);
	}

	handleScroll = e => {
		const totalHeight = getHeight();
		console.log(
			"totalHeight:",
			totalHeight,
			"winPageYOffset + window.Inner Height:",
			window.pageYOffset + window.innerHeight
		);

		if (totalHeight - 100 <= window.pageYOffset + window.innerHeight) {
			const type = this.props.search.activeElem;
			const data = this.props[type];
			const { user_id } = this.props.User;
			console.log(data.queryData.total_pages,data.queryData.page )
			if (data.queryData.total_pages > data.queryData.page) {
				let newElem = data.queryData.page + 1;
				this.props.extSearch(user_id, data.queryData.term, type, newElem);
			}
		}
	};

	debounceHandleScroll = debounce(e => this.handleScroll(e), 200);

	// Converts the Redux Object into an array.
	// Hopefully this function becomes uncessary as I optimize the code.
	makeGrid = (data, type) => {
		let arr = [];
		for (let i = 0; i < data.keysArr.length; i++) {
			let key = data.keysArr[i];
			arr.push({
				...data.media[key]
			});
		}
		return <MediaGrid media={arr} type={type} />;
	};

	emptyGrid = () => {
		let arr = [];
		for (let i = 0; i < 5; i++) {
			arr.push({
				id: i,
				smallImage: null,
				largeImage: null,
				title: null,
				loaded: false
			});
		}
		return <MediaGrid media={arr} type={"MOVIE"} />;
	};

	render() {
		const type = this.props.search.activeElem;
		const data = this.props[type];
		switch (data.status) {
			default:
				return this.emptyGrid();
			case `${type}${T._BEGAN_SEARCH_NEXT}`:
				return this.makeGrid(data, type);
			case `${type}${T._ERRORED_SEARCH}`:
				return (
					<Alert variant="danger">
						<Alert.Heading>Uh Oh!</Alert.Heading>
						<p>There was an error with that search! Please try another term.</p>
					</Alert>
				);
			case `${type}${T._FINISHED_SEARCH}`: {
				return this.makeGrid(data, type);
			}
			case `${type}${T._FINISHED_SEARCH_NEXT}`: {
				return this.makeGrid(data, type);
			}
		}
	}
}

const mapStateToProps = state => {
	return {
		MOVIE: getMediaState(state, T.MOVIE),
		TV: getMediaState(state, T.TV),
		BOOK: getMediaState(state, T.BOOK),
		search: getSearchState(state),
		User: getUser(state)
	};
};

export default connect(
	mapStateToProps,
	{ extSearch }
)(SearchContainer);
