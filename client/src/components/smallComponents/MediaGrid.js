import React from "react";

import { Link } from "react-router-dom";
import styled from "styled-components";

import Card from 'react-bootstrap/Card'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const StyledCard = styled(Card)`
    width: 100%;
    
  :hover {
        box-shadow: 5px 10px;
      }
`;

const MediaGrid = props => {
	return (

			<Row>
				{props.media.map(elem => {
					console.log(elem);
					return (
						<Col xs={12} sm={6} md={4} lg={3} className="mt-3" key={elem.ID}>
							<Link to={`/media/${props.type}/${elem.ID}`}>
								<StyledCard bg = 'light'>
                                    <Card.Img variant = 'top' src = {elem.largeImage} />
                                    <Card.Title> {elem.title} </Card.Title>
								</StyledCard>
							</Link>
						</Col>
					);
				})}
				;
			</Row>
	
	);
};

export default MediaGrid;
