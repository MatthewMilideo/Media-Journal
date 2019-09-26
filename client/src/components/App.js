import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";

import HomePage from "./Navigation/HomePage";
import SearchPage from "./Navigation/SearchPage";
import JournalHome from "./Navigation/JournalHome";
import MediaPage from "./Navigation/MediaPage";

import Styled from "styled-components";

import history from "../history";
import NavBar from "./NavBar";

const StyledContainer = Styled(Container)`
min-height: 100%;
`;

class App extends React.Component {
	render() {
		console.log(this.props);
		//console.log(history);
		return (
			<StyledContainer fluid className=" d-flex flex-column pl-0 pr-0">
				<Router basename={"client/build/"} history={history}>
					<div>
						<NavBar location={history.location.pathname} />
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
								<Route
									path={`${process.env.PUBLIC_URL}/Journal`}
									exact
									component={JournalHome}
								/>
								<Route
									path={`${process.env.PUBLIC_URL}/media/:type?/:id?`}
									exact
									component={MediaPage}
								/>
							</Switch>
						</Container>
					</div>
				</Router>
				<div className="flex-grow-1 mb-3"> </div>
				<Jumbotron fluid className="d-flex border-top mt-auto mt-5 mb-0 p-3">
					<span> Matthew Milideo 2019 </span>
					<span className="ml-auto">
						https://github.com/MatthewMilideo/Media-Journal
					</span>
				</Jumbotron>
			</StyledContainer>
		);
	}
}

export default App;
