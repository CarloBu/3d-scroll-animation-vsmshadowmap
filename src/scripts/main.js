// Import all our modular components
import LenisManager from '@/scripts/lenis.js';
import ThreeScene from '@/scripts/threejs-scene.js';
import LightingManager from '@/scripts/lighting.js';
import AnimationManager from '@/scripts/animation.js';
import UIAnimationManager from '@/scripts/ui-animations.js';

/**
 * Main Application Class
 * Coordinates all the different modules for the 3D Rube Goldberg demo
 */
class RubeGoldbergApp {
	constructor() {
		this.canvas = document.querySelector('canvas.webgl');
		if (!this.canvas) {
			console.error('Canvas not found!');
			return;
		}

		// Initialize all modules
		this.initializeModules();
		this.setupGlobalAPI();
		this.startAnimation();
	}

	/**
	 * Initialize all modular components
	 */
	initializeModules() {
		// Initialize Three.js scene
		this.threeScene = new ThreeScene(this.canvas);

		// Initialize lighting manager
		this.lightingManager = new LightingManager(this.threeScene.getScene());

		// Initialize animation manager
		this.animationManager = new AnimationManager(
			this.threeScene,
			this.lightingManager
		);

		// Initialize UI animation manager
		this.uiAnimationManager = UIAnimationManager;
		this.uiAnimationManager.init();

		// Initialize Lenis smooth scroll
		this.lenisManager = new LenisManager();

		// Setup scroll animation callback
		this.lenisManager.onScroll((scroll) => {
			this.updateScrollAnimation(scroll);
		});
	}

	/**
	 * Setup global API for external control
	 */
	setupGlobalAPI() {
		// Export frame range control
		window.setFrameRange = (start, end) => {
			this.animationManager.setFrameRange(start, end);
		};

		// Export postprocessing controls
		const postprocessingControls = this.threeScene.getPostprocessingControls();
		window.postprocessing = {
			setContrast: postprocessingControls.setContrast,
			setBrightness: (value) => {
				this.lightingManager.setBrightness(value);
			},
			getContrast: postprocessingControls.getContrast,
			getBrightness: () => {
				return this.lightingManager.getBrightness();
			},
		};

		// Export UI animation controls
		window.uiAnimations = {
			setRevealThreshold: this.uiAnimationManager.setRevealThreshold,
			getRevealThreshold: this.uiAnimationManager.getRevealThreshold,
			getVisibilityState: this.uiAnimationManager.getVisibilityState,
			reset: this.uiAnimationManager.reset,
		};
	}

	/**
	 * Update animation based on scroll
	 * @param {number} scroll - Current scroll position
	 */
	updateScrollAnimation(scroll) {
		const maxScroll = document.body.scrollHeight - window.innerHeight;
		const scrollProgress = Math.min(scroll / maxScroll, 1);
		this.animationManager.updateAnimation(scrollProgress);
		this.uiAnimationManager.onScroll(scrollProgress);
	}

	/**
	 * Load the 3D model
	 * @param {string} path - Path to the GLB file
	 */
	async loadModel(path = '/scene.glb') {
		try {
			await this.animationManager.loadModel(path);
			console.log('Model loaded successfully');
		} catch (error) {
			console.error('Failed to load model:', error);
		}
	}

	/**
	 * Start the animation loop
	 */
	startAnimation() {
		const tick = () => {
			this.lenisManager.update();
			this.threeScene.render();
			requestAnimationFrame(tick);
		};
		tick();
	}
}

/**
 * Initialize the application
 */
const app = new RubeGoldbergApp();

// Load the model
app.loadModel();

// Export app instance for debugging
window.app = app;
