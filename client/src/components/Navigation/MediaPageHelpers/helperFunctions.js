import React from "react";

export const renderCrew = crew => {
	let keys = Object.keys(crew);
	let s = "";
	keys.sort();

	let list = keys.map(key => {
		s = "";
		if (crew[key].length > 1) s = "s";
		//console.log((key, crew[key], crew[key].length)

		return crew[key].length !== 0 ? (
			<div className="media-body-inner-div">
				<i>
					{key}
					{s}:
				</i>
				{crew[key].map((member, index) => {
					if (index >= 2) return;
					let comma = ",";
					if (index === 1 || index === crew[key].length - 1) comma = "";
					return (
						<p>
							{" "}
							{member.name}
							{comma}
						</p>
					);
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

export const runTimes = list => {
	let func = elem => elem;
	return renderList(list, func, "Episode Lengths: ", " minutes");
};

export const renderList = (list, config, sectionText, elemText) => {
	let returnData = null;
	list.length === 0
		? (returnData = null)
		: (returnData = list.map((elem, index) => {
				let comma = null;
				index === list.length - 1 ? (comma = "") : (comma = ", ");
				return (
					<h5 className="comma-list">
						{config(elem)}
						{elemText}
						{comma}
					</h5>
				);
		  }));

	return returnData === null ? null : (
		<div className="genre-div">
			<h5 className="media-body-h1"> {sectionText} </h5>
			{returnData}
		</div>
	);
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
	let returnData;
	let string = "";
	let names = [];
	let images = [];

	if (networks != null) {
		string = "Networks and ";
		networks.forEach((company, index) => {
			//console.log((index);
			if (index >= 4) return;
			company.logo_path === null
				? names.push(<p> {company.name} </p>)
				: images.push(
						<div>
							<img
								src={`https://image.tmdb.org/t/p/w185/${company.logo_path}`}
								alt={company.name}
							/>
						</div>
				  );
		});
	}

	companies.forEach((company, index) => {
		//console.log((index);
		if (index >= 4) return;
		company.logo_path === null
			? names.push(<p> {company.name} </p>)
			: images.push(
					<div>
						<img
							src={`https://image.tmdb.org/t/p/w185/${company.logo_path}`}
							alt={company.name}
						/>
					</div>
			  );
	});

	names.length === 0 && images.length === 0
		? (returnData = null)
		: (returnData = (
				<div className="media-body-div">
					<h1> {`${string}Production Companies:`} </h1>

					<div className="media-comp-div">
						{images}
						{names}
					</div>
				</div>
		  ));

	return returnData;
};
