import React from "react";
import { connect } from "react-redux";
import Styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import MediaCard from "./MediaCard";
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

class SearchContainer extends React.Component {
	myRef = React.createRef();

	callback = entries => {
		const type = this.props.search;
		const data = this.props[type];
		const { user_id } = this.props.User;
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

				this.props.extSearch(user_id, data.queryData.term, type, newElem);
			}
			if (
				data.queryData.total_pages &&
				data.queryData.total_pages === data.queryData.page
			) {
				this.observer.unobserve(this.myRef.current);
			}
		}
	};

	observer = new IntersectionObserver(this.callback, {
		root: null,
		threshold: 0.1
	});

	componentDidMount() {
		this.observer.observe(this.myRef.current);
	}

	renderGrid(media, type) {
		const mediaLength = media.length;
		let returnObj;
		media
			? (returnObj = media.map((elem, i) => {
					return (
						<Col
							xs={12}
							sm={6}
							md={4}
							lg={3}
							key={elem.id}
							className="mb-3"
							onMouseEnter={() => {
								console.log("entered grid");
							}}
						>
							<MediaCard
								key={elem.id}
								index={i}
								onHover={this.hoverChange}
								data={elem}
								type={type}
								len={mediaLength}
							/>
						</Col>
					);
			  }))
			: (returnObj = <div> </div>);

		return (
			<div className="pb-3 pr-3 pl-3">
				<Row className="d-flex justify-content-center"> {returnObj} </Row>
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
		for (let i = 0; i < 9; i++) {
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

	renderAlert = (title, body, variant = "danger") => {
		return (
			<Alert className="mt-3" variant={variant}>
				<Alert.Heading> {title} </Alert.Heading>
				<p>{body}</p>
			</Alert>
		);
	};

	render() {
		const type = this.props.search;
		const data = this.props[type];

		let returnData;
		if (data.status === null)
			returnData = this.renderAlert(
				"Search for some content!",
				"You can search for a piece of media above.",
				"primary"
			);
		else if (data.status === `${type}${T._BEGAN_SEARCH}`) {
			returnData = (
				<React.Fragment>
					<SpinnerDiv>
						<Spinner animation="border" />
					</SpinnerDiv>
					{this.emptyGrid()}
				</React.Fragment>
			);
		} else if (data.status === `${type}${T._BEGAN_SEARCH}${T._NEXT}`) {
			returnData = (
				<React.Fragment>
					<SpinnerDiv />
					{this.makeGrid(data, type)}
					<SpinnerDiv>
						<Spinner animation="border" />
					</SpinnerDiv>
				</React.Fragment>
			);
		} else if (data.status === `${type}${T._ERRORED_SEARCH}`) {
			if (data.serverStatus === 503)
				returnData = this.renderAlert(
					"Could Not Connect",
					"There was a problem connecting to the server."
				);
			else if (data.serverStatus === 404)
				returnData = this.renderAlert(
					"No Media Found!",
					"Try searching for something else."
				);
			else
				returnData = this.renderAlert(
					"Error!",
					"There was an error with input or an internal server error!"
				);
		} else if (data.status === `${type}${T._ERRORED_SEARCH}_NEXT`) {
			if (data.serverStatus === 503)
				returnData = this.renderAlert(
					"Could Not Connect",
					"There was a problem connecting to the server."
				);
			else if (data.serverStatus === 404)
				returnData = this.renderAlert(
					"No Media Found!",
					"Try searching for something else."
				);
			else
				returnData = this.renderAlert(
					"Error!",
					"There was an error with input or an internal server error!"
				);
		} else {
			returnData = (
				<React.Fragment>
					<SpinnerDiv />
					{this.makeGrid(data, type)}
				</React.Fragment>
			);
		}

		return (
			<div>
				{returnData}
				<PaddingDiv ref={this.myRef} />
			</div>
		);
	}
}

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
