import React from "react";
import { Grid, Segment, Divider } from "semantic-ui-react";
import {
	renderCrew,
	renderGenres,
	renderProdComps,
	runTimes
} from "./helperFunctions";

const TVData = props => {
	const { show } = props;
	let gridWidth = 10;
	let poster = null;

	show.poster_path === null
		? (gridWidth = 13)
		: (poster = (
				<Grid.Column centered width={6}>
					<img src={show.largeImage} />
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
				<div className="media-body-div">
					<h1> Overview: </h1>
					<p className="overview"> {show.overview} </p>
				</div>
		  ));

	const renderEps = (numEps, numSeasons) => {
		if (numSeasons !== null)
			numSeasons = <p> Number of Seasons: {numSeasons} </p>;
		if (numEps !== null) numEps = <p> Number of Episodes: {numEps} </p>;

		let returnStr;
		numEps && numSeasons ? (returnStr = "|") : (returnStr = "");

		return (numEps && numSeasons) || numEps || numSeasons ? (
			<div className="media-body-div">
				<h1> Show Stats : </h1>
				{numSeasons} {returnStr} {numEps}
			</div>
		) : null;
	};

	const runtimes = list => {
		let returnData = null;

		if (list.length !== 0) {
			returnData = <h5 className="comma-list">{list[0]} minutes</h5>;
		}

		return returnData === null ? null : (
			<div className="runtime-div">
				<h5 className="media-body-h1"> Episode Runtime: {returnData} </h5>
			</div>
		);
	};

	return (
		<Grid centered equal stackable>
			<Grid.Row centered verticalAlign="top">
				{poster}
				<Grid.Column divided="vertically" width={gridWidth}>
					<Grid.Row>
						<Segment >
							<div className="media-title-div">
								<h1> {show.title} </h1>
								{releaseDate} | {runtimes(show.runtime)}
							</div>
							<div className="media-body">
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
