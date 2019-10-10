import React, { useState, useEffect, useRef, useCallback } from "react";

export const useIntersect = (
	root = null,
	rootMargin = "0px",
	threshold = 0.1
) => {
	const [entry, updateEntry] = useState({});
	const [node, setNode] = useState(null);

	const observer = useRef(
		new window.IntersectionObserver(([entry]) => updateEntry(entry), {
			root,
			rootMargin,
			threshold
		})
	);

	useEffect(() => {
		const { current: currentObserver } = observer;
		currentObserver.disconnect();

		if (node) currentObserver.observe(node);

		return () => currentObserver.disconnect();
	}, [node]);

	return [setNode, entry];
};

function useHookWithRefCallback(observer) {
	console.log(observer);
	const ref = useRef(null);
	console.log(ref);
	const setRef = useCallback(node => {
		/* I found this function when researching how to use refs. I don't need this section
        In this instance, but am leaving it here for future reference. 
		*/ if (
			ref.current
		) {
			// Make sure to cleanup any events/references added to the last instance
		}

		if (node) {
			observer.current.observe(node);
		}
		// Save a reference to the node
		ref.current = node;
	}, []);

	return [setRef];
}

export function useLazyLoad(root = null, rootmargin = "0px", threshold = 0.01) {
	const observer = useRef(null);

	observer.current = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.src = entry.target.dataset.src;
				observer.current.unobserve(entry.target);
			}
		});
	});

	console.log(" after effect use lazy", observer);

	const [setRef] = useHookWithRefCallback(observer);

	return [setRef];
}

export function useInfScroll(
	root = null,
	rootmargin = "0px",
    threshold = 0.01,
    useState, 
    state
) {
	const observer = useRef(null);
	let retVal = false;

	observer.current = new IntersectionObserver(entry => {
		console.log(entry);
		if (entry.isIntersecting) {
            retVal = true;
            useState(!state); 
		}
	});

	console.log("hello!", observer.current);

	const [setRef2] = useHookWithRefCallback(observer);
	return [setRef2, retVal];
}
