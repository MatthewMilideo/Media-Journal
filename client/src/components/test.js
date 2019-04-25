import React from 'react'
import * as T from '../actions/types';
import SwipeRow from './smallComponents/SwipeRow';
import { Container, Menu, Segment, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { getSearch } from '../reducers';
import { fetchNextPage } from "../actions";

const configureInputList = (list, configObj) => {
    if (!list) return;

    let localList = list.map(elem => {
        ////console.log(('elem', elem);
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
    ////console.log((localList);
    return localList
};

const renderContent = (type, searchData) => {
    ////console.log((type, searchData);
    const configObj = {
        imageP1: "",
        imageP2: "largeImage",
        imageD:
            "https://www.naturehills.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/s/o/southern-live-oak-600x600.jpg",
        text1: "title",
        text2: "character",
        id: 'id'
    };

    let data = configureInputList (searchData.data, configObj); 
    //console.log('calculated data in renderContent', data);

    let swipeRow = (
        <SwipeRow
            key = {type}
            cType = {type}
            type={0}
            elemType = {'search'}
            rows={1}
            eSize={215}
            list={data}
            listConfig={configObj}
        />
    );

    switch (searchData.status) {
        case T.UNLOADED:
            return <Segment textAlign = 'center'> Please search for some content. </Segment>;
        case `${type}${T._BEGAN_SEARCH}`:
            return <div> Content Loading </div>;
        case `${type}${T._BEGAN_SEARCH_NEXT}`:
            return <div> {swipeRow} </div>;
        case `${type}${T._FINISHED_SEARCH}`:
            return (
                <div>
                    {swipeRow}
                </div>
            );
        case `${type}${T._FINISHED_SEARCH_NEXT}`:
            return swipeRow;
        case `${type}${T._ERRORED_SEARCH}`:
            return <Segment inverted color='red' textAlign = 'center'>  There was an error with your search, please try again. </Segment>;
        case `${type}${T._ERRORED_SEARCH_NEXT}`:
            return (
                <Segment inverted color='red' textAlign = 'center'>>
                    {swipeRow}
                    There was an error retrieving more content. 
                </Segment>
            );
    }
};


const test = (props) => {
   
    const {type} = props;
    //console.log(type)
    const data = props[type];

    const loadMore = () => {
        props.fetchNextPage(type); 
    }
    

    return(
        <div> 
        {renderContent(type, data)}
        <Button onClick = {loadMore}> Load More </Button>
        </div>
    ) 
}

  

const mapStateToProps = state => {
	return {
		MOVIE: getSearch(T.MOVIE, state),
		TV_SEASON: getSearch(T.TV_SEASON, state),
		BOOK: getSearch(T.BOOK, state),
		GAME: getSearch(T.GAME, state)
	};
};

export default connect(mapStateToProps,{fetchNextPage})(test); 