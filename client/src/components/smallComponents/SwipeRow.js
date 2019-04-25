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
// Elem Type: cast
// Header Text:

class SwipeRow extends React.Component {
	state = {
		windowSize: -1,
		rowSize: 0,
		rows: [],
		rowsPos: 0
	};

	componentDidMount() {
		window.addEventListener("resize", this.debounceOnResize, false);
		this.onResize();
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.debounceOnResize, false);
	}

	// Finds the container size by comparing window size to max breakpoints from Semantic UI.
	// Sets container size and uses it to determine the number of elemnts that can fit in the
	// Swipe Row component. Size is currently predetermined.
	onResize = e => {
		let winSize = window.innerWidth;
		for (let i = 0; i < sizeArr.length; i++) {
			
			if (winSize <= sizeArr[i].max && this.state.windowSize !== i) {
				if ( i > 0  &&  winSize >=  sizeArr[i-1].max || i === 0) {
				////console.log(("winSize", winSize, 'sizeArr', sizeArr[i].max );
				winSize = sizeArr[i].min;
				let rowSize = Math.floor(winSize / this.props.eSize);
				if (rowSize === 0 && this.props.type === false) rowSize = 5;
				if (rowSize === 0 && this.props.type === true) rowSize = 1;
				let rows = this.buildRowLists(rowSize);

				let rowsPos = this.state.rowsPos
				if (this.state.rowsPos > rows.length -1) rowsPos = rows.length -1

				this.setState({
					windowSize: i,
					rowSize: rowSize,
					rows: rows,
					rowsPos
				});
				break;
			}
			}
		}
	};

	debounceOnResize = _.debounce(() => this.onResize(), 200);

	buildRowLists = rowSize => {
		let list = this.props.list;
		if (rowSize <= 0 || list.length <= 0) return [];
		let stateLists = [];
		for (let i = 0; i < list.length; i += rowSize) {
			let tempList = [];
			for (let j = 0; j < rowSize; j++) {
				if (i + j < list.length) tempList.push(list[i + j]);
				if (i + j >= list.length) tempList.push(null);
			}
			stateLists.push(tempList);
		}
		return stateLists;
	};

	// These two functions build the left and right buttons respectively.
	// I tried to make one function, but I think this ended up being cleaner.
	buildLeftButton = () => {
		return (
			<Grid.Column verticalAlign="middle" width={1}>
				{this.state.rowsPos === 0 ? (
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
				{this.state.rowsPos === this.state.rows.length - 1 ? (
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
		let { rows, rowsPos } = this.state;
		if (rowsPos === 0) {
			return;
		}
		this.setState({
			rowsPos: rowsPos - 1
		});
	};

	handleRightClick = () => {
		let { rows, rowsPos } = this.state;
		////console.log((rowsPos, rows.length);
		////console.log((rows);
		if (rowsPos < rows.length - 1) {
			this.setState({
				rowsPos: rowsPos + 1
			});
		}
	};

	// Easily extensible to include any number of rows.
	buildRows = num => {
		const { rows, rowsPos } = this.state;
		let returnData = null;
		if (num === 1) {
			returnData = rows[rowsPos].map((elem, index) => {
				if (elem === null){
					return( <Grid.Column key = {index} > </Grid.Column>)
				}
				return (
					<Grid.Column key={elem.id}>
						 <SwipeRowElem type = {this.props.elemType} key={elem.id} elem={elem}  /> 
					</Grid.Column>
				);
			});
			return returnData;
		}
		returnData = rows.map((list, index) => {
			return (
				<Grid.Row key = {index} stretched>
					{list.map( (elem, index) => {
						if (elem === null){
							return( <Grid.Column key = {index}> </Grid.Column>)
						}
						
						return (
							<Grid.Column key={elem.id}>
								<Link to={`/media/${this.props.cType}/${elem.id}`}>
									<SwipeRowElem type = {this.props.elemType} key = {elem.id} elem={elem} />
								</Link>
							</Grid.Column>
						);
					})}

				</Grid.Row>
			);
		});
		return returnData;
	};
	// needs fixing
	renderRowMobile() {
		let { rows, rowsPos } = this.state;
		return (
			<Segment>
					
				<Item.Group divided>
					{rows[rowsPos].map(elem => (
						<Link to={`/media/${this.props.cType}/${elem.id}`}>	
						<SwipeRowElem type = {this.props.elemType} key={elem.id} elem={elem} size={0} />
						</Link>
					))}
				</Item.Group>
				
			</Segment>
		);
	}

	render() {
		if (this.state.rows.length === 0) {
			return null;
		}
		//console.log('prop list:' , this.props.list)

		let returnData =
			this.state.windowSize > 0
				? this.props.rows
					? this.buildRows(-1)
					: this.buildRows(1)
				: this.renderRowMobile();

		return (
			<div> 
				{this.props.headerText? <h1> {this.props.headerText} </h1> : null }
				
				<Grid stackable columns="equal">
					{this.props.type ? this.buildLeftButton() : null}
					{returnData}
					{this.props.type ? this.buildRightButton() : null}
				</Grid>
			</div>
		);
	}
}
export default SwipeRow;
