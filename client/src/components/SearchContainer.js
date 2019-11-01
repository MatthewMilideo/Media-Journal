import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import MediaCard from "./MediaCard";
import { useLazyLoad, useIntersect } from "../hooks/Intersect";
import { extSearch } from "../actions/index";
import { getUser, getMediaState, getSearchActiveElem } from "../reducers";

import * as T from "../actions/types";

const IntersectionObserverDiv = Styled.div`
height: 50px; 
width: 100%;`;

const SpinnerDiv = Styled.div`
display: flex; 
justify-content: center; 
align-items: center; 
height: 50px; 
width: 100%;`;

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

const SearchContainer = props => {
	const [doneFlag, setDone] = useState(false);
	const [hoverIndex, setHover] = useState(-1);

	// Loads images for Media Cards
	const [ref] = useLazyLoad();
	// Detects when to load more data.
	const AlertObj = useRef({});
	const [setRef, intVal] = useIntersect();

	const type = props.search;
	const data = props[type];

	const prevType = usePrevious(type);
	useEffect(() => {
		if (type !== prevType) {
			setDone(false);
		}
	});

	useEffect(() => {
		if (
			data.queryData.total_pages &&
			data.queryData.total_pages === data.queryData.page
		) {
			setDone(true);
			return;
		}
		if (intVal.isIntersecting && doneFlag !== true) {
			props.extSearch(
				props.User.user_id,
				data.queryData.term,
				type,
				data.queryData.page + 1
			);
		}
	}, [intVal.isIntersecting]);

	if (data.status === null) {
		return renderAlert(
			"Search for some content!",
			"You can search for a piece of media above.",
			"primary"
		);
	} else if (data.status === `${type}${T._ERRORED_SEARCH}`) {
		console.log(data.data.serverStatus);
		if (data.data.serverStatus === 503)
			return renderAlert(
				"Could Not Connect",
				"There was a problem connecting to the server."
			);
		else if (data.data.serverStatus === 404)
			return renderAlert(
				"No Media Found!",
				"Try searching for something else."
			);
		else
			return renderAlert(
				"Error!",
				"There was an error with input or an internal server error!"
			);
	} else {
		return (
			<React.Fragment>
				<SpinnerDiv>
					{data.status === `${type}${T._BEGAN_SEARCH}` ? (
						<Spinner animation="border" />
					) : null}
				</SpinnerDiv>
				<div className="pb-3 pr-3 pl-3">
					<Row className="d-flex justify-content-center">
						{data.keysArr !== undefined
							? data.keysArr.map((key, i) => {
									return (
										<Col
											xs={12}
											sm={6}
											md={4}
											lg={3}
											key={key}
											className="mb-3"
										>
											<MediaCard
												ref={ref}
												index={i}
												key={key}
												data={data.media[key]}
												type={data.media[key].type}
												hover={i === hoverIndex}
												setHover={setHover}
											/>
										</Col>
									);
							  })
							: null}
					</Row>
				</div>

				{doneFlag !== true ? (
					<IntersectionObserverDiv
						className="d-flex justify-content-center"
						ref={setRef}
					>
						{data.status === `${type}${T._BEGAN_SEARCH_NEXT}` ? (
							<Spinner animation="border" />
						) : null}
					</IntersectionObserverDiv>
				) : (
					<IntersectionObserverDiv ref={setRef}>
						{" "}
						<Alert variant="success"> End of search results!</Alert>{" "}
					</IntersectionObserverDiv>
				)}
			</React.Fragment>
		);
	}
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
