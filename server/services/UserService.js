const User = require("../models/users_model");
const helpers = require("../models/helpers");

const UserService = {};

// Input: user_id
// Output: nothing
UserService.postUser= async function(user_id){
	// Check the Input.
	if (!helpers.checkArgs([], [user_id])){
		return {
			status: 400,
			data: "You must provide a valid user_id."
        };
    }
    console.log(user_id);
    let res = await User.postUser(user_id);
    console.log(res);
	return { status: res.status};
};



module.exports = UserService;