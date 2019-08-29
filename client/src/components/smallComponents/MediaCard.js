import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import debounce from "lodash/debounce";
import CSSTransition from "react-transition-group";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { postMediaUser } from "../../actions";
import { getUser } from "../../reducers";

const CardTitle = styled(Card.Title)`
	font-size: 15px;
	min-height: 55px;
`;

const CardImageDiv = styled.div`
	flex-grow: 1;
	width: 100%;
	height: 300px;
	background-color: light-gray;
`;

const CardImage = styled(Card.Img)`
	display: none;
`;

const StyledCard = styled(Card)`
    width: 100%;
    height: 100%; 
	img{
        width: 100%; 
        flex-grow: 1;
        max-height: 350px; 
		}
    }
`;

const BlurredCard = styled(Card)`
    position: relative; 
    z-index: -5; 
	width: 100%; 
    height: 100%; 
    min-height: 100%; 
	img{
        width: 100%; 
        flex-grow: 1;
        max-height: 350px; 
		}
    }
    filter: blur(5px);
`;

const InnerDiv = styled.div`
	position: relative;
	z-index: 2;
	width: 100%;
`;

const BlurredDiv = styled.div`
	background-color: white;
	opacity: 0.1;
	position: relative;
	z-index: 2;
	width: 100%;
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
	state = { load: false, hover: false, height: 0, ref: React.createRef() };

	componentDidUpdate(prevProps) {
		const { ref, height } = this.state;

		if (prevProps.len !== this.props.len) {
			this.setState({ height: 0 });
			return;
		}

		// If the width of the media grid changed, recalculate the heights.
		if (prevProps.width !== this.props.width) {
			this.setState({ height: 0 });
			return;
		}

		// If the height has yet to be set in state, set it.
		if (ref.current && height === 0) {
			// I let the bootstrap grid(flex box) determine my height, as such I need to wait till it dynamically determines the
			// height to read it. This is hacky but it works!
			setTimeout(() => {
				this.setState({ height: ref.current.clientHeight });
			}, 1);
		}
	}

	renderLoading = () => {
		return (
			<BlurredDiv className="bg-dark">
				<StyledCard className="bg-dark">
					<CardImageDiv />
					<CardImage
						src={this.props.data.largeImage}
						onLoad={() => {
							this.setState({ load: true });
						}}
					/>
					<CardTitle> Media Title </CardTitle>
				</StyledCard>
			</BlurredDiv>
		);
	};

	renderMedia = () => {
		let style = {};
		let className;
		if (this.state.height !== 0) style = { height: `${this.state.height}px` };

		this.props.data.viewed ? (className = "bg-success") : (className = "");
		return (
			<StyledCard
				ref={this.state.ref}
				style={style ? style : null}
				className="d-flex p-1"
				onMouseOver={e => this.delayMouseEnter(e)}
				onMouseOut={() => this.delayMouseEnter.cancel()}
				className={className}
			>
				<Card.Img src={this.props.data.largeImage} />
				<CardTitle> {this.props.data.title} </CardTitle>
			</StyledCard>
		);
	};

	renderMouseOver = () => {
		let style = {};
		if (this.state.height !== 0) style = { height: `${this.state.height}px` };
		return (
			<InnerDiv
				style={style ? style : null}
				className="d-flex p-1"
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
						<Card.Img src={this.props.data.largeImage} />
						<CardTitle> {this.props.data.title} </CardTitle>
					</StyledCard>
				</BlurredDiv>
			</InnerDiv>
		);
	};

	delayMouseEnter = debounce(e => this.handleMouseEnter(e), 100);

	handleMouseEnter = e => {
		this.setState({ hover: true });
	};

	//	<Link to={`/media/${this.props.type}/${this.props.data.id}`}>

	render() {
		const { load } = this.state;

		if (this.state.hover === true) {
			return this.renderMouseOver();
		}

		return load ? this.renderMedia() : this.renderLoading();
	}
}

const mapStatetoProps = state => {
	return {
		User: getUser(state)
	};
};

export default connect(
	mapStatetoProps,
	{ postMediaUser }
)(MediaCard);
