import React from "react";
import { connect } from "react-redux";
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
		const { data } = this.props.Item;
		console.log(data);
		return (
			<div>
				<img src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`} />
				<h1> Title: {data.title} </h1>
				<h2> Tagline: {data.tagline} </h2>
				<p> {data.overview} </p>
				Genres:
				<ul>
					{data.genres.map(genre => {
						return <li key={genre.id}> {genre.name} </li>;
					})}
				</ul>
				{data.budget !== 0 ? <p> Budget: {data.budget}</p> : <p></p>}
				{data.revenue !== 0 ? <p> Revenue: {data.revenue}</p> : <p></p>}
				Prod Comps
				<ul>
					{data.production_companies.map(comp => {
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
					})}
				</ul>
				<ul>
					{data.credits.crew.map(crew => {
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
					})}
				</ul>
			</div>
		);
	}

	render() {
		const { status } = this.props.Item;
		if (status !== T.FINISHED_ITEM) return <div> hello </div>;
		return this.renderMovie();
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
