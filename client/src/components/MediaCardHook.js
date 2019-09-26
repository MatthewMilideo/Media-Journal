import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import debounce from "lodash/debounce";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { postMediaUser } from "../actions";
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

const CardImage = styled(Card.Img)``;

const StyledCard = styled(Card)`
    width: 100%;
    height: 425px; 
    }
`;

const CardImageDiv = styled.div`
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
	background-color: white;
	width: 100%;
	height: 425px;
	opacity: 0.1;
	position: relative;
	z-index: 2;
`;

const InnerDiv = styled.div`
	position: relative;
	z-index: 2;
	width: 100%;
	height: 425px;
`;

const BlurredCard = styled(Card)`
	width: 100%;
	height: 425px; 
    position: relative; 
    z-index: -5; 
	img{
		height: 100%;
		object-fit: cover;
		object-position: top;
		}
    }
    filter: blur(5px);
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

// Hook
function useOnScreen(ref, imageSrc, rootMargin = "0px") {
    const [isIntersecting, setIntersecting] = useState(false);
    
    
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// Update our state when observer callback fires
				setIntersecting(entry.isIntersecting);
			},
			{
				root: null,
				threshold: 0.1,
				rootMargin
			}
		);
		if (ref.current) {
			observer.observe(ref.current);
		}
		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
	}, []); // Empty array ensures that effect is only run on mount and unmount

	return isIntersecting;
}

/* 
prop : user_id
*/

function MediaCardHook(props) {
	const ref = useRef();
	const [loaded, setLoaded] = useState(false);
	const [hover, setHover] = useState(false);
    const onScreen = useOnScreen(ref, props.data.largeImage);
    



	let renderLoading = () => {
		console.log("render Loading");
		return (
			<BlurredDiv className="bg-dark">
				<CardImage
					ref={ref}
					src={null}
					onLoad={() => {
                        console.log('test');
						setLoaded(true);
					}}
				/>
			</BlurredDiv>
		);
	};

	let renderMedia = () => {
		let style = {};
		let className;

		return (
			<StyledCard
				style={style ? style : null}
				className="d-flex"
				className={className}
			>
				<CardImageDiv>
					<Card.Img src={props.data.largeImage} />
				</CardImageDiv>
				<TitleDiv className="d-flex bg-light">
					<span className="ml-2 mr-2 mt-1"> {props.data.title} </span>
					{props.data.viewed ? (
						<div className="d-flex border-top text-white mt-auto bg-info">
							<span className="ml-2">
								Viewed: <span className="d-inline oi oi-circle-check"></span>
							</span>
							<span className="ml-auto  mr-2">
								Notes: {props.data.noteCount}
							</span>
						</div>
					) : null}
				</TitleDiv>
			</StyledCard>
		);
	};

	return loaded ? renderMedia() : renderLoading();
}

export default MediaCardHook;

/*
	

	

	

	

	

	renderMouseOver = () => {
		return (
			<InnerDiv
				onMouseLeave={e => {
					this.delayMouseEnter.cancel();
					this.setState({ hover: false });
				}}
			>
				<ContentDiv>
					<StyledArea>
						<Link
							to={`/media/${this.props.type}/${this.props.data.id}`}
							as={Button}
						>
							<span className="oi oi-plus"> View Media </span>
						</Link>
					</StyledArea>
					<StyledArea>
						<Button
							onClick={() => {
								const { data } = this.props;
								const { user_id } = this.props.User;
								let mediaObj = {
									title: data.title,
									CID: data.id,
									type: this.props.type
								};
								this.props.postMediaUser(user_id, mediaObj);
							}}
						>
							<span className="oi oi-plus"> Add Data to Viewed </span>
						</Button>
					</StyledArea>
				</ContentDiv>

				<BlurredDiv>
					<StyledCard>
						<CardImageDiv>
							<Card.Img src={this.props.data.largeImage} />
						</CardImageDiv>
						<TitleDiv> {this.props.data.title} </TitleDiv>
					</StyledCard>
				</BlurredDiv>
			</InnerDiv>
		);
	};

	delayMouseEnter = debounce(e => this.handleMouseEnter(e), 100);

	handleMouseEnter = e => {
		this.setState({ hover: true });
	};

	render() {
		const { load } = this.state;
		console.log(this.ref);

		if (this.state.hover === true) {
			console.log("in hover");
			return this.renderMouseOver();
		}

		return load ? this.renderMedia() : this.renderLoading();
	}
}

*/
