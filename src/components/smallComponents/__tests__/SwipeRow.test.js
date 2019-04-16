import React from "react";
import { mount } from "enzyme";

import SwipeRow from "../SwipeRow";
import SwipeRowElem from "../SwipeRowElem";
import { Grid, Segment } from "semantic-ui-react";
import { itemBuilder } from "../../../actions/queryBuilders";

const configObj = {
	imageP1: "https://image.tmdb.org/t/p/w185/",
	imageP2: "profile_path",
	imageD:
		"https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg",
	text1: "name",
	text2: "character"
};

const eSize = 215;
const list = [
	{
		cast_id: 12,
		character: "Dorothy Vallens",
		credit_id: "52fe4277c3a36847f8020dc7",
		gender: 1,
		id: 6588,
		name: "Isabella Rossellini",
		order: 0,
		profile_path:
			"https://image.tmdb.org/t/p/w185//yKnom6aUaP17Z49mypVZmq1jdjH.jpg"
	},
	{
		cast_id: 13,
		character: "Jeffrey Beaumont",
		credit_id: "52fe4277c3a36847f8020dcb",
		gender: 2,
		id: 6677,
		name: "Kyle MacLachlan",
		order: 1,
		profile_path:
			"https://image.tmdb.org/t/p/w185//ykDb80YOPY2HLuRClLDpSYxUCPX.jpg"
	},
	{
		cast_id: 14,
		character: "Frank Booth",
		credit_id: "52fe4277c3a36847f8020dcf",
		gender: 2,
		id: 2778,
		name: "Dennis Hopper",
		order: 2,
		profile_path:
			"https://image.tmdb.org/t/p/w185//56nj2DfMVU3F9qUagZWMePLbrKF.jpg"
	},
	{
		cast_id: 15,
		character: "Sandy Williams",
		credit_id: "52fe4277c3a36847f8020dd3",
		gender: 1,
		id: 4784,
		name: "Laura Dern",
		order: 3,
		profile_path:
			"https://image.tmdb.org/t/p/w185//2Ryt0SsExqWrLTzBu6sZcbLwoDJ.jpg"
	},
	{
		cast_id: 16,
		character: "Mrs. Williams",
		credit_id: "52fe4277c3a36847f8020dd7",
		gender: 1,
		id: 3382,
		name: "Hope Lange",
		order: 4,
		profile_path:
			"https://image.tmdb.org/t/p/w185//pkUVlKHmajjgH26t7qe1PyBaF4i.jpg"
	},
	{
		cast_id: 17,
		character: "Ben",
		credit_id: "52fe4277c3a36847f8020ddb",
		gender: 2,
		id: 923,
		name: "Dean Stockwell",
		order: 5,
		profile_path:
			"https://image.tmdb.org/t/p/w185//gdHo8LNElMf1XxoRYgi0UUzbJuB.jpg"
	},
	{
		cast_id: 18,
		character: "Det. John Williams",
		credit_id: "52fe4277c3a36847f8020ddf",
		gender: 2,
		id: 11792,
		name: "George Dickerson",
		order: 6,
		profile_path:
			"https://image.tmdb.org/t/p/w185//htojA9mRgJ5vM1JeRNUshLNwzJ5.jpg"
	}
];

it("Changes the number of elements rendered when the window resizes", () => {
	let wrapper = mount(
		<SwipeRow eSize={eSize} list={list} listConfig={configObj} />
    );
    
    
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    // Trigger the window resize event.
    

	wrapper.unmount();
});
