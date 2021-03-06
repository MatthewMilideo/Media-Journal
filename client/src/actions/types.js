// Bootstrap Variables
export const breakpoints = {
	// Small devices (landscape phones, 576px and up)
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	arr: [576, 768, 992, 1200, 10000]
};

/* Firebase Auth */
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_ERROR = "SIGNUP_ERROR";
export const SIGNUP_ERROR_AXIOS = "SIGNUP_ERROR_AXIOS";

export const HACKER_USER_ID = "SIGNUP_ERROR_AXIOS";

export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
export const SIGNIN_ERROR = "SIGNIN_ERROR";

export const SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS";
export const SIGNOUT_ERROR = "SIGNOUT_ERROR";

/* Search Types */

/* Data Types for Search */
export const MOVIE = "MOVIE";
export const TV = "TV";
export const BOOK = "BOOK";
export const GAME = "GAME";

/* Search Types */
export const _BEGAN_SEARCH = "_BEGAN_SEARCH";
export const _BEGAN_SEARCH_NEXT = "_BEGAN_SEARCH_NEXT";
export const _FINISHED_SEARCH = "_FINISHED_SEARCH";
export const _FINISHED_SEARCH_NEXT = "_FINISHED_SEARCH_NEXT";
export const _ERRORED_SEARCH = "_ERRORED_SEARCH";
export const _ERRORED_SEARCH_NEXT = "_ERRORED_SEARCH_NEXT";

export const _BEGAN_POST_MEDIA_USER = "_BEGAN_POST_MEDIA_USER";
export const _SUCCESS_POST_MEDIA_USER = "_SUCCESS_POST_MEDIA_USER";
export const _ERRORED_POST_MEDIA_USER = "_ERRORED_POST_MEDIA_USER";

export const BEGAN_POST_USER = "BEGAN_POST_USER";
export const SUCCESS_POST_USER = "SUCCESS_POST_USER";
export const ERRORED_POST_USER = "ERRORED_POST_USER";

export const _BEGAN_DELETE_MEDIA_USER = "_BEGAN_DELETE_MEDIA_USER";
export const _SUCCESS_DELETE_MEDIA_USER = "_SUCCESS_DELETE_MEDIA_USER";
export const _ERRORED_DELETE_MEDIA_USER = "_ERRORED_DELETE_MEDIA_USER";

/* UI State Search Bar */

export const SEARCH_BAR_TEXT = "SEARCH_BAR_TEXT";
export const SEARCH_BAR_ACTIVE_CHANGE = "SEARCH_BAR_ACTIVE_CHANGE";

// General Partial Constants
export const _NEXT = "_NEXT";

//Item Constants
export const BEGAN_ITEM = "BEGAN_ITEM";
export const FINISHED_ITEM = "FINISHED_ITEM";
export const ERRORED_ITEM = "ERRORED_ITEM";

//Notes Constants
export const BEGAN_GET_NOTES = "BEGAN_GET_NOTES";
export const FINISHED_GET_NOTES = "FINISHED_GET_NOTES";
export const ERRORED_GET_NOTES = "ERRORED_GET_NOTES";

export const BEGAN_GET_NOTES_TAGS = "BEGAN_GET_NOTES_TAGS";
export const FINISHED_GET_NOTES_TAGS = "FINISHED_GET_NOTES_TAGS";
export const ERRORED_GET_NOTES_TAGS = "ERRORED_GET_NOTES_TAGS";

//Notes Constants
export const BEGAN_GET_MEDIA = "BEGAN_GET_MEDIA";
export const FINISHED_GET_MEDIA = "FINISHED_GET_MEDIA";
export const ERRORED_GET_MEDIA = "ERRORED_GET_MEDIA";

export const BEGAN_POST_NOTE = "BEGAN_POST_NOTE";
export const FINISHED_POST_NOTE = "FINISHED_POST_NOTE";
export const ERRORED_POST_NOTE = "ERRORED_POST_NOTE";
export const FINISHED_POST_NOTE2 = "FINISHED_POST_NOTE2";

export const BEGAN_EDIT_NOTE = "BEGAN_EDIT_NOTE";
export const FINISHED_EDIT_NOTE = "FINISHED_EDIT_NOTE";
export const ERRORED_EDIT_NOTE = "ERRORED_EDIT_NOTE";

export const BEGAN_DELETE_NOTE = "BEGAN_DELETE_NOTE";
export const FINISHED_DELETE_NOTE = "FINISHED_DELETE_NOTE";
export const ERRORED_DELETE_NOTE = "ERRORED_DELETE_NOTE";

export const ADD_NOTE = "ADD_NOTE";
export const ADD_NOTE_TAG = "ADD_NOTE_TAG";
export const REMOVE_NOTE_TAG = "REMOVE_NOTE_TAG";

// Search Tags Constants
export const BEGAN_SEARCH_TAGS = "BEGAN_SEARCH_TAGS";
export const FINISHED_SEARCH_TAGS = "FINISHED_SEARCH_TAGS";
export const ERRORED_SEARCH_TAGS = "ERRORED_SEARCH_TAGS";

