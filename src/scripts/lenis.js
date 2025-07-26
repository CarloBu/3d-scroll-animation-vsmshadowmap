import Lenis from 'lenis';

/**
 * Lenis Smooth Scroll Setup and Management
 */
class LenisManager {
	constructor() {
		this.lenis = new Lenis({
			duration: 4,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smooth: true,
			smoothTouch: false,
			touchMultiplier: 2,
			direction: 'vertical',
		});

		this.scrollCallbacks = [];
		this.setupScrollListener();
	}

	/**
	 * Setup the scroll event listener
	 */
	setupScrollListener() {
		this.lenis.on('scroll', (e) => {
			this.scrollCallbacks.forEach((callback) => callback(e.scroll));
		});
	}

	/**
	 * Add a callback to be called on scroll
	 * @param {Function} callback - Function to call with scroll value
	 */
	onScroll(callback) {
		this.scrollCallbacks.push(callback);
	}

	/**
	 * Remove a scroll callback
	 * @param {Function} callback - Function to remove
	 */
	offScroll(callback) {
		const index = this.scrollCallbacks.indexOf(callback);
		if (index > -1) {
			this.scrollCallbacks.splice(index, 1);
		}
	}

	/**
	 * Get current scroll value
	 */
	get scroll() {
		return this.lenis.scroll;
	}

	/**
	 * Update Lenis (should be called in animation loop)
	 */
	update() {
		this.lenis.raf(Date.now());
	}

	/**
	 * Destroy the Lenis instance
	 */
	destroy() {
		this.lenis.destroy();
	}
}

export default LenisManager;
