import React from "react";
import _ from "lodash";
import { Grid, Segment, Icon, Item, Button, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { sizeArr } from "../../setupGlobals";
import SwipeRowElem from "./SwipeRowElem";

// Props

// eSize: The size of the SwipeRowElem in pixels.
// list: The list of Elems that will make up the SwipeRowElems
// listConfig: The object to configure the list.
// Rows: Will this contain many rows or 1 rows.
// Type: Not sure of all the types I could pass here, but this is currently to differnetiate between swipe and
// not swipe row.
// Header Text:

class SwipeRow extends React.Component {
	state = {
		size: -1,
		firstElem: 0,
		lastElem: 0,
		numElems: 0,
		listsPos: 0, 
		list: [],
		lists: []
	};

	componentDidMount() {
		window.addEventListener("resize", this.debounceOnResize, false);
		
		this.configureInputList(this.props.list, this.props.listConfig);
		this.onResize();
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.debounceOnResize, false);
	}

	// Finds the container size by comparing window size to max breakpoints from Semantic UI.
	// Sets container size and uses it to determine the number of elemnts that can fit in the
	// Swipe Row component. Size is currently predetermined.
	onResize = e => {
		console.log('in reseize');
		let curSize = window.innerWidth;
		for (let i = 0; i < sizeArr.length; i++) {
			if (curSize <= sizeArr[i].max) {
				if (this.state.size !== i) {
					curSize = sizeArr[i].min;
					let numElems = Math.floor(curSize / this.props.eSize);
					if (numElems === 0) numElems = 5;

					

					this.setState({
						size: i,
						lastElem: this.state.firstElem + numElems,
						numElems: numElems,
						lists:  stateLists
					});
				}
				break;
			}
		}
	};

	debounceOnResize = _.debounce(() => this.onResize(), 200);

	// Formats input list so elems can be easily passed to SwipeRowElem
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
				cast_id: elem.cast_id,
				id: elem.ID
			};
		});

		this.setState({ list: localList });
	};

	// These two functions build the left and right buttons respectively.
	// I tried to make one function, but I think this ended up being cleaner.
	buildLeftButton = () => {
		return (
			<Grid.Column verticalAlign="middle" width={1}>
				{this.state.firstElem === 0 ? (
					<Icon
						fitted
						name="angle left"
						size="big"
						disabled
						onClick={this.handleLeftClick}
					/>
				) : (
					<Icon
						fitted
						name="angle left"
						size="big"
						onClick={this.handleLeftClick}
					/>
				)}{" "}
			</Grid.Column>
		);
	};

	buildRightButton = () => {
		return (
			<Grid.Column verticalAlign="middle" width={1}>
				{this.state.lastElem === this.props.list.length ? (
					<Icon
						fitted
						name="angle right"
						size="big"
						disabled
						onClick={this.handleRightClick}
					/>
				) : (
					<Icon
						fitted
						name="angle right"
						size="big"
						onClick={this.handleRightClick}
					/>
				)}
			</Grid.Column>
		);
	};

	// These two function handles pressing left or right buttons on the SwipeRow

	handleLeftClick = () => {
		let { lists, listsPos } = this.state;
		if (listsPos === 0) {
			return;
		}
		this.setState({
			listsPos: listsPos - 1
		});
	};

	handleRightClick = () => {
		let { lists, listsPos } = this.state;
		console.log(listsPos, lists.length)
		console.log(lists);
		if (listsPos < lists.length-1) {
			this.setState({
				listsPos: listsPos + 1
			});
		}
		
	};

	buildforRow = list => {
		const { lists, listsPos } = this.state;
		let elems  = lists[listsPos].map(elem => {
			return (
				<Grid.Column key={elem.cast_id}>
					<SwipeRowElem key={elem.cast_id} elem={elem} />
				</Grid.Column>
			);
		});
		return elems;
	};

	buildforRows = (list, numElems) => {
		let lists = this.state.lists;
		lists = lists.map(list => {
			return (
				<Grid.Row stretched>
					{list.map(elem => {
						console.log(elem);
						return (
							<Grid.Column key={elem.cast_id}>
								<Link to={`/media/${this.props.cType}/${elem.id}`}>
									<SwipeRowElem elem={elem} />
								</Link>
							</Grid.Column>
						);
					})}
				</Grid.Row>
			);
		});
		return lists;
	};

	// Needs Fixing 
	renderRowMobile() {
		let { lastElem, numElems, lists } = this.state;
		return (
			<Segment>
				<Item.Group divided>
					{lists.map(elem => (
						<SwipeRowElem key={elem.cast_id} elem={elem} size={0} />
					))}
				</Item.Group>
				<Button
					onClick={() => this.setState({ lastElem: lastElem + numElems })}
				>
					{" "}
					More Actors
				</Button>
			</Segment>
		);
	}

	// Render when there is a single row.
	renderRow() {
		console.log(" in render swipe row");
		return (
			<Segment>
				<h1> {this.props.headerText} </h1>
				<Divider />
				<Grid stackable columns="equal">
					<Grid.Row stretched>
						{this.props.type ? this.buildLeftButton() : null}
						{this.buildforRow(this.state.list)}
						{this.props.type ? this.buildRightButton() : null}
					</Grid.Row>
				</Grid>
			</Segment>
		);
	}

	// Render when there are multipule rows.
	renderRows() {
		return (
			<Segment>
				<Grid stackable columns="equal">
					{this.buildforRows(this.state.list, this.state.numElems)}
				</Grid>
			</Segment>
		);
	}

	render() {
		console.log(state);
		if (this.state.lists.length === 0) {
			return null;
		}

		return this.state.size > 0
			? this.props.rows
				? this.renderRows()
				: this.renderRow()
			: this.renderRowMobile();
	}
}
export default SwipeRow;
