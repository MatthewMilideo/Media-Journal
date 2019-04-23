import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router";
import { Menu } from "semantic-ui-react";
import NavBar from "../components/NavBar";

let wrapper;

beforeEach(() => {
	wrapper = mount(
		<MemoryRouter>
			<NavBar />
		</MemoryRouter>
	);
});

afterEach(() => {
	wrapper.unmount();
});

it("Renders 4 Menu Items", () => {
	expect(wrapper.find(Menu.Item).length).toEqual(4);
});

it("starts with one menu item active", () => {
	expect(
		wrapper.find(Menu.Item).someWhere(item => item.prop("active"))
	).toEqual(true);
});

it("changes active item on click", () => {
	wrapper.find(Menu.Item).forEach((item, index) => {
		item.simulate("click");
		expect(
			wrapper
				.find(Menu.Item)
				.at(index)
				.prop("active")
		).toEqual(true);
	});
});
