import * as THREE from 'three';

/**
 * Lighting Manager
 */
class LightingManager {
	constructor(scene) {
		this.scene = scene;
		this.lights = {};
		this.setupLights();
	}

	/**
	 * Setup initial lights
	 */
	setupLights() {
		// Soft Ambient Lighting
		this.lights.ambient = new THREE.AmbientLight('#ffffff', 3);
		this.scene.add(this.lights.ambient);

		// Create directional lights but configure them later when we know scene size
		this.lights.directional1 = new THREE.DirectionalLight('#ffffff', 1.5);
		this.lights.directional2 = new THREE.DirectionalLight('#ffffff', 0.5);
		this.lights.fill = new THREE.DirectionalLight('#ffffff', 0);

		// Add lights to scene
		this.scene.add(this.lights.directional1);
		this.scene.add(this.lights.directional2);
		this.scene.add(this.lights.fill);
	}

	/**
	 * Configure lighting based on scene size
	 * @param {THREE.Box3} boundingBox - Scene bounding box
	 */
	configureLightingForScene(boundingBox) {
		const size = boundingBox.getSize(new THREE.Vector3());
		const center = boundingBox.getCenter(new THREE.Vector3());
		const maxDimension = Math.max(size.x, size.y, size.z);

		// Position lights relative to scene size and center
		const lightDistance = maxDimension * 2;

		// Configure main directional light
		this.lights.directional1.position.set(
			center.x + lightDistance * 0.5,
			center.y + lightDistance * 0.7,
			center.z + lightDistance * 0.4
		);

		// Enable shadows and configure shadow settings
		this.lights.directional1.castShadow = true;
		this.lights.directional1.shadow.mapSize.width = 4096;
		this.lights.directional1.shadow.mapSize.height = 4096;
		this.lights.directional1.shadow.camera.near = 50;
		this.lights.directional1.shadow.camera.far = 100;
		this.lights.directional1.shadow.radius = 20;
		this.lights.directional1.shadow.blurSamples = 20;
		this.lights.directional1.shadow.normalBias = 0.01;

		// Configure shadow camera for the main directional light
		const shadowCameraSize = maxDimension * 1.5;
		this.lights.directional1.shadow.camera.left = -shadowCameraSize;
		this.lights.directional1.shadow.camera.right = shadowCameraSize;
		this.lights.directional1.shadow.camera.top = shadowCameraSize;
		this.lights.directional1.shadow.camera.bottom = -shadowCameraSize;

		// Make sure the light looks at the scene center
		this.lights.directional1.target.position.copy(center);
		this.lights.directional1.target.updateMatrixWorld();
		this.scene.add(this.lights.directional1.target);

		this.lights.directional1.shadow.camera.updateProjectionMatrix();

		// Configure secondary directional light
		this.lights.directional2.position.set(
			center.x - lightDistance * 0.3,
			center.y + lightDistance * 0.5,
			center.z - lightDistance * 0.3
		);

		// Configure fill light from below
		this.lights.fill.position.set(
			center.x,
			center.y - lightDistance * 0.3,
			center.z
		);
	}

	/**
	 * Set brightness by adjusting ambient light intensity
	 * @param {number} value - Brightness adjustment value
	 */
	setBrightness(value) {
		this.lights.ambient.intensity = 2 + value;
	}

	/**
	 * Get current brightness value
	 * @returns {number} Current brightness adjustment
	 */
	getBrightness() {
		return this.lights.ambient.intensity - 2;
	}

	/**
	 * Get all lights for external access
	 * @returns {Object} Lights object
	 */
	getLights() {
		return this.lights;
	}
}

export default LightingManager;
