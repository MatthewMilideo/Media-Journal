import React from "react";
import { Segment, Image, Item } from "semantic-ui-react";

import AddTagButton from './AddTagButton'

import "../../styles/style.css";
import styles from "../../styles/SwipeRowElem.module.css";

const render = (elem) => {
    return(
    
       <Segment raised>
        <div className={styles.segmentHeight}>
            <Image className={styles.segmentImage} src={elem.image} />
            <h2 className = {styles.title}> {elem.title1}: </h2> 
            <p className = {styles.title}> {elem.text1} </p>
            <h2 className = {styles.title}> {elem.title2}: </h2>
            <p className = {styles.title}> {elem.text2} </p>
            <AddTagButton type= 'Actor' tag = {elem.text1} />
        </div>
    </Segment>)
    
}

const renderMobile =  (elem) => {
  
   return(
        <Item>
			<Item.Image className={styles.test} src={elem.image} />
			<Item.Header > Actor: {elem.text1} </Item.Header>
            <Item.Header > Charachter: {elem.text2} </Item.Header>
		</Item>)
    
}

const SwipeRowElem = props => {
	const { elem, size } = props;

    return size !== 0 ?  render(elem) : renderMobile(elem)

};

export default SwipeRowElem;
