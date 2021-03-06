import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

import Card from "react-bootstrap/Card";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button'
import { hackerUserID } from "../../actions/index";

const TallDiv = styled.div`
	width: 300px;
	height: 700px;
	background-color: blue;
`;

export const useIntersect = ({ root = null, rootMargin, threshold = 0.1 }) => {
	const [entry, updateEntry] = useState({});
	const [node, setNode] = useState(null);
	console.log("test");

	const observer = useRef(
		new window.IntersectionObserver(([entry]) => updateEntry(entry), {
			root,
			rootMargin,
			threshold
		})
	);

	useEffect(() => {
		const { current: currentObserver } = observer;
		currentObserver.disconnect();

		if (node) currentObserver.observe(node);

		return () => currentObserver.disconnect();
	}, [node]);

	return [setNode, entry];
};

const IntersectBox = props => {
	const [ref, entry] = useIntersect({
		threshold: 0.5
	});

	if (entry.isIntersecting) {
		return (
			<Card className="bg-success p-5">
				intersectionRatio: {props.name} {entry.intersectionRatio}
			</Card>
		);
	} else {
		return (
			<Card className="bg-info p-5" ref={ref}>
				intersectionRatio: {props.name} {entry.intersectionRatio}
			</Card>
		);
	}
};

const TestPage = (props) => {
	const [formValue, setForm] = useState("");

	return (
		<Card className="d-flex flex-column p-3">
            <Card.Title> Change User ID </Card.Title>
			<Form
				onSubmit={e => {
					e.preventDefault();
					props.hackerUserID(formValue);
				}}
			>
				<Form.Label> User Id: </Form.Label>
				<Form.Control
					type="text"
					value={formValue}
					onChange={e => setForm(e.target.value)}
				/>
				<Button className= 'mt-3'> Submit </Button>
			</Form>
		</Card>
	);
};

export default connect(
	null,
	{ hackerUserID }
)(TestPage);

