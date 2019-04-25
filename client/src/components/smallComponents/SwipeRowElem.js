import React from "react";
import { Segment, Image, Item, Grid } from "semantic-ui-react";

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

	renderCast = elem => {
		let data = null;
		if (elem.text2 === "" && elem.text1 !== "")
			data = <p className={styles.maxLines}> {elem.text1} </p>;
		if (elem.text1 === "" && elem.text2 !== "")
			data = <p className={styles.maxLines}>{elem.text2} </p>;
		if (elem.text1 !== "" && elem.text2 !== "") {
			data = (
				<React.Fragment>
					
					<p className={styles.maxLines}>{elem.text2} </p>
					<p className={styles.maxLines}> played by: </p>
					<p className={styles.maxLines}> {elem.text1} </p>
				</React.Fragment>
			);
		}

		return (
			<Segment className={styles.SwipeRowElemSeg} raised>
				<div className={styles.wrapImage}>
					<Image className={styles.segmentImage} src={elem.image} />
				</div>

				<Segment className={styles.innerSegment} inverted color="blue">
					{data}
				</Segment>
			</Segment>
		);
	};

	renderSearch = elem => {
		console.log(elem);
		return (
			<Segment className={styles.SwipeRowElemSeg2}>
				<img className={styles.searchImage} src={elem.image} />
				<Segment inverted color ='blue' >
					<div className={styles.redDiv}>
					<p> {`${elem.text1}`} </p>
					{elem.text3 === undefined ? null : <p className = 'subtitle'> : {elem.text3} </p>}
						
					
					</div>
				</Segment>
			</Segment>
		);
	};

	render() {
		const { elem, type } = this.props;
		////console.log((type);
		if (type === "cast") {
			return this.renderCast(elem);
		} else {
			return this.renderSearch(elem);
		}
	}
}

export default SwipeRowElem;
