import React from "react";
import { connect } from "react-redux";

import { MOVIE } from "../../actions/types";

import { Grid, Image, Button, Segment, Divider } from "semantic-ui-react";
import { fetchItem } from "../../actions";
import { getItemData } from "../../reducers";
import NoteManager from "../smallComponents/NoteManager";
import SwipeRow from "../smallComponents/SwipeRow";

class MediaPage extends React.Component {
	state = { noteCount: 1, type: "movie", castlist: [], castNum: 5 };

	componentDidMount() {
		let id = this.props.match.params.id;
		//console.log('mounted');
		this.props.fetchItem(MOVIE, id);
	}

	componentDidUpdate(prevProps) {
		if (this.props.curNotes !== prevProps.curNotes) {
			this.setState({
				noteCount: this.state.noteCount + this.props.curNotes.length
			});
		}

		if (this.props.curItem !== prevProps.curItem) {
			this.genCast(this.props.curItem.cast);
		}
	}

	renderMedia = media => {
		return (
			<Grid stackable>
				<Grid.Row stretched>
					<Grid.Column width={5}>
						<Segment raised>
							<Image src={media.largeImage} />
						</Segment>
					</Grid.Column>

					<Grid.Column divided="vertically" width={7}>
						<Segment>
							<h1> {media.title} </h1>
							<Divider />
							<h4> Overview </h4>
							<p> {media.overview} </p>
						</Segment>
					</Grid.Column>
					<Grid.Column divided="vertically" width={4}>
						<Segment>
							<h2> Notable Facts </h2>
							<Divider />
							<div>
								Released {media.release_date}
								<br />
								Budget: {media.budget}
								<br />
								Revenue: {media.revenue}
								<br />
								Runtime: {media.runtime} minutes.
							</div>
						</Segment>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	};

	genCast = cast => {
		let castlist = cast.map((member, index) => {
			member.profile_path === null
				? (member.profile_path =
						"https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg")
				: (member.profile_path = `https://image.tmdb.org/t/p/w185/${
						member.profile_path
				  }`);

			return (
				<Segment key={member.cast_id}>
					<Image src={member.profile_path} />
					Charachter: {member.character}
					<br />
					Name: {member.name}
					<br />
					<Button> Add Tag </Button>
				</Segment>
			);
		});
		this.setState({ castlist: castlist });
	};

	handleClick = () => {
		this.setState({ castNum: this.state.castNum + 5 });
	};

	renderCast = cast => {
		if (Object.entries(cast).length === 0 && cast.constructor === Object) {
			return null;
		}

		const configObj = {
			imageP1: "https://image.tmdb.org/t/p/w185/",
			imageP2: "profile_path",
			imageD:
				"https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg",
			text1: "name",
			text2: "character"
		};

		return (
			<SwipeRow
				type={0}
				rows={1}
				eSize={215}
				list={cast.cast}
				listConfig={configObj}
			/>
		);
	};


	render() {
		if (
			Object.keys(this.props.itemData).length === 0 &&
			this.props.itemData.constructor === Object
		)
			return null;

		const { id, type } = this.props.itemData;

		return (
			<div>
				<Segment inverted color="olive">
					{this.renderMedia(this.props.itemData)}
					<NoteManager cID={id} type={type} />
				</Segment>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		itemData: getItemData(state)
	};
};

export default connect(
	mapStateToProps, //mapDispatchToProps
	{
		fetchItem
	}
)(MediaPage);
