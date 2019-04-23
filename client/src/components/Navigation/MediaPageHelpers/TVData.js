import React from "react";
import { Grid, Segment, Divider } from "semantic-ui-react";
import {
	renderCrew,
	renderGenres,
	renderProdComps,
	runTimes
} from "./helperFunctions";

const TVData = props => {
	//console.log(("in tv data", props);
	//console.log(("props", props);
	const { show } = props;
	let gridWidth = 10;
	let poster = null;

	show.poster_path === null
		? (gridWidth = 13)
		: (poster = (
				<Grid.Column centered width={6}>
					<img className="image" src={show.largeImage} />
				</Grid.Column>
		  ));

	let releaseDate;
	show.firstDate === null
		? (releaseDate = null)
		: (releaseDate = <h5> Released: {show.firstDate} </h5>);

	let overview;
	//console.log((show.overview);
	show.overview === ""
		? (overview = null)
		: (overview = (
				<div className="overview-div">
					{" "}
					<h1 className="media-body-h1"> Overview: </h1>
					<p className="overview"> {show.overview} </p>
				</div>
		  ));

	const renderEps = (numEps, numSeasons) => {
		if (numSeasons !== null) numSeasons = <p> Number of Seasons: {numSeasons} </p>;
		if (numEps !==  null) numEps = <p> Number of Episodes: {numEps} </p>;
		

		let returnStr;
		numEps && numSeasons ? (returnStr = "|") : (returnStr = "");

		return (numEps && numSeasons) || numEps || numSeasons ? (
			<div className="show-div">
				<h1 className="media-body-h1"> Show Stats : </h1>
				{numSeasons} {returnStr} {numEps}
			</div>
		) : null;
	};

	const runtimes = list => {
		let returnData = null;
		let s = "";
		if (list.length > 1) s = "s";
		if (list.length !== 0) {
			returnData = list.map((elem, index) => {
				let comma = null;
				index === list.length - 1 ? (comma = "") : (comma = ", ");
				return (
					<h5 className="comma-list">
						{elem} minutes
						{comma}
					</h5>
				);
			});
		}

		return returnData === null ? null : (
			<div className="runtime-div">
				<h5 className="media-body-h1"> {`Episode Runtime${s}:`} </h5>
				{returnData}
			</div>
		);
	};

	/*
	let runtimes;
	show.runtime === null
		? (runtime = null)
		: (runtime = runtime.map( runtime ) <h5> Runtime: {runtime} minutes</h5>);
		*/

	return (
		<Grid centered equal stackable>
			<Grid.Row centered verticalAlign="top">
				{poster}
				<Grid.Column divided="vertically" width={gridWidth}>
					<Grid.Row>
						<Segment compact>
							<div className="title-div">
								<h1 className="media-title"> {show.title} </h1>
								<span className="media-title-descriptor">
									{releaseDate} | {runtimes(show.runtime)}
								</span>
							</div>
							<div className="movie-body">
								<Divider />

								{overview}
								{renderEps(show.numEps, show.numSeasons)}
								{renderGenres(show.genres)}
								{renderCrew(show.crew)}
								{renderProdComps(show.prodComps, show.networks)}
							</div>
						</Segment>
					</Grid.Row>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default TVData;
