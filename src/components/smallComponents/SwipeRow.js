import React from "react";
import _ from "lodash";
import { Grid, Segment, Icon, Item, Button } from "semantic-ui-react";
import { sizeArr } from "../../setupGlobals";
import SwipeRowElem from "./SwipeRowElem";

// Props

// eSize: The size of the SwipeRowElem in pixels.
// list: The list of Elems that will make up the SwipeRowElems
// listConfig: The object to configure the list.
// Rows: Will this contain many rows or 1 rows.
// Type: Not sure of all the types I could pass here, but this is currently to differnetiate between swipe and
// not swipe row.

class SwipeRow extends React.Component {
	state = {
		size: -1,
		firstElem: 0,
		lastElem: 0,
		numElems: 0,
		list: []
	};

	componentWillMount() {
		this.onResize();
	}

	componentDidMount() {
		window.addEventListener("resize", this.debounceOnResize, false);
		this.configureInputList(this.props.list, this.props.listConfig);
	}

	componentDidUpdate(prevProps) {
		if (this.props.list !== prevProps.list)
			this.configureInputList(this.props.list, this.props.listConfig);
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
					let numElems = Math.floor(curSize / this.props.eSize);
					if (numElems === 0) numElems = 5;
					this.setState({
						size: i,
						lastElem: this.state.firstElem + numElems,
						numElems: numElems
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
				cast_id: elem.cast_id
			};
		});
		//console.log(localList);

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
		let { firstElem, lastElem, numElems } = this.state;
		if (firstElem - numElems < 0) {
			this.setState({ firstElem: 0, lastElem: numElems });
			return;
		}
		this.setState({
			firstElem: firstElem - numElems,
			lastElem: lastElem - numElems
		});
	};

	handleRightClick = (e, flag) => {
		let { firstElem, lastElem, numElems } = this.state;
		let len = this.props.list.length;
		if (lastElem + numElems > len) {
			this.setState({ lastElem: len, firstElem: len - numElems });
			return;
		}
		this.setState({
			lastElem: lastElem + numElems,
			firstElem: firstElem + numElems
		});
	};

	buildforRow = list => {
		const { firstElem, lastElem } = this.state;
		list = list.slice(firstElem, lastElem);

		let elems = list.map(elem => {
			return (
				<Grid.Column key={elem.cast_id}>
					<SwipeRowElem key={elem.cast_id} elem={elem} />
				</Grid.Column>
			);
		});
		return elems;
	};

	buildLists = (list, newSize) => {
		if (newSize <= 0 || list.length <= 0) return [];
		let lists2 = [];
		for (let i = 0; i < list.length; i += newSize) {
			let tempList = [];
			for (let j = 0; j < newSize; j++) {
				if (i + j < list.length) tempList.push(list[i + j]);
			}
			lists2.push(tempList);
		}
		return lists2;
	};

	buildforRows = (list, firstElem, lastElem, numElems) => {
		let lists = this.buildLists(list, numElems);
		lists = lists.map(list => {
			return (
				<Grid.Row stretched>
					{list.map(elem => {
						return (
							<Grid.Column key={elem.cast_id}>
								<SwipeRowElem elem={elem} />
							</Grid.Column>
						);
					})}
				</Grid.Row>
			);
		});
		return lists;
	};

	// Render
	renderRowMobile() {
		let { lastElem, numElems, list } = this.state;
		list = list.slice(0, lastElem);
		return (
			<Segment>
				<Item.Group divided>
					{list.map(elem => (
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

	renderRow() {
		//console.log(" in render swipe row");
		return (
			<Segment>
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

	renderRows() {
		return (
			<Segment>
				<Grid stackable columns="equal">
					{this.buildforRows(this.state.list, null, null, this.state.numElems)}
				</Grid>
			</Segment>
		);
	}

	render() {
		//console.log("props b4", this.props);

		if (this.state.list.length === 0) {
			return null;
		}
		//console.log("props", this.props);
		return this.state.size > 0
			? this.props.rows
				? this.renderRows()
				: this.renderRow()
			: this.renderRowMobile();
	}
}
export default SwipeRow;

export const RowList = (list, configObj) => {
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
			cast_id: elem.cast_id
		};
	});
	this.setState({ list: localList });
};
