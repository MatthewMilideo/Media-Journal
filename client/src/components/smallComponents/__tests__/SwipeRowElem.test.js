import React from "react";
import { shallow} from "enzyme";

import SwipeRowElem from "../SwipeRowElem";
import { Segment, Item, Image } from "semantic-ui-react";

// Swipe Row Elem is passed a elem at render.
const mockElem1 = {
	image:
		"https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg",
	text1: "Hello",
	text2: "Hello2"
};

const mockSize0 = 0;
const mockSize1 = 1;

describe("Mobile version of SwipeRowElem", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = shallow(<SwipeRowElem elem={mockElem1} size={mockSize0} />);
	});
    
    it('Renders 1 List item' , () => {
        expect(wrapper.find(Item).length).toEqual(1);
    })

    it('Renders the image and text' , () => {
        expect(wrapper.find(Item.Image).prop('src')).toEqual('https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg');
        expect(wrapper.find(Item.Header).length).toEqual(2);
    })
});

describe("desktop version of SwipeRowElem", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = shallow(<SwipeRowElem elem={mockElem1} size={mockSize1} />);
	});
    
    it('Renders 1 Segment item' , () => {
        expect(wrapper.find(Segment).length).toEqual(1);
    })

    it('Renders the image and text' , () => {
        expect(wrapper.find(Image).prop('src')).toEqual('https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg');
        expect(wrapper.find('h2').length).toEqual(2);
        expect(wrapper.find('p').length).toEqual(2);
    })
});

