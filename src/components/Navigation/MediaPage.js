import React from "react";
import { connect } from "react-redux";
import { Grid, Image, Button, Segment, Dropdown } from "semantic-ui-react";
import { fetchItem } from "../../actions";
import { getItemData } from "../../reducers";
import MovieData from "./MediaPageHelpers/MovieData";
import TVData from "./MediaPageHelpers/TVData";
import NoteManager from "../smallComponents/NoteManager";
import SwipeRow from "../smallComponents/SwipeRow";
import * as T from "../../actions/types";
import { sizeArr } from "../../setupGlobals";
import _ from "lodash";
import "../../styles/style.css";

class MediaPage extends React.Component {
	state = { size: -1, type: T.MOVIE, tag: null };

	componentDidMount() {
		window.addEventListener("resize", this.debounceOnResize, false);

		const { id, type } = this.props.match.params;
		this.props.fetchItem(type, id);
		this.setState({ type });
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
		return <MovieData movie= {movie} />;
	};

	renderTV = show => {
		return <TVData show = {show} />
	}

	handleClick = () => {
		this.setState({ castNum: this.state.castNum + 5 });
	};

	configureInputList = (list, configObj) => {
		if (!list) return;

		let localList = list.map(elem => {
			let image;
			elem[configObj.imageP2] === null
				? (image = configObj.imageD)
				: (image = `${configObj.imageP1}${elem[configObj.imageP2]}`);
			return {
				image: image,
				title1: configObj.text1,
				text1: elem[configObj.text1],
				title2: configObj.text2,
				text2: elem[configObj.text2],
				id: elem.ID
			};
		});
		////console.log((localList);
		return localList;
	};

	renderCast = cast => {
		if (Object.entries(cast).length === 0 && cast.constructor === Object) {
			return null;
		}

		// Formats input list so elems can be easily passed to SwipeRowElem

		const configObj = {
			imageP1: "https://image.tmdb.org/t/p/w185/",
			imageP2: "profile_path",
			imageD:
				"https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg",
			text1: "name",
			text2: "character",
			id: "cast_id"
		};
		cast = this.configureInputList(cast, configObj);

		return (
			<SwipeRow
				type={1}
				elemType="cast"
				rows={0}
				eSize={215}
				list={cast}
				listConfig={configObj}
				headerText="Cast"
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

		//console.log(('item data', this.props.itemData, type)
		let returnData; 
		if (type === T.MOVIE){
			//console.log(('type movie');
			returnData = this.renderMovie(this.props.itemData); 
		} 
		if (type === T.TV_SEASON){
			//console.log(('type show');
			returnData = this.renderTV(this.props.itemData); 
		}

		return (
			<div>
				<Segment inverted color="blue">
					{returnData}
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
