import React from "react";

import debounce from "lodash/debounce";

import styled from "styled-components";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { breakpoints } from "../../actions/types";

/* Props: 
Media: All of the media that is past to the carousel. 
    This is probable actors, but could be anything.  
*/

const StyledCard = styled(Card)`

    height: 100%; 

	:hover {
		box-shadow: 5px 10px;
	}
`;

const StyledDiv = styled.div`
	display: flex;
`;

const StyledRow = styled(Row)`
	width: 100%;
`;

const StyledCol = styled(Col)`
    height: 350px; 
`;

class ActorCarousel extends React.Component {
	state = { start: 0, stateSize: -1 };
	numElems = [0, 2, 3, 4, 4];

	componentDidMount() {
		window.addEventListener("resize", this.debounceOnResize, false);
		this.onResize();
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.debounceOnResize, false);
	}

	// Finds the container size by comparing window size to max breakpoints from Bootstrap
	// Sets container size and uses it to determine the number of elemnts that can fit in the
	onResize = e => {
		const { arr } = breakpoints;

		let winSize = window.innerWidth;
		for (let i = 0; i < arr.length; i++) {
			console.log(winSize, arr[i]);
			if (winSize <= arr[i]) {
				console.log(this.state.stateSize, i);
				if (this.state.stateSize === i) break;

				this.setState({
					stateSize: i
				});
				break;
			}
		}
	};

	debounceOnResize = debounce(() => this.onResize(), 200);

	onRightClick = () => {
		let { stateSize, start } = this.state;
		if (start + this.numElems[stateSize] < this.props.media.length)
			this.setState({ start: start + this.numElems[stateSize] });
	};

	onLeftClick = () => {
		let { stateSize, start } = this.state;
		if (start - this.numElems[stateSize] >= 0)
			this.setState({ start: start - this.numElems[stateSize] });
	};

	renderRow() {
		if (this.state.stateSize !== -1) {
			const { media } = this.props;
			const { start, stateSize } = this.state;
			let end = start + this.numElems[stateSize];
			if (end > media.length) end = media.length;
			let returnArr = [];
			for (let i = start; i < end; i++) {
				returnArr.push(
					<StyledCol className="mt-3" xs={0} sm={6} md={4} lg={3} xl={3}>
						<StyledCard key={media[i].id}>
							<Card.Img variant="top" src={media[i].image} />
							<Card.Title>
								{media[i].text1} <br /> {media[i].text2}{" "}
							</Card.Title>
						</StyledCard>
					</StyledCol>
				);
			}
			return returnArr;
		}
		return null;
	}

	render() {
		console.log(this.state);
		return (
			<StyledDiv>
				<span onClick={this.onLeftClick} className="oi oi-chevron-left" />
				<StyledRow> {this.renderRow()} </StyledRow>
				<span onClick={this.onRightClick} className="oi oi-chevron-right" />
			</StyledDiv>
		);
	}
}

export default ActorCarousel;
