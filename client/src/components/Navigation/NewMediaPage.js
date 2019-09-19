import React from "react";
import { connect } from "react-redux";
import Image from "react-bootstrap/Image";
import Jumbotron from "react-bootstrap/Jumbotron";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import NoteManager from "../NoteManager";
import styled from "styled-components";

import { getItem } from "../../actions";
import { getItemData, getUser } from "../../reducers";

import * as T from "../../actions/types";

import _ from "lodash";

const InorderList = styled.ul`
	list-style: none;
	padding: 0px;
	li {
		display: inline;
	}
`;

const BackgroundCard = styled(Card)`
	background-image: url(${props =>
		props.Item ? props.Itemdata.poster_path : null}});
	background-position: right bottom, left top;
	background-repeat: repeat;
`;

const StyledImage = styled(Image)`
	max-height: 50px;
`;

/* Renders a specific piece of media */

class MediaPage extends React.Component {
	state = { size: -1, type: T.MOVIE, tag: null };

	componentDidMount() {
		const { id, type } = this.props.match.params;
		this.props.getItem(this.props.User.user_id, id, type);
	}

	componentWillUnmount() {}

	renderMovie() {
		const { data } = this.props.Item.data;

		return (
			<BackgroundCard className="p-3 mb-2">
				<Container fluid>
					<Row>
						<Col xs={4} sm={4} md={4} lg={4} xl={4}>
							<Jumbotron className=" bg-danger p-3 mb-0 shadow-sm">
								<Jumbotron className=" bg-warning p-3 mb-0 shadow-sm">
									<Jumbotron fluid className=" bg-light p-3 mb-0 shadow-sm">
										<Image
											fluid
											rounded
											src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
										/>
									</Jumbotron>
								</Jumbotron>
							</Jumbotron>
						</Col>
						<Col>
							<Jumbotron fluid className=" bg-light p-3 mb-0 shadow-sm">
								<h1> {data.title} </h1> <h2> {data.tagline} </h2>
								Overview:
								<p> {data.overview} </p>
								Genres:
								<InorderList>
									{data.genres
										? data.genres.map(genre => {
												return <li key={genre.id}> {genre.name}, </li>;
										  })
										: null}
								</InorderList>
								Budget:
								<div className="d-flex">
									{data.budget !== 0 ? (
										<p className="mr-1"> Budget: {data.budget}</p>
									) : (
										<p></p>
									)}
									{data.revenue !== 0 ? (
										<p> Revenue: {data.revenue}</p>
									) : (
										<p></p>
									)}
								</div>
								Production Companies:
								<div className="d-flex">
									{data.production_companies
										? data.production_companies.map(comp => {
												return (
													<div key={comp.id}>
														{" "}
														{comp.logo_path !== null ? (
															<div>
																<StyledImage
																	fluid
																	src={`https://image.tmdb.org/t/p/w500/${comp.logo_path}`}
																/>
																{comp.name}
															</div>
														) : (
															<div>{comp.name}</div>
														)}
													</div>
												);
										  })
										: null}
								</div>
							</Jumbotron>

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
						</Col>
					</Row>
				</Container>
			</BackgroundCard>
		);
	}

	render() {
		const { id, type } = this.props.match.params;
		const { status } = this.props.Item;
		const { user_id } = this.props.User;

		if (status !== T.FINISHED_ITEM)
			return <NoteManager CID={id} type={type} user_id={user_id} />;

		return (
			<div>
				{this.renderMovie()}
				<NoteManager CID={id} type={type} user_id={user_id} />
			</div>
		);
	}
	//{this.renderMovie()}
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
