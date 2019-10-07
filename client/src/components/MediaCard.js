import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import debounce from "lodash/debounce";

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

const Img2 = styled.img`
	visibility: hidden; 
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

class MediaCard extends React.Component {
	state = { load: false, hover: false };

	ref = React.createRef();

	observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				const { isIntersecting } = entry;
				if (isIntersecting && this.props.data.largeImage) {
					this.ref.current.src = this.props.data.largeImage;
					this.observer = this.observer.disconnect();
				}
			});
		},
		{
			root: null,
			threshold: 0.1
		}
	);

	componentDidMount() {
		this.observer.observe(this.ref.current);
	}

	renderLoading = () => {
		return (
			<BlurredDiv className="bg-dark">
				<CardImageDiv>
					<Img2
						alt="Loading"
						ref={this.ref}
						src = {null}
						onLoad={() => {
							this.setState({ load: true });
						}}
						onError={() => {
							console.log("error");
						}}
					/>
				</CardImageDiv>
			</BlurredDiv>
		);
	};

	renderMedia = () => {
		let buttonText = this.props.type === "BOOK" ? "Read:" : "Viewed:";

		return (
			<Link
				style={{ color: "inherit", textDecoration: "none" }}
				to={`/media/${this.props.type}/${this.props.data.id}`}
			>
				<StyledCard
					className="d-flex"
					onMouseEnter={e => this.delayMouseEnter(e)}
					onMouseOut={() => this.delayMouseEnter.cancel()}
				>
					<CardImageDiv>
						<Card.Img src={this.props.data.largeImage} />
					</CardImageDiv>
					<TitleDiv className="d-flex bg-light">
						<span className="ml-2 mr-2 mt-1"> {this.props.data.title} </span>
						{this.props.data.viewed ? (
							<div className="d-flex border-top text-white mt-auto bg-info">
								<span className="ml-2">
									{buttonText}{" "}
									<span className="d-inline oi oi-circle-check"></span>
								</span>
								<span className="ml-auto  mr-2">
									Notes: {this.props.data.noteCount}
								</span>
							</div>
						) : null}
					</TitleDiv>
				</StyledCard>
			</Link>
		);
	};

	renderButton = user_id => {
		let buttonText;
		this.props.data.viewed
			? (buttonText =
					this.props.type === "BOOK"
						? "Remove from Read"
						: "Remove from Viewed")
			: (buttonText =
					this.props.type === "BOOK" ? "Add to Read" : "Add to Viewed");
		let func;
		this.props.data.viewed
			? (func = this.props.deleteMediaUser)
			: (func = this.props.postMediaUser);

		return func !== null ? (
			<Button
				onClick={() => {
					let mediaObj = {
						title: this.props.data.title,
						CID: this.props.data.id,
						type: this.props.type
					};
					func(this.props.User.user_id, mediaObj);
				}}
			>
				<span className="oi oi-plus" /> <span> {buttonText}</span>
			</Button>
		) : null;
	};

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
					{this.props.data.viewed && this.props.data.noteCount > 0 ? null : (
						<StyledArea>
							{this.renderButton(this.props.User.user_id)}
						</StyledArea>
					)}
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

	delayMouseEnter = debounce(e => this.handleMouseEnter(e), 125);

	handleMouseEnter = e => {
		if (window.innerWidth > 575) this.setState({ hover: true });
	};

	render() {
		const { load } = this.state;

		if (this.state.hover === true) {
			return this.renderMouseOver();
		}

		return !load ? this.renderLoading() : this.renderMedia();
	}
}

const mapStatetoProps = state => {
	return {
		User: getUser(state)
	};
};

export default connect(
	mapStatetoProps,
	{ postMediaUser, deleteMediaUser }
)(MediaCard);
