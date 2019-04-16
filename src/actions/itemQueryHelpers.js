import * as T from "./types";
import movieDB from '../api/movieDB';

import { movieItemFormatter, showItemFormatter } from "./dataFormatters";

export const TMDBItemQuery = (type, id) => async dispatch => {
    let response;
    
    let loc = type === T.MOVIE ? `/movie/${id}` : `/tv/${id}`;
    let formatter = type === T.MOVIE ? movieItemFormatter : showItemFormatter
    let params = type === T.MOVIE ? {'append_to_response': 'credits,images,release_dates'  }  : {'append_to_response': 'credits,images' }
  //  console.log('in item query', loc, formatter, params);
    //console.log('item', T.BEGAN_ITEM);

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
    return null; 
};

export const gameItemQuery = (type, id) => async dispatch => {
    return null; 
};
