import {formatDate, formatMoney} from '../helpers'

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
			largeImage: largeImage,
		};
	});
	return data; 
};

const standardRoles = ['Director','Executive Producer','Producer','Director of Photography','Writer']

const crewFormatter = (input, output = standardRoles) => {
	let returnObj = {}
	output.forEach( role => returnObj[role] = [])

	input.forEach( crew => {
		if(returnObj[crew.job]) returnObj[crew.job].push(crew);
	})

	return returnObj;
}


export const movieItemFormatter = (data) => {

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
		type: 'MOVIE', 
		overview: data.overview, 
		crew: crewFormatter(data.credits.crew),
		cast: data.credits.cast,
		production_companies: data.production_companies,
		genres: data.genres, 
		budget: formatMoney(data.budget),
		revenue: formatMoney(data.revenue),
		images: data.images,
		language: data.original_language,  
		poster_path: data.poster_path, 
		release_date: formatDate(data.release_dates.results[0].release_dates[0].release_date),
		runtime: data.runtime,
		largeImage: largeImage, 
		smallImage: smallImage
	}

	return movieData; 
};

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

	//console.log(data);

	const showData = {
		type: 'TV_SHOW', 
		title: data.original_name,
		overview: data.overview, 
		creator: data.created_by,
		firstDate: data.first_air_date, 
		lastDate: data.last_air_date, 
		crew: crewFormatter(data.credits.crew),
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
	}

	return showData;

}

export const bookFormatter = (books, curElem = 0) => {

    if (!books.items){
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
			largeImage = largeImage.concat("&zoom=.5")
			bigImage = book.volumeInfo.imageLinks.small;
		} else {
			smallImage = null;
			largeImage = null;
			bigImage = null;
		}
		return {
			ID: book.id,
			title: book.volumeInfo.title,
			authors: book.volumeInfo.authors,
			overview: book.volumeInfo.description,
			language: book.volumeInfo.language,
			smallImage: smallImage,
			largeImage: largeImage,
			bigImage: bigImage, 
		};
	});
	books.page = curElem; 
	return books; 
};
