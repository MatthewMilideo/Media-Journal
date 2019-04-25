import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container, Segment } from "semantic-ui-react";

import HomePage from "./Navigation/HomePage";
import SearchPage from "./Navigation/SearchPage";
import JournalHome from "./Navigation/JournalHome";
import MediaPage from "./Navigation/MediaPage";

import history from "../history";
import "../styles/style.css";
import NavBar from "./NavBar";

class App extends React.Component {
	render() {
		//console.log(history);
		return (
			<div className="main">
				<Router basename={"client/build/"} history={history}>
					<div>
						<NavBar />
						
						<Container className="main-container">
						<Segment secondary> 
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
									path={`/Journal`}
									exact
									component={JournalHome}
								/>
								<Route
									path={`${process.env.PUBLIC_URL}/media/:type?/:id?`}
									exact
									component={MediaPage}
								/>
							</Switch>
							</Segment>
						</Container>
					</div>
				</Router>
			</div>
		);
	}
}

export default App;