//LOGIN Constants
export const BEGAN_LOGIN = "BEGAN_LOGIN";
export const FINISHED_LOGIN = "FINISHED_LOGIN";
export const ERRORED_LOGIN = "ERRORED_LOGIN";
export const LOGOUT = "LOGOUT";
export const BEGAN_REGISTER = "BEGAN_REGISTER";
export const FINISHED_REGISTER = "FINISHED_REGISTER";
export const ERRORED_REGISTER = "ERRORED_REGISTER";

// Registration Verification
export const REG_UNDEFINED = "REG_UNDEFINED";
export const CHECK_USER = "CHECK_USER";
export const VALID_USER = "VALID_USER";
export const INVALID_USER = "INVALID_USER";
export const CHECK_EMAIL = "CHECK_EMAIL";
export const VALID_EMAIL = "VALID_EMAIL";
export const INVALID_EMAIL = "INVALID_EMAIL";

export const VALID = "VALID";
export const INVALID = "INVALID";

export const NOTE_STATUS = "NOTE_STATUS";

//Internal Data Types
export const NOTE_GROUP = "NOTE_GROUP";
export const NOTE = "NOTE";
export const NOTE_SUB = "NOTE_SUB";
export const TAG = "TAG";

//Journal Partial Constants
export const _ALL = "_BEGAN";
export const _BEGAN = "_BEGAN";
export const _FINISHED = "_FINISHED";
export const _ERRORED = "_ERRORED";
export const _GET = "_GET";
export const _PATCH = "_PATCH";
export const _POST = "_POST";
export const _PUT = "_PUT";
export const _DELETE = "_DELETE";

export const GET = "GET";
export const POST = "POST";
export const DELETE = "POST";
export const UNLOADED = "UNLOADED";

//Journal Constants
export const _BEGAN_GET = "_BEGAN_GET";
export const _FINISHED_GET = "_FINISHED_GET";
export const _ERRORED_GET = "_ERRORED_GET";

export const _BEGAN_POST = "_BEGAN_POST";
export const _FINISHED_POST = "_FINISHED_POST";
export const _ERRORED_POST = "ERRORED_POST";

export const _BEGAN_DELETE = "_BEGAN_DELETE";
export const _FINISHED_DELETE = "_FINISHED_DELETE";
export const _ERRORED_DELETE = "ERRORED_DELETE";

export const _BEGAN_PATCH = "_BEGAN_PATCH";
export const _FINISHED_PATCH = "_FINISHED_PATCH";
export const _ERRORED_PATCH = "ERRORED_PATCH";

export const _BEGAN_PUT = "_BEGAN_PUT";
export const _FINISHED_PUT = "_FINISHED_PUT";
export const _ERRORED_PUT = "ERRORED_PUT";

// Notes Sync

export const EDIT_NOTE_TITLE = "EDIT_NOTE_TITLE";
export const EDIT_NOTE_DATA = "EDIT_NOTE_DATA";
export const NOTE_EDIT_STATE = "NOTE_EDIT_STATE";
export const DISCARD_NOTE_CHANGES = "DISCARD_NOTE_CHANGES";

export const BEG_SAVE_NOTE = "BEG_SAVE_NOTE";
export const FIN_SAVE_NOTE = "FIN_SAVE_NOTE";
export const ERR_SAVE_NOTE = "ERR_SAVE_NOTE";

export const BEG_SAVE_NOTE_CHANGES = "BEG_SAVE_NOTE_CHANGES";
export const FIN_SAVE_NOTE_CHANGES = "FIN_SAVE_NOTE_CHANGES";
export const ERR_SAVE_NOTE_CHANGES = "ERR_SAVE_NOTE_CHANGES";

// Notes
export const BEG_GET_ALL_NOTES = "BEG_GET_ALL_NOTES";
export const FIN_GET_ALL_NOTES = "FIN_GET_ALL_NOTES";
export const ERR_GET_ALL_NOTES = "ERR_GET_ALL_NOTES";

export const BEG_GET_USER_NOTES = "BEG_GET_USER_NOTES";
export const FIN_GET_USER_NOTES = "FIN_GET_USER_NOTES";
export const ERR_GET_USER_NOTES = "ERR_GET_USER_NOTES";

export const BEG_GET_MEDIA_NOTES = "BEG_GET_MEDIA_NOTES";
export const FIN_GET_MEDIA_NOTES = "FIN_GET_MEDIA_NOTES";
export const ERR_GET_MEDIA_NOTES = "ERR_GET_MEDIA_NOTES";

export const BEG_GET_MEDIAUSER_NOTES = "BEG_GET_MEDIAUSER_NOTES";
export const FIN_GET_MEDIAUSER_NOTES = "FIN_GET_MEDIAUSER_NOTES";
export const ERR_GET_MEDIAUSER_NOTES = "ERR_GET_MEDIAUSER_NOTES";

export const BEG_POST_NOTE = "BEG_POST_NOTE";
export const FIN_POST_NOTE = "FIN_POST_NOTE";
export const ERR_POST_NOTE = "ERR_POST_NOTE";
