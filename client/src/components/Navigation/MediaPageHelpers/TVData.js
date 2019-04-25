import React from "react";
import { Grid, Segment, Divider } from "semantic-ui-react";
import {
	renderPoster,
	RenderTwo,
	RenderList,
	RenderObj,
	renderProdComps
} from "./helperFunctions";

const TVData = props => {
	const { show } = props;

	let temp = renderPoster(show.largeImage);
	let gridWidth = temp.width;
	let poster = temp.poster;

	let titleCon = {
		elem1: show.firstDate,
		elem2: show.runtime,
		t1: `Released: ${show.firstDate}`,
		t2: `Runtime ${show.runtime[0]} minutes`,
		title: null
	};

	let overCon = {
		elem1: show.overview,
		elem2: null,
		t1: show.overview,
		t2: null,
		title: "Synopsis:"
	};

	let epsCon = {
		elem1: show.numSeasons,
		elem2: show.numEps,
		t1: `Number of seaons: ${show.numSeasons}`,
		t2: `Number of episodes: ${show.numEps}`,
		title: "Show Stats:"
	};

	let genCon = {
		title: 'Genre',
		list: show.genres, 
		num : 99999, 
		func: elem => elem.name
	};

	let crewCon = {
		title: 'Crew:',
		obj: show.crew,
		num: 3, 
	}

	return (
		<Grid centered equal stackable>
			<Grid.Row centered verticalAlign="top">
				{poster}
				<Grid.Column divided="vertically" width={gridWidth}>
					<Grid.Row>
						<Segment>
							<div className="media-title-div">
								<h1> {show.title} </h1>
								<RenderTwo config={titleCon} />
							</div>
							<div className="media-body">
								<Divider />
								<RenderTwo config={overCon} />
								<RenderTwo config={epsCon} />
								<RenderList config={genCon} sub = '' />
								<RenderObj config ={crewCon} />
								
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

/*

{renderGenres(show.genres)}
								{renderCrew(show.crew)}
								*/
