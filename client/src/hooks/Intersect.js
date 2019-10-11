import { useState, useEffect, useRef, useCallback } from "react";

export const useIntersect = (
	root = null,
	rootMargin = "0px",
	threshold = 0.01
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

export function useLazyLoad(root = null, rootmargin = "0px", threshold = 0.01) {
	const observer = useRef(null);

	const setRef = useCallback(node => {
		if (node) {
			observer.current.observe(node);
		}
	}, []);

	observer.current = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.src = entry.target.dataset.src;
				observer.current.unobserve(entry.target);
			}
		});
	});

	return [setRef];
}
