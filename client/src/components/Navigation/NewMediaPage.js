import React from "react";
import { connect } from "react-redux";
import { Col } from "react-bootstrap/Col";
import { Row } from "react-bootstrap/Row";
import NoteManager from "../NoteManager";

import { getItem } from "../../actions";
import { getItemData, getUser } from "../../reducers";

import * as T from "../../actions/types";

import _ from "lodash";
import "../../styles/style.css";

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
			<div>
				<img src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`} />
				<h1> Title: {data.title} </h1>
				<h2> Tagline: {data.tagline} </h2>
				<p> {data.overview} </p>
				Genres:
				<ul>
					{data.genres
						? data.genres.map(genre => {
								return <li key={genre.id}> {genre.name} </li>;
						  })
						: null}
				</ul>
				{data.budget !== 0 ? <p> Budget: {data.budget}</p> : <p></p>}
				{data.revenue !== 0 ? <p> Revenue: {data.revenue}</p> : <p></p>}
				Prod Comps
				<ul>
					{data.production_companies
						? data.production_companies.map(comp => {
								return (
									<li key={comp.id}>
										{" "}
										{comp.name}
										{comp.logo_path !== null ? (
											<img
												src={`https://image.tmdb.org/t/p/w500/${comp.logo_path}`}
											/>
										) : (
											<div></div>
										)}
									</li>
								);
						  })
						: null}
				</ul>
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
			</div>
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
