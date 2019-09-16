import React from "react";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import debounce from "lodash/debounce";
import Styled from "styled-components";
import { searchTag, addNoteTag, removeNoteTag } from "../actions";
import { getSearchTags } from "../reducers";

const ParentDiv = Styled.div`
    position: relative; 
`;

const UnstyledForm = Styled(Form.Control)`
width: 100%; 
border: none; 
:focus{
    box-shadow-bottom-left: none; 
    box-shadow-bottom-right: none; 
    outline: none; 
}
`;

const ULStyled2 = Styled.ul`
position: absolute; 
width: 100%; 
list-style:none;
padding: 0; 
li{
    padding: 10.5px; 
    font-size: 1rem;
    border: solid; 
    border-width: 1px 1px 0px 1px;
    border-color: rgba(189, 195, 199, .25);
}
li:last-child {
    border-width: 1px;
  }
`;

const StyledBadge = Styled(Badge)`
font-size: 1rem;
padding: .5rem; 
`;

const ULStyled = Styled.ul`
list-style:none;
padding: 0; 
li{
    display: inline; 
    font-size: 1rem;
}
`;

const resultDiv = Styled.div`
background-color: white; 
width: 100%; 
border: solid; 
`;

class TagSearch extends React.Component {
	state = { formValue: "" };

	onFormValueChange = e => {
		this.props.searchTag(e.target.value);
		this.setState({ formValue: e.target.value });
	};

	onFormSubmit = e => {
		e.preventDefault();
		let { tags, note_id } = this.props;
		tags = tags.map(tag => tag.title.toLowerCase().trim());
		if (tags.includes(e.target[0].value.toLowerCase().trim())) {
			this.setState({ formValue: "" });
			return;
		}

		tags = this.props.tags;
		this.props.addNoteTag(
			{
				title: e.target[0].value.trim(),
				id: e.target[0].value,
				new: true
			},
			note_id
		);
		this.setState({ formValue: "" });
	};

	tagClick = elem => {
		this.props.addNoteTag(elem, this.props.note_id);
		this.setState({ formValue: "" });
	};

	onTagDeleteClick = elem => {
		this.props.removeNoteTag(elem, this.props.note_id);
	};

	renderDBTags = (tags, max) => {
		max = 4;
		let bgFlag = false;
		return (
			<ULStyled2>
				{tags.map((elem, index) => {
					bgFlag = !bgFlag;
					return index < max ? (
						<li
							onClick={() => this.tagClick(elem)}
							key={elem.id}
							className={bgFlag ? "bg-white" : "bg-light"}
						>
							{elem.title}
						</li>
					) : null;
				})}
			</ULStyled2>
		);
	};

	renderSelectedTags = arr => {
		return (
			<ULStyled>
				{arr.map(elem => (
					<li key={elem.id}>
						{" "}
						<StyledBadge variant="info">
							{elem.title}
							<span
								onClick={() => this.onTagDeleteClick(elem)}
								className=" ml-2 oi oi-circle-x"
							/>
						</StyledBadge>
					</li>
				))}
			</ULStyled>
		);
	};

	render() {
		return (
			<ParentDiv className="mb-3">
				{this.renderSelectedTags(this.props.tags)}
				<Form onSubmit={this.onFormSubmit}>
					<Form.Group controlId="noteTags">
						<Form.Label>Note Tags: </Form.Label>
						<UnstyledForm
							type="text"
							value={this.state.formValue}
							onChange={this.onFormValueChange}
							autoComplete="off"
						/>

						{this.state.formValue
							? this.renderDBTags(this.props.Tags.tags)
							: null}
					</Form.Group>
				</Form>
			</ParentDiv>
		);
	}
}

const mapStateToProps = state => {
	return {
		Tags: getSearchTags(state)
	};
};

export default connect(
	mapStateToProps,
	{ searchTag, addNoteTag, removeNoteTag }
)(TagSearch);
