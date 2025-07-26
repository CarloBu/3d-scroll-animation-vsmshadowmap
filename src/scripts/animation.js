import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Animation Manager for GLTF Loading and Animation Control
 */
class AnimationManager {
	constructor(threeScene, lightingManager) {
		this.threeScene = threeScene;
		this.lightingManager = lightingManager;
		this.mixer = null;
		this.animations = [];
		this.startFrame = 4;
		this.endFrame = null; // null = full animation
		this.loader = new GLTFLoader();
	}

	/**
	 * Load GLTF model
	 * @param {string} path - Path to the GLB file
	 * @returns {Promise} Promise that resolves when model is loaded
	 */
	loadModel(path) {
		return new Promise((resolve, reject) => {
			this.loader.load(
				path,
				(gltf) => {
					// Apply materials to all objects
					this.threeScene.applyMaterialsToObjects(gltf.scene);

					// Find and use the camera from the GLB
					gltf.scene.traverse((child) => {
						if (child.isCamera && child.name.toLowerCase() === 'camera') {
							this.threeScene.setCameraFromGLTF(child);
						}
					});

					// Set up animations
					if (gltf.animations && gltf.animations.length > 0) {
						this.mixer = new THREE.AnimationMixer(gltf.scene);
						this.animations = gltf.animations;

						// Create and setup all animations
						this.animations.forEach((clip) => {
							const action = this.mixer.clipAction(clip);
							action.play();
							action.paused = true; // Start paused for scrubbing
						});
					}

					// Get bounding box to understand size
					const box = new THREE.Box3().setFromObject(gltf.scene);

					// Add to scene
					this.threeScene.getScene().add(gltf.scene);

					// Configure lighting based on the loaded model's bounding box
					this.lightingManager.configureLightingForScene(box);

					resolve(gltf);
				},
				undefined,
				(error) => {
					console.error('Error loading GLB:', error);
					reject(error);
				}
			);
		});
	}

	/**
	 * Set frame range for animation
	 * @param {number} start - Start frame
	 * @param {number} end - End frame (null for full animation)
	 */
	setFrameRange(start, end) {
		this.startFrame = start;
		this.endFrame = end;
	}

	/**
	 * Update animation based on scroll progress
	 * @param {number} scrollProgress - Scroll progress (0-1)
	 */
	updateAnimation(scrollProgress) {
		if (!this.mixer || this.animations.length === 0) return;

		// Update animation progress for all clips (including camera animation)
		this.animations.forEach((clip) => {
			const action = this.mixer.clipAction(clip);
			const duration = clip.duration;

			// Convert frames to time (24fps)
			const startTime = this.startFrame / 24;
			const endTime = this.endFrame ? this.endFrame / 24 : duration;

			// Map scroll to custom range
			action.time = startTime + scrollProgress * (endTime - startTime);
		});

		this.mixer.update(0); // Update without advancing time
	}

	/**
	 * Get animations array
	 * @returns {Array} Array of animation clips
	 */
	getAnimations() {
		return this.animations;
	}

	/**
	 * Get animation mixer
	 * @returns {THREE.AnimationMixer} Animation mixer
	 */
	getMixer() {
		return this.mixer;
	}

	/**
	 * Get current frame range
	 * @returns {Object} Object with startFrame and endFrame
	 */
	getFrameRange() {
		return {
			startFrame: this.startFrame,
			endFrame: this.endFrame,
		};
	}
}

export default AnimationManager;
