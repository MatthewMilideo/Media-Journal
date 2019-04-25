import React from "react";
import { Grid, Segment, Divider } from "semantic-ui-react";
import { renderPoster, renderProdComps } from "./helperFunctions";
import { RenderTwo, RenderList, RenderObj } from "./helperFunctions";

/* Props 
Movie: All of the relevant data about the movie.
Size: The Size of the Window. 
*/



const MovieData = props => {
	const { movie } = props;

	let titleCon = {
		elem1: movie.release_date,
		elem2: movie.runtime,
		t1: `Release Date: ${movie.release_date}`,
		t2: `Runtime: ${movie.runtime} minutes`,
		title: null
	};

	let overCon = {
		elem1: movie.overview,
		elem2: null,
		t1: movie.overview,
		t2: null,
		title: "Synopsis:"
	};

	let genCon = {
		title: "Genre",
		list: movie.genres,
		num: 999,
		func: elem => elem.name
	};

	let budCon = {
		elem1: movie.budget,
		elem2: movie.revenue,
		t1: `Budget: ${movie.budget}`,
		t2: `Revenue: ${movie.revenue}`,
		title: "Budget:"
	};

	let crewObj = {
		title: "Crew:",
		obj: movie.crew,
		num: 2
	};

	let temp = renderPoster(movie.largeImage);
	let gridWidth = temp.width;
	let poster = temp.poster;

	return (
		<Grid centered columns="equal" stackable>
			<Grid.Row centered verticalAlign="top">
				{poster}
				<Grid.Column divided="vertically" width={gridWidth}>
					<Grid.Row>
						<Segment>
							<div className="media-title-div">
								<h1> {movie.title} </h1>
								<RenderTwo config={titleCon} />
							</div>
							<div className="media-body">
								<Divider />
								<RenderTwo config={overCon} />
								<RenderList config={genCon} sub="" />
								<RenderTwo config={budCon} />
								<RenderObj config={crewObj} />
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
