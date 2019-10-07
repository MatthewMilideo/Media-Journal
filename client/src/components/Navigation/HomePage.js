import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Styled from "styled-components";

import Bootstrap from "../../media/boot.png";
import StyledI from "../../media/styled.png";
import ReactI from "../../media/react.png";
import Redux from "../../media/redux.png";
import NodeI from "../../media/node.jpg";
import Knex from "../../media/knex.png";

const StyledCol = Styled(Col)`
display: inline-flex;
max-height: 200px; 
justify-content: space-around; 
margin-bottom: 50px; 
img{
	max-height: 175px; 
	object-fit: contain; 
}
`;

const HomePage = () => {
	return (
		<div className="d-flex flex-column">
			<h1 className="border-bottom pb-3 text-center">
				{" "}
				Welcome to my Media Journaling Application{" "}
			</h1>

			<Row className="mt-5">
				<StyledCol lg={6}>
					<Image src={ReactI} />
				</StyledCol>
				<StyledCol lg={6}>
					<Image src={Redux} />
				</StyledCol>

				<StyledCol lg={6}>
					<Image src={Bootstrap} />
				</StyledCol>
				<StyledCol lg={6}>
					<Image src={StyledI} />
				</StyledCol>

				<StyledCol lg={6}>
					<Image src={NodeI} />
				</StyledCol>
				<StyledCol lg={6}>
					<Image src={Knex} />
				</StyledCol>
			</Row>
		</div>
	);
};

export default HomePage;
