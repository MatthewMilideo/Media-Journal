import React from "react";
import { connect } from "react-redux";

import Styled from "styled-components";
import debounce from "lodash/debounce";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";

import { searchTag } from "../actions";
import { getSearchTags } from "../reducers";

const ParentDiv = Styled.div`
    position: relative; 
`;

const UnstyledForm = Styled(Form.Control)`
width: 100%;
:focus{
	border-bottom: none
}

`;

const ULStyled2 = Styled.ul`
z-index: 100; 
position: absolute; 

border-radius: .25rem;

/*
border-color: #80bdff;
outline: 0;
box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
	*/

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


class TagSearch extends React.Component {
	state = { formValue: "" };

	debounceSearchTag = debounce(this.props.searchTag, 200, {
		leading: true,
		trailing: true
	});

	// Function needs to be debounced.
	onFormValueChange = e => {
		this.debounceSearchTag(e.target.value);
		this.setState({ formValue: e.target.value });
	};

	onFormSubmit = e => {
		e.preventDefault();
		let { tags} = this.props;
		tags = tags.map(tag => tag.title.toLowerCase().trim());
		if (tags.includes(e.target[0].value.toLowerCase().trim())) {
			this.setState({ formValue: "" });
			return;
		}
		tags = this.props.tags;
		this.props.addNoteTag({
			title: e.target[0].value.trim(),
			id: e.target[0].value,
			new: true
		});
		this.setState({ formValue: "" });
	};

	tagClick = elem => {
		this.props.addNoteTag(elem);
		this.setState({ formValue: "" });
	};

	onTagDeleteClick = elem => {
		this.props.removeNoteTag(elem);
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
							key={elem.title}
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
		const { edit } = this.props;
		return (
			<ULStyled>
				{arr.map(elem => {
					return (
						<li key={elem.tag_id}>
							{" "}
							<StyledBadge variant="info" key={elem.tag_id}>
								{elem.title}
								{edit ? (
									<span
										key={elem.tag_id}
										onClick={() => this.onTagDeleteClick(elem)}
										className=" ml-2 oi oi-circle-x"
									/>
								) : null}
							</StyledBadge>
						</li>
					);
				})}
			</ULStyled>
		);
	};

	renderEdit() {
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

	renderStatic() {
		return (
			<ParentDiv className="mb-3">
				{this.renderSelectedTags(this.props.tags)}
			</ParentDiv>
		);
	}

	render() {
		const { edit } = this.props;
		return edit ? this.renderEdit() : this.renderStatic();
	}
}

const mapStateToProps = state => {
	return {
		Tags: getSearchTags(state)
	};
};

export default connect(
	mapStateToProps,
	{ searchTag }
)(TagSearch);
