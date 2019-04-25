import * as T from "./types";
import movieDB from '../api/movieDB';
import bookDB from '../api/bookDB';

import { movieItemFormatter, showItemFormatter, bookItemFormatter } from "./dataFormatters";

/* This file handles all the queries for specific pieces of content */

export const TMDBItemQuery = (type, id) => async dispatch => {
    let response;
    
    let loc = type === T.MOVIE ? `/movie/${id}` : `/tv/${id}`;
    let formatter = type === T.MOVIE ? movieItemFormatter : showItemFormatter
    let params = type === T.MOVIE ? {'append_to_response': 'credits,images,release_dates,releases'  }  : {'append_to_response': 'credits,images' }


	dispatch({
		type: T.BEGAN_ITEM,
		payload: { type }
    });
    
	try {
		response = await movieDB.get(loc, { params });
	} catch (err) {
		dispatch({ type: T.ERRORED_ITEM });
		return;
    }

	response = formatter(response.data);
	response['id'] = id; 

	dispatch({
		type: T.FINISHED_ITEM,
		payload: response
	});
};

export const bookItemQuery = (type, id) => async dispatch => {
	let response; 
	let loc = `${id}`
    dispatch({
		type: T.BEGAN_ITEM,
		payload: { type}
    });
    
	try {
		response = await bookDB.get(loc);
	} catch (err) {
		dispatch({ type: T.ERRORED_ITEM });
		return;
	}
	
	response = bookItemFormatter(response.data);

	dispatch({
		type: T.FINISHED_ITEM,
		payload: response
	});
};


export const gameItemQuery = (type, id) => async dispatch => {
    return null; 
};
