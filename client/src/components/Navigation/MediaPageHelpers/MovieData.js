import React from "react";
import { Grid, Image, Button, Segment, Divider } from "semantic-ui-react";
import { renderCrew, renderGenres, renderProdComps } from "./helperFunctions";

/* Props 
Movie: All of the relevant data about the movie.
Size: The Size of the Window. 
*/

const MovieData = props => {
	//console.log(("in movie data", props);
	const { movie } = props;
	let gridWidth = 10;
	let poster = null;

	movie.poster_path === null
		? (gridWidth = 13)
		: (poster = (
				<Grid.Column width={6}>
					<div className = 'media-image-div'>
						<img className="media-main-image" src={movie.largeImage} />
					</div>
				</Grid.Column>
		  ));

	let releaseDate;
	movie.release_date === null
		? (releaseDate = null)
		: (releaseDate = <h5> Released: {movie.release_date} </h5>);

	let runtime;
	movie.runtime === null
		? (runtime = null)
		: (runtime = <h5> Runtime: {movie.runtime} minutes</h5>);

	let overview;
	//console.log((movie.overview);
	movie.overview === ""
		? (overview = null)
		: (overview = (
				<div className="media-body-div">
					<h1> Overview: </h1>
					<p className="overview"> {movie.overview} </p>
				</div>
		  ));

	return (
		<Grid centered equal stackable>
			<Grid.Row centered verticalAlign="top">
				{poster}
				<Grid.Column divided="vertically" width={gridWidth}>
					<Grid.Row>
						<Segment compact>
							<div className="media-title-div">
								<h1> {movie.title} </h1>
								{releaseDate} | {runtime}
							</div>
							<div className="movie-body">
								<Divider />
								{overview}
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
