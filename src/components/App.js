import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container} from "semantic-ui-react";

import Home from "./Navigation/Home";

import MediaPage from "./Navigation/MediaPage";

import history from "../history";
import "../styles/style.css";
import NavBar from "./NavBar";



class App extends React.Component {
	render() {
		return (
			<div className="main">
				<Router history={history}>
					<div>
						<NavBar />
						<Container>
						
							<Switch>
								<Route path="/" exact component={Home} />
								<Route path="/movie/:id" exact component={MediaPage} />
								<Route path="/TV/:id" exact component={MediaPage} />
								<Route path="/book/:id" exact component={MediaPage} />
								<Route path="/entries/" exact component={MediaPage} />
							</Switch>
							
						</Container>
						
					</div>
				</Router>
			</div>
		);
	}
}


export default App;
