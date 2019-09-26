const axios = require("axios");

const helpers = require("./helpers");
const KEY = process.env.TMDB_KEY;
const T = require("../types");

const TMDB = axios.create({
	baseURL: "https://api.themoviedb.org/3"
});

const TMDBModel = {};

TMDBModel.search = function(term, type, page = 1) {
	let url;
	type === T.MOVIE ? (url = "search/movie") : (url = "search/tv");

	return TMDB.get(url, {
		params: { api_key: KEY, query: term, page }
	})
		.then(response => {
			if (response.data.results.length === 0) {
				return Promise.reject({
					status: 404,
					data: "The requested content was not found."
				});
			}
			response.data = TMDBModel.formatResponse(response.data);
			return { status: 200, data: response.data };
		})
		.catch(error => {
			if (error.response) {
				if (error.response.status === 422) {
					return {
						status: 400,
						data: "You must provide a valid term and page.",
						error
					};
				} else {
					return { status: error.response.status, data: error.message, error };
				}
			}
			return {
				status: error.status,
				data: error.data
			};
		});
};

TMDBModel.getItem = function(id, type) {
	// Configuration
	//	console.log(" in get item", id, type);
	let loc = type === T.MOVIE ? `/movie/${id}` : `/tv/${id}`;
	let append_to_response =
		type === T.MOVIE
			? "credits,images,release_dates,releases"
			: "credits,images";

	if (!helpers.checkArgsType([id], [], type)) {
		//		console.log("in helpers");
		return Promise.reject({
			status: 400,
			data: "You must provide a valid id and type."
		});
	}

	return TMDB.get(loc, { params: { api_key: KEY, append_to_response } })
		.then(item => {
			item = TMDBModel.formatItem(item.data);
			//console.log(item);
			return { status: 200, data: item };
		})
		.catch(error => {
			//console.log(error);
			if (error.response) {
				throw { status: error.response.status, data: error.message, error };
			}

			throw {
				status: error.status,
				data: error.data
			};
		});
};

TMDBModel.formatResponse = response => {
	//console.log(response);
	response.results = response.results.map(elem => {
		if (elem.name) elem.title = elem.name;
		//	console.log(elem.poster_path);
		elem.smallImage = `https://image.tmdb.org/t/p/w45${elem.poster_path}`;
		elem.largeImage = `https://image.tmdb.org/t/p/w500${elem.poster_path}`;
		if (!elem.poster_path) {
			//		console.log('in if');
			elem.smallImage =
				"https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=45&q=80";
			elem.largeImage =
				"https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80";
		}

		return elem;
	});
	return response;
};

TMDBModel.formatItem = data => {
	if (data.release_date)
		data.release_date = formatDate(
			data.release_dates.results[0].release_dates[0].release_date
		);

		if (data.first_air_date)
		data.first_air_date = formatDate(
			data.first_air_date
		);
		if (data.last_air_date)
		data.last_air_date = formatDate(
			data.last_air_date
		);
	if (data.budget) data.budget = formatMoney(data.budget);
	if (data.revenue) data.revenue = formatMoney(data.revenue);
	if (data.crew) data.crew = crewFormatter(data.credits.crew, null);
	if (data.name) data.title = data.name;
	return data;
};

const monthObj = {
	0: "January",
	1: "Febuary",
	2: "March",
	3: "April",
	4: "May",
	5: "June",
	6: "July",
	7: "August",
	8: "September",
	9: "October",
	10: "November",
	11: "December"
};

const dayObj = {
	0: "Sunday",
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thursday",
	5: "Friday",
	6: "Saturday",
	7: "Sunday"
};

const formatDate = date => {
	let d = new Date(date);
	let dayName = dayObj[d.getDay()];
	let day = d.getDate();
	let month = monthObj[d.getMonth()];
	let year = d.getFullYear();

	return dayName + ", " + month + " " + day + ", " + year;
};

const formatMoney = num => {
	////console.log(('num', num);
	if (num === 0) return null;

	let returnStr = "$";
	num = num.toString();
	let numLen = num.length - 1;
	let counter = 0;

	for (let i = numLen; i >= 0; i--) {
		counter++;
		if (counter === 3 && i != 0) {
			counter = 0;
			let str1 = num.slice(0, i);
			let str2 = num.slice(i, num.length);
			num = str1.concat(",", str2);
		}
	}
	returnStr = returnStr.concat(num);
	return returnStr;
};

//This object defines the standard crew rolls that I use in the fromatter below.
const standardRoles = [
	"Director",
	"Executive Producer",
	"Producer",
	"Director of Photography",
	"Writer"
];
//Formats the crew from a TMDB item query and returns roles listed above
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

/*

TV Formatter 

	let firstDate = formatDate(new Date(data.first_air_date));
	let lastDate = formatDate(new Date(data.last_air_date));
	////console.log(('date',firstDate)

			crew: crewFormatter(data.credits.crew, data.created_by),



	/* This object defines the standard crew rolls that I use in the fromatter below. 
const standardRoles = [
	"Director",
	"Executive Producer",
	"Producer",
	"Director of Photography",
	"Writer"
];
/* Formats the crew from a TMDB item query and returns roles listed above 
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

		overview: removeBR(data.description),


/* Removes line breaks from the overview section of a google books item request 
const removeBR = text => {
	if (text === undefined) return text;
	let value = text.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, "");
	//console.log(value);
	return value;
};

const monthObj = {
    0: 'January',
    1: 'Febuary',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

const dayObj = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
}


export const formatDate = (date) => {
    let d = new Date(date);
    let dayName = dayObj[d.getDay()];
    let day = d.getDate();
    let month = monthObj[d.getMonth()];
    let year = d.getFullYear();

    return  (dayName + ', ' + month + ' ' + day +', ' + year); 
} 

export const formatMoney = (num) => {
    ////console.log(('num', num);
    if (num === 0) return null; 

    let returnStr = '$'
    num = num.toString();
    let numLen = num.length -1; 
    let counter = 0; 

    for(let i = numLen; i >= 0; i-- ){
        counter++; 
        if (counter === 3 && i != 0){
            counter = 0; 
            let str1 = num.slice(0, i);
            let str2 = num.slice(i, num.length); 
            num = str1.concat(',', str2);  
        }
    }
    returnStr = returnStr.concat(num);
    return returnStr;
} 


*/

module.exports = TMDBModel;
