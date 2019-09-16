import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import Container from "react-bootstrap/Container";
//import Card from "react-bootstrap/Card";

import HomePage from "./Navigation/HomePage";
import SearchPage from "./Navigation/SearchPage";
import JournalHome from "./Navigation/JournalHome";
import NewMediaPage from "./Navigation/NewMediaPage";

import styled from "styled-components";
import image from "../video-camera.svg";

import history from "../history";
import NavBar from "./NavBar";

const SContainer = styled(Container)`
	background-image: url(${image});
`;

class App extends React.Component {
	render() {
		//console.log(history);
		return (
			<SContainer fluid className="pl-0 pr-0">
				<Router basename={"client/build/"} history={history}>
					<div>
						<NavBar />
						<Container className="mt-3 bg-white">
							<Switch>
								<Route
									path={`${process.env.PUBLIC_URL}/Home`}
									exact
									component={HomePage}
								/>
								<Route
									path={`${process.env.PUBLIC_URL}/`}
									exact
									component={SearchPage}
								/>
								<Route path={`/Journal`} exact component={JournalHome} />
								<Route
									path={`${process.env.PUBLIC_URL}/media/:type?/:id?`}
									exact
									component={NewMediaPage}
								/>
							</Switch>
						</Container>
					</div>
				</Router>
			</SContainer>
		);
	}
}

export default App;
