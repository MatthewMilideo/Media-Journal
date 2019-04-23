import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import Root from "./root";
import App from "./components/App";

ReactDOM.render(
	
		<Root>
            <BrowserRouter>
			<App />
            </BrowserRouter>
		</Root>
	,
	document.querySelector("#root")
);
