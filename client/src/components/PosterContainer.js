import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { Container, Item, Button} from "semantic-ui-react";

import { fetchNextPage} from "../actions";
import MediaPoster from "./MediaPoster";


class PosterContainer extends React.Component {
	state = { size: null, cols: null, maxWidth: null };

	componentDidMount() {
		window.addEventListener("scroll", this.onScroll, false);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.onScroll, false);
	}


	onScroll = () => {
	};
	throttleOnScroll = _.throttle(this.onScroll, 500);

	createPosterList = media => {
		if (!media) {
			return <div>Please search for a . </div>;
		} else if (media.length === 0) {
			return <div> Not found, please search for another.</div>;
		} else {
			let posterList = media.map(poster => {
				if (poster.largeImage === null)
					poster.largeImage =
						"https://react.semantic-ui.com/images/wireframe/image.png";
				return (
				<MediaPoster size="small" media={poster} key = {poster.ID} />
				);
			});
			return posterList;
		}
	};

	onClickMoreContent = e => {
		this.props.fetchNextPage();
	};

	render() {
		//console.log((this.props.content)

		return (
			<Container>
				<Item.Group divided>
					{this.createPosterList(this.props.content)}
				</Item.Group>
				<Button onClick = { this.onClickMoreContent }> Get More Content </Button>
			</Container>
		);
	}
}

export default connect(
	null,
	{ fetchNextPage }
)(PosterContainer);
