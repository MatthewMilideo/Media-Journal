import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import Styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import MediaCard from "./MediaCard2";
import { useLazyLoad, useInfScroll } from "../hooks/Intersect";
import { extSearch } from "../actions/index";
import { getUser, getMediaState, getSearchActiveElem } from "../reducers";

import * as T from "../actions/types";

const PaddingDiv = Styled.div`
height: 100px; 
width: 100px;`;

const SpinnerDiv = Styled.div`
display: flex; 
justify-content: center; 
align-items: center; 
height: 50px; 
width: 100%;`;

const SearchContainer = props => {
	const [state, setState] = useState(false);
	const type = props.search;
	const data = props[type];
	const [ref] = useLazyLoad();
	const [infRef, infVal] = useInfScroll(null, "0px", 0.01, useState, state);
	let returnData;
	console.log("infVal", infVal);
	console.log("infVal", state);

	if (infVal) {
		console.log("hello");
		if (
			data.keysArr.length !== 0 &&
			(data.status !== `${type}${T._FINISHED_SEARCH}` ||
				data.status !== `${type}${T._FINISHED_SEARCH_NEXT}`)
		) {
			if (data.queryData.total_pages > data.queryData.page) {
				let newElem = data.queryData.page + 1;
				props.extSearch(props.User.user_id, data.queryData.term, type, newElem);
			}
		}
	}

	if (data.status === null) {
		returnData = renderAlert(
			"Search for some content!",
			"You can search for a piece of media above.",
			"primary"
		);
	} else if (
		data.status === `${type}${T._ERRORED_SEARCH}` ||
		data.status === `${type}${T._ERRORED_SEARCH}_NEXT`
	) {
		if (data.serverStatus === 503)
			returnData = renderAlert(
				"Could Not Connect",
				"There was a problem connecting to the server."
			);
		else if (data.serverStatus === 404)
			returnData = renderAlert(
				"No Media Found!",
				"Try searching for something else."
			);
		else
			returnData = renderAlert(
				"Error!",
				"There was an error with input or an internal server error!"
			);
	} else if (data.status === `${type}${T._BEGAN_SEARCH}`) {
		returnData = (
			<React.Fragment>
				<SpinnerDiv>
					<Spinner animation="border" />
				</SpinnerDiv>
			</React.Fragment>
		);
	} else if (data.status === `${type}${T._BEGAN_SEARCH}${T._NEXT}`) {
		returnData = (
			<React.Fragment>
				<SpinnerDiv />
				{renderGrid(data, type, ref)}
				<SpinnerDiv>
					<Spinner animation="border" />
				</SpinnerDiv>
			</React.Fragment>
		);
	} else {
		returnData = (
			<React.Fragment>
				<SpinnerDiv />
				{renderGrid(data, type, ref)}
			</React.Fragment>
		);
	}

	return (
		<div>
			{returnData}
			<PaddingDiv ref={infRef} />
		</div>
	);
};

const renderGrid = (data, type, ref) => {
	let returnArr = [];
	for (let i = 0; i < data.keysArr.length; i++) {
		//let tempRef = React.createRef();
		//console.log(tempRef);
		let media = { ...data.media[data.keysArr[i]] };
		returnArr.push(
			<Col xs={12} sm={6} md={4} lg={3} key={media.id} className="mb-3">
				<div>
					<MediaCard
						ref={ref}
						index={i}
						key={media.id}
						data={media}
						type={type}
					/>
				</div>
			</Col>
		);
	}
	return (
		<div className="pb-3 pr-3 pl-3">
			<Row className="d-flex justify-content-center"> {returnArr}</Row>
		</div>
	);
};

const renderAlert = (title, body, variant = "danger") => {
	return (
		<Alert className="mt-3" variant={variant}>
			<Alert.Heading> {title} </Alert.Heading>
			<p>{body}</p>
		</Alert>
	);
};

const mapStateToProps = state => {
	return {
		MOVIE: getMediaState(state, T.MOVIE),
		TV: getMediaState(state, T.TV),
		BOOK: getMediaState(state, T.BOOK),
		search: getSearchActiveElem(state),
		User: getUser(state)
	};
};

export default connect(
	mapStateToProps,
	{ extSearch }
)(SearchContainer);

/*

	/*

	if (entry.isIntersecting) {
		const type = props.search;
		const data = props[type];
		const { user_id } = props.User;
		console.log("callback");
		console.log(data);

		if (
			data.keysArr.length !== 0 &&
			data.status !== `${type}${T._BEGAN_SEARCH}_NEXT` &&
			data.status !== `${type}${T._ERRORED_SEARCH}` &&
			data.status !== `${type}${T._ERRORED_SEARCH}_NEXT`
		) {
			if (data.queryData.total_pages > data.queryData.page) {
				let newElem = data.queryData.page + 1;

				props.extSearch(user_id, data.queryData.term, type, newElem);
			}
			if (
				data.queryData.total_pages &&
				data.queryData.total_pages === data.queryData.page
			) {
				// myRef.current = null;
			}
		}
    }
    */
