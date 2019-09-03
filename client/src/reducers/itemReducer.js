import * as T from "../actions/types";

const defaultState = {
	status: null,
	type: null,
	data: {},
};

export default (state = defaultState, action) => {
	switch (action.type) {
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