/*
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Transition } from "react-transition-group";
import styled from "styled-components";
import debounce from "lodash/debounce";

import { useIntersect } from "./Navigation/TestPage";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { postMediaUser, deleteMediaUser } from "../actions";
import { getUser } from "../reducers";

const TitleDiv = styled.div`
	flex-direction: column;
	text-align: center;
	font-size: 13px;
	min-height: 65px;

	span {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
`;

const StyledCard = styled(Card)`
    width: 100%;
    height: 425px; 
	}
	* {
		pointer-events: none;
	}
	  
`;

const CardImageDiv = styled.div`
	z-index: 100;
	display: flex;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: light-gray;
	img {
		height: 100%;
		object-fit: cover;
		object-position: top;
	}
`;

const BlurredDiv = styled.div`
	background-color: grey;
	width: 100%;
	height: 425px;
	opacity: 0.1;
	position: relative;
	z-index: 1;
`;

const InnerDiv = styled.div`
	position: relative;
	z-index: 2;
	width: 100%;
	height: 425px;
`;

const ContentDiv = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 5;
	width: 100%;
	height: 100%;
`;

const StyledArea = styled.div`
	display: flex;
	flex-direction: column;
	margin: auto;

	:hover {
		background-color: grey;
	}

	div {
		opacity: 1;
	}
`;

const Animation = styled(BlurredDiv)`
	transition: 0.5s;
	opacity: ${({ state }) => {
		switch (state) {
			case "entering":
				return 1;
			case "entered":
				return 1;
			case "exiting":
				return 0;
			case "exited":
				return 0;
		}
	}};
`;


const MediaCard = function(props) {
	const [hover, setHover] = useState(false);
	const [load, setLoad] = useState(false);
	const [img, setImg] = useState(null);

	const handleMouseEnter = e => {
		if (window.innerWidth > 575) setHover(true);
	};

	const delayMouseEnter = debounce(e => handleMouseEnter(e), 125);

	let buttonText = props.type === "BOOK" ? "Read:" : "Viewed:";

	const [ref, entry] = useIntersect({
		threshold: 0.1
	});

	if (entry.isIntersecting && img === null && props.data.largeImage !== null) {
		setImg(props.data.largeImage);
	}

	return (
		<Transition in={img !== null} timeout={500}>
			{state => (
				<Link
					style={{ color: "inherit", textDecoration: "none" }}
					to={`/media/${props.type}/${props.data.id}`}
				>
					<Animation
						state={state}
						className="bg-dark"
						ref={img === null ? ref : null}
					>
						<StyledCard
							className="d-flex test"
							onMouseEnter={e => delayMouseEnter(e)}
							onMouseOut={() => delayMouseEnter.cancel()}
						>
							<CardImageDiv>
								<Card.Img src={img} onLoad={() => setLoad(true)} />
							</CardImageDiv>
							<TitleDiv className="d-flex bg-light">
								<span className="ml-2 mr-2 mt-1"> {props.data.title} </span>
								{props.data.viewed ? (
									<div className="d-flex border-top text-white mt-auto bg-info">
										<span className="ml-2">
											{buttonText}
											<span className="d-inline oi oi-circle-check"></span>
										</span>
										<span className="ml-auto  mr-2">
											Notes: {props.data.noteCount}
										</span>
									</div>
								) : null}
							</TitleDiv>
						</StyledCard>
					</Animation>
				</Link>
			)}
		</Transition>
	);
};

const RenderMedia = props => {
	console.log(props.ref);
	let buttonText = props.type === "BOOK" ? "Read:" : "Viewed:";
	return (
		<Link
			style={{ color: "inherit", textDecoration: "none" }}
			to={`/media/${props.type}/${props.data.id}`}
		>
			<Animation state={props.state} className="bg-dark">
				<StyledCard
					className="d-flex test"
					onMouseEnter={e => props.delayMouseEnter(e)}
					onMouseOut={() => props.delayMouseEnter.cancel()}
				>
					<CardImageDiv className="bg-dark">
						<Card.Img src={props.img} onLoad={() => props.setLoad(true)} />
					</CardImageDiv>
					<TitleDiv className="d-flex bg-light">
						<span className="ml-2 mr-2 mt-1"> {props.data.title} </span>
						{props.data.viewed ? (
							<div className="d-flex border-top text-white mt-auto bg-info">
								<span className="ml-2">
									{buttonText}
									<span className="d-inline oi oi-circle-check"></span>
								</span>
								<span className="ml-auto  mr-2">
									Notes: {props.data.noteCount}
								</span>
							</div>
						) : null}
					</TitleDiv>
				</StyledCard>
			</Animation>
		</Link>
	);
};

const renderButton = props => {
	let buttonText;
	props.data.viewed
		? (buttonText =
				props.type === "BOOK" ? "Remove from Read" : "Remove from Viewed")
		: (buttonText = props.type === "BOOK" ? "Add to Read" : "Add to Viewed");
	let func;
	props.data.viewed ? (func = props.deleteMediaUser) : (func = props.postMedia);

	return func !== null ? (
		<Button
			onClick={() => {
				let mediaObj = {
					title: props.data.title,
					CID: props.data.id,
					type: props.type
				};
				func(props.User.user_id, mediaObj);
			}}
		>
			<span className="oi oi-plus" /> <span> {buttonText}</span>
		</Button>
	) : null;
};

const mapStatetoProps = state => {
	return {
		User: getUser(state)
	};
};

export default connect(
	mapStatetoProps,
	{ postMediaUser, deleteMediaUser }
)(MediaCard);


const renderMouseOver = props => {
	return (
		<InnerDiv
			onMouseLeave={e => {
				props.delayMouseEnter.cancel();
				props.setHover(false);
			}}
		>
			<ContentDiv>
				<StyledArea>
					<Link to={`/media/${props.type}/${props.data.id}`} as={Button}>
						<span className="oi oi-plus"> View Media </span>
					</Link>
				</StyledArea>
				{props.data.viewed && props.data.noteCount > 0 ? null : (
					<StyledArea>{renderButton(props.User.user_id)}</StyledArea>
				)}
			</ContentDiv>

			<BlurredDiv>
				<StyledCard>
					<CardImageDiv>
						<Card.Img src={props.data.largeImage} />
					</CardImageDiv>
					<TitleDiv> {props.data.title} </TitleDiv>
				</StyledCard>
			</BlurredDiv>
		</InnerDiv>
	);
};
*/
