import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Transition } from "react-transition-group";
import styled from "styled-components";
import debounce from "lodash/debounce";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { postMediaUser, deleteMediaUser } from "../actions";
import { getUser } from "../reducers";

const FixedSizeCard = styled(Card)`
	width: 100%;
	height: 425px;
	border: 1px;
	opacity: ${({ blur }) => blur};
`;

const CardTitleDiv = styled.div`
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

const CardImageDiv = styled.div`
	width: 100%;
	height: 100%;
	min-height: 355px;
	img {
		height: 100%;
		object-fit: cover;
		object-position: top;
	}
`;

const HoveredCardDiv = styled.div`
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

const InnerDiv = styled.div`
	position: relative;
	z-index: 2;
	width: 100%;
	height: 425px;
`;

const Animation = styled(FixedSizeCard)`
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

const MediaCard = React.forwardRef((props, ref) => {
	//const [hover, setHover] = useState(false);
	const [load, setLoad] = useState(false);

	const handleMouseEnter = e => {
		if (window.innerWidth > 575) props.setHover(props.index);
	};

	const delayMouseEnter = debounce(e => handleMouseEnter(e), 0);

	return !props.hover ? (
		<Transition in={load === true} timeout={500}>
			{state => (
				<Link
					style={{ color: "inherit", textDecoration: "none" }}
					to={`/media/${props.type}/${props.data.id}`}
				>
					<Animation state={state}>
						<FixedSizeCard
							className="d-flex shadow"
							onMouseEnter={e => delayMouseEnter(e)}
							blur="1"
						>
							<CardImageDiv>
								<Card.Img
									ref={ref}
									src={null}
									data-src={props.data.largeImage}
									onLoad={() => setLoad(true)}
								/>
							</CardImageDiv>
							<CardBottomDiv {...props} />
						</FixedSizeCard>
					</Animation>
				</Link>
			)}
		</Transition>
	) : (
		<InnerDiv onMouseLeave={e => props.setHover(-1)}>
			<HoveredCardDiv>
				<div className="d-flex flex-column m-auto">
					<Link to={`/media/${props.type}/${props.data.id}`} as={Button}>
						<span className="oi oi-plus"> View Media </span>
					</Link>
				</div>
				{props.data.viewed && props.data.noteCount > 0 ? null : (
					<div className="d-flex flex-column m-auto">
						<RenderButton {...props} />
					</div>
				)}
			</HoveredCardDiv>

			<FixedSizeCard blur="0.1" className="d-flex shadow">
				<CardImageDiv>
					<Card.Img src={props.data.largeImage} />
				</CardImageDiv>
				<CardBottomDiv {...props} />
			</FixedSizeCard>
		</InnerDiv>
	);
});

const CardBottomDiv = props => {
	let buttonText = props.type === "BOOK" ? "Read:" : "Viewed:";

	return (
		<CardTitleDiv className="d-flex bg-light">
			<span className="ml-2 mr-2 mt-1"> {props.data.title} </span>
			{props.data.viewed ? (
				<div className="d-flex border-top text-white mt-auto bg-info">
					<span className="ml-2">
						{buttonText}
						<span className="d-inline oi oi-circle-check"></span>
					</span>
					<span className="ml-auto  mr-2">Notes: {props.data.noteCount}</span>
				</div>
			) : null}
		</CardTitleDiv>
	);
};

const RenderButton = props => {
	let buttonText;
	props.data.viewed
		? (buttonText =
				props.type === "BOOK" ? "Remove from Read" : "Remove from Viewed")
		: (buttonText = props.type === "BOOK" ? "Add to Read" : "Add to Viewed");
	let func;

	props.data.viewed
		? (func = props.deleteMediaUser)
		: (func = props.postMediaUser);

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
	{ postMediaUser, deleteMediaUser },
	null,
	{ forwardRef: true }
)(MediaCard);
