import React from "react";

import { connect } from "react-redux";
import Alert from "react-bootstrap/Alert";

import Styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import MediaCard from "./MediaCard";
import { extSearch } from "../actions/index";
import { getUser, getSearchState, getMediaState } from "../reducers";
import * as T from "../actions/types";

const PaddingDiv = Styled.div`
height: 200px; 
width: 100px;`;

class SearchContainer extends React.Component {
	state = { test: "hello" };

	myRef = React.createRef();
	imageRefs = [];

	callback = entries => {
		console.log(entries);
		const type = this.props.search.activeElem;
		const data = this.props[type];
		const { user_id } = this.props.User;
		if (data.queryData.total_pages > data.queryData.page) {
			let newElem = data.queryData.page + 1;
			this.props.extSearch(user_id, data.queryData.term, type, newElem);
		}

		if (
			data.queryData.total_pages &&
			data.queryData.total_pages === data.queryData.page
		) {
			console.log("hello");
			this.observer.unobserve(this.myRef.current);
		}
	};

	observer = new IntersectionObserver(this.callback, {
		root: null,
		threshold: 0.1
	});

	componentDidMount(prevProps) {
		this.observer.observe(this.myRef.current);
	}

	componentDidUpdate(prevProps) {}

	handleScroll = e => {};

	renderGrid(media, type) {
		const mediaLength = media.length;
		let returnObj;
		media
			? (returnObj = media.map(elem => {
					return (
						<Col xs={12} sm={6} md={4} lg={3} key={elem.id} className="mb-3">
							<MediaCard
								key={elem.id}
								data={elem}
								type={type}
								len={mediaLength}
							/>
						</Col>
					);
			  }))
			: (returnObj = <div> </div>);

		return (
			<div className="pt-3 pb-3 pr-3 pl-3">
				<Row className="d-flex justify-content-center"> {returnObj} </Row>
				<button onClick={() => console.log(this.myRef)}> </button>
				<PaddingDiv ref={this.myRef} />
			</div>
		);
	}

	// Converts the Redux Object into an array.
	// Hopefully this function becomes uncessary as I optimize the code.
	makeGrid = (data, type) => {
		let media = [];
		for (let i = 0; i < data.keysArr.length; i++) {
			let key = data.keysArr[i];
			media.push({
				...data.media[key]
			});
		}
		return this.renderGrid(media, type);
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
		return this.renderGrid(arr, "MOVIE");
	};

	render() {
		console.log(this.myRef);
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
