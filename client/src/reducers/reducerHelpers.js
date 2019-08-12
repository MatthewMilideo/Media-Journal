import { searchHOR } from "./higherOrderReducers";

const defaultSearchState = {
	status: null,
	type: null,
	query: null,
	data: [],
	curElem: null,
	totalElems: null
};
const emptySearchReducer = (state = defaultSearchState, action) => state;
const searchTypes = [T.MOVIE, T.TV_SEASON, T.BOOK, T.GAME]; 

//Generalized Reducer builder might be useful later. 
const reducersBuilder = (types, HOR, reducer) => {
	let reducersObj = {}
	types.map( t => reducersObj[t] = HOR(t, reducer)); 

}

export const searchReducersBuilder = () => {
	return reducersBuilder(searchTypes, searchHOR, emptySearchReducer); 
}

export const removeCollisions = (stateL, newL) => {
	let flag = false;
	let newList2 = [];
	for (let i = 0; i < newL.length; i++) {
		for (let j = 0; j < stateL.length; j++) {
			if (newL[i].ID === stateL[j].ID) flag = true;
		}
		if (flag === false) newList2.push(newL[i]);
		flag = false;
	}
	return newList2;
};