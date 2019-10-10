import * as T from "../actions/types";

const defaultState = {
	status: null,
	type: null,
	data: {},
};

function deleteMediaUser(state, action){
	let newState = {...state};
	newState.data = {...newState.data};
	newState.data.data= {...newState.data.data};
	newState.data.data.viewed = false; 
	return newState; 
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case `${T._SUCCESS_DELETE_MEDIA_USER}`: {
			return deleteMediaUser(state, action);
		}
        case T.BEGAN_ITEM:
			return {
				...defaultState,
				status: action.type,
				type: action.payload.type,
			};
        case T.FINISHED_ITEM:
			return {
				...state, 
				status: action.type,
				data: action.payload.data
			};
        case T.ERRORED_ITEM:
			return {
                status: action.type,
                data: {}
			};
        default:
			return state;
	}
};

export function _getItemStatus(store) {
	return store.status;
}

export function _getItemData(store) {
	return store;
}