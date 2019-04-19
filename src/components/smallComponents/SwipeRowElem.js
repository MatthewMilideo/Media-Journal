import React from "react";
import { Segment, Image, Item, Grid } from "semantic-ui-react";

import AddTagButton from "./AddTagButton";

import "../../styles/style.css";
import styles from "../../styles/SwipeRowElem.module.css";

/* Props
Type: The type of swipe row elem being displayed. 

*/

class SwipeRowElem extends React.Component {
	state = { hovered: false };

	renderMobile = elem => {
		return (
			<Item>
				<Item.Image className={styles.test} src={elem.image} />
				<Item.Header> Actor: {elem.text1} </Item.Header>
				<Item.Header> Charachter: {elem.text2} </Item.Header>
			</Item>
		);
	};

	render() {
		const { elem } = this.props;
		return (
			<Segment className = {styles.SwipeRowElemSeg} raised>
					<div className={styles.wrapImage}>
						<Image className={styles.segmentImage} src={elem.image} />
					</div>

					<Segment className={styles.innerSegment} inverted color="red">
						<div className={styles.redDiv}>
                            <p >{elem.text2} </p>
							<p > played by: </p>
                            <p > {elem.text1} </p>
							<div className = {styles.tagButton}> 
							    <button className = {styles.buttonTest}> </button>
                            </div>
						</div>
					</Segment>
				
			</Segment>
		);
	}
}

export default SwipeRowElem;
