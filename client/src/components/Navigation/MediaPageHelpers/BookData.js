import React from "react";
import { Grid, Image, Button, Segment, Divider } from "semantic-ui-react";
import DOMPurify from "dompurify";
import { renderCrew, renderProdComps } from "./helperFunctions";
//import itemS from '../../../styles/ItemData.module.css'
//import bookS from '../../../styles/BookData.module.css'
import styles from "../../../styles/bookData.module.css";

/* Props 
Movie: All of the relevant data about the movie.
Size: The Size of the Window. 

*/

const renderImage = obj => {
    if (obj ===  undefined) return null 
    let keys = Object.keys(obj);
    if (keys.length === 0) return null; 
    let url = obj[keys[keys.length-1]]
    console.log(url);
  
    return <img className="image" src= {url} />
}

const renderAuthors = list => {
    if (list === undefined) return null

	let returnData = null;
	let s = "";

	if (list.length > 1) s = "s";

	list.length === 0
		? (returnData = null)
		: (returnData = list.map((author, index) => {
				let comma = ",";
				if (index === list.length - 1) comma = "";
				if (index === list.length - 2) comma = ", and ";

				return (
					<p className="comma-list">
						{author}
						{comma}
					</p>
				);
		  }));

	return returnData === null ? null : (
		<div className="author-div"> by {returnData} </div>
	);
};

const renderGenres = list => {
    if (list === undefined) return null; 

	let returnData = null;
	let s = "";

	if (list.length > 1) s = "s";

	list.length === 0
		? (returnData = null)
		: (returnData = list.map((author, index) => {
				return <li className="book-genre-list">{author}</li>;
		  }));

	return returnData === null ? null : (
		<div className="book-genre-div">
			<h1 className="media-body-h1"> {`Genre${s}:`} </h1>

			<ul className="book-genre-list">{returnData}</ul>
		</div>
	);
};

const renderOther = (publisher, pubDate, pageCount, lang) => {
	publisher !== undefined
		? (publisher = <p> Publisher: {publisher} </p>)
		: (publisher = null);
	pubDate !== undefined
		? (pubDate = <p> Publish Date: {pubDate} </p>)
		: (pubDate = null);
	pageCount === undefined
		? (pageCount = null)
		: (pageCount = <p> Pages: {pageCount} </p>);
	lang === undefined ? (lang = null) : (lang = <p> Language: {lang} </p>);

	return (publisher && pubDate) || pageCount || lang ? (
		<div className="book-info-div">
			<h1 className="media-body-h1"> Book Information: </h1>
			<div className="book-info-div-inner">
				{publisher} {pubDate} {pageCount} {lang}
			</div>
		</div>
	) : null;
};

const BookData = props => {
	//console.log(("in movie data", props);
	const { book } = props;
	let gridWidth = 10;
	let poster = null;

	book.poster_path === null
		? (gridWidth = 13)
		: (poster = (
				<Grid.Column centered width={6}>
                    {renderImage(book.images)}
				</Grid.Column>
		  ));

	let overview;
	book.overview === ""
		? (overview = null)
		: (overview = (
				<div>
					<h1 className="media-body-h1"> Synopsis: </h1>
					<div
						className="book-overview-inner"
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(book.overview)
						}}
					/>
				</div>
		  ));

	return (
		<Grid centered equal stackable>
			<Grid.Row centered verticalAlign="top">
				{poster}
				<Grid.Column divided="vertically" width={gridWidth}>
					<Grid.Row>
						<Segment >
							<div className="book-title-div">
								<h1 className="book-title"> {book.title} </h1>
								{book.subtitle !== undefined ? (
									<h2>: {book.subtitle}</h2>
								) : null}
								<span className="media-title-descriptor" />
								{renderAuthors(book.authors)}
							</div>
							<div className="book-body">
								<Divider />
								{overview}
								{renderGenres(book.genres)}
								{renderOther(
									book.publisher,
									book.pubDate,
									book.pageCount,
									book.language
								)}
							</div>
						</Segment>
					</Grid.Row>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default BookData;
