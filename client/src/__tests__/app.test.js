import React from "react";
import { shallow, render, mount } from "enzyme";
import { MemoryRouter } from "react-router";

import Root from "../root";
import App from "../components/App";
import NavBar from "../components/NavBar";
import Home from "../components/Navigation/Home";
import MediaPage from "../components/Navigation/MediaPage";

let wrapper;

it("renders the navbar and homepage given / ", () => {
	wrapper = mount(
		<Root>
			<MemoryRouter initialEntries={["/"]}>
				<App />
			</MemoryRouter>
		</Root>
	);

	expect(wrapper.find(NavBar).length).toEqual(1);
	expect(wrapper.find(Home).length).toEqual(1);
	wrapper.unmount();
});
