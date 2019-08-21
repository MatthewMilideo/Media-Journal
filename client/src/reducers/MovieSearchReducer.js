import * as T from "../actions/types";

const defaultState = {
	status: null,
	data: {},
};

export default (state = defaultState, action) => {
	switch (action.type) {
        case T.BEGAN_SEARCH:
			return {
				...state,
				status: action.type,
			};
        case T.FINISHED_SEARCH:
			return {
                ...state, 
                status: action.type,
				data: action.payload
			};
        case T.ERROR_SEARCH:
			return {
                status: action.type,
                data: {}
			};
        default:
			return state;
	}
};
