import React from "react";
import { connect } from "react-redux";
import { fetchItem } from "../../actions";
import { getItemData } from "../../reducers";
import MovieData from "./MediaPageHelpers/MovieData";
import TVData from "./MediaPageHelpers/TVData";
import BookData from './MediaPageHelpers/BookData';
import NoteManager from "../smallComponents/NoteManager";
import ActorCarousel from '../smallComponents/ActorCarousel';


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
		this.props.fetchItem(type, id);
		this.setState({ type, id });
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

	renderBook = book => {
		return <BookData book = {book} />
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
		//////console.log((localList);
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
			text3: 'subtitle',
			id: "cast_id"
		};
		cast = this.configureInputList(cast, configObj);

		return (
			<ActorCarousel media = {cast} />
		);
	};


	render() {
	
		if (
			Object.keys(this.props.itemData).length === 0 &&
			this.props.itemData.constructor === Object
		)
			return null;

		const {id,} = this.state;
		const { type, title} = this.props.itemData;
		//console.log('id', id);

		////console.log(('item data', this.props.itemData, type)
		let returnData; 
		let cast = null; 
		if (type === T.MOVIE){
			////console.log(('type movie');
			returnData = this.renderMovie(this.props.itemData);
			cast =  this.renderCast(this.props.itemData.cast);
		} 
		if (type === T.TV_SEASON){
			////console.log(('type show');
			returnData = this.renderTV(this.props.itemData);
			cast =  this.renderCast(this.props.itemData.cast);
		}

		if (type === T.BOOK){
			////console.log(('type show');
			returnData = this.renderBook(this.props.itemData); 
		}

		return (
			<div>
				
					{returnData}
					{cast}
					<NoteManager title = {title} cID={id} type={type} />
			
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
