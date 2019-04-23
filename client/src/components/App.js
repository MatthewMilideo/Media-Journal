import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container} from "semantic-ui-react";

import SearchPage from './Navigation/SearchPage';
import JournalHome from './Navigation/JournalHome'
import MediaPage from "./Navigation/MediaPage";

import history from "../history";
import "../styles/style.css";
import NavBar from "./NavBar";



class App extends React.Component {
	render() {
		return (
			<div className="main">
				<Router basename = {'client/build/'} history={history}>
					<div>
						<NavBar />
						<Container className = 'main-container'>
						
							<Switch>
								<Route path= {`${process.env.PUBLIC_URL}/`} exact component={SearchPage} />
								<Route path= {`${process.env.PUBLIC_URL}/media/:type?/:id?`} exact component={MediaPage} />
								<Route component={JournalHome} />
							</Switch>
							
						</Container>
						
					</div>
				</Router>
			</div>
		);
	}
}


export default App;
