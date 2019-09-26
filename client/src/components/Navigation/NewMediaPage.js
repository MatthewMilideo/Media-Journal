import React from "react";
import { connect } from "react-redux";
import Image from "react-bootstrap/Image";
import Jumbotron from "react-bootstrap/Jumbotron";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ImageList from "../ImageList";
import NoteManager from "../NoteManager";
import styled from "styled-components";

import { getItem } from "../../actions";
import { getItemData, getUser } from "../../reducers";

import * as T from "../../actions/types";

import _ from "lodash";

const InorderList = styled.ul`
	list-style: none;
	padding: 0px;
	margin 0px; 
	li {
		display: inline;
	}
`;

let StyledJumbotron = styled(Jumbotron)`
	position: relative;

	::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url(${props => {
			return props.image ? props.image : null;
		}});
		background-blend-mode: darken;
		background-position: right bottom, left top;
		background-repeat: repeat;
		background-size: 25% auto;
		filter: blur(3px);
	}
`;

function renderList(title, list) {
	let modifier = "";
	console.log(arguments);
	if (list && list.length > 1) modifier = "s";
	return list && list.length > 0 ? (
		<InorderList>
			<span> {`${title}${modifier}: `} </span>
			{list.map((elem, i) => {
				i === list.length - 1 ? (modifier = "") : (modifier = ",");
				return (
					<li className="mr-1" key={elem}>
						{`${elem}${modifier}`}
					</li>
				);
			})}
		</InorderList>
	) : null;
}

function renderSingle(title, elem) {
	return elem ? (
		<div>
			<span className="mb-1 mt-3"> {title}: </span>
			{elem}
		</div>
	) : null;
}

function renderDangerous(title, elem) {
	return elem ? (
		<div>
			<h5 className="mb-1 mt-3"> {title}: </h5>
			<div dangerouslySetInnerHTML={{ __html: elem }} />
		</div>
	) : null;
}

const RenderCard = props => {
	return (
		<Card className=" mb-3 bg-light shadow">
			<StyledJumbotron
				image={props.image}
				className=" pt-3 pb-3 pl-4 pr-4 mb-0 shadow-lg"
			>
				<Container fluid>
					<Row>
						<Col xs={12} sm={12} md={4} lg={4} xl={4}>
							<Image fluid rounded className="shadow" src={props.image} />
						</Col>
						<Col>
							<Jumbotron fluid className=" bg-light p-3 mb-0 shadow-lg">
								{props.children}
							</Jumbotron>
						</Col>
					</Row>
				</Container>
			</StyledJumbotron>
		</Card>
	);
};

/* Renders a specific piece of media */

class MediaPage extends React.Component {
	state = { size: -1, type: T.MOVIE, tag: null };

	componentDidMount() {
		const { id, type } = this.props.match.params;
		this.props.getItem(this.props.User.user_id, id, type);
	}

	renderBook() {
		const { data } = this.props.Item.data;
		return (
			<RenderCard  image={data.largeImage}>
				<div>
					<div className=" mb-2 border-bottom">
						<h1 className="mb-2"> {data.title} </h1>
					</div>

					<div className="m-2 mt-0">
						{renderDangerous("Overview", data.description)}
						<h5 className="mb-1 mt-3"> General Information: </h5>
						<div>
							{renderList("Author", data.authors)}
							{renderSingle("Publisher", data.publisher)}
							{renderSingle("Publish Date", data.publishedDate)}
							{renderSingle("Pages", data.printedPageCount)}
							{renderList("Genre", data.categories)}
						</div>
					</div>
				</div>
			</RenderCard>
		);
	}

	renderMovie() {
		const { data } = this.props.Item.data;
		console.log(data.largeImage);
		return (
			<RenderCard image={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}>
				<div className=" mb-2 border-bottom">
					<h1 className="mb-2"> {data.title} </h1>
				</div>
				<div className="m-2 mt-0">
					<h5> {data.tagline}</h5>
				</div>
				{data.overview ? (
					<div>
						<h5 className="mb-1 mt-3"> Overview: </h5>
						{data.overview}
					</div>
				) : null}
				<h5 className="mb-1 mt-3"> General Information: </h5>
				<div>
					{renderSingle("Status", data.status)}
					{renderSingle("First Episode Air Date", data.first_air_date)}
					{renderSingle("Last Episode Air Date", data.last_air_date)}
					{renderSingle("Release Date", data.release_date)}
					{renderSingle("Runtime", `${data.runtime} minutes`)}
					{renderList("Episode runtime", data.episode_run_time)}
					{renderSingle("Budget", data.budget)}
					{renderSingle("Revenue", data.revenue)}
					{data.genres && data.genres.length !== 0 ? (
						<InorderList>
							<span> Genre(s): </span>
							{data.genres.map((genre, index) => {
								let comma;
								index === data.genres.length - 1 ? (comma = "") : (comma = ",");
								return (
									<li key={genre.id}>
										{" "}
										{genre.name}
										{comma}{" "}
									</li>
								);
							})}{" "}
						</InorderList>
					) : null}
					{(data.production_companies &&
						data.production_companies.length !== 0) ||
					(data.networks && data.networks.length !== 0) ? (
						<div>
							<h5 className="mb-2 mt-3">
								{" "}
								Networks and Production Companies:{" "}
							</h5>

							<ImageList
								prodComps={data.production_companies}
								networks={data.networks}
								flag={true}
								number={3}
							/>
						</div>
					) : null}
				</div>
			</RenderCard>
		);
	}

	render() {
		const { id, type } = this.props.match.params;
		const { status } = this.props.Item;
		const { user_id } = this.props.User;

		if (status === T.BEGAN_ITEM) return <div> LOADING </div>;
		else if (status === T.ERRORED_ITEM)
			return (
				<Alert className="mt-3" variant="danger">
					<Alert.Heading>Error</Alert.Heading>
					<p> There was an error loading this item.</p>
				</Alert>
			);
		else if (status === T.FINISHED_ITEM) {
			return (
				<div>
					{type !== T.BOOK ? (
						<div>
							{this.renderMovie()}
							<NoteManager CID={id} type={type} user_id={user_id} />
						</div>
					) : (
						<div>
							{this.renderBook()}
							<NoteManager  CID={id} type={type} user_id={user_id} />
						</div>
					)}
				</div>
			);
		} else return <div></div>;
	}
}

const mapStateToProps = state => {
	return {
		User: getUser(state),
		Item: getItemData(state)
	};
};

export default connect(
	mapStateToProps,
	{ getItem }
)(MediaPage);

/*


									<ul>
										{data.credits
											? data.credits.crew.map(crew => {
													if (
														crew.department === "Writing" ||
														crew.job === "Director of Photography" ||
														crew.job === "Director"
													)
														return (
															<li key={`${crew.id}${crew.job}`}>
																{" "}
																{crew.job} {crew.name}
															</li>
														);
											  })
											: null}
									</ul>

									*/
