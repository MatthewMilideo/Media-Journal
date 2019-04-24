import React from "react";
import { Grid, Image, Button, Segment, Divider } from "semantic-ui-react";
import { renderOverview, renderPoster, renderCrew, renderGenres, renderProdComps } from "./helperFunctions";

/* Props 
Movie: All of the relevant data about the movie.
Size: The Size of the Window. 
*/




/*
const renderTwo = (releaseDate, numSeasons) => {
	if (releaseDate !== null) numSeasons = <p> Release Date: {releaseDate} </p>;
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
*/





const MovieData = props => {
	//console.log(("in movie data", props);
	const { movie } = props;

	let temp = renderPoster(movie.largeImage); 
	let gridWidth = temp.width;
	console.log(gridWidth);
	let poster = temp.poster; 


	let releaseDate;
	movie.release_date === null
		? (releaseDate = null)
		: (releaseDate = <h5> Released: {movie.release_date} </h5>);

	let runtime;
	movie.runtime === null
		? (runtime = null)
		: (runtime = <h5> Runtime: {movie.runtime} minutes</h5>);

	return (
		<Grid centered equal stackable>
			<Grid.Row centered verticalAlign="top">
				{poster}
				<Grid.Column divided="vertically" width={gridWidth}>
					<Grid.Row>
						<Segment >
							<div className="media-title-div">
								<h1> {movie.title} </h1>
								{releaseDate} | {runtime}
							</div>
							<div className="media-body">
								<Divider />
								{renderOverview(movie.overview)}
								{renderGenres(movie.genres)}
								{renderBudget(movie.budget, movie.revenue)}
								{renderCrew(movie.crew)}
								{renderProdComps(movie.production_companies)}
							</div>
						</Segment>
					</Grid.Row>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

const renderBudget = (budget, revenue) => {
	if (budget !== null) budget = <p> Budget: {budget} </p>;
	if (revenue !== null) revenue = <p> Revenue: {revenue} </p>;

	let returnStr;
	budget && revenue ? (returnStr = "|") : (returnStr = "");

	return (budget && revenue) || budget || revenue ? (
		<div className="media-body-div">
			<h1> Budget: </h1>
			{budget} {returnStr} {revenue}
		</div>
	) : null;
};

export default MovieData;
