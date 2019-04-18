import React from "react";
import { connect } from "react-redux";
import { Grid, Image, Button, Segment, Divider } from "semantic-ui-react";
import { fetchItem } from "../../actions";
import { getItemData } from "../../reducers";
import NoteManager from "../smallComponents/NoteManager";
import SwipeRow from "../smallComponents/SwipeRow";
import * as T from '../../actions/types'
import { sizeArr } from "../../setupGlobals";
import _ from "lodash";
import "../../styles/style.css";

class MediaPage extends React.Component {
	state = { size: -1, type: T.MOVIE, tag: null, castlist: [], castNum: 5 };

	componentDidMount() {
		window.addEventListener("resize", this.debounceOnResize, false);

		const { id, type } = this.props.match.params;
		this.props.fetchItem(type, id);
		this.setState({type});
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

	componentWillUnmount() {
		window.removeEventListener("resize", this.debounceOnResize, false);
	}

	// Finds the container size by comparing window size to max breakpoints from Semantic UI.
	// Sets container size and uses it to determine the number of elemnts that can fit in the
	// Swipe Row component. Size is currently predetermined.
	onResize = e => {
		let curSize = window.innerWidth;
		for (let i = 0; i < sizeArr.length; i++) {
			if (curSize <= sizeArr[i].max) {
				if (this.state.size !== i) {
					curSize = sizeArr[i].min;
					this.setState({
						size: i
					});
				}
				break;
			}
		}
	};

	debounceOnResize = _.debounce(() => this.onResize(), 200);

	renderMovie = movie => {
		return (
			<Grid equal stackable>

				<Grid.Row verticalAlign="top">
					<Grid.Column width={6}>
						<Image src={movie.largeImage} />
					</Grid.Column>
					<Grid.Column divided="vertically" width={10}>
						<Grid.Row>
							<Segment compact>
								<div className="title-div">
									<h1 className="media-title"> {movie.title} </h1>
									<span className="media-title-descriptor">
										<h5>  Released: {movie.release_date} </h5> | <h5> Runtime: {movie.runtime} minutes</h5>
										
									</span>
								</div>
								<Divider className="divide" />
								<h4 className="mainH1"> Overview </h4>
								<p className="overview"> {movie.overview} </p>
								<span className="media-title-descriptor">
									Budget: $ {movie.budget}| Revenue: $ {movie.revenue}
								</span>
								<h4 className="mainH1"> Genres </h4>
								{movie.genres.map(genre => {
									return (
										<div className="thisDiv">
											<span>{genre.name},</span>
										</div>
									);
								})}
							</Segment>
						</Grid.Row>
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
				type={1}
				rows={0}
				eSize={215}
				list={cast}
				listConfig={configObj}
				headerText ='Cast'
			/>
		);
	};

	render() {
		console.log(this.state);
		if (
			Object.keys(this.props.itemData).length === 0 &&
			this.props.itemData.constructor === Object
		)
			return null;

		const { id, type } = this.props.itemData;

		return (
			<div>
				<Segment inverted color="blue">
					{this.renderMovie(this.props.itemData)}
					{this.renderCast(this.props.itemData.cast)}
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
