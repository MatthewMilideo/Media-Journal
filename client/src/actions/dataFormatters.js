import { formatDate, formatMoney } from "../helpers";
import * as T from "../actions/types";

/* Formats Results of search query to The Movie Database (TMDB) API */
export const TMDBFormatter = (data, unused) => {
	data.results = data.results.map(media => {
		let smallImage;
		let largeImage;

		if (media.poster_path != null) {
			smallImage = `https://image.tmdb.org/t/p/w185${media.poster_path}`;
			largeImage = `https://image.tmdb.org/t/p/w500${media.poster_path}`;
		} else {
			smallImage = null;
			largeImage = null;
		}

		return {
			ID: media.id,
			title: media.title || media.name,
			date: media.release_date,
			overview: media.overview,
			smallImage: smallImage,
			largeImage: largeImage
		};
	});
	return data;
};

/* Formats Results of search query to Google Books API */
export const bookFormatter = (books, curElem = 0) => {
	if (!books.items) {
		books.items = [];
		return books;
	}

	books.items = books.items.map(book => {
		let smallImage;
		let largeImage;
		let bigImage;

		if (book.volumeInfo.hasOwnProperty("imageLinks")) {
			smallImage = book.volumeInfo.imageLinks.smallThumbnail;
			largeImage = book.volumeInfo.imageLinks.thumbnail;
			largeImage = largeImage.concat("&zoom=.25");
			bigImage = book.volumeInfo.imageLinks.small;
		} else {
			smallImage = null;
			largeImage = null;
			bigImage = null;
		}
		return {
			ID: book.id,
			title: book.volumeInfo.title,
			subtitle: book.volumeInfo.subtitle,
			authors: book.volumeInfo.authors,
			overview: book.volumeInfo.description,
			language: book.volumeInfo.language,
			smallImage: smallImage,
			largeImage: largeImage,
			bigImage: bigImage
		};
	});
	books.page = curElem;
	return books;
};

/* Formats results of a search query for a specific movie from the TMDB API  */
export const movieItemFormatter = data => {
	let smallImage;
	let largeImage;

	if (data.poster_path != null) {
		smallImage = `https://image.tmdb.org/t/p/w185${data.poster_path}`;
		largeImage = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
	} else {
		smallImage = null;
		largeImage = null;
	}

	const movieData = {
		title: data.original_title,
		type: "MOVIE",
		overview: data.overview,
		crew: crewFormatter(data.credits.crew, null),
		cast: data.credits.cast,
		production_companies: data.production_companies,
		genres: data.genres,
		budget: formatMoney(data.budget),
		revenue: formatMoney(data.revenue),
		images: data.images,
		language: data.original_language,
		poster_path: data.poster_path,
		release_date: formatDate(
			data.release_dates.results[0].release_dates[0].release_date
		),
		runtime: data.runtime,
		largeImage: largeImage,
		smallImage: smallImage
	};

	return movieData;
};

/* Formats results of a search query for a specific show from the TMDB API  */
export const showItemFormatter = data => {
	let smallImage;
	let largeImage;

	if (data.poster_path != null) {
		smallImage = `https://image.tmdb.org/t/p/w185${data.poster_path}`;
		largeImage = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
	} else {
		smallImage = null;
		largeImage = null;
	}

	let firstDate = formatDate(new Date(data.first_air_date));
	let lastDate = formatDate(new Date(data.last_air_date));
	////console.log(('date',firstDate)

	const showData = {
		type: T.TV,
		title: data.original_name,
		overview: data.overview,
		runtime: data.episode_run_time,
		firstDate: firstDate,
		lastDate: lastDate,
		creator: data.created_by,
		crew: crewFormatter(data.credits.crew, data.created_by),
		cast: data.credits.cast,
		genres: data.genres,
		images: data.images,
		poster_path: data.poster_path,
		largeImage: largeImage,
		smallImage: smallImage,

		numEps: data.number_of_episodes,
		numSeasons: data.number_of_seasons,
		language: data.original_language,
		prodComps: data.production_companies,
		networks: data.networks
	};

	return showData;
};

/* This object defines the standard crew rolls that I use in the fromatter below. */
const standardRoles = [
	"Director",
	"Executive Producer",
	"Producer",
	"Director of Photography",
	"Writer"
];
/* Formats the crew from a TMDB item query and returns roles listed above */
const crewFormatter = (input, creator = null, output = standardRoles) => {
	let returnObj = {};
	output.forEach(role => (returnObj[role] = []));

	returnObj["Creator"] = [];
	if (creator != null) {
		creator.forEach(crew => {
			returnObj["Creator"].push(crew);
		});
	}

	input.forEach(crew => {
		if (returnObj[crew.job]) returnObj[crew.job].push(crew);
	});

	return returnObj;
};

/* Formats theresults of a search query for a specific book from the GoogleBooks API  */
export const bookItemFormatter = data => {
	data = data.volumeInfo;
	let pubDate = data.publishedDate;

	pubDate === undefined
		? (pubDate = undefined)
		: (pubDate = formatDate(new Date(pubDate)));

	let returnObj = {
		id: data.id,
		type: T.BOOK,
		title: data.title,
		subtitle: data.subtitle,
		overview: removeBR(data.description),
		authors: data.authors,
		publisher: data.publisher,
		pubDate,
		ids: data.industryIdentifiers,
		pageCount: data.printedPageCount,
		language: data.language,
		genres: data.categories,
		//price: data.saleInfo.listPrice,
		images: data.imageLinks
	};

	return returnObj;
};

/* Removes line breaks from the overview section of a google books item request */
const removeBR = text => {
	if (text === undefined) return text;
	let value = text.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, "");
	//console.log(value);
	return value;
};
