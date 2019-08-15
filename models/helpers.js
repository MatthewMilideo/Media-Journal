/* Helper Functions for validation in the models. */

/* I need to switch over to Typescript...
Given an object {ints: [], strings: []}
This function returns true either if the arrays are empty, or 
if the arrays contain all values of their 'type' */

exports.checkArgs = function(ints, strings = []) {
	if (ints instanceof Array && strings instanceof Array) {
		for (let i = 0; i < ints.length; i++) {
			if (typeof ints[i] === "object") return false;
			if (!Number.isInteger(parseInt(ints[i]))) return false;
		}
		for (let i = 0; i < strings.length; i++) {
			if (!strings[i] || typeof strings[i] !== "string") {
				return false;
			}
			//if (Number.isInteger(parseInt(strings[i])))  return false;
		}
		return true;
	}
	return false;
};

/* Given a media object (representation of a media database entry)
This function returns true if valid and false if invalid. */
const typeArr = ["MOVIE", "TV_SEASON", "BOOK", "GAME"];
exports.checkMediaObj = function(obj) {
	if (typeof obj === "object" && obj !== null) {
		if (!obj.title) return false;
		if (typeof obj.title !== "string") return false;
		if (!obj.type) return false;
		if (!typeArr.includes(obj.type)) return false;
		if (!obj.CID) return false;
		if (typeof obj.CID !== "string") return false;
		return true;
	}
	return false;
};

exports.checkMediaType = function(type) {
    if (typeof type !== "string") return false;
    if (!typeArr.includes(type)) return false;
    return true;
};

/* Wrapper function for checkArgs and CheckMediaObj together.  */

exports.checkArgsAndMedia = function(ints, strings, mediaObj) {
	if (!(exports.checkArgs(ints, strings) && exports.checkMediaObj(mediaObj))) {
		return false;
	}
	return true;
};

/* ~~~~~ Variables for testing ~~~~~ */


/*

let validInts1 = [1, 2, 3, 4]; 
let validInts2 = []; 
let invalidInts1 = ['hello']; 
let invalidInts2 = [{}]; 
let invalidInts3 = [[1]]; 

let validStrings1 = ['hello', 'hello'];
let validStrings2 = [];
let invalidStrings1 = [1]
let invalidStrings2 = [{}]; 
let invalidStrings3 = [['hi']]; 



let validMediaObj = {
	title: "The Movie",
	CID: "1234",
	type: "MOVIE"
};

let invalidArgsObj = {
	strings: ["hello", "hello"],
	ints: [1, 2, 3, "hello"]
};

let invalidMediaObj = {
	title: "The Movie",
	CID: "1234",
	type: "test"
};

console.log('~~~~ Should Print true ~~~~~~~~~~')

console.log(checkArgs(validInts1, validStrings1)); 
console.log(checkArgs(validInts2, validStrings1)); 
console.log(checkArgsAndMedia(validInts1,validStrings1, validMediaObj));


console.log('~~~~ Should Print false ~~~~~~~~~~')
console.log(checkArgs(invalidInts1, validStrings1)); 
console.log(checkArgs(invalidInts2, validStrings1)); 
console.log(checkArgs(invalidInts3, validStrings1)); 
console.log(checkArgs(validInts1, invalidStrings1)); 
console.log(checkArgs(validInts1, invalidStrings2)); 
console.log(checkArgs(validInts1, invalidStrings3)); 


console.log(checkArgsAndMedia(invalidInts1,validStrings1, validMediaObj));
console.log(checkArgsAndMedia(validInts1,invalidStrings1, validMediaObj));
console.log(checkArgsAndMedia(validInts1,validStrings1, invalidMediaObj));
console.log(checkArgsAndMedia(invalidInts1,invalidStrings1, invalidMediaObj));

*/
