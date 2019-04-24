import React from "react";
import {Grid} from 'semantic-ui-react';



export const renderPoster = poster => {
	console.log(poster)
	return poster === null
		? { width: 13, poster: null }
		: {
				width: 10,
				poster: (
					<Grid.Column width={6}>
						<img src={poster} />
					</Grid.Column>
				)
		  };
};

export const renderOverview = overview => {
	overview === ""
		? (overview = null)
		: (overview = (
				<div className="media-body-div">
					<h1> Overview: </h1>
					<p> {overview} </p>
				</div>
		  ));
	return overview
}

export const renderCrew = crew => {
	let keys = Object.keys(crew);
	let s = "";
	keys.sort();

	let list = keys.map(key => {
		s = "";
		if (crew[key].length > 1) s = "s";
		return crew[key].length !== 0 ? (
			<div className="media-body-inner-div">
				<i>{`${key}${s}: `}</i>
				{crew[key].map((member, index) => {
					if (index >= 2) return;
					let comma = ",";
					if (index === 1 || index === crew[key].length - 1) comma = "";
					return <p> {`${member.name}${comma} `}</p>;
				})}
			</div>
		) : null;
	});

	let test = 0;
	list.forEach(elem => {
		if (elem !== null) test = 1;
	});

	return test === 1 ? (
		<div className="media-body-div">
			<h1 className="media-body-h1"> Crew: </h1> {list}
		</div>
	) : null;
};

export const renderGenres = genres => {
	let returnData = null;
	genres.length === 0
		? (returnData = null)
		: (returnData = genres.map((genre, index) => {
				let comma = null;
				index === genres.length - 1 ? (comma = "") : (comma = ", ");
				return (
					<p>
						{genre.name}
						{comma}
					</p>
				);
		  }));

	return returnData === null ? null : (
		<div className="media-body-div">
			<h1> Genres: </h1>
			{returnData}
		</div>
	);
};

export const renderProdComps = (companies, networks) => {
	let names = [];
	let images = [];

	let string;
	let returnData;

	networks === null ? (string = null) : (string = "Networks and ");
	let net = prodCompsHelper(networks);
	let comp = prodCompsHelper(companies);
	names = [...names, ...net[0], ...comp[0]];
	images = [...images, ...net[1], ...comp[1]];

	names.length === 0 && images.length === 0
		? (returnData = null)
		: (returnData = (
				<div className="media-body-div media-body-div-bottom">
					<h1> {`${string}Production Companies:`} </h1>
					<div className="media-comp-div">
						{images}
						{names}
					</div>
				</div>
		  ));

	return returnData;
};

export const prodCompsHelper = list => {
	if (list === undefined) return [[], []];
	let names = [];
	let images = [];

	list.forEach((elem, index) => {
		if (index >= 4) return;
		elem.logo_path === null
			? names.push(
					<div>
						<p> {elem.name} </p>
					</div>
			  )
			: images.push(
					<div>
						<img
							src={`https://image.tmdb.org/t/p/w185/${elem.logo_path}`}
							alt={elem.name}
						/>
					</div>
			  );
	});
	return [names, images];
};
