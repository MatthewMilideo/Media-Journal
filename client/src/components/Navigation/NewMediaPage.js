import React from "react";
import { connect } from "react-redux";
import { getItem } from "../../actions";
import { getItemData, getUser } from "../../reducers";
import MovieData from "./MediaPageHelpers/MovieData";
import TVData from "./MediaPageHelpers/TVData";
import BookData from "./MediaPageHelpers/BookData";
import NoteManager from "../smallComponents/NoteManager";
import ActorCarousel from "../smallComponents/ActorCarousel";

import * as T from "../../actions/types";
import { sizeArr } from "../../setupGlobals";
import _ from "lodash";
import "../../styles/style.css";

/* Renders a specific piece of media */

class MediaPage extends React.Component {
	state = { size: -1, type: T.MOVIE, tag: null };

	componentDidMount() {
		window.addEventListener("resize", this.debounceOnResize, false);
		const { id, type } = this.props.match.params;
		this.props.getItem(this.props.User.user_id, id, type);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.debounceOnResize, false);
	}

	// Finds the container size by comparing window size to max breakpoints from Semantic UI.
	// Sets container size and uses it to determine the number of elemnts that can fit in the
	// Swipe Row component. Size is currently predetermined.
	onResize = e => {};

	debounceOnResize = _.debounce(() => this.onResize(), 200);

	render() {
		return <div> Hallo </div>;
	}
}

const mapStateToProps = state => {
	return {
		User: getUser(state),
		itemData: getItemData(state)
	};
};

export default connect(
	mapStateToProps,
	{ getItem }
)(MediaPage);
