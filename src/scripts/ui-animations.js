import { gsap } from 'gsap';

/**
 * UI Animation Manager using Functional Programming
 */

// State management
let animationState = {
	isVisible: false,
	revealThreshold: 0.7, // Reveal at 70%
	hideThreshold: 0.69, // Hide at 65%
	elements: null,
	currentTimeline: null, // Track current animation timeline
	isAnimating: false, // Track if animation is in progress
};

/**
 * Initialize and cache DOM elements
 */
const initializeElements = () => {
	animationState.elements = {
		title: document.querySelector('.section__title'),
		text: document.querySelector('.section__text'),
		actions: document.querySelector('.section__actions'),
	};
};

/**
 * Set initial hidden state for all elements
 */
const setInitialState = () => {
	if (!animationState.elements) return;

	Object.values(animationState.elements).forEach((element) => {
		if (element) {
			gsap.set(element, {
				opacity: 0,
				y: 30,
				filter: 'blur(10px)',
			});
		}
	});
};

/**
 * Kill any running animations
 */
const killCurrentAnimation = () => {
	if (animationState.currentTimeline) {
		animationState.currentTimeline.kill();
		animationState.currentTimeline = null;
		animationState.isAnimating = false;
	}
};

/**
 * Reveal section with staggered blur animations
 */
const revealSection = () => {
	if (!animationState.elements || animationState.isVisible) return;

	// Kill any running animations first
	killCurrentAnimation();

	animationState.isVisible = true;
	animationState.isAnimating = true;

	// Create timeline for staggered animations
	const tl = gsap.timeline({
		onComplete: () => {
			animationState.isAnimating = false;
			animationState.currentTimeline = null;
		},
	});

	// Store the timeline reference
	animationState.currentTimeline = tl;

	// Reveal all elements with single stagger
	tl.to(
		[
			animationState.elements.title,
			animationState.elements.text,
			animationState.elements.actions,
		],
		{
			opacity: 1,
			y: 0,
			filter: 'blur(0px)',
			duration: 2,
			ease: 'power3.out',
			stagger: 0.2,
		}
	);

	console.log(
		'Section revealed at',
		animationState.revealThreshold * 100 + '% scroll progress'
	);
};

/**
 * Hide section with blur animations
 */
const hideSection = () => {
	if (!animationState.elements || !animationState.isVisible) return;

	// Kill any running animations first
	killCurrentAnimation();

	animationState.isVisible = false;
	animationState.isAnimating = true;

	// Create timeline for hiding animations
	const tl = gsap.timeline({
		onComplete: () => {
			animationState.isAnimating = false;
			animationState.currentTimeline = null;
		},
	});

	// Store the timeline reference
	animationState.currentTimeline = tl;

	// Hide text elements with blur
	tl.to([animationState.elements.title, animationState.elements.text], {
		opacity: 0,
		y: 30,
		filter: 'blur(10px)',
		duration: 0.8,
		ease: 'power3.in',
		stagger: 0.1,
	})
		// Hide button with blur
		.to(
			animationState.elements.actions,
			{
				opacity: 0,
				y: 30,
				filter: 'blur(10px)',
				duration: 0.8,
				ease: 'power3.in',
			},
			'<0.3' // Start 0.3 seconds after the text elements
		);

	console.log(
		'Section hidden below',
		animationState.hideThreshold * 100 + '% scroll progress'
	);
};

/**
 * Handle scroll-based visibility logic with hysteresis
 */
const handleScrollVisibility = (scrollProgress) => {
	// Use different thresholds for reveal and hide to prevent rapid toggling
	const shouldReveal =
		scrollProgress >= animationState.revealThreshold &&
		!animationState.isVisible;
	const shouldHide =
		scrollProgress < animationState.hideThreshold && animationState.isVisible;

	if (shouldReveal) {
		revealSection();
	} else if (shouldHide) {
		hideSection();
	}
};

/**
 * Main scroll handler
 */
const onScroll = (scrollProgress) => {
	handleScrollVisibility(scrollProgress);
};

/**
 * Reset animations to initial state
 */
const reset = () => {
	killCurrentAnimation();
	animationState.isVisible = false;
	setInitialState();
};

/**
 * Get current reveal threshold
 */
const getRevealThreshold = () => animationState.revealThreshold;

/**
 * Get current hide threshold
 */
const getHideThreshold = () => animationState.hideThreshold;

/**
 * Set reveal threshold
 */
const setRevealThreshold = (threshold) => {
	animationState.revealThreshold = Math.max(0, Math.min(1, threshold));
};

/**
 * Set hide threshold
 */
const setHideThreshold = (threshold) => {
	animationState.hideThreshold = Math.max(0, Math.min(1, threshold));
};

/**
 * Set both thresholds at once
 */
const setThresholds = (revealThreshold, hideThreshold) => {
	setRevealThreshold(revealThreshold);
	setHideThreshold(hideThreshold);
};

/**
 * Get current visibility state
 */
const getVisibilityState = () => animationState.isVisible;

/**
 * Get current animation state
 */
const getAnimationState = () => animationState.isAnimating;

/**
 * Initialize the UI animation system
 */
const init = () => {
	initializeElements();
	setInitialState();
};

// Public API using functional approach
export default {
	init,
	onScroll,
	reset,
	getRevealThreshold,
	getHideThreshold,
	setRevealThreshold,
	setHideThreshold,
	setThresholds,
	getVisibilityState,
	getAnimationState,
};
