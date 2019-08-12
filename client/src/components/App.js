import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import Container from "react-bootstrap/Container";
//import Card from "react-bootstrap/Card";

import HomePage from "./Navigation/HomePage";
import SearchPage from "./Navigation/SearchPage";
import JournalHome from "./Navigation/JournalHome";
import MediaPage from "./Navigation/MediaPage";
import LoginPage from "./Navigation/LoginPage";


import history from "../history";
import "../styles/style.css";
import NavBar from "./NavBar";

class App extends React.Component {
	render() {
		//console.log(history);
		return (
			<Container fluid>
				<Container>
					<Router basename={"client/build/"} history={history}>
						<div>
							<NavBar />

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
									component={MediaPage}
								/>
								<Route
									path={`${process.env.PUBLIC_URL}/login`}
									exact
									component={LoginPage}
								/>
							</Switch>
						</div>
					</Router>
				</Container>
			</Container>
		);
	}
}

export default App;
