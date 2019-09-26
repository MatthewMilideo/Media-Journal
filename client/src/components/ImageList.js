import React from "react";
import Image from "react-bootstrap/Image";
import styled from "styled-components";

// Input
//Label: String,
// Data: The list of data.
//Number: Number of Images/Titles to show,
//flag: Prefer images or order.

const StyledImage = styled(Image)`
	max-height: 40px;
`;

const UnstyledList = styled.ul`
    display: flex; 
    flex: auto
    list-style-type: none;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0px; 
    flex-shrink: 1; 
    

    li{
        display: flex; 
        flex-shrink: 1; 
        flex-grow: 1

        text-align: center; 
        justify-content: space-evenly;
   
    }
`;

const ImageList = props => {
	let { prodComps, networks, data, number, flag } = props;
	if (!number) number = 3;

	if (prodComps && networks) data = [...networks, ...prodComps];
	else if (prodComps) data = prodComps;
    else data = networks;
    
	let returnData = [];
	let textData = [];

	// If we want to display images instead of names.
	if (flag === true) {
		for (let elem of data) {
			if (elem.logo_path) {
				returnData.push(
					<StyledImage
					key = {elem.logo_path}
						fluid
						src={`https://image.tmdb.org/t/p/w500/${elem.logo_path}`}
					/>
				);
			} else textData.push(<span> {elem.name} </span>);
		}
		console.log(returnData);
		console.log(textData);
		let i = 0;
		while (returnData.length < number) {
			if (textData[i]) returnData.push(textData[i]);
			else break; 
		}
	}
	returnData = returnData.slice(0, number );
	console.log(returnData);
	return (
		<div>
			<UnstyledList>
				{returnData.map(elem => {
					return <li key = {elem.key}> {elem} </li>;
				})}
			</UnstyledList>
		</div>
	);
};

export default ImageList;
