import React from "react";
import {Link} from "react-router-dom"
import {
	Item,
	Button, 
} from "semantic-ui-react";
import {connect} from 'react-redux';
import { fetchItem } from '../actions'

class MediaPoster extends React.Component {
	state = {
		hovered: false
	};

	onMouseEnter(e) {
		this.setState({ hovered: true });
	}

	onMouseLeave() {
		this.setState({ hovered: false });
	}

	

	render() {
		return (
			<Link to = {`/movie/${this.props.media.ID}`} >
			<Item className="items" >
				<Item.Image src={this.props.media.largeImage} size= "small" />
				<Item.Content>
					<Item.Header> {this.props.media.title} </Item.Header>
					<Item.Description> {this.props.media.overview} </Item.Description>
					<Button> Quick Add </Button>
				</Item.Content>
			</Item>
			</Link>
		);
	}
}

export default connect(null, {fetchItem})(MediaPoster);
