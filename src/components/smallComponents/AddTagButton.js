import React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";

import {addTag} from '../../actions'

class AddTagButton extends React.Component {


    handleClick = (e) => {
        this.props.addTag({id: this.props.tag, value:this.props.tag, text:this.props.tag})

    }

	render() {
		return <Button onClick = {this.handleClick}> Add {this.props.type} Tag </Button>;
	}
}

export default connect(
	null,
	{ addTag }
)(AddTagButton);
