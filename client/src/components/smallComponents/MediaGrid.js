import React from "react";

import debounce from "lodash/debounce";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import MediaCard from "./MediaCard";

class MediaGrid extends React.Component {
	state = { width: window.innerWidth, height: window.innerHeight };

	componentDidMount() {
		this.updateWindow();
		window.addEventListener("resize", this.debounceUpdateWindow);
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.debounceUpdateWindow);
	}

	updateWindow = () => {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	};

	debounceUpdateWindow = debounce(this.updateWindow, 200);

	render() {
		const { media, type } = this.props;
		const mediaLength = media.length;
		let returnObj;

		media
			? (returnObj = media.map(elem => {
					return (
						<Col xs={12} sm={6} md={4} lg={3} key={elem.id} className="mb-3">
							<MediaCard
								key={elem.id}
								data={elem}
								type={type}
								width={this.state.width}
								len = {mediaLength}
							/>
						</Col>
					);
			  }))
			: (returnObj = <div> </div>);

		return (
			<div className="pt-3 pb-3 pr-3 pl-3">
				<Row>{returnObj}</Row>
			</div>
		);
	}
}

export default MediaGrid;
