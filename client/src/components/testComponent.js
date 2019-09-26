import React, { useState } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import Styled from "styled-components";

const StyledCard = Styled(Card)`
width: 200px; 
height: 400px; 
animation: shimmer 3s infinite linear;
background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
background-size: 1000px 100%;


&.test-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  &.test-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }
  &.test-exit {
    opacity: 1;
  }
 


 
 @keyframes shimmer {
	 0% {
		 background-position: -1000px 0;
	 }
	 100% {
		 background-position: 1000px 0;
	 }
 }


	`;

const FinishedCard = Styled(Card)`
	width: 200px; 
	height: 400px; 
`;

function testComponent() {
	const [showButton, setShowButton] = useState(true);
	const [showMessage, setShowMessage] = useState(false);
	const [loaded, setLoaded] = useState(false);
	return (
		<Container style={{ paddingTop: "2rem" }}>
			{
				<Button
					onClick={() => {
						setShowMessage(true);
						setTimeout(() => {
							setShowMessage(false);
						}, 3000);
					}}
					size="lg"
				>
					Show Message
				</Button>
			}
			{!loaded ? (
				<CSSTransition
					in={showMessage}
					timeout={300}
					classNames="test"
					unmountOnExit
					onEnter={() => setShowButton(false)}
					onExited={() => setLoaded(true)}
				>
					<StyledCard
						className="test"
						variant="primary"
						dismissible
						onClose={() => setShowMessage(false)}
					>
						<Card.Img variant="top" />
						<Card.Title>Animated alert message</Card.Title>
						<p>
							This alert message is being transitioned in and out of the DOM.
						</p>
					</StyledCard>
				</CSSTransition>
			) : null}
			{loaded ? (
				<FinishedCard
					variant="primary"
					dismissible
					onClose={() => setShowMessage(false)}
				>
					<Card.Img
						variant="top"
						src="https://timedotcom.files.wordpress.com/2016/05/hillary-clinton2.jpg"
					/>
					<Card.Title>Animated alert message</Card.Title>
					<p>This alert message is being transitioned in and out of the DOM.</p>
				</FinishedCard>
			) : null}
		</Container>
	);
}

export default testComponent;

/*

*/
