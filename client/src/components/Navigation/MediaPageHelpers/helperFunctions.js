import React from "react";
import {Grid} from 'semantic-ui-react';



export const renderPoster = poster => {
	return poster === null
		? { width: 13, poster: null }
		: {
				width: 10,
				poster: (
					<Grid.Column width={6}>
						<img src={poster} />
					</Grid.Column>
				)
		  };
};

export const RenderTwo = props => {
	let { title, elem1, elem2, t1, t2 } = props.config;
	if (elem1 !== null) t1 = <p> {t1} </p>;
	if (elem2 !== null) t2 = <p> {t2} </p>;

	let returnStr;
	elem1 && elem2 ? (returnStr = "|") : (returnStr = "");
	return (elem1 && elem2) || elem1 || elem2 ? (
		<div className="media-body-div">
			{title === null ? null : <h1> {title} </h1>}
			{t1} {returnStr} {t2}
		</div>
	) : null;
};

export const RenderList = props => {
	let { title, list, num, func } = props.config;
	let comma, returnData;
	if (list === null || list.length === 0) return null;
	num > list.length ? (num = list.length - 1) : (num = num);
	returnData = list.map((elem, index) => {
		index === num ? (comma = "") : (comma = ", ");
		if (index > num) return;
		return <p key={func(elem)}> {`${func(elem)}${comma} `}</p>;
	});
	let s;
	returnData.length > 1 ? (s = "s") : (s = "");
	return (
		<div className={`media-body-div${props.sub}`}>
			<h1>{`${title}${s}:`} </h1>
			{returnData}
		</div>
	);
};

export const RenderObj = props => {
	let { title, obj, num } = props.config;
	let max;
	let keys = Object.keys(obj);
	let s = "";
	keys.sort();

	let list = keys.map(key => {
		let config = { title: key, list: obj[key], num, func: elem => elem.name };
		return <RenderList config={config} sub="-sub" />;
	});
	let test = 0;
	list.forEach(elem => {
		if (elem !== null) test = 1;
	});

	return test === 1 ? (
		<div className="media-body-div">
			<h1> {title} </h1> {list}
		</div>
	) : null;
};

export const renderProdComps = (companies, networks) => {
	let names = [];
	let images = [];

	let string;
	let returnData;

	networks === null ? (string = null) : (string = "Networks and ");
	let net = prodCompsHelper(networks);
	let comp = prodCompsHelper(companies);
	names = [...names, ...net[0], ...comp[0]];
	images = [...images, ...net[1], ...comp[1]];

	names.length === 0 && images.length === 0
		? (returnData = null)
		: (returnData = (
				<div className="media-body-div media-body-div-bottom">
					<h1> {`${string}Production Companies:`} </h1>
					<div className="media-comp-div">
						{images}
						{names}
					</div>
				</div>
		  ));

	return returnData;
};

const prodCompsHelper = list => {
	if (list === undefined) return [[], []];
	let names = [];
	let images = [];

	list.forEach((elem, index) => {
		if (index >= 4) return;
		elem.logo_path === null
			? names.push(
					<div>
						<p> {elem.name} </p>
					</div>
			  )
			: images.push(
					<div>
						<img
							src={`https://image.tmdb.org/t/p/w185/${elem.logo_path}`}
							alt={elem.name}
						/>
					</div>
			  );
	});
	return [names, images];
};
