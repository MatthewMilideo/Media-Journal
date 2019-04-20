import React from "react";
import { Grid, Image, Button, Segment, Divider } from "semantic-ui-react";

/* Props 
Movie: All of the relevant data about the movie.
Size: The Size of the Window. 
*/

const renderGenres = genres => {
    let returnData = null;
    genres.length === 0
        ? (returnData = null)
        : (returnData = genres.map((genre, index) => {
                let comma = null;
                index === genres.length - 1 ? (comma = "") : (comma = ", ");
                return (
                    <p className="comma-list">
                        {genre.name}
                        {comma}
                    </p>
                );
          }));

          return returnData === null ? null : (
            <div className="genre-div">
                <h1 className="media-body-h1"> Genres: </h1>
                {returnData}
            </div>
        );
};

const renderBudget = (budget, revenue) => {
    if (budget !== null) budget = <p> Budget: {budget} </p>;
    if (revenue !== null) revenue = <p> Revenue: {revenue} </p>;

    let returnStr;
    budget && revenue ? (returnStr = "|") : (returnStr = "");

    return (budget && revenue) || budget || revenue ? (
        <div className="budget-div">
            <h1 className="media-body-h1"> Budget: </h1>
            {budget} {returnStr} {revenue}
        </div>
    ) : null;
};

const renderCrew = crew => {
    
    /*

    
    genres.length === 0
        ? (returnData = null)
        : (returnData = genres.map((genre, index) => {
                let comma = null;
                index === genres.length - 1 ? (comma = "") : (comma = ", ");
                return (
                    <p className="comma-list">
                        {genre.name}
                        {comma}
                    </p>
                );
          }));

    return returnData === null ? null : (
        <div className="genre-div">
            <h1 className="media-body-h1"> Genres: </h1>
            {returnData}
        </div>
    );
    */
};

const renderProdComps = companies => {
    let returnData;
    let names = [];
    let images = [];

    companies.forEach((company, index) => {
        console.log(index);
        if (index >= 4) return;
        company.logo_path === null
            ? names.push(<p className="company-name"> {company.name} </p>)
            : images.push(
                    <div>
                        <img
                            className="company-logo"
                            src={`https://image.tmdb.org/t/p/w185/${company.logo_path}`}
                            alt={company.name}
                        />
                    </div>
              );
    });

    companies.length === 0
        ? (returnData = null)
        : (returnData = (
                <div>
                    <h1 className="media-body-h1"> Production Companies: </h1>

                    <div className="comp-div">
                        {images}
                        {names}
                    </div>
                </div>
          ));

    return returnData;
};

const MovieData = props => {
	const { movie } = props;
	let gridWidth = 10;
	let poster = null;

	movie.poster_path === null
		? (gridWidth = 13)
		: (poster = (
				<Grid.Column centered width={6}>
                    <div className = 'test5'> 
					<Image src={movie.largeImage} />
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


	return (
		<Grid centered equal stackable>
			<Grid.Row centered verticalAlign="top">
				{poster}
				<Grid.Column divided="vertically" width={gridWidth}>
					<Grid.Row>
						<Segment compact>
							<div className="title-div">
								<h1 className="media-title"> {movie.title} </h1>
								<span className="media-title-descriptor">
									{releaseDate} | {runtime}
								</span>
							</div>
							<div className="movie-body">
								<Divider />
								<h1 className="media-body-h1"> Overview: </h1>
								<p className="overview"> {movie.overview} </p>
								{renderGenres(movie.genres)}
								{renderBudget(movie.budget, movie.revenue)}
								{renderProdComps(movie.production_companies)}
							</div>
						</Segment>
					</Grid.Row>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default MovieData;
